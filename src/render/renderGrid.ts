import type { Viewport } from "../viewport/viewportState"

export function renderGrid(
  viewport: Viewport,
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  step: number
) {
  // Convert visible screen bounds -> world coordinates
  const left = -viewport.offsetX / viewport.scale
  const top = -viewport.offsetY / viewport.scale
  const right = left + width / viewport.scale
  const bottom = top + height / viewport.scale

  // Determine world-space grid spacing
  const worldStep = step

  const firstVertical = Math.floor(left / worldStep) * worldStep
  const firstHorizontal = Math.floor(top / worldStep) * worldStep

  context.strokeStyle = "#1c1c1c"
  context.lineWidth = 1 / viewport.scale

  context.beginPath()

  // Vertical lines
  for (let x = firstVertical; x <= right; x += worldStep) {
    context.moveTo(x, top)
    context.lineTo(x, bottom)
  }

  // Horizontal lines
  for (let y = firstHorizontal; y <= bottom; y += worldStep) {
    context.moveTo(left, y)
    context.lineTo(right, y)
  }

  context.stroke()
}
