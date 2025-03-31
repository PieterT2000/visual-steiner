import { Metric, SupportedAlgorithms } from "@/types.ts";
import { AlgorithmsFormSchema } from "../sidebar/components/form/schema.ts";
import Sigma from "sigma";

export enum CanvasMode {
  Visualize = "Visualize",
  Draw = "Edit graph",
  Live = "Live Edit graph",
}

export type CanvasControl = {
  computeSolutions: () => void;
  animatedCameraFit: (duration?: number) => void;
  getSigma: () => Sigma | null;
};

export type GraphCanvasStyle = {
  nodeSize: number;
  edgeSize: number;
  nodeColor: string;
  edgeColor: string;
  canvasWidth: number;
  canvasHeight: number;
  steinerNodeSize?: number;
};

export type AlgorithmSolution = {
  algorithm: SupportedAlgorithms;
  metric: Metric;
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
