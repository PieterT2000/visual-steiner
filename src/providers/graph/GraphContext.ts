import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { useGraphUpdates } from "@/features/canvas/hooks/useGraphUpdates";

type GraphContextType = {
  graphPubSub: ReturnType<typeof useGraphUpdates>;
  graphSource: string;
  setGraphSource: Dispatch<SetStateAction<string>>;
};

export const GraphContext = createContext<GraphContextType | null>(null);

export function useGraphContext() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }
  return context;
}
