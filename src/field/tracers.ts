import type { InfluenceNode } from "../state/nodes"
import { evaluateField } from "./evaluateField"
import type { Viewport } from "../viewport/viewportState"

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

export function stepTracers(
  tracers: Tracer[],
  nodes: InfluenceNode[],
  deltaSeconds: number,
  viewport: Viewport,
  canvasWidth: number,
  canvasHeight: number
) {
  // calculate visible world-space bounds
  const worldLeft = -viewport.offsetX / viewport.scale
  const worldTop = -viewport.offsetY / viewport.scale
  const worldRight = worldLeft + canvasWidth / viewport.scale
  const worldBottom = worldTop + canvasHeight / viewport.scale

  for (const tracer of tracers) {
    const { x, y } = tracer.position

    // Sample field at tracer position
    const field = evaluateField(x, y, nodes)
    const fieldLength = Math.hypot(field.vx, field.vy)

    // If field is NaN/Infinity -> respawn
    if (!Number.isFinite(fieldLength)) {
      const node = nodes[Math.floor(Math.random() * nodes.length)]
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * node.radius

      tracer.position.x = node.x + Math.cos(angle) * radius
      tracer.position.y = node.y + Math.sin(angle) * radius
      tracer.history = []
      continue
    }

    // Compute new position.
    // If fieldLength === 0, don't move this frame (no force outside nodes).
    let newX = x
    let newY = y

    if (fieldLength > 0) {
      const directionX = field.vx / fieldLength
      const directionY = field.vy / fieldLength

      const moveX = directionX * tracer.speed * deltaSeconds
      const moveY = directionY * tracer.speed * deltaSeconds

      newX = x + moveX
      newY = y + moveY
    }

    // Add current position to history before moving
    tracer.history.push({ x, y })
    if (tracer.history.length > tracer.maxHistory) {
      tracer.history.shift()
    }

    // check tail first: is the oldest history point still inside any node radius?
    let tailInsideAnyNode = false
    const tail = tracer.history[0]

    if (tail) {
      for (const node of nodes) {
        const dx = tail.x - node.x
        const dy = tail.y - node.y
        const distance = Math.hypot(dx, dy)

        if (distance <= node.radius) {
          tailInsideAnyNode = true
          break
        }
      }
    }

    // tail left all node radii -> respawn
    if (tail && !tailInsideAnyNode) {
      const node = nodes[Math.floor(Math.random() * nodes.length)]
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * node.radius

      tracer.position.x = node.x + Math.cos(angle) * radius
      tracer.position.y = node.y + Math.sin(angle) * radius
      tracer.history = []
      continue
    }

    // check offscreen after tail logic
    const isOffscreen =
      newX < worldLeft ||
      newX > worldRight ||
      newY < worldTop ||
      newY > worldBottom

    if (isOffscreen) {
      const node = nodes[Math.floor(Math.random() * nodes.length)]
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * node.radius

      tracer.position.x = node.x + Math.cos(angle) * radius
      tracer.position.y = node.y + Math.sin(angle) * radius
      tracer.history = []
      continue
    }

    tracer.position.x = newX
    tracer.position.y = newY
  }
}
