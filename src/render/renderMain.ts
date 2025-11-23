import type { Viewport } from "../viewport/viewportState";
import { drawArrow } from "./renderArrow"
import { renderGrid } from "./renderGrid";

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

  // render arrow in center of canvas
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  drawArrow(ctx, cx, cy, 1, -1, 27);

}