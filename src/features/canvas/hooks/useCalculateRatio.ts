import { SupportedAlgorithms } from "@/types";
import { AlgorithmSolution } from "../types";
import { useMemo } from "react";

type Input = Pick<AlgorithmSolution, "algorithm" | "meta">;
type Return = Input & {
  meta: {
    ratio: number;
  };
};

const useCalculateRatio = (
  solutions: Input[],
  baseAlgorithm: SupportedAlgorithms = SupportedAlgorithms.PRIMS_MST
): Return[] => {
  return useMemo(() => {
    const base = solutions.find(
      (solution) => solution.algorithm === baseAlgorithm
    );
    // prevent division by zero
    if (!base || base.meta.length === 0) {
      return [];
    }
    return solutions.map((solution) => ({
      ...solution,
      meta: {
        ...solution.meta,
        ratio: solution.meta.length / base.meta.length,
      },
    }));
  }, [solutions, baseAlgorithm]);
};

export default useCalculateRatio;
