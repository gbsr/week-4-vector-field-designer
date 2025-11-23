import { drawArrow } from "./renderArrow";

export function renderVectorField(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  sampleStep: number
) {
  // sample on a grid *in world space*
  for (let x = 0; x < canvasWidth; x += sampleStep) {
    for (let y = 0; y < canvasHeight; y += sampleStep) {
      
      // Replace later with real field logic
      const vx = Math.sin(y * 0.01);
      const vy = -Math.cos(x * 0.01);

      drawArrow(ctx, x, y, vx, vy, 30, true); 
    }
  }
}
