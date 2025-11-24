import type { InfluenceNode } from "./nodes"

export interface AppState {
  nodes: InfluenceNode[]
  selectedNodeId: string | null
}
