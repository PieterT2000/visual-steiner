import Graph from "graphology";
import { calcSMT } from "./steiner-utils.ts";
import { SMTType } from "./steiner-utils.ts";
import { GraphMutationItem, MutationEdge } from "@/types.ts";
import { nanoid as generateId } from "nanoid";
import { primsMST } from "./algorithms/prims.ts";

interface Context {
  graph: Graph;
}

export const calculateSMT = ({ graph }: Context, type: SMTType) => {
  const nodes = graph.mapNodes((id, attr) => [id, attr.x, attr.y]);
  const nodeIds = nodes.map((n) => n[0]);
  const terms = nodes.map((n) => n.slice(1)).flat();
  const { length, nsps, nedges, sps, edges } = calcSMT(terms, type);

  // add steiner points to graph
  const steinerNodeIds: string[] = [];
  for (let i = 0; i < nsps; i += 1) {
    const id = `sp-${generateId()}`;
    graph.addNode(id, {
      x: sps[i * 2],
      y: sps[i * 2 + 1],
      size: 10,
      label: `SP ${i + 1}`,
      isSteiner: true,
    });
    steinerNodeIds.push(id);
  }

  const allNodeIds = [...nodeIds, ...steinerNodeIds];

  // find node ids for edges
  // also find node ids for steiner points

  // add edges to graph
  const edgeMutations: MutationEdge[] = [];
  for (let i = 0; i < nedges; i += 1) {
    const v0 = allNodeIds[edges[i * 2]];
    const v1 = allNodeIds[edges[i * 2 + 1]];
    const existingEdgeId = graph.edge(v0, v1);
    if (!existingEdgeId) {
      const edgeId = graph.addEdge(v0, v1, {
        visible: false,
      });
      edgeMutations.push({ id: edgeId, source: v0, target: v1 });
    } else {
      edgeMutations.push({ id: existingEdgeId, source: v0, target: v1 });
    }
  }

  return {
    edgeMutations,
    steinerNodeIds,
    graphLength: length,
  };
};

export function calculatePrimsMST({ graph }: Context) {
  const treeMutationHistory: GraphMutationItem[] = [];
  // generate all edges
  const order = graph.order;
  const nodes = graph.nodes();
  const newGraph = graph.emptyCopy(); // only copy nodes
  for (let i = 0; i < order; i++) {
    const sourceNode = nodes[i];
    for (let j = i + 1; j < order; j++) {
      const targetNode = nodes[j];
      const sourceAttr = graph.getNodeAttributes(sourceNode);
      const targetAttr = graph.getNodeAttributes(targetNode);
      const weight = Math.hypot(
        sourceAttr.x - targetAttr.x,
        sourceAttr.y - targetAttr.y
      );
      newGraph.addEdge(sourceNode, targetNode, {
        weight,
        visible: true,
      });
    }
  }
  primsMST(newGraph, (mutation) => {
    treeMutationHistory.push(mutation);
    // add edge to graph if it doesn't exist for later highlighting
    if (!graph.hasEdge(mutation.edge.id)) {
      // console.log("add edge to graph", mutation.edge.id);
      graph.addEdge(mutation.edge.source, mutation.edge.target, {
        id: mutation.edge.id,
        // hide the edge until it becomes visible as part of the animation
        hidden: false,
      });
    }
  });

  return {
    treeMutationHistory,
  };
}
