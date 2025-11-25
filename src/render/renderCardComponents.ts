import type { InfluenceNode } from "../state/nodes"
import type { Viewport } from "../state/viewport"

export const cardWidth = 180
export const cardHeight = 90

export function renderCardComponents(
  nodes: InfluenceNode[],
  ctx: CanvasRenderingContext2D,
  viewport: Viewport
) {
  for (const node of nodes) {
    // dot
    ctx.fillStyle = "#aa2222"
    ctx.beginPath()
    ctx.arc(node.x, node.y, 6, 0, Math.PI * 2)
    ctx.fill()

    // connector line
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 0.25 / viewport.scale
    ctx.beginPath()
    ctx.moveTo(node.x, node.y)
    ctx.lineTo(node.cardX, node.cardY)
    ctx.stroke()
  }
}
