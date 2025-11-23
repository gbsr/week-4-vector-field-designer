export interface Viewport {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export function createViewport(): Viewport {
  return { offsetX: 0, offsetY: 0, scale: 1 };
}