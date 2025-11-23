import type { Tracer } from "../field/tracers"

export function renderTracers(
  ctx: CanvasRenderingContext2D,
  tracers: Tracer[],
  lineWidth: number,
  strokeStyle = "rgba(255, 255, 255, 0.9)"
) {
  ctx.save()
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = lineWidth

  for (const tracer of tracers) {
    if (tracer.history.length < 2) continue

    ctx.beginPath()
    const first = tracer.history[0]
    ctx.moveTo(first.x, first.y)

    for (let i = 1; i < tracer.history.length; i++) {
      const point = tracer.history[i]
      ctx.lineTo(point.x, point.y)
    }

    // Also go to the current position so the line reaches the head
    ctx.lineTo(tracer.position.x, tracer.position.y)

    ctx.stroke()
  }

  ctx.restore()
}
