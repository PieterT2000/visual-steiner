export function getRelativeMousePosition<T extends HTMLElement>(
  event: MouseEvent,
  container: T
): { x: number; y: number } {
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}
