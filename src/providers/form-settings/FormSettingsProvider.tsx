import { useMemo, useRef, useState, useCallback } from "react";
import {
  AlgorithmVisibility,
  FormSettingsContext,
} from "./FormSettingsContext.ts";
import { Metric, SupportedAlgorithms } from "@/types.ts";
import { Form } from "@/components/ui/form.tsx";
import { useAlgorithmsForm } from "@/features/sidebar/components/form/useAlgorithmsForm.tsx";
import { algorithmsFormSchema } from "@/features/sidebar/components/form/schema.ts";
import { defaultValues } from "@/features/sidebar/components/form/defaultValues.ts";
import { Updater, useImmer } from "use-immer";
import { defaultAlgorithmVisibilityAndOrder } from "./const";

const FormSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeAlgorithmCard, setActiveAlgorithmCard] = useState<
    SupportedAlgorithms | undefined
  >(SupportedAlgorithms.ESMT);
  const form = useAlgorithmsForm(algorithmsFormSchema, defaultValues);
  const [algorithmVisibility, setAlgorithmVisibility] = useImmer<
    AlgorithmVisibility[]
  >(defaultAlgorithmVisibilityAndOrder);
  const [metric, setMetric] = useState<Metric>(Metric.EUCLIDEAN);

  const handleSetMetric = (metric: Metric) => {
    setMetric(metric);
    setActiveAlgorithmCard(
      metric === Metric.RECTILINEAR
        ? SupportedAlgorithms.RSMT
        : SupportedAlgorithms.ESMT
    );
  };

  const formRef = useRef<HTMLFormElement>(null);

  const handleSetAlgorithmVisibility: Updater<AlgorithmVisibility[]> =
    useCallback((algorithm) => {
      setAlgorithmVisibility(algorithm);
      // graphPubSub.publishGraphUpdated();
    }, []);

  const context: FormSettingsContext = useMemo(
    () => ({
      activeAlgorithmCard,
      setActiveAlgorithmCard,
      formRef,
      form,
      algorithmVisibility,
      setAlgorithmVisibility: handleSetAlgorithmVisibility,
      metric,
      setMetric: handleSetMetric,
    }),
    [activeAlgorithmCard, algorithmVisibility, formRef.current, metric]
  );

  return (
    <FormSettingsContext.Provider value={context}>
      <Form {...form}>{children}</Form>
    </FormSettingsContext.Provider>
  );
};

export default FormSettingsProvider;
