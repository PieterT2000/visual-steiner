import { UndirectedGraph } from "graphology";
import type { Attributes } from "graphology-types";
import { AlgorithmDisplaySettings } from "../types.ts";
import { SupportedAlgorithms } from "@/types.ts";
import { GRAPH_DEFAULT_SETTINGS } from "../consts";

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
