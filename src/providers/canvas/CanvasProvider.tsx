import { useRef, useState } from "react";
import { CanvasContext } from "./CanvasContext.ts";
import {
  AlgorithmSolution,
  CanvasControl,
  CanvasMode,
} from "@/features/canvas/types.ts";
import { createDefaultGraph } from "@/lib/graph-utils";
import { replaceGraph } from "@/lib/graph-utils";
import Graph from "graphology";
import { useImmer } from "use-immer";
import { useGraphPubSub } from "@/features/canvas/hooks/useGraphPubSub";
import { useFormContext } from "react-hook-form";

interface CanvasProviderProps {
  children: React.ReactNode;
}

const defaultGraph = createDefaultGraph();

const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const [graph] = useState<CanvasContext["graph"]>(defaultGraph);
  const initialGraphRef = useRef(graph.copy());
  const [activeAlgorithm, setActiveAlgorithm] =
    useState<CanvasContext["activeAlgorithm"]>();
  const [canvasImageUrl, setCanvasImageUrl] = useState<string | null>(null);
  const [canvasMode, setCanvasMode] = useState(CanvasMode.Visualize);
  // By default, solutions are not computed, so the graph is said to be dirty initially
  const [graphDirty, setGraphDirty] = useState(true);
  const [solutions, setSolutions] = useImmer<AlgorithmSolution[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const controlRef = useRef<CanvasControl>(null);
  const { publishGraphUpdated } = useGraphPubSub();
  const {
    formState: { isDirty },
  } = useFormContext();
  /**
   * Sigma.js does not support graph instance replacements, so instead we
   * merge the new graph into the cleared existing graph instance.
   * @param newGraph
   */
  const handleReplaceGraph = (newGraph: Graph) => {
    initialGraphRef.current = newGraph.copy();
    replaceGraph(graph, newGraph);
    setCanvasImageUrl(null);
    setGraphDirty(true);
    setSolutions([]);
    publishGraphUpdated();
    controlRef.current?.animatedCameraFit();
  };

  const updateInitialGraph = (newGraph: Graph) => {
    replaceGraph(initialGraphRef.current, newGraph);
  };

  const context: CanvasContext = {
    graph,
    activeAlgorithm,
    setActiveAlgorithm,
    controlRef,
    canvasImageUrl,
    setCanvasImageUrl,
    replaceGraphInContext: handleReplaceGraph,
    updateInitialGraph,
    initialGraphRef,
    canvasMode,
    setCanvasMode,
    graphDirty: graphDirty || isDirty,
    setGraphDirty,
    solutions,
    setSolutions,
    files,
    setFiles,
  };

  return (
    <CanvasContext.Provider value={context}>{children}</CanvasContext.Provider>
  );
};

export default CanvasProvider;
