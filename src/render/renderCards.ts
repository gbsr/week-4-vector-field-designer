import type { InfluenceNode } from "../state/nodes"
import type { Viewport } from "../state/viewport"

export function renderDomCards(nodes: InfluenceNode[], viewport: Viewport) {
  const layer = document.getElementById("card-layer")
  if (!layer) return

  // clear and re-create each frame for now
  layer.innerHTML = ""

  for (const node of nodes) {
    const card = document.createElement("div")
    card.className = "node-card"
    card.textContent = node.id // will render more stuff later, id for now only

    const { sx, sy } = worldToScreen(node.cardX, node.cardY, viewport)
    card.style.position = "absolute"
    card.style.left = `${sx}px`
    card.style.top = `${sy}px`

    layer.appendChild(card)
  }
}

function worldToScreen(x: number, y: number, viewport: Viewport) {
  return {
    sx: x * viewport.scale + viewport.offsetX,
    sy: y * viewport.scale + viewport.offsetY,
  }
}
