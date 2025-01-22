import Graph from "graphology";

function euclideanDist<N extends { x: number; y: number }>(node1: N, node2: N) {
  return Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2);
}

const kruskalMST = (graph: Graph) => {
  const nodes = graph.nodes();

  // compute distance matrix
  const dist = Array.from({ length: nodes.length }, () =>
    Array(nodes.length).fill(0)
  );
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      const node1 = graph.getNodeAttributes(nodes[i]) as {
        x: number;
        y: number;
      };
      const node2 = graph.getNodeAttributes(nodes[j]) as {
        x: number;
        y: number;
      };
      dist[i][j] = euclideanDist(node1, node2);
    }
  }
};
