import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* v8 ignore next 3 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Picks a random element from the array
 */
export function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
