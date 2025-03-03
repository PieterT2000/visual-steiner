import Graph, { UndirectedGraph } from "graphology";
import { random } from "graphology-layout";
import { complete } from "graphology-generators/classic";

/**
 * Creates the union of two graphs and modifies the first graph in place
 * @param graph1
 * @param graph2
 */
export function mergeGraphs<TGraph extends Graph>(
  graph1: TGraph,
  graph2: TGraph
): void {
  const dest = graph1;
  graph2.forEachNode((node, nodeAttrs) => {
    dest.mergeNode(node, {
      ...nodeAttrs,
    });
  });
  graph2.forEachEdge((edgeId, edgeAttrs, source, target) => {
    dest.mergeEdgeWithKey(edgeId, source, target, {
      ...edgeAttrs,
    });
  });
}

export function replaceGraph(graph: Graph, newGraph: Graph): void {
  graph.clear();
  mergeGraphs(graph, newGraph);
}

export function generateRandomGraph(size: number): Graph {
  const newGraph = complete(UndirectedGraph, size);
  random.assign(newGraph, {
    dimensions: ["x", "y"],
  });
  // add hidden attribute to all edges and initial attribute
  newGraph.forEachEdge((edge) => {
    newGraph.setEdgeAttribute(edge, "hidden", true);
    newGraph.setEdgeAttribute(edge, "initialEdge", true);
  });
  return newGraph;
}

/**
 * Converts an existing undirected graph to a complete undirected graph in-place
 * @param graph undirected graph
 * @returns complete undirected graph
 */
export function toCompleteGraph<TGraph extends UndirectedGraph>(graph: TGraph) {
  let i, j;
  const order = graph.order;
  const nodes = graph.nodes();
  for (i = 0; i < order; i++) {
    for (j = i + 1; j < order; j++) {
      if (graph.hasEdge(nodes[i], nodes[j])) {
        continue;
      }
      graph.addUndirectedEdge(nodes[i], nodes[j]);
    }
  }
}

/**
 * Computes the edge weights (Euclidean distance) in-place and stores them in the `weight` attribute of each edge
 * @param graph undirected graph
 */
export function calcEdgeWeights<TGraph extends UndirectedGraph>(graph: TGraph) {
  graph.forEachEdge((edge, _ea, _v1, _v2, sourceAttrs, targetAttrs) => {
    const weight = Math.hypot(
      sourceAttrs.x - targetAttrs.x,
      sourceAttrs.y - targetAttrs.y
    );
    graph.setEdgeAttribute(edge, "weight", weight);
  });
}
