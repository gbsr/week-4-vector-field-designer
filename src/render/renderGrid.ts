import { type Viewport } from '../viewport/viewportState';

export function renderGrid(
  viewport: Viewport,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  step: number
) 

{
  context.strokeStyle = '#333';
  context.lineWidth = 1 / viewport.scale;

  context.beginPath();
  for (let x = 0; x <= width; x += step) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += step) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.stroke();
}