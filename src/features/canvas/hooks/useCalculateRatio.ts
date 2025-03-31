import { Metric, SupportedAlgorithms } from "@/types";
import { AlgorithmSolution } from "../types";
import { useMemo } from "react";

type Input = Pick<AlgorithmSolution, "algorithm" | "meta" | "metric">;
type Return = Input & {
  meta: {
    ratio: number;
  };
};

const useCalculateSteinerRatio = (
  solutions: Input[],
  metric: Metric
): Return | undefined => {
  return useMemo(() => {
    const baseAlgorithm =
      metric === Metric.EUCLIDEAN
        ? SupportedAlgorithms.PRIMS_EMST
        : SupportedAlgorithms.PRIMS_RSMT;
    const base = solutions.find(
      (solution) => solution.algorithm === baseAlgorithm
    );
    // prevent division by zero
    if (!base || base.meta.length === 0) {
      return undefined;
    }

    const solutionsByMetric = solutions.filter(
      (solution) => solution.metric === metric
    );
    if (solutionsByMetric.length !== 2) {
      console.warn("Expected 2 solutions, got", solutionsByMetric.length);
      return undefined;
    }

    const targetSolution = solutionsByMetric.find(
      (solution) => solution.algorithm !== baseAlgorithm
    );

    if (!targetSolution) {
      return undefined;
    }
    return {
      ...targetSolution,
      meta: {
        ...targetSolution.meta,
        ratio: targetSolution.meta.length / base.meta.length,
      },
    };
  }, [solutions, metric]);
};

export default useCalculateSteinerRatio;
