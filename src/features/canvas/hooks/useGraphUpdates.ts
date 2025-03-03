import { createPubSub } from "@/hooks/usePubSub";
import { useRef } from "react";

export function useGraphUpdates() {
  return useRef(createPubSub("graphUpdated")).current;
}
