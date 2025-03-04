import {
  AlgorithmSolution,
  CanvasControl,
  CanvasMode,
} from "@/features/canvas/types.ts";
import { SupportedAlgorithms } from "@/types.ts";
import Graph from "graphology";
import { createContext, useContext } from "react";
import { Updater } from "use-immer";

export interface CanvasContext {
  graph: Graph;
  replaceGraphInContext: (newGraph: Graph) => void;
  updateInitialGraph: (newGraph: Graph) => void;
  initialGraphRef: React.MutableRefObject<Graph>;
  activeAlgorithm: SupportedAlgorithms | undefined;
  setActiveAlgorithm: React.Dispatch<
    React.SetStateAction<SupportedAlgorithms | undefined>
  >;
  controlRef: React.RefObject<CanvasControl>;
  canvasImageUrl: string | null;
  setCanvasImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  canvasMode: CanvasMode;
  setCanvasMode: React.Dispatch<React.SetStateAction<CanvasMode>>;
  graphDirty: boolean;
  setGraphDirty: React.Dispatch<React.SetStateAction<boolean>>;
  solutions: AlgorithmSolution[];
  setSolutions: Updater<AlgorithmSolution[]>;
}

export const CanvasContext = createContext<CanvasContext | undefined>(
  undefined
);

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
