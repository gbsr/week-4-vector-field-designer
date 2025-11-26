// render/renderDomCards.ts
import type { InfluenceNode } from "../state/nodes"
import type { Viewport } from "../state/viewport"

export function renderDomCards(nodes: InfluenceNode[], viewport: Viewport) {
  const layer = document.getElementById("card-layer")
  if (!layer) return

  for (const node of nodes) {
    // wrapper for this node's DOM bits
    let wrapper = layer.querySelector<HTMLDivElement>(
      `.node-wrapper[data-node-id="${node.id}"]`
    )

    if (!wrapper) {
      wrapper = document.createElement("div")
      wrapper.className = "node-wrapper"
      wrapper.dataset.nodeId = node.id
      wrapper.style.position = "absolute"
      layer.appendChild(wrapper)

      const dot = document.createElement("div")
      dot.className = "node-dot"
      wrapper.appendChild(dot)

      const connector = document.createElement("div")
      connector.className = "node-connector"
      wrapper.appendChild(connector)

      const card = document.createElement("div")
      card.className = "node-card"
      wrapper.appendChild(card)
    }

    const dot = wrapper.querySelector<HTMLDivElement>(".node-dot")!
    const connector = wrapper.querySelector<HTMLDivElement>(".node-connector")!
    const card = wrapper.querySelector<HTMLDivElement>(".node-card")!

    // content
    card.textContent = node.kind

    // positions (screen space)
    const dotScreen = worldToScreen(node.x, node.y, viewport)
    const cardTopLeft = worldToScreen(node.cardX, node.cardY, viewport)

    // card: top-left
    card.style.left = `${cardTopLeft.sx}px`
    card.style.top = `${cardTopLeft.sy}px`

    // dot center
    dot.style.left = `${dotScreen.sx}px`
    dot.style.top = `${dotScreen.sy}px`

    // card center
    const cardCenterX = cardTopLeft.sx + card.offsetWidth / 2
    const cardCenterY = cardTopLeft.sy + card.offsetHeight / 2

    // connector line
    const dx = cardCenterX - dotScreen.sx
    const dy = cardCenterY - dotScreen.sy
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx)

    connector.style.left = `${dotScreen.sx}px`
    connector.style.top = `${dotScreen.sy}px`
    connector.style.width = `${length}px`
    connector.style.transform = `rotate(${angle}rad)`
  }
}

function worldToScreen(x: number, y: number, viewport: Viewport) {
  return {
    sx: x * viewport.scale + viewport.offsetX,
    sy: y * viewport.scale + viewport.offsetY,
  }
}
