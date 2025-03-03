export type Edge = {
  id: string;
  source: string;
  target: string;
};

export type EdgeMutation = {
  edge: Edge;
  timestamp: number;
};

export enum SupportedAlgorithms {
  /**
   * Prims minimal spanning tree
   */
  PRIMS_MST = "primsMinimalSpanningTree",
  /**
   * Rectilinear Steiner minimal tree. This is the same as the Uniformly oriented Steiner minimal tree with lambda = 2
   */
  RSMT = "rectilinearSteinerMinimalTree",
  /**
   * Uniformly oriented Steiner minimal tree
   */
  UOSMT = "uniformlyOrientedSteinerMinimalTree",
  /**
   * Euclidean Steiner minimal tree
   */
  ESMT = "euclideanSteinerMinimalTree",
}
