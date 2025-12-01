import { renderMain } from "./render/renderMain"
import type { Viewport } from "./state/viewport"
import type { InfluenceNode } from "./state/nodes"
import "./style.css"
import {
  createTracers,
  stepTracers,
  setTracerLifetimeRange,
} from "./field/tracers"
import { cardHeight, cardWidth } from "./render/renderCardComponents"
import { appState } from "./state/appState"
import { generateFieldModule, highlightTs } from "./generateCode"

// ----------------------------------------------------
// Persistence: save/restore viewport + nodes snapshot
// ----------------------------------------------------

interface SavedState {
  viewport: {
    offsetX: number
    offsetY: number
    scale: number
  }
  nodes: InfluenceNode[]
}

const STORAGE_KEY = "flowFieldDesignerState"

function loadSavedState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SavedState
  } catch {
    return null
  }
}

function saveDesignerState(viewport: Viewport, nodes: InfluenceNode[]) {
  const snapshot: SavedState = {
    viewport: {
      offsetX: viewport.offsetX,
      offsetY: viewport.offsetY,
      scale: viewport.scale,
    },
    nodes: nodes.map((n) => ({ ...n })),
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch (err) {
    console.warn("Failed to save designer state", err)
  }
}

// ----------------------------------------------------
// UI bootstrap
// ----------------------------------------------------

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="code-container">
      <div class="button-row">
        <button id="tryButton">Try code</button>
        <button id="copyButton">Copy Code</button>
      </div>
      <div class="code-contentWrapper">
        <div class="code-content">

          <!-- test code output here -->
        

        </div>
      </div>
    </div>

    <div id="splitter" class="splitter"></div>

    <div class="canvas-container">
      <span class="canvas-label">Zoom: Mouse Wheel | Pan: Drag | Dblclick to add new node</span>
      <span class="canvas-label" id="zoomLabel">Zoom: 100%</span>
      <div class="toggle-row">
        <button class="hideCardsButton" id="hideCardsButton" title="Hide Cards">Toggle Cards</button>
        <button id="toggleGridButton" title="Toggle grid">Toggle Grid</button>
        <button id="toggleArrowsButton" title="Toggle arrows">Toggle Arrows</button>
      </div>
      <!-- tracer + view controls -->
      <div class="tracer-controls">
        <label>
          Tracer width
          <input
            id="tracerWidthInput"
            type="range"
            min="1"
            max="20"
            step="0.1"
            value="4"
          />
        </label>
        <label>
          Tracer length
          <input
            id="tracerLengthInput"
            type="range"
            min="1"
            max="2000"
            step="1"
            value="25"
          />
        </label>
        <label>
          Tracer lifetime (s)
          <input
            id="tracerLifetimeInput"
            type="range"
            min="0.25"
            max="100"
            step="1"
            value="3"
          />
        </label>
       
      </div>

      <span class="canvas-label" id="posLabel">Cursor: –</span>
      <canvas id="canvas"></canvas>
      <div id="card-layer"></div>
    </div>
`

// splitter drag logic
const appRoot = document.querySelector<HTMLDivElement>("#app")
const codeContainer = document.querySelector<HTMLDivElement>(".code-container")
const canvasContainer =
  document.querySelector<HTMLDivElement>(".canvas-container")
const splitter = document.getElementById("splitter") as HTMLDivElement | null

let isDraggingSplit = false

if (appRoot && codeContainer && canvasContainer && splitter) {
  splitter.addEventListener("mousedown", (e) => {
    e.preventDefault()
    isDraggingSplit = true
  })

  window.addEventListener("mousemove", (e) => {
    if (!isDraggingSplit) return

    const appRect = appRoot.getBoundingClientRect()
    const relativeX = e.clientX - appRect.left
    let ratio = relativeX / appRect.width

    // clamp so neither side becomes absurdly small
    ratio = Math.max(0.15, Math.min(0.85, ratio))

    const leftPercent = ratio * 100
    const rightPercent = 100 - leftPercent

    codeContainer.style.flex = `0 0 ${leftPercent}%`
    canvasContainer.style.flex = `0 0 ${rightPercent}%`

    // keep canvas bitmap in sync with CSS size
    resizeCanvas()
  })

  window.addEventListener("mouseup", () => {
    isDraggingSplit = false
  })
}

// code panel refs + state
const codeContentDiv = document.querySelector<HTMLDivElement>(".code-content")
let lastGeneratedCode = ""

// helper to regenerate + render code
function updateCodeView(nodes: InfluenceNode[]) {
  if (!codeContentDiv) return
  const code = generateFieldModule(nodes)
  lastGeneratedCode = code

  // highlightTs returns HTML (escaped + spans)
  const highlighted = highlightTs(code)
  codeContentDiv.innerHTML = `<pre><code class="ts">${highlighted}</code></pre>`
}

const copyButton = document.getElementById("copyButton")
copyButton?.addEventListener("click", () => {
  const codeToCopy =
    lastGeneratedCode ||
    document.querySelector(".code-content")?.textContent?.trim() ||
    ""

  if (codeToCopy) {
    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        alert("Code copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }
})
// tracer + view controls refs
const tracerWidthInput = document.getElementById(
  "tracerWidthInput"
) as HTMLInputElement | null
const tracerLengthInput = document.getElementById(
  "tracerLengthInput"
) as HTMLInputElement | null
const tracerLifetimeInput = document.getElementById(
  "tracerLifetimeInput"
) as HTMLInputElement | null
const toggleGridButton = document.getElementById(
  "toggleGridButton"
) as HTMLButtonElement | null
const toggleArrowsButton = document.getElementById(
  "toggleArrowsButton"
) as HTMLButtonElement | null
const toggleCardsButton = document.getElementById(
  "hideCardsButton"
) as HTMLButtonElement | null

// setup canvas
const canvasElement = document.querySelector<HTMLCanvasElement>("#canvas")
if (!canvasElement) {
  throw new Error('Canvas element with id "canvas" not found')
}

const canvas: HTMLCanvasElement = canvasElement

const ctx = canvas.getContext("2d")
if (!ctx) {
  throw new Error("Could not get 2D 2D context")
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
}

// make canvas match CSS size once at startup
resizeCanvas()

window.addEventListener("resize", () => {
  resizeCanvas()
})

// Drag flag exposed to DOM-card code
let isDraggingNodeOrCard = false

export function setIsDraggingNodeOrCard(isDragging: boolean) {
  isDraggingNodeOrCard = isDragging
}

// use shared viewport + nodes from appState
const viewport = appState.viewport
const nodes: InfluenceNode[] = appState.nodes

// labels
const zoomLabel = document.getElementById("zoomLabel") as HTMLSpanElement | null
const posLabel = document.getElementById("posLabel") as HTMLSpanElement | null
const gridStep = 25

// ----------------------------------------------------
// Restore previous session or create default node
// ----------------------------------------------------

;(function initViewportAndNodes() {
  // default viewport
  viewport.offsetX = canvas.width / 2
  viewport.offsetY = canvas.height / 2
  viewport.scale = 1

  const saved = loadSavedState()
  if (saved && saved.nodes && saved.nodes.length) {
    viewport.offsetX = saved.viewport.offsetX
    viewport.offsetY = saved.viewport.offsetY
    viewport.scale = saved.viewport.scale

    nodes.length = 0
    for (const n of saved.nodes) {
      nodes.push(n)
    }
  } else {
    // fallback initial node if nothing saved yet
    nodes.push({
      id: "n1",
      kind: "vortex",
      spin: "ccw",
      x: 0,
      y: 0,
      force: 1,
      radius: 380,
      falloff: "smooth",
      cardX: 300,
      cardY: 100,
    })
  }

  if (zoomLabel) {
    zoomLabel.textContent = `Zoom: ${(viewport.scale * 100).toFixed(0)}%`
  }
})()

// drag state, will be refactored into proper state management later
type DragMode = "none" | "pan" | "node" | "card"

let dragMode: DragMode = "none"
let dragNode: InfluenceNode | null = null
let dragOffsetX = 0
let dragOffsetY = 0
let lastPanX = 0
let lastPanY = 0
let tracerCount = 60
let tracerSpeed = 180
let tracerLength = 90
let tracerBaseWidth = 4

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  const world = screenToWorld(mouseX, mouseY, viewport)

  // Check node hit
  const R = 12 // clickable radius (world units)
  for (const node of nodes) {
    const dx = world.x - node.x
    const dy = world.y - node.y
    if (Math.hypot(dx, dy) <= R) {
      dragMode = "node"
      dragNode = node
      dragOffsetX = world.x - node.x
      dragOffsetY = world.y - node.y
      isDraggingNodeOrCard = true
      return
    }
  }

  // Check card hit
  for (const node of nodes) {
    if (
      world.x >= node.cardX &&
      world.x <= node.cardX + cardWidth &&
      world.y >= node.cardY &&
      world.y <= node.cardY + cardHeight
    ) {
      dragMode = "card"
      dragNode = node
      dragOffsetX = world.x - node.cardX
      dragOffsetY = world.y - node.cardY
      isDraggingNodeOrCard = true
      return
    }
  }

  // Otherwise: start panning
  dragMode = "pan"
  lastPanX = e.clientX
  lastPanY = e.clientY
})

window.addEventListener("mousemove", (e) => {
  if (dragMode === "none") return

  if (dragMode === "pan") {
    const dx = e.clientX - lastPanX
    const dy = e.clientY - lastPanY

    viewport.offsetX += dx
    viewport.offsetY += dy

    lastPanX = e.clientX
    lastPanY = e.clientY

    if (zoomLabel) {
      zoomLabel.textContent = `Zoom: ${(viewport.scale * 100).toFixed(0)}%`
    }

    return
  }

  if (!dragNode) return

  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  const world = screenToWorld(mouseX, mouseY, viewport)

  if (dragMode === "node") {
    dragNode.x = world.x - dragOffsetX
    dragNode.y = world.y - dragOffsetY
  } else if (dragMode === "card") {
    dragNode.cardX = world.x - dragOffsetX
    dragNode.cardY = world.y - dragOffsetY
  }
})

window.addEventListener("mouseup", () => {
  dragMode = "none"
  dragNode = null
  isDraggingNodeOrCard = false
})

window.addEventListener("mouseleave", () => {
  dragMode = "none"
  dragNode = null
  isDraggingNodeOrCard = false
})

canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault()

    const zoomFactor = 1.1
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // world coords before zoom
    const worldXBefore = (mouseX - viewport.offsetX) / viewport.scale
    const worldYBefore = (mouseY - viewport.offsetY) / viewport.scale

    if (e.deltaY < 0) {
      viewport.scale *= zoomFactor
    } else {
      viewport.scale /= zoomFactor
    }

    // clamp zoom a bit
    viewport.scale = Math.max(0.25, Math.min(8, viewport.scale))

    // keep the point under the cursor stable
    const worldXAfter = worldXBefore * viewport.scale
    const worldYAfter = worldYBefore * viewport.scale

    viewport.offsetX = mouseX - worldXAfter
    viewport.offsetY = mouseY - worldYAfter

    if (zoomLabel) {
      zoomLabel.textContent = `Zoom: ${(viewport.scale * 100).toFixed(0)}%`
    }
  },
  { passive: false }
)

// cursor world position label (snapped to grid)
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const worldX = (mouseX - viewport.offsetX) / viewport.scale
  const worldY = (mouseY - viewport.offsetY) / viewport.scale

  const snappedX = Math.round(worldX / gridStep) * gridStep
  const snappedY = Math.round(worldY / gridStep) * gridStep

  if (posLabel) {
    posLabel.textContent = `Cursor: (${snappedX.toFixed(0)}, ${snappedY.toFixed(
      0
    )})`
  }
})

canvas.addEventListener("mouseleave", () => {
  if (posLabel) posLabel.textContent = "Cursor: –"
})

function createNewNodeAt(worldX: number, worldY: number) {
  console.log(`Creating new node at (${worldX}, ${worldY})`)

  const cardDistance = 150
  const angle = Math.random() * Math.PI * 2

  const cardX = worldX + Math.cos(angle) * cardDistance
  const cardY = worldY + Math.sin(angle) * cardDistance

  nodes.push({
    id: `n${nodes.length + 1}`,
    kind: "attract",
    x: worldX,
    y: worldY,
    force: 10,
    radius: 100,
    falloff: "smooth",
    cardX,
    cardY,
  })
}

function hideCardsForAllNodes() {
  const cardLayer = document.getElementById("card-layer")
  if (cardLayer) {
    cardLayer.classList.add("hidden")
  }
}

function showCardsForAllNodes() {
  const cardLayer = document.getElementById("card-layer")
  if (cardLayer) {
    cardLayer.classList.remove("hidden")
  }
}

canvas.addEventListener("dblclick", (e) => {
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const worldX = (mouseX - viewport.offsetX) / viewport.scale
  const worldY = (mouseY - viewport.offsetY) / viewport.scale
  createNewNodeAt(worldX, worldY)
  console.log(`Double click at world coords: (${worldX}, ${worldY})`)
})

function screenToWorld(x: number, y: number, viewport: Viewport) {
  return {
    x: (x - viewport.offsetX) / viewport.scale,
    y: (y - viewport.offsetY) / viewport.scale,
  }
}

// tracers created from shared nodes, stored in appState too
const tracers = createTracers(
  tracerCount,
  tracerSpeed,
  tracerLength,
  tracerBaseWidth,
  nodes
)
appState.tracers = tracers

// helper to rebuild tracers when settings change
function rebuildTracers() {
  tracers.length = 0
  const fresh = createTracers(
    tracerCount,
    tracerSpeed,
    tracerLength,
    tracerBaseWidth,
    nodes
  )
  tracers.push(...fresh)
}

// hook up tracer controls
if (tracerWidthInput) {
  tracerWidthInput.value = String(tracerBaseWidth)
  tracerWidthInput.addEventListener("input", () => {
    tracerBaseWidth = Number(tracerWidthInput.value) || 1
    rebuildTracers()
  })
}

if (tracerLengthInput) {
  tracerLengthInput.value = String(tracerLength)
  tracerLengthInput.addEventListener("input", () => {
    tracerLength = Number(tracerLengthInput.value) || 10
    rebuildTracers()
  })
}

if (tracerLifetimeInput) {
  tracerLifetimeInput.value = "25"
  const initial = Number(tracerLifetimeInput.value)
  setTracerLifetimeRange(initial * 0.75, initial * 1.25)

  tracerLifetimeInput.addEventListener("input", () => {
    const centre = Number(tracerLifetimeInput.value) || 10
    const min = centre * 0.75
    const max = centre * 1.25
    setTracerLifetimeRange(min, max)
    // lifetime only affects future spawns; no need to rebuild
  })
}

// card toggle
if (toggleCardsButton) {
  toggleCardsButton.addEventListener("click", () => {
    const cardLayer = document.getElementById("card-layer")
    if (cardLayer) {
      if (cardLayer.classList.contains("hidden")) {
        showCardsForAllNodes()
      } else {
        hideCardsForAllNodes()
      }
    }
  })
}

// grid / arrow toggles
if (toggleGridButton) {
  toggleGridButton.addEventListener("click", () => {
    appState.showGrid = !appState.showGrid
  })
}

if (toggleArrowsButton) {
  toggleArrowsButton.addEventListener("click", () => {
    appState.showArrows = !appState.showArrows
  })
}

// open test.html in same tab with the code prefilled via URL fragment
const tryButton = document.getElementById(
  "tryButton"
) as HTMLButtonElement | null

tryButton?.addEventListener("click", () => {
  const codeToTry =
    lastGeneratedCode ||
    document.querySelector(".code-content")?.textContent?.trim() ||
    ""

  if (!codeToTry) return

  // save current designer state so Back will restore this layout
  saveDesignerState(viewport, nodes)

  // viewport export: zoom + camera world position at canvas center
  const centerWorldX = (canvas.width / 2 - viewport.offsetX) / viewport.scale
  const centerWorldY = (canvas.height / 2 - viewport.offsetY) / viewport.scale

  const encodedCode = encodeURIComponent(codeToTry)
  const encodedZoom = encodeURIComponent(String(viewport.scale))
  const encodedCamX = encodeURIComponent(String(centerWorldX))
  const encodedCamY = encodeURIComponent(String(centerWorldY))

  const basePath = location.pathname.replace(/\/[^/]*$/, "/")
  const testUrl =
    `${location.origin}${basePath}test.html` +
    `#code=${encodedCode}` +
    `&zoom=${encodedZoom}` +
    `&camx=${encodedCamX}` +
    `&camy=${encodedCamY}`

  location.href = testUrl
})

let lastTimestamp = performance.now()

function loop(timestamp: number) {
  const deltaMs = timestamp - lastTimestamp
  lastTimestamp = timestamp

  const deltaSeconds = deltaMs / 1000

  // Skip tracer stepping while dragging nodes/cards to keep drag snappy
  if (!isDraggingNodeOrCard) {
    stepTracers(
      tracers,
      nodes,
      deltaSeconds,
      viewport,
      canvas.width,
      canvas.height
    )
  }

  // regenerate field code from current nodes
  updateCodeView(nodes)

  // Always redraw: grid + arrows + tracers + DOM cards
  renderMain(canvas, ctx!, viewport, nodes, tracers)

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
