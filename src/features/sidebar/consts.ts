import { SupportedAlgorithms } from "@/types";
import {
  mstFormLayoutConfig,
  steinerFormLayoutConfig,
  uniformlyOrientedFormLayoutConfig,
} from "./components/form/layouts.config";
import {
  mstFormSchema,
  steinerFormSchema,
  uniformOrientSteinerFormSchema,
} from "./components/form/schema";

export const algorithmCardFormLayoutMap = {
  [SupportedAlgorithms.PRIMS_EMST]: {
    schema: mstFormSchema,
    layout: mstFormLayoutConfig,
  },
  [SupportedAlgorithms.ESMT]: {
    schema: steinerFormSchema,
    layout: steinerFormLayoutConfig,
  },
  [SupportedAlgorithms.RSMT]: {
    schema: steinerFormSchema,
    layout: steinerFormLayoutConfig,
  },
  [SupportedAlgorithms.UOSMT]: {
    schema: uniformOrientSteinerFormSchema,
    layout: uniformlyOrientedFormLayoutConfig,
  },
};
