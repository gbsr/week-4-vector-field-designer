import { evaluateField } from "../field/evaluateField"
import type { InfluenceNode } from "../state/nodes"
import { drawArrow } from "./renderArrow"

export function renderVectorField(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  sampleStep: number,
  nodes: InfluenceNode[],
  arrowHead: boolean = true,
  arrowLength: number = 20,
  viewport: { offsetX: number; offsetY: number; scale: number }
) {
  // worldspace view bounds
  const worldLeft = -viewport.offsetX / viewport.scale
  const worldTop = -viewport.offsetY / viewport.scale
  const worldRight = worldLeft + canvasWidth / viewport.scale
  const worldBottom = worldTop + canvasHeight / viewport.scale

  // sample in world space
  for (let x = worldLeft; x < worldRight; x += sampleStep) {
    for (let y = worldTop; y < worldBottom; y += sampleStep) {
      const { vx, vy } = evaluateField(x, y, nodes)
      if (vx === 0 && vy === 0) continue

      drawArrow(ctx, x, y, vx, vy, arrowLength, arrowHead)
    }
  }
}
