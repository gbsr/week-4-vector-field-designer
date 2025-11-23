export function drawArrow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  vx: number,
  vy: number,
  visualLength = 60,
  withHead = true
) {
  
  // normalize direction
  const len = Math.hypot(vx, vy) || 1;
  const nx = vx / len;
  const ny = vy / len;

  const x2 = x + nx * visualLength;
  const y2 = y + ny * visualLength;

  const headLength = 12;

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x2, y2);

  if (withHead) {
    const angle = Math.atan2(ny, nx);

    context.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 8),
      y2 - headLength * Math.sin(angle - Math.PI / 8)
    );
    context.moveTo(x2, y2);
    context.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 8),
      y2 - headLength * Math.sin(angle + Math.PI / 8)
    );
  }

  context.strokeStyle = '#ffffff';
  context.lineWidth = 1;
  context.stroke();
}