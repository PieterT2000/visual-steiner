import { SupportedAlgorithms } from "@/types.ts";
import { GRAPH_DEFAULT_SETTINGS } from "@/features/canvas/consts";
const commonDefaultValues = {
  maxCpuTime: 10_000,
  edgeWidth: GRAPH_DEFAULT_SETTINGS.edgeWidth,
  vertexRadius: GRAPH_DEFAULT_SETTINGS.nodeSize,
  colors: {
    edge: GRAPH_DEFAULT_SETTINGS.edgeColor,
    vertex: GRAPH_DEFAULT_SETTINGS.nodeColor,
  },
};

export const defaultValues = {
  [SupportedAlgorithms.PRIMS_MST]: {
    ...commonDefaultValues,
  },
  [SupportedAlgorithms.ESMT]: {
    ...commonDefaultValues,
    colors: {
      ...commonDefaultValues.colors,
      steinerVertex: GRAPH_DEFAULT_SETTINGS.steinerNodeColor,
    },
  },
  [SupportedAlgorithms.RSMT]: {
    ...commonDefaultValues,
    colors: {
      ...commonDefaultValues.colors,
      steinerVertex: GRAPH_DEFAULT_SETTINGS.steinerNodeColor,
    },
  },
  // [SupportedAlgorithms.UOSMT]: {
  //   ...commonDefaultValues,
  //   lambda: 3,
  //   colors: {
  //     ...commonDefaultValues.colors,
  //     steinerVertex: GRAPH_DEFAULT_SETTINGS.steinerNodeColor,
  //   },
  // },
} as const;
