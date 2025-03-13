import { AlgorithmVisibility } from "./FormSettingsContext";

import { SupportedAlgorithms } from "@/types";

export const defaultAlgorithmVisibilityAndOrder: AlgorithmVisibility[] = [
  {
    algorithm: SupportedAlgorithms.ESMT,
    visible: true,
  },
  {
    algorithm: SupportedAlgorithms.PRIMS_MST,
    visible: false,
  },
  {
    algorithm: SupportedAlgorithms.RSMT,
    visible: false,
  },
  // {
  //   algorithm: SupportedAlgorithms.UOSMT,
  //   visible: false,
  // },
];
