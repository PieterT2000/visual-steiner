import { Metric, SupportedAlgorithms } from "@/types.ts";
import { createContext, useContext } from "react";
import { Updater } from "use-immer";
import { UseFormReturn } from "react-hook-form";
import { algorithmsFormSchema } from "@/features/sidebar/components/form/schema.ts";
import { z } from "zod";
export interface AlgorithmVisibility {
  algorithm: SupportedAlgorithms;
  visible: boolean;
  metric: Metric;
}

export interface FormSettingsContext {
  activeAlgorithmCard: SupportedAlgorithms | undefined;
  setActiveAlgorithmCard: (algorithm: SupportedAlgorithms | undefined) => void;
  formRef: React.RefObject<HTMLFormElement>;
  algorithmVisibility: AlgorithmVisibility[];
  setAlgorithmVisibility: Updater<AlgorithmVisibility[]>;
  metric: Metric;
  setMetric: (metric: Metric) => void;
  form: UseFormReturn<z.infer<typeof algorithmsFormSchema>>;
}

export const FormSettingsContext = createContext<
  FormSettingsContext | undefined
>(undefined);

export const useFormSettings = () => {
  const context = useContext(FormSettingsContext);
  if (!context) {
    throw new Error(
      "useFormSettings must be used within a FormSettingsProvider"
    );
  }
  return context;
};
