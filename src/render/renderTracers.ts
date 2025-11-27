import type { Tracer } from "../field/tracers"

let fadeOutDuration = 6 // in seconds

export function renderTracers(
  ctx: CanvasRenderingContext2D,
  tracers: Tracer[],
  lineWidth: number,
  strokeStyle = "rgba(255, 255, 255, 0.9)"
) {
  ctx.save()
  ctx.lineWidth = lineWidth

  // we assume strokeStyle is an rgba() string and reuse its RGB part
  // e.g. "rgba(255, 255, 255, 0.9)" -> "rgba(255, 255, 255"
  let rgbPrefix = strokeStyle
  const rgbaMatch = strokeStyle.match(/^rgba\(([^)]+)\)$/)
  if (rgbaMatch) {
    const parts = rgbaMatch[1].split(",")
    if (parts.length === 4) {
      parts.pop() // drop alpha
      rgbPrefix = `rgba(${parts.join(",")}`
    }
  }

  for (const tracer of tracers) {
    if (tracer.history.length < 2) continue

    // age-based fade: last fadeOutDuration of lifetime
    let alpha = 1
    if (tracer.maxAge > 0) {
      const remaining = tracer.maxAge - tracer.age
      if (remaining <= 0) {
        alpha = 0
      } else if (remaining < fadeOutDuration) {
        alpha = remaining / fadeOutDuration
      }
    }

    ctx.strokeStyle =
      rgbaMatch && alpha >= 0 && alpha <= 1
        ? `${rgbPrefix}, ${alpha})`
        : strokeStyle

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
