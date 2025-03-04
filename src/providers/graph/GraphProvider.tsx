import { GraphContext } from "./GraphContext";
import { useGraphUpdates } from "@/features/canvas/hooks/useGraphUpdates";

export function GraphProvider({ children }: { children: React.ReactNode }) {
  const graphPubSub = useGraphUpdates();

  return (
    <GraphContext.Provider value={{ graphPubSub }}>
      {children}
    </GraphContext.Provider>
  );
}
