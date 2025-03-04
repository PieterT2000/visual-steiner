import { useMemo, useRef, useState, useCallback } from "react";
import {
  AlgorithmVisibility,
  FormSettingsContext,
} from "./FormSettingsContext.ts";
import { SupportedAlgorithms } from "@/types.ts";
import { Form } from "@/components/ui/form.tsx";
import { useAlgorithmsForm } from "@/features/sidebar/components/form/useAlgorithmsForm.tsx";
import { algorithmsFormSchema } from "@/features/sidebar/components/form/schema.ts";
import { defaultValues } from "@/features/sidebar/components/form/defaultValues.ts";
import { Updater, useImmer } from "use-immer";
import { useGraphContext } from "@/providers/graph/GraphContext";

const defaultAlgorithmVisibilityAndOrder: AlgorithmVisibility[] = [
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
  {
    algorithm: SupportedAlgorithms.UOSMT,
    visible: false,
  },
];

const FormSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeAlgorithmCard, setActiveAlgorithmCard] = useState<
    SupportedAlgorithms | undefined
  >(SupportedAlgorithms.ESMT);
  const form = useAlgorithmsForm(algorithmsFormSchema, defaultValues);
  const [algorithmVisibility, setAlgorithmVisibility] = useImmer<
    AlgorithmVisibility[]
  >(defaultAlgorithmVisibilityAndOrder);
  const { graphPubSub } = useGraphContext();

  const formRef = useRef<HTMLFormElement>(null);

  const handleSetAlgorithmVisibility: Updater<AlgorithmVisibility[]> =
    useCallback((algorithm) => {
      setAlgorithmVisibility(algorithm);
      graphPubSub.publishGraphUpdated();
    }, []);

  const context: FormSettingsContext = useMemo(
    () => ({
      activeAlgorithmCard,
      setActiveAlgorithmCard,
      formRef,
      algorithmVisibility,
      setAlgorithmVisibility: handleSetAlgorithmVisibility,
    }),
    [activeAlgorithmCard, algorithmVisibility, formRef.current]
  );

  return (
    <FormSettingsContext.Provider value={context}>
      <Form {...form}>{children}</Form>
    </FormSettingsContext.Provider>
  );
};

export default FormSettingsProvider;
