import { SupportedAlgorithms } from "@/types.ts";
import { AlgorithmsFormSchema } from "../sidebar/components/form/schema.ts";

export enum CanvasMode {
  Visualize = "Visualize",
  Draw = "Edit graph",
}

export type CanvasControl = {
  computeSolutions: () => void;
  triggerUpdateGraphThumbnail: () => void;
  animatedCameraFit: (duration?: number) => void;
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
