import { useState } from "react";
import { GraphContext } from "./GraphContext";
import { useGraphUpdates } from "@/features/canvas/hooks/useGraphUpdates";
import { GraphSource } from "@/types";

export function GraphProvider({ children }: { children: React.ReactNode }) {
  const graphPubSub = useGraphUpdates();
  const [graphSource, setGraphSource] = useState<string>(
    GraphSource.DEFAULT_GRAPH
  );

  const context = {
    graphPubSub,
    graphSource,
    setGraphSource,
  };
  return (
    <GraphContext.Provider value={context}>{children}</GraphContext.Provider>
  );
}
