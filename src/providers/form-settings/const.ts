import { AlgorithmVisibility } from "./FormSettingsContext";

import { Metric, SupportedAlgorithms } from "@/types";

export const defaultAlgorithmVisibilityAndOrder: AlgorithmVisibility[] = [
  {
    algorithm: SupportedAlgorithms.ESMT,
    visible: true,
    metric: Metric.EUCLIDEAN,
  },
  {
    algorithm: SupportedAlgorithms.PRIMS_EMST,
    visible: false,
    metric: Metric.EUCLIDEAN,
  },
  {
    algorithm: SupportedAlgorithms.RSMT,
    visible: true,
    metric: Metric.RECTILINEAR,
  },
  {
    algorithm: SupportedAlgorithms.PRIMS_RSMT,
    visible: false,
    metric: Metric.RECTILINEAR,
  },
];
