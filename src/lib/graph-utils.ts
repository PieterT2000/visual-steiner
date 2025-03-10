import Graph, { UndirectedGraph } from "graphology";
import { random } from "graphology-layout";
import { Attributes } from "graphology-types";
import { complete } from "graphology-generators/classic";
import { AlgorithmDisplaySettings } from "@/features/canvas/types";
import { GRAPH_DEFAULT_SETTINGS } from "@/features/canvas/consts";
import { SupportedAlgorithms } from "@/types";

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
): void {
  const dest = graph1;
  graph2.forEachNode((node, nodeAttrs) => {
    dest.mergeNode(node, {
      ...nodeAttrs,
      algorithm: mergeStringOrArrayAttribute(nodeAttrs.algorithm),
    });
  });
  graph2.forEachEdge((edgeId, edgeAttrs, source, target) => {
    dest.updateEdgeWithKey(edgeId, source, target, (attrs) => ({
      ...attrs,
      ...edgeAttrs,
      // If the edge is used by multiple algorithms, keep track of algorithms in an array
      algorithm: mergeStringOrArrayAttribute(
        attrs.algorithm,
        edgeAttrs.algorithm
      ),
    }));
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
  newGraph.forEachEdge((edge) => {
    newGraph.updateEdgeAttributes(edge, (attrs) => ({
      ...attrs,
      algorithm: [],
      // Hide all initial edges in complete graph by default
      hidden: true,
      initialEdge: true,
      size: GRAPH_DEFAULT_SETTINGS.edgeWidth,
      color: GRAPH_DEFAULT_SETTINGS.edgeColor,
    }));
  });
  newGraph.forEachNode((node) => {
    newGraph.updateNodeAttributes(node, (attrs) => ({
      ...attrs,
      size: GRAPH_DEFAULT_SETTINGS.nodeSize,
      color: GRAPH_DEFAULT_SETTINGS.nodeColor,
    }));
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

/**
 * Creates a complete graph with 4 nodes and 6 edges
 */
export function createDefaultGraph() {
  const defaultGraph = new UndirectedGraph();
  defaultGraph.addNode(1, {
    label: "Node 1",
    x: 0,
    y: 0,
    size: 10,
  });
  defaultGraph.addNode(2, {
    label: "Node 2",
    x: 1,
    y: 1,
    size: 10,
  });
  defaultGraph.addNode(3, {
    label: "Node 3",
    x: 0,
    y: 1,
    size: 10,
  });
  defaultGraph.addNode(4, {
    label: "Node 4",
    x: 1,
    y: 0,
    size: 10,
  });
  const edgeAttrs = {
    hidden: true,
    initialEdge: true,
    algorithm: [],
  };
  defaultGraph.addEdge(1, 2, edgeAttrs);
  defaultGraph.addEdge(1, 3, edgeAttrs);
  defaultGraph.addEdge(1, 4, edgeAttrs);
  defaultGraph.addEdge(2, 3, edgeAttrs);
  defaultGraph.addEdge(2, 4, edgeAttrs);
  defaultGraph.addEdge(3, 4, edgeAttrs);
  return defaultGraph;
}

export function isSteinerNode(nodeAttrs: Attributes) {
  return !!nodeAttrs.isSteiner;
}

export function isRectSteinerNode(nodeAttrs: Attributes) {
  return nodeAttrs.steinerType === "rectilinear";
}

export function isEuclidSteinerNode(nodeAttrs: Attributes) {
  return nodeAttrs.steinerType === "euclidean";
}

export function getNodeColor(
  nodeAttrs: Attributes,
  settings: AlgorithmDisplaySettings,
  isDrawMode: boolean
) {
  if (isSteinerNode(nodeAttrs)) {
    return isDrawMode
      ? GRAPH_DEFAULT_SETTINGS.steinerNodeColor
      : (settings as AlgorithmDisplaySettings<SupportedAlgorithms.ESMT>)?.colors
          .steinerVertex;
  }
  return isDrawMode
    ? GRAPH_DEFAULT_SETTINGS.nodeColor
    : settings?.colors?.vertex;
}

export function isDrawNode(nodeAttrs: Attributes) {
  return nodeAttrs.isTemp;
}

export function isEdgeUsedByVisibleAlgorithms(
  edgeAttrs: Attributes,
  visibleAlgorithms?: SupportedAlgorithms[]
) {
  return visibleAlgorithms?.some((algo) => {
    return edgeAttrs.algorithm.includes(algo);
  });
}

export function isNodeUsedByVisibleAlgorithms(
  nodeAttrs: Attributes,
  visibleAlgorithms?: SupportedAlgorithms[]
) {
  return visibleAlgorithms?.some((algo) => nodeAttrs.algorithm.includes(algo));
}

export function calculateGraphLength(graph: Graph) {
  return graph.reduceEdges((acc, _, edgeAttrs) => {
    return acc + (edgeAttrs.weight ?? 0);
  }, 0);
}
