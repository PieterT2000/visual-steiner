export type Edge = {
  key: string;
  source: string;
  target: string;
};

export type Node = {
  key: string;
  x: number;
  y: number;
};

export type EdgeMutation = {
  edge: Edge;
  timestamp: number;
};

export enum SupportedAlgorithms {
  /**
   * Prims minimal spanning tree using the Euclidean metric
   */
  PRIMS_EMST = "primsEuclideanMinimalSpanningTree",
  /**
   * Prims minimal spanning tree using the rectilinear metric
   */
  PRIMS_RSMT = "primsRectilinearMinimalSpanningTree",
  /**
   * Rectilinear Steiner minimal tree. This is the same as a Uniformly oriented Steiner minimal tree with lambda = 2
   */
  RSMT = "rectilinearSteinerMinimalTree",
  /**
   * Euclidean Steiner minimal tree
   */
  ESMT = "euclideanSteinerMinimalTree",
}

export enum GraphSource {
  DEFAULT_GRAPH = "default_graph",
  RANDOM_GRAPH = "random_graph",
}

export enum Metric {
  EUCLIDEAN = "euclidean",
  RECTILINEAR = "rectilinear",
}
