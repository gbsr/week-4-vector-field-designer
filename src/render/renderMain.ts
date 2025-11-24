import type { Tracer } from "../field/tracers"
import type { InfluenceNode } from "../state/nodes"
import type { Viewport } from "../state/viewport"
import { cardHeight, cardWidth, renderCards } from "./renderCards"
import { renderGrid } from "./renderGrid"
import { renderTracers } from "./renderTracers"
import { renderVectorField } from "./renderVectorField"

export function renderMain(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  nodes: InfluenceNode[],
  tracers: Tracer[],
  cardWidth: number,
  cardHeight: number
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

  renderCards(nodes, ctx, viewport, cardWidth, cardHeight)
}
