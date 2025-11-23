import type { InfluenceNode } from "../state/nodes"

export function evaluateField(
  sampleX: number,
  sampleY: number,
  nodes: InfluenceNode[]
): { vx: number; vy: number } {
  // Accumulated field value at this sample point
  let totalFieldX = 0
  let totalFieldY = 0

  for (const node of nodes) {
    // Vector from sample position to the node
    const offsetX = node.x - sampleX
    const offsetY = node.y - sampleY

    const distanceToNode = Math.hypot(offsetX, offsetY) || 1

    // Ignore this node if the sample is outside its influence radius
    if (distanceToNode > node.radius) {
      continue
    }

    // Direction from sample → node, normalized to length 1
    const directionToNodeX = offsetX / distanceToNode
    const directionToNodeY = offsetY / distanceToNode

    // How far from the center we are, expressed as [0, 1]
    // 0  = at the node center
    // 1  = at the edge of the radius
    const normalizedDistance = distanceToNode / node.radius

    // Base strength: strongest at center, fades towards the radius
    let strengthAtDistance = node.force * (1 - normalizedDistance)

    // Optional smoother falloff instead of a straight linear fade
    if (node.falloff === "smooth") {
      const inverse = 1 - normalizedDistance // 1 at center, 0 at edge
      const smoothFactor = inverse * inverse * (3 - 2 * inverse) // smoothstep
      strengthAtDistance = node.force * smoothFactor
    }

    switch (node.kind) {
      case "attract": {
        // Pull towards the node
        totalFieldX += directionToNodeX * strengthAtDistance
        totalFieldY += directionToNodeY * strengthAtDistance
        break
      }

      case "repel": {
        // Push away from the node
        totalFieldX -= directionToNodeX * strengthAtDistance
        totalFieldY -= directionToNodeY * strengthAtDistance
        break
      }

      case "flow": {
        // Constant flow direction, independent of the sample position
        const angleInRadians = (node.directionDeg ?? 0) * (Math.PI / 180)
        const flowDirectionX = Math.cos(angleInRadians)
        const flowDirectionY = Math.sin(angleInRadians)

        totalFieldX += flowDirectionX * strengthAtDistance
        totalFieldY += flowDirectionY * strengthAtDistance
        break
      }

      case "vortex": {
        // Tangential (swirling) motion around the node
        const spinDirection = node.spin === "cw" ? -1 : 1

        // 90° rotation of the radial direction:
        // (x, y) → (-y, x) gives a perpendicular vector
        const tangentX = -directionToNodeY * spinDirection
        const tangentY = directionToNodeX * spinDirection

        totalFieldX += tangentX * strengthAtDistance
        totalFieldY += tangentY * strengthAtDistance
        break
      }
    }
  }

  return {
    vx: totalFieldX,
    vy: totalFieldY,
  }
}
