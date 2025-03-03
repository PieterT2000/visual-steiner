import Graph from "graphology";
import { calcSMT } from "./steiner-utils.ts";
import { SMTType } from "./steiner-utils.ts";
import { EdgeMutation, Edge, SupportedAlgorithms } from "@/types.ts";
import { nanoid as generateId } from "nanoid";
import { primsMST } from "./algorithms/prims.ts";
import { calcEdgeWeights } from "./graph-utils";
import { toCompleteGraph } from "./graph-utils";

interface Context<TGraph extends Graph> {
  graph: TGraph;
}

type ComputeResult<
  TGraph,
  TMeta extends undefined | { [key: string]: unknown } = undefined
> = {
  edgeMutations: Edge[];
  mutationTimestamps?: number[];
  graph: TGraph;
  length: number;
  /**
   * Algorithm-specific metadata about the computation
   */
  meta: TMeta;
};

type SteinerMeta = {
  steinerNodeIds: string[];
};

const smtAlgorithmMap: Record<SMTType, SupportedAlgorithms> = {
  rectilinear: SupportedAlgorithms.RSMT,
  euclidean: SupportedAlgorithms.ESMT,
};

export const calculateSMT = <TGraph extends Graph>(
  type: SMTType,
  { graph }: Context<TGraph>
): ComputeResult<TGraph, SteinerMeta> => {
  const graphCopy = graph.copy() as TGraph;
  const nodes = graphCopy.mapNodes((id, attr) => [id, attr.x, attr.y] as const);
  const nodeIds = nodes.map((n) => n[0]);
  const terms = nodes.map((n) => n.slice(1)).flat() as number[];
  const { length, nsps, nedges, sps, edges } = calcSMT(terms, type);

  // add steiner points to graph
  const steinerNodeIds: string[] = [];
  for (let i = 0; i < nsps; i += 1) {
    const id = `sp-${generateId()}`;
    graphCopy.addNode(id, {
      x: sps[i * 2],
      y: sps[i * 2 + 1],
      size: 10,
      label: `SP ${i + 1}`,
      isSteiner: true,
      steinerType: type,
      algorithm: smtAlgorithmMap[type],
    });
    steinerNodeIds.push(id);
  }

  const allNodeIds = [...nodeIds, ...steinerNodeIds];

  // find node ids for edges
  // also find node ids for steiner points

  // add edges to graph
  const edgeMutations: Edge[] = [];
  for (let i = 0; i < nedges; i += 1) {
    const v0 = allNodeIds[edges[i * 2]];
    const v1 = allNodeIds[edges[i * 2 + 1]];
    // console.log(v0, v1, edges, allNodeIds);
    // console.log(type, i * 2, i * 2 + 1);
    const existingEdgeId = graphCopy.edge(v0, v1);
    let edgeId = existingEdgeId;
    if (!edgeId) {
      edgeId = graphCopy.addEdge(v0, v1, {
        hidden: true,
        algorithm: smtAlgorithmMap[type],
      });
    }

    edgeMutations.push({
      id: edgeId,
      source: v0,
      target: v1,
    });
  }

  return {
    edgeMutations,
    length,
    meta: {
      steinerNodeIds,
    },
    graph: graphCopy,
  };
};

export function calculatePrimsMST<TGraph extends Graph>({
  graph,
}: Context<TGraph>): ComputeResult<TGraph> {
  const edgeMutations: EdgeMutation[] = [];
  const graphCopy = graph.copy();
  toCompleteGraph(graphCopy);
  calcEdgeWeights(graphCopy);
  const mst = primsMST(graphCopy, (edge) => {
    edgeMutations.push(edge);
  }) as TGraph;
  const treeLength = mst
    .mapEdges((_, attributes) => {
      return attributes.weight;
    })
    .reduce((acc, weight) => acc + weight, 0);

  return {
    edgeMutations: edgeMutations.map((i) => i.edge),
    mutationTimestamps: edgeMutations.map((i) => i.timestamp),
    graph: mst,
    length: treeLength,
    meta: undefined,
  };
}
