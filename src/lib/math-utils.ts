import { Metric } from "@/types";

export function roundTo(value: number, precision: number) {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

export type WeightFunction = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => number;
export const weightFunctions: Record<Metric, WeightFunction> = {
  euclidean: (x1: number, y1: number, x2: number, y2: number) =>
    Math.hypot(x1 - x2, y1 - y2),
  rectilinear: (x1: number, y1: number, x2: number, y2: number) =>
    Math.abs(x1 - x2) + Math.abs(y1 - y2),
};

interface BucketParams {
  min: number;
  max: number;
  size: number;
  value: number;
}

/**
 * Divides a range into equal buckets and returns which bucket a number belongs to
 * @param params Object containing:
 *   - min: The minimum value of the range
 *   - max: The maximum value of the range
 *   - size: The number of buckets
 *   - value: The value to check
 * @returns The bucket number (0 to size-1) that the value belongs to
 */
export function getBucket({ min, max, size, value }: BucketParams): number {
  const range = max - min;
  const bucketSize = range / size;

  // Handle edge cases
  if (value <= min) return 0;
  if (value >= max) return size - 1;

  // Calculate which bucket the value belongs to
  const bucket = Math.floor((value - min) / bucketSize);
  return Math.min(bucket, size - 1);
}

/**
 * Calculates the position percentage (0-100) for a ratio value within its metric's bounds
 * @param params Object containing:
 *   - value: The ratio value to position
 *   - metric: The metric type (EUCLIDEAN or RECTILINEAR)
 * @returns A percentage value between 0 and 100
 */
export function getRatioPosition({
  value,
  metric,
}: {
  value: number;
  metric: Metric;
}): number {
  const minRatio = metric === Metric.EUCLIDEAN ? Math.sqrt(3) / 2 : 2 / 3;
  const maxRatio = 1;

  // Clamp the value between min and max
  const clampedValue = Math.max(minRatio, Math.min(maxRatio, value));

  // Calculate position percentage
  return ((clampedValue - minRatio) / (maxRatio - minRatio)) * 100;
}

interface Color {
  r: number;
  g: number;
  b: number;
}

/**
 * Interpolates between green-yellow-red colors based on position in a gradient
 * @param position Percentual position in the gradient (0-100)
 * @returns RGB color string
 * See https://stackoverflow.com/a/5469040/9713831
 */
export function getGradientColor(percentage: number): string {
  const colors: Color[] = [
    { r: 0, g: 188, b: 125 }, // (green)
    { r: 253, g: 154, b: 0 }, //  (yellow)
    { r: 251, g: 44, b: 54 }, //  (red)
  ];

  const p = percentage / 100;

  const interpolateComponent = (p: number, ...components: number[]) => {
    const [a, b, c] = components;
    return p < 0.5
      ? b * p * 2.0 + a * (0.5 - p) * 2.0
      : c * (p - 0.5) * 2.0 + b * (1.0 - p) * 2.0;
  };

  const r = interpolateComponent(p, ...colors.map((c) => c.r));
  const g = interpolateComponent(p, ...colors.map((c) => c.g));
  const b = interpolateComponent(p, ...colors.map((c) => c.b));

  return `rgb(${r}, ${g}, ${b})`;
}
