import { SupportedAlgorithms } from "@/types.ts";
import { createContext, useContext } from "react";
import { Updater } from "use-immer";
import { createPubSub } from "@/hooks/usePubSub";
export interface AlgorithmVisibility {
  algorithm: SupportedAlgorithms;
  visible: boolean;
}

export interface FormSettingsContext {
  activeAlgorithmCard: SupportedAlgorithms | undefined;
  setActiveAlgorithmCard: (algorithm: SupportedAlgorithms | undefined) => void;
  formRef: React.RefObject<HTMLFormElement>;
  algorithmVisibility: AlgorithmVisibility[];
  setAlgorithmVisibility: Updater<AlgorithmVisibility[]>;
  graphPubSub: ReturnType<typeof createPubSub<"graphUpdated">>;
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
