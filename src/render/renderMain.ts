import type { Tracer } from "../field/tracers"
import type { InfluenceNode } from "../state/nodes"
import type { Viewport } from "../state/viewport"
import { renderDomCards } from "./renderCards"
import { renderGrid } from "./renderGrid"
import { renderTracers } from "./renderTracers"
import { renderVectorField } from "./renderVectorField"
import { appState } from "../state/appState"

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

  if (appState.showGrid) {
    renderGrid(viewport, ctx, w, h, 50)
  }

  if (appState.showArrows) {
    renderVectorField(ctx, w, h, 40, nodes, true, 25, viewport)
  }

  renderTracers(ctx, tracers, 8.5, "")

  renderDomCards(nodes, viewport)
}
