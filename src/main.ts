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

// make canvas match CSS size once at startup
const rect = canvas.getBoundingClientRect()
canvas.width = rect.width
canvas.height = rect.height

// test node
const nodes: InfluenceNode[] = [
  {
    id: "n1",
    kind: "vortex",
    spin: "ccw",
    x: canvas.width / 2,
    y: canvas.height / 2,
    force: 30,
    radius: 250,
    falloff: "smooth",
  },

  {
    id: "n2",
    kind: "flow",
    directionDeg: 55,
    x: 500,
    y: 300,
    force: 11,
    radius: 250,
    falloff: "linear",
  },

  {
    id: "n3",
    kind: "flow",
    directionDeg: 135,
    x: canvas.width / 2,
    y: canvas.height / 2,
    force: 3,
    radius: 250,
    falloff: "smooth",
  },
  {
    id: "n4",
    kind: "repel",
    x: canvas.width / 2,
    y: canvas.height / 2,
    force: 3,
    radius: 50,
    falloff: "smooth",
  },
]

const viewport = createViewport()

const tracers = createTracers(60, 180, 90, nodes)

let lastTimestamp = performance.now()

function loop(timestamp: number) {
  const deltaMs = timestamp - lastTimestamp
  lastTimestamp = timestamp

  const deltaSeconds = deltaMs / 1000

  // Update tracer positions according to the field
  stepTracers(tracers, nodes, deltaSeconds, canvas.width, canvas.height)

  // Render everything for this frame
  renderMain(canvas, ctx!, viewport, nodes, tracers)
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
