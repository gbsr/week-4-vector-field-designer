export type NodeKind = "attract" | "repel" | "flow" | "vortex";

export interface InfluenceNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  force: number;
  radius: number;
  falloff: "linear" | "smooth";
  directionDeg?: number; // when flow
  spin?: "cw" | "ccw";   // when vortex
}
