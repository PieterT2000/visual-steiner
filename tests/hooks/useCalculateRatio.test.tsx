import useCalculateRatio from "@/features/canvas/hooks/useCalculateRatio";
import { SupportedAlgorithms } from "@/types";
import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

function createSolution(algorithm: SupportedAlgorithms, length: number) {
  return {
    algorithm,
    highlightedNodes: new Set<string>(),
    highlightedEdges: new Set<string>(),
    meta: { length },
  };
}
describe.skip("useCalculateRatio", () => {
  test("should return empty array if base solution has length 0 or is not found", () => {
    const base = createSolution(SupportedAlgorithms.PRIMS_EMST, 0);
    const solutions = [
      createSolution(SupportedAlgorithms.ESMT, 20),
      createSolution(SupportedAlgorithms.RSMT, 30),
    ];
    const { result } = renderHook(() =>
      useCalculateRatio([...solutions, base], base.algorithm)
    );
    expect(result.current).toEqual([]);

    const { result: result2 } = renderHook(() =>
      useCalculateRatio([...solutions], base.algorithm)
    );
    expect(result2.current).toEqual([]);
  });

  test("should return ratio = x/base length when base length is not 0", () => {
    const base = createSolution(SupportedAlgorithms.PRIMS_MST, 10);
    const solutions = [
      createSolution(SupportedAlgorithms.ESMT, 20),
      createSolution(SupportedAlgorithms.RSMT, 30),
    ];

    const { result } = renderHook(() =>
      useCalculateRatio([...solutions, base], base.algorithm)
    );
    expect(result.current.map((solution) => solution.meta.ratio)).toEqual([
      2, 3, 1,
    ]);
  });
});
