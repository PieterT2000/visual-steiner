import { describe } from "node:test";
import { test, expect } from "vitest";
import useOrderedList from "@/hooks/useOrderedList";
import { renderHook } from "@testing-library/react";

describe("useOrderedList", () => {
  const items = [
    { id: "a", meta: { length: 2 } },
    { id: "b", meta: { length: 0 } },
    { id: "c", meta: { length: 3 } },
  ];

  test("should return the items in ascending order by default", () => {
    const { result } = renderHook(() =>
      useOrderedList(items, (item) => item.meta.length)
    );
    expect(result.current.map((item) => item.id)).toEqual(["b", "a", "c"]);
  });

  test("should return the items in descending order", () => {
    const { result } = renderHook(() =>
      useOrderedList(items, (item) => item.meta.length, "desc")
    );
    expect(result.current.map((item) => item.id)).toEqual(["c", "a", "b"]);
  });
});
