import { SupportedAlgorithms } from "@/types.ts";
import { AlgorithmsFormSchema } from "../sidebar/components/form/schema.ts";
import { Sigma } from "sigma";

export enum CanvasMode {
  Visualize = "visualize",
  Draw = "draw",
}

export type CanvasControl = {
  computeSolutions: () => void;
  setSigmaSettings: (
    settings: Parameters<Sigma["setSettings"]>[number]
  ) => void;
};

export type AlgorithmSolution = {
  algorithm: SupportedAlgorithms;
  /**
   * Set of node ids that are highlighted for the algorithm
   */
  highlightedNodes: Set<string>;
  /**
   * Set of edge ids that are highlighted for the algorithm
   */
  highlightedEdges: Set<string>;
  meta: {
    length: number;
  };
};

export type AlgorithmDisplaySettings<
  T extends SupportedAlgorithms = keyof AlgorithmsFormSchema
> = AlgorithmsFormSchema[T];
