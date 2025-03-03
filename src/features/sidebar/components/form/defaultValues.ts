import { themeHexColors } from "@/theme.ts";
import { SupportedAlgorithms } from "@/types.ts";

const commonDefaultValues = {
  maxCpuTime: 10_000,
  edgeWidth: 1,
  vertexRadius: 1,
  colors: {
    edge: "#000000",
    vertex: themeHexColors.primary,
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
      steinerVertex: themeHexColors.layer2,
    },
  },
  [SupportedAlgorithms.RSMT]: {
    ...commonDefaultValues,
    colors: {
      ...commonDefaultValues.colors,
      steinerVertex: themeHexColors.layer2,
    },
  },
  [SupportedAlgorithms.UOSMT]: {
    ...commonDefaultValues,
    lambda: 3,
    colors: {
      ...commonDefaultValues.colors,
      steinerVertex: themeHexColors.layer2,
    },
  },
} as const;
