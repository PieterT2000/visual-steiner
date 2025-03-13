import Graph, { UndirectedGraph } from "graphology";
import { random } from "graphology-layout";
import { Attributes } from "graphology-types";
import { empty } from "graphology-generators/classic";
import { AlgorithmDisplaySettings } from "@/features/canvas/types";
import { GRAPH_DEFAULT_SETTINGS } from "@/features/canvas/consts";
import { SupportedAlgorithms, Node } from "@/types";
function mergeStringOrArrayAttribute(
  attr1?: string | string[] | undefined,
  attr2?: string | string[] | undefined
): string | string[] {
  let attr1Arr: string[];
  let attr2Arr: string[];
  if (Array.isArray(attr1)) {
    attr1Arr = attr1;
  } else if (typeof attr1 === "string") {
    attr1Arr = [attr1];
  } else {
    attr1Arr = [];
  }
  if (Array.isArray(attr2)) {
    attr2Arr = attr2;
  } else if (typeof attr2 === "string") {
    attr2Arr = [attr2];
  } else {
    attr2Arr = [];
  }
  return [...new Set([...attr1Arr, ...attr2Arr])];
}

/**
 * Creates the union of two graphs and modifies the first graph in place
 * @param graph1
 * @param graph2
 */
export function mergeGraphs<TGraph extends Graph>(
  graph1: TGraph,
  graph2: TGraph
): Map<string, string> {
  const dest = graph1;
  // Keeps track of the edges that we tried to merge but for which source->target already exists
  // Format: graph2EdgeId -> graph1EdgeId
  const mergedEdgesMap = new Map<string, string>();
  graph2.forEachNode((node, nodeAttrs) => {
    if (dest.hasNode(node)) {
      const existingNodeAttrs = dest.getNodeAttributes(node);
      Object.assign(existingNodeAttrs, {
        ...nodeAttrs,
        algorithm: mergeStringOrArrayAttribute(
          existingNodeAttrs.algorithm,
          nodeAttrs.algorithm
        ),
      });
    } else {
      dest.addNode(node, {
        ...nodeAttrs,
        algorithm: mergeStringOrArrayAttribute(nodeAttrs.algorithm),
      });
    }
  });
  graph2.forEachEdge((edgeId, edgeAttrs, source, target) => {
    const hasEdgeWithId = dest.hasEdge(edgeId);
    const hasEdgeWithSourceTarget = dest.hasEdge(source, target);
    const existingEdgeAttrs = hasEdgeWithId
      ? dest.getEdgeAttributes(edgeId)
      : hasEdgeWithSourceTarget
      ? dest.getEdgeAttributes(source, target)
      : null;
    if (hasEdgeWithSourceTarget) {
      mergedEdgesMap.set(edgeId, dest.edge(source, target)!);
    }
    if (existingEdgeAttrs) {
      const { key, ...rest } = edgeAttrs;
      Object.assign(existingEdgeAttrs, {
        ...rest,
        algorithm: mergeStringOrArrayAttribute(
          existingEdgeAttrs.algorithm,
          edgeAttrs.algorithm
        ),
      });
    } else {
      dest.addEdgeWithKey(edgeId, source, target, {
        ...edgeAttrs,
        key: edgeId,
        algorithm: mergeStringOrArrayAttribute(edgeAttrs.algorithm),
      });
    }
  });
  return mergedEdgesMap;
}

export function replaceGraph(graph: Graph, newGraph: Graph): void {
  graph.clear();
  mergeGraphs(graph, newGraph);
}

export function generateRandomGraph(size: number): Graph {
  const newGraph = empty(UndirectedGraph, size);
  random.assign(newGraph, {
    dimensions: ["x", "y"],
  });

  return newGraph;
}

export function graphFromNodes(nodes: Node[]) {
  const graph = new UndirectedGraph();
  nodes.forEach((node) => {
    graph.addNode(node.key, {
      x: node.x,
      y: node.y,
    });
  });
  return graph;
}

/**
 * Converts an existing undirected graph to a complete, weighted, undirected graph in-place
 * @param graph undirected graph
 * @returns complete undirected graph
 */
export function toCompleteWeightedGraph<TGraph extends UndirectedGraph>(
  graph: TGraph,
  defaultEdgeAttrs: Attributes = {}
) {
  let i, j;
  const order = graph.order;
  const nodes = graph.nodes();
  for (i = 0; i < order; i++) {
    for (j = i + 1; j < order; j++) {
      if (graph.hasEdge(nodes[i], nodes[j])) {
        continue;
      }
      const x1 = graph.getNodeAttribute(nodes[i], "x");
      const y1 = graph.getNodeAttribute(nodes[i], "y");
      const x2 = graph.getNodeAttribute(nodes[j], "x");
      const y2 = graph.getNodeAttribute(nodes[j], "y");
      const weight = Math.hypot(x1 - x2, y1 - y2);
      graph.addUndirectedEdge(nodes[i], nodes[j], {
        ...defaultEdgeAttrs,
        weight,
      });
    }
  }
}

/**
 * Adds edges between passed node and all its neighbors in a complete graph
 * @param graph undirected graph
 * @param node node
 */
// export function addAdjacentEdges<TGraph extends UndirectedGraph>(
//   graph: TGraph,
//   nodeKey: string
// ) {
//   const otherNodes = graph.nodes().filter((n) => n !== nodeKey);
//   otherNodes.forEach((neighbor) => {
//     graph.addUndirectedEdge(nodeKey, neighbor, {
//       algorithm: [],
//       initialEdge: true,
//     });
//   });
// }

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

/**
 * Creates a complete graph with 4 nodes and 6 edges
 */
export function createDefaultGraph() {
  const defaultGraph = new UndirectedGraph();
  const nodes = [
    {
      x: 0,
      y: 0,
    },
    {
      x: 1,
      y: 1,
    },
    {
      x: 0,
      y: 1,
    },
    {
      x: 1,
      y: 0,
    },
  ];
  nodes.forEach((attrs, idx) => {
    defaultGraph.addNode(idx + 1, {
      ...attrs,
      label: `Node ${idx + 1}`,
    });
  });
  return defaultGraph;
}

export function isSteinerNode(nodeAttrs: Attributes) {
  return !!nodeAttrs.isSteiner;
}

export function isRectSteinerNode(nodeAttrs: Attributes) {
  return (
    !!nodeAttrs.isSteiner &&
    nodeAttrs.algorithm.includes(SupportedAlgorithms.RSMT)
  );
}

export function isEuclidSteinerNode(nodeAttrs: Attributes) {
  return (
    !!nodeAttrs.isSteiner &&
    nodeAttrs.algorithm.includes(SupportedAlgorithms.ESMT)
  );
}

export function getNodeColor(
  nodeAttrs: Attributes,
  settings: {
    vertex: string;
    steinerVertex?: string;
  },
  isDrawMode: boolean
) {
  if (isSteinerNode(nodeAttrs)) {
    return isDrawMode || !settings.steinerVertex
      ? GRAPH_DEFAULT_SETTINGS.steinerNodeColor
      : settings.steinerVertex;
  }
  return isDrawMode ? GRAPH_DEFAULT_SETTINGS.nodeColor : settings.vertex;
}

export function isDrawNode(nodeAttrs: Attributes) {
  return nodeAttrs.isTemp;
}

export function isEdgeUsedByVisibleAlgorithms(
  edgeAttrs: Attributes,
  visibleAlgorithms?: SupportedAlgorithms[]
) {
  if (!visibleAlgorithms) return false;
  return visibleAlgorithms.some((algo) => {
    return edgeAttrs.algorithm.includes(algo);
  });
}

export function isNodeUsedByVisibleAlgorithms(
  nodeAttrs: Attributes,
  visibleAlgorithms?: SupportedAlgorithms[]
) {
  if (!visibleAlgorithms) return false;
  return visibleAlgorithms.some((algo) => nodeAttrs.algorithm.includes(algo));
}

export function calculateGraphLength(graph: Graph) {
  return graph.reduceEdges((acc, _, edgeAttrs) => {
    return acc + (edgeAttrs.weight ?? 0);
  }, 0);
}
