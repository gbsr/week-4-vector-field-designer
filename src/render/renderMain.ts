import type { Viewport } from "../viewport/viewportState";
import { drawArrow } from "./renderArrow"
import { renderGrid } from "./renderGrid";
import { renderVectorField } from "./renderVectorField"

export function renderMain(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  viewport: Viewport
) {
  const w = canvas.width;
  const h = canvas.height;

 
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);

  ctx.setTransform(
    viewport.scale,
    0,
    0,
    viewport.scale,
    viewport.offsetX,
    viewport.offsetY
  );

  renderGrid(viewport, ctx, w, h, 50);
  renderVectorField(ctx, w, h, 40);

}