import { useState } from "react";
import { CanvasContext } from "./CanvasContext.ts";
import { empty } from "graphology-generators/classic";
import { UndirectedGraph } from "graphology";
import { random } from "graphology-layout";

interface CanvasProviderProps {
  children: React.ReactNode;
}

// import { createDefaultGraph } from "./utils/graph-utils.ts";
// const defaultGraph = createDefaultGraph();
const defaultGraph = empty(UndirectedGraph, 10);
random.assign(defaultGraph, {
  dimensions: ["x", "y"],
});

const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const [graph, setGraph] = useState<CanvasContext["graph"]>(defaultGraph);
  const [sigma, setSigma] = useState<CanvasContext["sigma"]>();
  const [activeAlgorithm, setActiveAlgorithm] =
    useState<CanvasContext["activeAlgorithm"]>();

  const context: CanvasContext = {
    graph,
    setGraph,
    sigma,
    setSigma,
    activeAlgorithm,
    setActiveAlgorithm,
  };

  return (
    <CanvasContext.Provider value={context}>{children}</CanvasContext.Provider>
  );
};

export default CanvasProvider;
