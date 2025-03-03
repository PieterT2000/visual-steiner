import { test, describe, expect } from "vitest";
import { UndirectedGraph } from "graphology";
import { mergeGraphs } from "../graph-utils";
import { createDefaultGraph } from "@/features/canvas/utils/graph-utils.ts";

describe("mergeGraphs", () => {
  test("should merge all nodes and edges from second graph into first graph", () => {
    const graph1 = new UndirectedGraph();
    const graph2 = createDefaultGraph();
    mergeGraphs(graph1, graph2);
    graph2.forEachNode((node, attrs) => {
      expect(graph1.hasNode(node)).toBe(true);
      expect(graph1.getNodeAttributes(node)).toEqual(attrs);
    });
    graph2.forEachEdge((edge, attrs) => {
      expect(graph1.hasEdge(edge)).toBe(true);
      expect(graph1.getEdgeAttributes(edge)).toEqual(attrs);
    });
  });

  test("should merge node attributes of nodes present in both graphs", () => {
    const graph1 = new UndirectedGraph();
    const graph2 = new UndirectedGraph();
    graph1.addNode("1", {
      label: "Node 1",
    });
    graph2.addNode("1", {
      label: "Node 1",
      color: "red",
    });
    mergeGraphs(graph1, graph2);
    expect(graph1.getNodeAttributes("1")).toEqual({
      label: "Node 1",
      color: "red",
    });
  });
});
