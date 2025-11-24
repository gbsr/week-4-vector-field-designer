import type { Tracer } from "../field/tracers"
import type { InfluenceNode } from "../state/nodes"
import type { Viewport } from "../state/viewport"
import { renderGrid } from "./renderGrid"
import { renderTracers } from "./renderTracers"
import { renderVectorField } from "./renderVectorField"

export function renderMain(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  nodes: InfluenceNode[],
  tracers: Tracer[]
) {
  const w = canvas.width
  const h = canvas.height

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, w, h)

  ctx.setTransform(
    viewport.scale,
    0,
    0,
    viewport.scale,
    viewport.offsetX,
    viewport.offsetY
  )

  renderGrid(viewport, ctx, w, h, 50)
  renderVectorField(ctx, w, h, 40, nodes, true, 25, viewport)
  renderTracers(ctx, tracers, 1, "rgba(255, 255, 255, 0.9)")

  // render cards for nodes
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
    const cardWidth = 180
    const cardHeight = 90

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
