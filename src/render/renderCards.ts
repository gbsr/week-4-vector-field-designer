import type { InfluenceNode } from "../state/nodes"
import type { Viewport } from "../state/viewport"

export const cardWidth = 180
export const cardHeight = 90

export function renderCards(
  nodes: InfluenceNode[],
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  cardWidth: number,
  cardHeight: number
) {
  for (const node of nodes) {
    // dot
    ctx.fillStyle = "#ff6540"
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

    // card

    ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 1 / viewport.scale

    ctx.beginPath()
    ctx.rect(node.cardX, node.cardY, cardWidth, cardHeight)
    ctx.fill()
    ctx.stroke()

    // minimal text for now, will render properly later
    ctx.fillStyle = "#ffffff"
    ctx.font = `${12 / viewport.scale}px system-ui`
    ctx.fillText(
      `type: ${node.kind}`,
      node.cardX + 8,
      node.cardY + 18 / viewport.scale
    )
    ctx.fillText(
      `force: ${node.force}`,
      node.cardX + 8,
      node.cardY + 34 / viewport.scale
    )
    ctx.fillText(
      `radius: ${node.radius}`,
      node.cardX + 8,
      node.cardY + 50 / viewport.scale
    )
  }
}
