// Read URL hash parameters shared from the designer
function getHashParams(): URLSearchParams {
  const hash = window.location.hash
  const withoutHash = hash.startsWith("#") ? hash.slice(1) : hash
  return new URLSearchParams(withoutHash)
}

const HASH_PARAMS = getHashParams()

// Zoom factor (1 == 100%) coming from the designer viewport
const FIELD_SCALE = parseFloat(HASH_PARAMS.get("zoom") ?? "") || 1

// World-space coordinate that should appear at the canvas center
const CAMX = parseFloat(HASH_PARAMS.get("camx") ?? "") || 0
const CAMY = parseFloat(HASH_PARAMS.get("camy") ?? "") || 0

interface Particle {
  x: number
  y: number
  trail: { x: number; y: number }[]
  maxTrail: number
}

interface FieldApi {
  // we don't care about exact node shape here, the pasted module defines it
  nodes: any[]
  evaluateField: (
    pos: { x: number; y: number },
    nodes: any[]
  ) => { x: number; y: number }
}

/* --------------------------------------------------------
   Lightweight TS/JS syntax highlighting
   (same token model as in the designer)
-------------------------------------------------------- */

const KEYWORDS = new Set([
  "export",
  "import",
  "from",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "of",
  "in",
  "while",
  "type",
  "interface",
  "extends",
  "implements",
  "new",
  "class",
  "switch",
  "case",
  "break",
  "default",
  "as",
  "number",
  "string",
  "boolean",
  "void",
  "any",
  "unknown",
])

type TokenKind = "plain" | "string" | "comment"

interface Token {
  kind: TokenKind
  text: string
}

// very small HTML escaper so code displays correctly in the highlight layer
function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let current = ""
  let kind: TokenKind = "plain"

  let i = 0
  const len = code.length

  function push() {
    if (!current) return
    tokens.push({ kind, text: current })
    current = ""
  }

  while (i < len) {
    const ch = code[i]
    const next = i + 1 < len ? code[i + 1] : ""

    // line comment
    if (kind === "plain" && ch === "/" && next === "/") {
      push()
      kind = "comment"
      current += ch
      i++
      current += code[i]
      i++
      while (i < len && code[i] !== "\n") {
        current += code[i++]
      }
      push()
      kind = "plain"
      continue
    }

    // block comment
    if (kind === "plain" && ch === "/" && next === "*") {
      push()
      kind = "comment"
      current += ch
      i++
      current += code[i]
      i++
      while (i < len) {
        const c = code[i]
        const n = i + 1 < len ? code[i + 1] : ""
        current += c
        i++
        if (c === "*" && n === "/") {
          current += n
          i++
          break
        }
      }
      push()
      kind = "plain"
      continue
    }

    // strings
    if (kind === "plain" && (ch === '"' || ch === "'" || ch === "`")) {
      push()
      const quote = ch
      kind = "string"
      current += ch
      i++
      while (i < len) {
        const c = code[i]
        current += c
        i++
        if (c === "\\" && i < len) {
          current += code[i]
          i++
          continue
        }
        if (c === quote) break
      }
      push()
      kind = "plain"
      continue
    }

    current += ch
    i++
  }

  push()
  return tokens
}

function highlightPlain(escaped: string): string {
  return escaped.replace(
    /(\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b)/g,
    (match) => {
      // numbers
      if (/^\d/.test(match)) {
        return `<span class="tok-number">${match}</span>`
      }

      // keywords
      if (KEYWORDS.has(match)) {
        return `<span class="tok-kw">${match}</span>`
      }

      // simple guess: Types / interfaces / enums start with uppercase
      if (/^[A-Z]/.test(match)) {
        return `<span class="tok-type">${match}</span>`
      }

      return match
    }
  )
}

function highlightTs(code: string): string {
  const tokens = tokenize(code)
  let out = ""

  for (const t of tokens) {
    if (t.kind === "comment") {
      out += `<span class="tok-comment">${escapeHtml(t.text)}</span>`
    } else if (t.kind === "string") {
      out += `<span class="tok-string">${escapeHtml(t.text)}</span>`
    } else {
      out += highlightPlain(escapeHtml(t.text))
    }
  }

  return out
}

/* --------------------------------------------------------
   DOM wiring
-------------------------------------------------------- */

const codeInput = document.getElementById(
  "codeInput"
) as HTMLTextAreaElement | null

// highlight layer under the textarea
const codeHighlight = document.querySelector(
  ".code-shell .code-highlight"
) as HTMLElement | null

const runButton = document.getElementById(
  "runButton"
) as HTMLButtonElement | null
const resetParticlesButton = document.getElementById(
  "resetParticlesButton"
) as HTMLButtonElement | null
const statusEl = document.getElementById("status") as HTMLPreElement | null

const canvas = document.getElementById(
  "fieldCanvas"
) as HTMLCanvasElement | null
if (!canvas) {
  throw new Error('Canvas element with id "fieldCanvas" not found')
}

const ctx = canvas.getContext("2d")
if (!ctx) {
  throw new Error("Could not get 2D context")
}

if (codeInput) {
  codeInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const start = codeInput.selectionStart
      const end = codeInput.selectionEnd
      const value = codeInput.value
      const insert = "  " // two spaces

      codeInput.value = value.slice(0, start) + insert + value.slice(end)
      codeInput.selectionStart = codeInput.selectionEnd = start + insert.length

      syncHighlight()
    }
  })
}

function resizeCanvas() {
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
}

const backButton = document.getElementById(
  "backToDesignerButton"
) as HTMLButtonElement | null

if (backButton) {
  backButton.addEventListener("click", () => {
    history.back()
  })
}

const copyButton = document.getElementById(
  "copyButton"
) as HTMLButtonElement | null

copyButton?.addEventListener("click", () => {
  const codeToCopy = codeInput?.value ?? ""

  if (!codeToCopy.trim()) {
    setStatus("Nothing to copy.", true)
    return
  }

  navigator.clipboard
    .writeText(codeToCopy)
    .then(() => {
      setStatus("Code copied to clipboard.", false)
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err)
      setStatus("Failed to copy code to clipboard.", true)
    })
})

resizeCanvas()
window.addEventListener("resize", resizeCanvas)

const PARTICLE_COUNT = 600
const PARTICLE_SPEED = 140
const particles: Particle[] = []

let fieldApi: FieldApi | null = null
let lastTime = performance.now()

// Write a small status message
function setStatus(message: string, isError = false) {
  if (!statusEl) return
  statusEl.textContent = message
  statusEl.classList.remove("ok", "error")
  statusEl.classList.add(isError ? "error" : "ok")
}

function getPrefilledCode(): string | null {
  const encoded = HASH_PARAMS.get("code")
  if (!encoded) return null

  try {
    return decodeURIComponent(encoded)
  } catch {
    return null
  }
}

// sync the overlay with the textarea content & scroll
function syncHighlight() {
  if (!codeInput || !codeHighlight) return
  const src = codeInput.value ?? ""
  codeHighlight.innerHTML = highlightTs(src)
  codeHighlight.scrollTop = codeInput.scrollTop
  codeHighlight.scrollLeft = codeInput.scrollLeft
}

const prefilled = getPrefilledCode()

// small default / prefilled text logic
if (codeInput) {
  if (prefilled) {
    // coming from the designer: use that
    codeInput.value = prefilled
  } else {
    // no hash → show hint
    codeInput.value = `// Paste your generated field module here.
// It should define:
//   const FIELD_NODES = [...]
//   export function evaluateField(pos: { x: number; y: number }, nodes = FIELD_NODES) { ... }`
  }
  // initial highlight
  syncHighlight()

  // keep highlight in sync on input
  codeInput.addEventListener("input", () => {
    syncHighlight()
  })

  // keep scroll positions in sync
  codeInput.addEventListener("scroll", () => {
    if (!codeHighlight) return
    codeHighlight.scrollTop = codeInput.scrollTop
    codeHighlight.scrollLeft = codeInput.scrollLeft
  })
}

/**
 * Make the code into a small "module" we can call.
 * We strip 'export' keywords so possible to paste TS-like modules.
 *
 * Expected globals in the pasted code (after stripping):
 *   const FIELD_NODES = [...]
 *   function evaluateField(pos, nodes) { ... }
 */
function buildFieldApi(source: string): FieldApi {
  let cleaned = source

  // 1) Drop interface blocks completely
  cleaned = cleaned.replace(/^export\s+interface[\s\S]*?\}\s*$/gm, "")
  cleaned = cleaned.replace(/^interface[\s\S]*?\}\s*$/gm, "")

  // 2) Drop type aliases (single-line)
  cleaned = cleaned.replace(/^export\s+type[^\n]*\n/gm, "")
  cleaned = cleaned.replace(/^type[^\n]*\n/gm, "")

  // 3) Special-case: FIELD_NODES declaration
  //    export const FIELD_NODES: InfluenceNode[] = [
  // -> const FIELD_NODES = [
  cleaned = cleaned.replace(
    /export\s+const\s+FIELD_NODES\s*:[^=]+=/,
    "const FIELD_NODES ="
  )

  // 4) Special-case: evaluateField signature
  //    export function evaluateField(pos: Vec2, nodes: InfluenceNode[]): Vec2 {
  // -> function evaluateField(pos, nodes) {
  cleaned = cleaned.replace(
    /export\s+function\s+evaluateField\s*\(\s*pos\s*:[^,]+,\s*nodes\s*:[^)]+\)\s*:[^{]+{/,
    "function evaluateField(pos, nodes) {"
  )

  // 5) Remove remaining "export" keywords (just in case)
  cleaned = cleaned.replace(/\bexport\s+/g, "")

  // 6) Remove optional property markers (`spin?: "cw"`)
  cleaned = cleaned.replace(/\?:/g, ":")

  // 7) Strip the specific param + return type annotations still left
  //    function falloffFactor(dist: number, radius: number, mode: Falloff): number {
  //    function degToRad(deg: number): number {
  cleaned = cleaned.replace(
    /\b(dist|radius|mode|deg)\s*:\s*(number|Falloff)\b/g,
    "$1"
  )
  cleaned = cleaned.replace(/\)\s*:\s*(number|Falloff|Vec2)\b/g, ")")

  // 8) Safety patch: fix accidental `return { x, y }` / `return { x: vx, y }`
  cleaned = cleaned.replace(
    /return\s*\{\s*x\s*,\s*y\s*\}/g,
    "return { x: vx, y: vy }"
  )

  cleaned = cleaned.replace(
    /return\s*\{\s*x\s*:\s*vx\s*,\s*y\s*\}/g,
    "return { x: vx, y: vy }"
  )

  console.log("=== CLEANED FIELD MODULE ===\n" + cleaned)

  const wrapped = `
${cleaned}

let nodesRef;

if (typeof FIELD_NODES !== "undefined") {
  nodesRef = FIELD_NODES;
} else if (typeof nodes !== "undefined") {
  nodesRef = nodes;
} else {
  throw new Error("No 'FIELD_NODES' or 'nodes' array found in pasted code.");
}

if (typeof evaluateField !== "function") {
  throw new Error("No global 'evaluateField' function found in pasted code.");
}

return { nodes: nodesRef, evaluateField };
  `

  const factory = new Function(wrapped) as () => FieldApi
  return factory()
}

/**
 * Init particles in canvas-space, random positions
 */
function initParticles() {
  if (!canvas) return
  particles.length = 0

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      trail: [],
      maxTrail: 18 + Math.random() * 10,
    })
  }
}

/**
 * Advance all particles according to the currently loaded field
 */
function stepParticles(dt: number) {
  if (!canvas || !fieldApi) return

  const { nodes, evaluateField } = fieldApi
  const speed = PARTICLE_SPEED

  for (const p of particles) {
    // map canvas coords -> field coords with origin at camera center
    const worldX = (p.x - canvas.width / 2) / FIELD_SCALE + CAMX
    const worldY = (p.y - canvas.height / 2) / FIELD_SCALE + CAMY

    const field = evaluateField({ x: worldX, y: worldY }, nodes)
    let vx = field.x
    let vy = field.y

    const len = Math.hypot(vx, vy) || 1
    vx /= len
    vy /= len

    p.x += vx * speed * dt
    p.y += vy * speed * dt

    // detect wrap
    let wrapped = false

    if (p.x < 0) {
      p.x += canvas.width
      wrapped = true
    } else if (p.x > canvas.width) {
      p.x -= canvas.width
      wrapped = true
    }

    if (p.y < 0) {
      p.y += canvas.height
      wrapped = true
    } else if (p.y > canvas.height) {
      p.y -= canvas.height
      wrapped = true
    }

    if (wrapped) {
      // break the trail so we don't draw a huge line across the seam
      p.trail.length = 0
      p.trail.push({ x: p.x, y: p.y })
    } else {
      // normal trail update
      p.trail.push({ x: p.x, y: p.y })
      if (p.trail.length > p.maxTrail) {
        p.trail.shift()
      }
    }
  }
}

/**
 * Draw the particle trails
 */
function render() {
  if (!canvas || !ctx) return
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.lineCap = "round"

  for (const p of particles) {
    const trail = p.trail
    if (trail.length < 2) continue

    // subtle color variation by x
    const hue = ((p.x / canvas.width) * 180 + 180) % 360
    ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.85)`
    ctx.lineWidth = 1.4

    ctx.beginPath()
    const first = trail[0]
    ctx.moveTo(first.x, first.y)
    for (let i = 1; i < trail.length; i++) {
      const t = trail[i]
      ctx.lineTo(t.x, t.y)
    }
    ctx.stroke()
  }
}

/**
 * Animation loop
 */
function loop(now: number) {
  const dt = (now - lastTime) / 1000
  lastTime = now

  stepParticles(dt)
  render()

  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

/**
 * Wire up UI
 */
if (runButton) {
  runButton.addEventListener("click", () => {
    if (!codeInput) return
    const source = codeInput.value
    if (!source.trim()) {
      setStatus("Paste some generated field code first.", true)
      return
    }

    try {
      fieldApi = buildFieldApi(source)
      initParticles()

      const nodeCount = Array.isArray(fieldApi.nodes)
        ? fieldApi.nodes.length
        : "unknown"

      setStatus(
        `OK: loaded field module with ${nodeCount} node(s). Particles following field.`,
        false
      )
    } catch (err) {
      console.error(err)
      setStatus(String(err), true)
      fieldApi = null
    }
  })
}

if (resetParticlesButton) {
  resetParticlesButton.addEventListener("click", () => {
    initParticles()
    setStatus("Particles reset.", false)
  })
}
// if weeee have prefilled code, try to run it immediately
if (prefilled && runButton) {
  runButton.click()
} else {
  setStatus("Waiting for field code…", false)
  initParticles()
}
