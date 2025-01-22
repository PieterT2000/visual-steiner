export type MutationEdge = {
  id: string;
  source: string;
  target: string;
};

export type GraphMutationItem = {
  edge: MutationEdge;
  timestamp: number;
};

export enum SupportedAlgorithms {
  PRIMS_MST = "primsMinimalSpanningTree",
  RSMT = "rectilinearSteinerMinimalTree",
  SMT = "steinerMinimalTree",
}
