import { useEffect, useMemo, useRef, useState } from "react";
import { calcEdgeWeights, calculateGraphLength } from "@/lib/graph-utils";
import { SupportedAlgorithms } from "@/types";
import { useGraphContext } from "@/providers/graph/GraphContext";
import Graph from "graphology";
/**
 * This hook recalculates the length of each solution by dropping edges that are not part of the solution
 * and then recalculating the length of the graph
 */
export const useUpdatedSolutionLengths = <
  T extends {
    meta: { length: number };
    algorithm: SupportedAlgorithms;
    highlightedEdges: Set<string>;
  }
>(
  solutions: T[],
  graph: Graph
) => {
  const { graphPubSub } = useGraphContext();
  const [triggerRecalc, setTriggerRecalc] = useState<number | undefined>(
    undefined
  );
  const prevSolutions = useRef(solutions);
  if (prevSolutions.current !== solutions) {
    prevSolutions.current = solutions;
    setTriggerRecalc(undefined);
  }

  useEffect(() => {
    const unsubscribe = graphPubSub.subscribeGraphUpdated(() => {
      setTriggerRecalc(Date.now());
    });
    return () => unsubscribe();
  }, [graphPubSub]);

  return useMemo(() => {
    if (triggerRecalc === undefined) {
      return solutions;
    }
    return solutions.map((solution) => {
      const copy = graph.copy();
      copy.forEachEdge((edge) => {
        const inSolution = solution.highlightedEdges.has(edge);
        if (!inSolution) {
          // This will automatically drop nodes that are not part of the solution
          copy.dropEdge(edge);
        }
      });
      calcEdgeWeights(copy);
      const length = calculateGraphLength(copy);
      return {
        ...solution,
        meta: {
          ...solution.meta,
          length,
        },
      };
    });
  }, [solutions, triggerRecalc]);
};
