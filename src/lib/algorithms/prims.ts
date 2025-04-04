import { EdgeMutation, Metric, SupportedAlgorithms } from "@/types.ts";
import Graph from "graphology";

export function primsMST(
  graph: Graph,
  metric: Metric,
  onTreeUpdate?: (mutation: EdgeMutation) => void
) {
  const tree = new Graph();
  const intree: Record<string, boolean> = {};
  const distance: Record<string, number> = {};
  const parent: Record<string, string> = {};
  const nodes = graph.nodes();

  const startNode = nodes[0];
  distance[startNode] = 0;
  tree.addNode(startNode, graph.getNodeAttributes(startNode));
  let v = startNode;

  while (!intree[v]) {
    intree[v] = true;
    const edges = graph.edges(v);
    for (const edge of edges) {
      const w =
        graph.target(edge) === v ? graph.source(edge) : graph.target(edge);
      const weight = graph.getEdgeAttribute(edge, "weight");
      if ((distance[w] ?? Infinity) > weight && !intree[w]) {
        distance[w] = weight;
        parent[w] = v;
      }
    }

    let minDist = Infinity;
    let newV = "";
    nodes
      .filter((node) => !intree[node])
      .forEach((node) => {
        if ((distance[node] ?? Infinity) < minDist) {
          minDist = distance[node];
          newV = node;
        }
      });
    if (newV !== "") {
      v = newV;
      tree.addNode(v, graph.getNodeAttributes(v));
      const edgeId = graph.edge(parent[v], v);
      if (!edgeId) {
        throw new Error("PrimMST: Attempting to add non-existent edge to MST");
      }
      tree.addEdgeWithKey(edgeId, parent[v], v, {
        ...graph.getEdgeAttributes(edgeId),
        key: edgeId,
        algorithm: [
          metric === Metric.EUCLIDEAN
            ? SupportedAlgorithms.PRIMS_EMST
            : SupportedAlgorithms.PRIMS_RSMT,
        ],
      });
      onTreeUpdate?.({
        edge: {
          key: edgeId,
          source: parent[v],
          target: v,
        },
        timestamp: Date.now(),
      });
    }
  }
  return tree;
}
