// render/renderDomCards.ts
import type { InfluenceNode } from "../state/nodes"
import type { Viewport } from "../state/viewport"

export function renderDomCards(nodes: InfluenceNode[], viewport: Viewport) {
  const layer = document.getElementById("card-layer")
  if (!layer) return

  for (const node of nodes) {
    let wrapper = layer.querySelector<HTMLDivElement>(
      `.node-wrapper[data-node-id="${node.id}"]`
    )

    if (!wrapper) {
      wrapper = createWrapperForNode(layer, node)
    }

    const {
      dot,
      connector,
      card,
      typeSelect,
      forceInput,
      radiusInput,
      falloffSelect,
      extraRow,
    } = getDomParts(wrapper)

    syncControlsFromNode(
      node,
      typeSelect,
      forceInput,
      radiusInput,
      falloffSelect,
      extraRow
    )
    updatePositionsAndConnector(node, viewport, dot, card, connector)
  }
}

function createWrapperForNode(
  layer: HTMLElement,
  node: InfluenceNode
): HTMLDivElement {
  const wrapper = document.createElement("div")
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

  const typeRow = document.createElement("div")
  typeRow.className = "node-card-row node-card-type"
  card.appendChild(typeRow)

  const forceRow = document.createElement("div")
  forceRow.className = "node-card-row node-card-force"
  card.appendChild(forceRow)

  const radiusRow = document.createElement("div")
  radiusRow.className = "node-card-row node-card-radius"
  card.appendChild(radiusRow)

  const extraRow = document.createElement("div")
  extraRow.className = "node-card-row node-card-extra"
  card.appendChild(extraRow)

  // controls inside rows (created once)

  // type: select
  const typeLabel = document.createElement("span")
  typeLabel.textContent = "type:"
  typeLabel.className = "node-card-label"
  const typeSelect = document.createElement("select")
  typeSelect.className = "node-card-select node-card-kind"
  ;["attract", "repel", "flow", "vortex"].forEach((kind) => {
    const opt = document.createElement("option")
    opt.value = kind
    opt.textContent = kind
    typeSelect.appendChild(opt)
  })
  typeRow.appendChild(typeLabel)
  typeRow.appendChild(typeSelect)

  // force: number
  const forceLabel = document.createElement("span")
  forceLabel.textContent = "force:"
  forceLabel.className = "node-card-label"
  const forceInput = document.createElement("input")
  forceInput.type = "number"
  forceInput.step = "0.1"
  forceInput.className = "node-card-input node-card-force-input"
  forceRow.appendChild(forceLabel)
  forceRow.appendChild(forceInput)

  // radius + falloff
  const radiusLabel = document.createElement("span")
  radiusLabel.textContent = "radius:"
  radiusLabel.className = "node-card-label"
  const radiusInput = document.createElement("input")
  radiusInput.type = "number"
  radiusInput.step = "1"
  radiusInput.className = "node-card-input node-card-radius-input"

  const falloffLabel = document.createElement("span")
  falloffLabel.textContent = "falloff:"
  falloffLabel.className = "node-card-label"
  const falloffSelect = document.createElement("select")
  falloffSelect.className = "node-card-select node-card-falloff"
  ;["linear", "smooth"].forEach((mode) => {
    const opt = document.createElement("option")
    opt.value = mode
    opt.textContent = mode
    falloffSelect.appendChild(opt)
  })

  radiusRow.appendChild(radiusLabel)
  radiusRow.appendChild(radiusInput)
  radiusRow.appendChild(falloffLabel)
  radiusRow.appendChild(falloffSelect)

  wrapper.appendChild(card)

  // event listeners for controls

  typeSelect.addEventListener("change", () => {
    node.kind = typeSelect.value as InfluenceNode["kind"]
    if (node.kind !== "flow") {
      node.directionDeg = undefined
    }
    if (node.kind !== "vortex") {
      node.spin = undefined
    }
  })

  forceInput.addEventListener("change", () => {
    const value = parseFloat(forceInput.value)
    if (!Number.isNaN(value)) {
      node.force = value
    }
  })

  radiusInput.addEventListener("change", () => {
    const value = parseFloat(radiusInput.value)
    if (!Number.isNaN(value)) {
      node.radius = value
    }
  })

  falloffSelect.addEventListener("change", () => {
    const value = falloffSelect.value
    if (value === "linear" || value === "smooth") {
      node.falloff = value
    }
  })

  return wrapper
}

function getDomParts(wrapper: HTMLDivElement) {
  const dot = wrapper.querySelector<HTMLDivElement>(".node-dot")!
  const connector = wrapper.querySelector<HTMLDivElement>(".node-connector")!
  const card = wrapper.querySelector<HTMLDivElement>(".node-card")!

  const typeRow = card.querySelector<HTMLDivElement>(".node-card-type")!
  const forceRow = card.querySelector<HTMLDivElement>(".node-card-force")!
  const radiusRow = card.querySelector<HTMLDivElement>(".node-card-radius")!
  const extraRow = card.querySelector<HTMLDivElement>(".node-card-extra")!

  const typeSelect =
    typeRow.querySelector<HTMLSelectElement>(".node-card-kind")!
  const forceInput = forceRow.querySelector<HTMLInputElement>(
    ".node-card-force-input"
  )!
  const radiusInput = radiusRow.querySelector<HTMLInputElement>(
    ".node-card-radius-input"
  )!
  const falloffSelect =
    radiusRow.querySelector<HTMLSelectElement>(".node-card-falloff")!

  return {
    dot,
    connector,
    card,
    typeSelect,
    forceInput,
    radiusInput,
    falloffSelect,
    extraRow,
  }
}

function syncControlsFromNode(
  node: InfluenceNode,
  typeSelect: HTMLSelectElement,
  forceInput: HTMLInputElement,
  radiusInput: HTMLInputElement,
  falloffSelect: HTMLSelectElement,
  extraRow: HTMLDivElement
) {
  // base controls
  if (typeSelect.value !== node.kind) {
    typeSelect.value = node.kind
  }
  const forceStr = String(node.force)
  if (forceInput.value !== forceStr) {
    forceInput.value = forceStr
  }
  const radiusStr = String(node.radius)
  if (radiusInput.value !== radiusStr) {
    radiusInput.value = radiusStr
  }
  if (falloffSelect.value !== node.falloff) {
    falloffSelect.value = node.falloff
  }

  // extraRow: mode-specific controls
  const currentExtraKind = extraRow.dataset.kind
  if (currentExtraKind !== node.kind) {
    extraRow.innerHTML = ""
    extraRow.dataset.kind = node.kind

    if (node.kind === "flow") {
      const dirLabel = document.createElement("span")
      dirLabel.textContent = "dir:"
      dirLabel.className = "node-card-label"

      const dirInput = document.createElement("input")
      dirInput.type = "number"
      dirInput.step = "1"
      dirInput.className = "node-card-input node-card-dir-input"
      dirInput.value = String(node.directionDeg ?? 0)

      dirInput.addEventListener("change", () => {
        const value = parseFloat(dirInput.value)
        if (!Number.isNaN(value)) {
          node.directionDeg = value
        }
      })

      extraRow.appendChild(dirLabel)
      extraRow.appendChild(dirInput)
    } else if (node.kind === "vortex") {
      const spinLabel = document.createElement("span")
      spinLabel.textContent = "spin:"
      spinLabel.className = "node-card-label"

      const spinSelect = document.createElement("select")
      spinSelect.className = "node-card-select node-card-spin"
      ;["cw", "ccw"].forEach((mode) => {
        const opt = document.createElement("option")
        opt.value = mode
        opt.textContent = mode
        spinSelect.appendChild(opt)
      })
      spinSelect.value = node.spin ?? "ccw"

      spinSelect.addEventListener("change", () => {
        const value = spinSelect.value
        if (value === "cw" || value === "ccw") {
          node.spin = value
        }
      })

      extraRow.appendChild(spinLabel)
      extraRow.appendChild(spinSelect)
    } else {
      extraRow.textContent = ""
    }
  } else {
    // keep extra controls in sync
    if (node.kind === "flow") {
      const dirInput = extraRow.querySelector<HTMLInputElement>(
        ".node-card-dir-input"
      )
      if (dirInput) {
        const dirStr = String(node.directionDeg ?? 0)
        if (dirInput.value !== dirStr) {
          dirInput.value = dirStr
        }
      }
    } else if (node.kind === "vortex") {
      const spinSelect =
        extraRow.querySelector<HTMLSelectElement>(".node-card-spin")
      if (spinSelect) {
        const spinValue = node.spin ?? "ccw"
        if (spinSelect.value !== spinValue) {
          spinSelect.value = spinValue
        }
      }
    }
  }
}

function updatePositionsAndConnector(
  node: InfluenceNode,
  viewport: Viewport,
  dot: HTMLDivElement,
  card: HTMLDivElement,
  connector: HTMLDivElement
) {
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

function worldToScreen(x: number, y: number, viewport: Viewport) {
  return {
    sx: x * viewport.scale + viewport.offsetX,
    sy: y * viewport.scale + viewport.offsetY,
  }
}
