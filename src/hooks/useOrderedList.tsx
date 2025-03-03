import { useMemo } from "react";

type Items<T> = T[];

function useOrderedList<T>(
  items: Items<T>,
  key: (item: T) => number,
  order: "asc" | "desc" = "asc"
) {
  return useMemo(() => {
    return items.sort((a, b) => {
      const aKey = key(a);
      const bKey = key(b);
      if (order === "asc") {
        return aKey - bKey;
      } else {
        return bKey - aKey;
      }
    });
  }, [items, order]);
}

export default useOrderedList;
