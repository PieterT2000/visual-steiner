import { SupportedAlgorithms } from "@/types";
import {
  mstFormLayoutConfig,
  steinerFormLayoutConfig,
} from "./components/form/layouts.config";
import { mstFormSchema, steinerFormSchema } from "./components/form/schema";

export const algorithmCardFormLayoutMap = {
  [SupportedAlgorithms.PRIMS_EMST]: {
    schema: mstFormSchema,
    layout: mstFormLayoutConfig,
  },
  [SupportedAlgorithms.PRIMS_RSMT]: {
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
};
