import { test, describe, expect } from "vitest";
import { UndirectedGraph } from "graphology";
import { mergeGraphs } from "../graph-utils";
import { createDefaultGraph } from "@/lib/graph-utils";

describe("mergeGraphs", () => {
  test("should merge all nodes and edges from second graph into first graph", () => {
    const graph1 = new UndirectedGraph();
    const graph2 = createDefaultGraph();
    mergeGraphs(graph1, graph2);
    graph2.forEachNode((node, attrs) => {
      expect(graph1.hasNode(node)).toBe(true);
      expect(graph1.getNodeAttributes(node)).toMatchObject(attrs);
    });
    graph2.forEachEdge((edge, attrs) => {
      expect(graph1.hasEdge(edge)).toBe(true);
      expect(graph1.getEdgeAttributes(edge)).toMatchObject(attrs);
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
    expect(graph1.getNodeAttributes("1")).toMatchObject({
      label: "Node 1",
      color: "red",
    });
  });

  test.each([
    { a1: "ESMT", a2: ["MST"], result: ["ESMT", "MST"] },
    { a1: ["ESMT", "MST"], a2: ["MST"], result: ["ESMT", "MST"] },
    { a1: undefined, a2: ["MST"], result: ["MST"] },
    { a1: ["ESMT"], a2: undefined, result: ["ESMT"] },
    { a1: undefined, a2: undefined, result: [] },
  ])(
    "should merge algorithm attribute of edges by concatenating arrays safely",
    ({ a1, a2, result }) => {
      const graph1 = new UndirectedGraph();
      const graph2 = new UndirectedGraph();
      graph1.updateEdge("1", "2", (attrs) => ({
        ...attrs,
        algorithm: a1,
      }));
      graph2.updateEdge("1", "2", (attrs) => ({
        ...attrs,
        algorithm: a2,
      }));
      mergeGraphs(graph1, graph2);
      expect(graph1.getEdgeAttributes("1", "2")).toEqual({
        algorithm: result,
      });
    }
  );
});
