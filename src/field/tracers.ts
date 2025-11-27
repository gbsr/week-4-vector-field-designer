import type { InfluenceNode } from "../state/nodes"
import { evaluateField } from "./evaluateField"
import type { Viewport } from "../state/viewport"

export interface TracerPoint {
  x: number
  y: number
}

export interface Tracer {
  position: TracerPoint
  history: TracerPoint[]
  speed: number
  maxHistory: number
}

export function createTracers(
  count: number,
  speed: number,
  length: number,
  nodes: InfluenceNode[]
): Tracer[] {
  const tracers: Tracer[] = []

  for (let i = 0; i < count; i++) {
    const node = nodes[Math.floor(Math.random() * nodes.length)]

    // spawn inside the node's radius
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * node.radius

    const spawnX = node.x + Math.cos(angle) * radius
    const spawnY = node.y + Math.sin(angle) * radius

    tracers.push({
      position: {
        x: spawnX,
        y: spawnY,
      },
      history: [],
      speed,
      maxHistory: length,
    })
  }

  return tracers
}

// helper: respawn inside a random node radius

function respawnInRandomNode(tracer: Tracer, nodes: InfluenceNode[]) {
  const node = nodes[Math.floor(Math.random() * nodes.length)]
  const angle = Math.random() * Math.PI * 2
  const radius = Math.random() * node.radius

  tracer.position.x = node.x + Math.cos(angle) * radius
  tracer.position.y = node.y + Math.sin(angle) * radius
  tracer.history = []
}

// --- main step ---

export function stepTracers(
  tracers: Tracer[],
  nodes: InfluenceNode[],
  deltaSeconds: number,
  viewport: Viewport,
  canvasWidth: number,
  canvasHeight: number
) {
  // world bounds (used only for tail offscreen check)
  const worldLeft = -viewport.offsetX / viewport.scale
  const worldTop = -viewport.offsetY / viewport.scale
  const worldRight = worldLeft + canvasWidth / viewport.scale
  const worldBottom = worldTop + canvasHeight / viewport.scale

  const MIN_FIELD = 0.001 // basically zero field
  const SINK_RADIUS = 4 // how close to a node center counts as "converged"

  for (const tracer of tracers) {
    const { x, y } = tracer.position

    const field = evaluateField(x, y, nodes)
    const fieldLength = Math.hypot(field.vx, field.vy)

    if (!Number.isFinite(fieldLength)) {
      respawnInRandomNode(tracer, nodes)
      continue
    }

    let newX = x
    let newY = y

    if (fieldLength > MIN_FIELD) {
      const dirX = field.vx / fieldLength
      const dirY = field.vy / fieldLength

      const moveX = dirX * tracer.speed * deltaSeconds
      const moveY = dirY * tracer.speed * deltaSeconds

      newX = x + moveX
      newY = y + moveY
    }

    tracer.history.push({ x, y })
    if (tracer.history.length > tracer.maxHistory) {
      tracer.history.shift()
    }

    tracer.position.x = newX
    tracer.position.y = newY

    const tail = tracer.history[0]
    if (!tail) continue

    // "sink" check: head + tail both very close to a
    //    node centre -> tracer has converged, respawn.
    let inSink = false

    for (const node of nodes) {
      const dxHead = tracer.position.x - node.x
      const dyHead = tracer.position.y - node.y
      const distHead = Math.hypot(dxHead, dyHead)

      const dxTail = tail.x - node.x
      const dyTail = tail.y - node.y
      const distTail = Math.hypot(dxTail, dyTail)

      if (distHead <= SINK_RADIUS && distTail <= SINK_RADIUS) {
        inSink = true
        break
      }
    }

    if (inSink) {
      respawnInRandomNode(tracer, nodes)
      continue
    }

    // tail radius check:
    //    whole ribbon has exited the interesting
    //    field → respawn at a node.
    let tailInsideAnyNode = false

    for (const node of nodes) {
      const dx = tail.x - node.x
      const dy = tail.y - node.y
      const dist = Math.hypot(dx, dy)

      if (dist <= node.radius) {
        tailInsideAnyNode = true
        break
      }
    }

    if (!tailInsideAnyNode) {
      respawnInRandomNode(tracer, nodes)
      continue
    }

    const tailOffscreen =
      tail.x < worldLeft ||
      tail.x > worldRight ||
      tail.y < worldTop ||
      tail.y > worldBottom

    if (tailOffscreen) {
      respawnInRandomNode(tracer, nodes)
      continue
    }
  }
}
