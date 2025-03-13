import { useGraphContext } from "@/providers/graph/GraphContext";
import { useEffect } from "react";

export function useGraphPubSub(listener?: () => void) {
  const { graphPubSub } = useGraphContext();
  useEffect(() => {
    if (!listener) return;
    const unsubscribe = graphPubSub.subscribeGraphUpdated(listener);
    return () => unsubscribe();
  }, [listener]);
  return graphPubSub;
}
