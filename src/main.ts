import { renderMain } from "./render/renderMain"
import { createViewport } from "./viewport/viewportState"
import type { InfluenceNode } from "./state/nodes"
import "./style.css"
import { createTracers, stepTracers } from "./field/tracers"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="code-container">
    <button id="copyButton">Copy Code</button>
      <div class="code-contentWrapper">
        <div class="code-content">

<!-- test code output here -->
          
          <!-- todo: add line numbers to code block -->
        
          <code><pre>
random test code:
import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
        
<!-- end test code output -->
          </pre></code>
        

        </div>
      </div>
    </div>

    <div class="canvas-container">
      <span class="canvas-label">Zoom: Mouse Wheel | Pan: Drag</span>
      <span class="canvas-label" id="zoomLabel">Zoom: 100%</span>
      <span class="canvas-label" id="posLabel">Cursor: –</span>
      <canvas id="canvas"></canvas>
    </div>
`

const copyButton = document.getElementById("copyButton")
copyButton?.addEventListener("click", () => {
  const codeContent = document
    .querySelector(".code-content")
    ?.textContent?.trim()
  if (codeContent) {
    navigator.clipboard
      .writeText(codeContent)
      .then(() => {
        alert("Code copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }
})

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

// viewport (used by pan/zoom + render)
const viewport = createViewport()

// center world origin (0,0) in the middle of the canvas
viewport.offsetX = canvas.width / 2
viewport.offsetY = canvas.height / 2
viewport.scale = 1

// zoom/pan handling
let isPanning = false
let lastX = 0
let lastY = 0

canvas.addEventListener("mousedown", (e) => {
  isPanning = true
  lastX = e.clientX
  lastY = e.clientY
})

window.addEventListener("mousemove", (e) => {
  if (!isPanning) return

  const dx = e.clientX - lastX
  const dy = e.clientY - lastY

  viewport.offsetX += dx
  viewport.offsetY += dy

  lastX = e.clientX
  lastY = e.clientY
})

window.addEventListener("mouseup", () => {
  isPanning = false
})

window.addEventListener("mouseleave", () => {
  isPanning = false
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
  },
  { passive: false }
)

// labels
const zoomLabel = document.getElementById("zoomLabel") as HTMLSpanElement | null
const posLabel = document.getElementById("posLabel") as HTMLSpanElement | null
const gridStep = 25

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

// now in world coords
const nodes: InfluenceNode[] = [
  {
    id: "n1",
    kind: "vortex",
    spin: "ccw",
    x: -50,
    y: 0,
    force: 30,
    radius: 250,
    falloff: "smooth",
  },
  {
    id: "n2",
    kind: "flow",
    directionDeg: 55,
    x: 25,
    y: 0,
    force: 11,
    radius: 250,
    falloff: "linear",
  },
  {
    id: "n3",
    kind: "flow",
    directionDeg: 135,
    x: -250,
    y: 0,
    force: 3,
    radius: 250,
    falloff: "smooth",
  },
  {
    id: "n4",
    kind: "repel",
    x: 40,
    y: -150,
    force: 3,
    radius: 50,
    falloff: "smooth",
  },
]

const tracers = createTracers(60, 180, 90, nodes)

let lastTimestamp = performance.now()

function loop(timestamp: number) {
  const deltaMs = timestamp - lastTimestamp
  lastTimestamp = timestamp

  const deltaSeconds = deltaMs / 1000

  // Update tracer positions according to the field
  stepTracers(
    tracers,
    nodes,
    deltaSeconds,
    viewport,
    canvas.width,
    canvas.height
  )

  // Render everything for this frame
  renderMain(canvas, ctx!, viewport, nodes, tracers)

  if (zoomLabel) {
    zoomLabel.textContent = `Zoom: ${(viewport.scale * 100).toFixed(0)}%`
  }

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
