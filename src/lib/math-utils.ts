export function roundTo(value: number, precision: number) {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}
