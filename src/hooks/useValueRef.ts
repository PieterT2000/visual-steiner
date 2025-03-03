import { useRef } from "react";

export function useValueRef<T>(value: T) {
  const ref = useRef<T>(value);
  if (ref.current !== value) {
    ref.current = value;
  }

  return ref;
}
