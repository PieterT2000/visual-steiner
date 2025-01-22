import { UndirectedGraph } from "graphology";

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
  defaultGraph.addEdge(1, 2);
  defaultGraph.addEdge(1, 3);
  defaultGraph.addEdge(1, 4);
  defaultGraph.addEdge(2, 3);
  defaultGraph.addEdge(2, 4);
  defaultGraph.addEdge(3, 4);
  return defaultGraph;
}
