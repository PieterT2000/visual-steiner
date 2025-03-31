import { SupportedAlgorithms } from "@/types.ts";
import { GRAPH_DEFAULT_SETTINGS } from "@/features/canvas/consts";
const commonDefaultValues = {
  edgeWidth: GRAPH_DEFAULT_SETTINGS.edgeWidth,
  vertexRadius: GRAPH_DEFAULT_SETTINGS.nodeSize,
  colors: {
    edge: GRAPH_DEFAULT_SETTINGS.edgeColor,
    vertex: GRAPH_DEFAULT_SETTINGS.nodeColor,
  },
};

export const defaultValues = {
  [SupportedAlgorithms.PRIMS_EMST]: {
    ...commonDefaultValues,
  },
  [SupportedAlgorithms.PRIMS_RSMT]: {
    ...commonDefaultValues,
  },
  [SupportedAlgorithms.ESMT]: {
    maxCpuTime: 10_000,
    ...commonDefaultValues,
    colors: {
      ...commonDefaultValues.colors,
      steinerVertex: GRAPH_DEFAULT_SETTINGS.steinerNodeColor,
    },
  },
  [SupportedAlgorithms.RSMT]: {
    maxCpuTime: 10_000,
    ...commonDefaultValues,
    colors: {
      ...commonDefaultValues.colors,
      steinerVertex: GRAPH_DEFAULT_SETTINGS.steinerNodeColor,
    },
  },
} as const;
