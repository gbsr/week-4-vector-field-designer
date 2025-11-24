export type NodeKind = "attract" | "repel" | "flow" | "vortex"

export interface InfluenceNode {
  id: string
  kind: NodeKind

  // field origin (world space)
  x: number
  y: number

  force: number
  radius: number
  falloff: "linear" | "smooth"
  directionDeg?: number // flow
  spin?: "cw" | "ccw" // vortex

  // UI card position (world space)
  cardX: number
  cardY: number
}
