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
  arrowLength: number = 20
) {
  for (let x = 0; x < canvasWidth; x += sampleStep) {
    for (let y = 0; y < canvasHeight; y += sampleStep) {
      const { vx, vy } = evaluateField(x, y, nodes)
      if (vx === 0 && vy === 0) continue

      drawArrow(ctx, x, y, vx, vy, arrowLength, arrowHead)
    }
  }
}
