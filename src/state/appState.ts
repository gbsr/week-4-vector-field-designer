import type { InfluenceNode } from "./nodes"
import { createViewport, type Viewport } from "./viewport"
import type { Tracer } from "../field/tracers"

export interface AppState {
  viewport: Viewport
  nodes: InfluenceNode[]
  tracers: Tracer[]
  showArrows: boolean
  showGrid: boolean
}

export const appState: AppState = {
  viewport: createViewport(),
  nodes: [],
  tracers: [],
  showArrows: true,
  showGrid: true,
}
