import { SupportedAlgorithms } from "@/types.ts";
import Graph from "graphology";
import { createContext, useContext } from "react";
import Sigma from "sigma";

export interface CanvasContext {
  graph: Graph;
  setGraph: (graph: Graph) => void;
  sigma: Sigma | undefined;
  setSigma: (sigma: Sigma | undefined) => void;
  activeAlgorithm: SupportedAlgorithms | undefined;
  setActiveAlgorithm: (algorithm: SupportedAlgorithms | undefined) => void;
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
