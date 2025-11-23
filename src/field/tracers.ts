import type { InfluenceNode } from "../state/nodes"
import { evaluateField } from "./evaluateField"

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
    // pick a random node to spawn near
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
      speed: speed,
      maxHistory: length,
    })
  }

  return tracers
}

export function stepTracers(
  tracers: Tracer[],
  nodes: InfluenceNode[],
  deltaSeconds: number,
  canvasWidth: number,
  canvasHeight: number
) {
  for (const tracer of tracers) {
    const { x, y } = tracer.position

    // Sample field at tracer position
    const field = evaluateField(x, y, nodes)
    const fieldLength = Math.hypot(field.vx, field.vy)

    // If field is invalid, just respawn safely
    if (!Number.isFinite(fieldLength)) {
      const node = nodes[Math.floor(Math.random() * nodes.length)]
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * node.radius

      tracer.position.x = node.x + Math.cos(angle) * radius
      tracer.position.y = node.y + Math.sin(angle) * radius
      tracer.history = []
      continue
    }

    // Normalize field direction so speed is controlled by tracer.speed
    let directionX = 0
    let directionY = 0

    if (fieldLength > 0) {
      directionX = field.vx / fieldLength
      directionY = field.vy / fieldLength
    }

    const moveX = directionX * tracer.speed * deltaSeconds
    const moveY = directionY * tracer.speed * deltaSeconds

    const newX = x + moveX
    const newY = y + moveY

    // Add current position to history before moving
    tracer.history.push({ x, y })
    if (tracer.history.length > tracer.maxHistory) {
      tracer.history.shift()
    }

    // If tracer goes off-screen, respawn inside a node radius
    const isOffscreen =
      newX < 0 || newX > canvasWidth || newY < 0 || newY > canvasHeight

    if (isOffscreen) {
      const node = nodes[Math.floor(Math.random() * nodes.length)]
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * node.radius

      tracer.position.x = node.x + Math.cos(angle) * radius
      tracer.position.y = node.y + Math.sin(angle) * radius
      tracer.history = []
      continue
    }

    // Decide if the tail (oldest history point) is still inside any node radius
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

    // If the entire trail has left all node radii, respawn
    if (!tailInsideAnyNode && tail) {
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
