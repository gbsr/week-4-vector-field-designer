# About

I’m **Anders Hofsten**, a junior frontend developer building 1 coding thing per week for 52 weeks.

This is **Week 4**.

# Flow Field Designer & Tester

*Week 4 — 52 Weeks of Code Challenge*

A visual tool for designing **flow fields** using draggable nodes (attract, repel, vortex, flow), real-time particle tracers, and a fully integrated **code generator + sandbox tester**.

You create the field visually → the app generates clean code → and with one click you jump into a live tester that runs your exact field, at the same camera position and zoom level you left it.

This week was… interesting.

I had a rough week personally, so I leaned harder into AI pair-development - not as a shortcut, but as a *workflow amplifier*. Most of the architecture, rendering logic, state handling, panning/zooming, and all the user-interaction patterns are things I understand and can reproduce, just not as fast, clearly.

But I want to be honest about this too:

**The code parser + syntax highlighter?** Pure sorcery to me.
Regex is black magic, and I wouldn’t have produced that myself.

And you know what?
That’s fine.

AI helped me build the parts that *feel* like magic, and in doing so I actually learned a ton about how these systems work under the hood. The important part is that I designed the tool, the flow, the architecture, and the functionality. AI filled in the void so I could keep momentum and actually ship the thing.

Some people call that cheating.
I call it finishing the project. But I digress.

The goal was clear:

**Build a quick, easy way to generate and test flow fields without having to manually write all the boilerplate or guess what the field “looks like” in motion.**

And it worked and it’s now a building block for future work and experimentation. I call that a win :)

---

## Demo

**Live:** https://gbsr.github.io/week-4-flow-field-designer/
**Repo:** https://github.com/gbsr/week-4-vector-field-designer

---

# Features

### Visual Flow Field Editor

- Drag nodes directly in the canvas
- Four node types:
  - **Attract**
  - **Repel**
  - **Vortex** (CW/CCW)
  - **Flow** (directional)
- Adjustable:
  - Force
  - Radius
  - Falloff (linear / smooth)
  - Spin / direction
- Node “cards” that show full settings beside each node
- Toggle grid + arrow visualization

### Real-Time Particle Tracers

- Lightweight tracer lines follow your field
- Wrap-around world
- Adjustable:
  - Width
  - Length
  - Lifetime
- Always updates live as you move or edit nodes

### Code Generation

Exports a **complete ready-to-use JS module**:

- `FIELD_NODES = [...]`
- `evaluateField(pos, nodes)` with falloff, vortex, flow, etc.
- Clean, readable, framework-agnostic
- No dependencies required

### Integrated Sandbox Tester (In-Browser)

One click → your field opens in a testing environment:

- The **same camera zoom and pan** are preserved
- You can **paste, edit, tweak, and re-run the field code**
- Built-in:
  - Syntax highlighting
  - Live particle simulation
  - Copy-to-clipboard

Perfect for quickly experimenting or dropping the field into another project.

### Camera Export / Import

Designer → Tester exports:

- current zoom
- current camera world position

So the tester matches exactly what you saw. Well, particle counts, color and settings are different, but whatever; the field is the same ^^.

Tester → Designer:
Hit “Back” and your designer stays where it was - nodes, zoom, state.
It feels like one seamless tool.

---

# Why I Built This

Flow fields have always fascinated me,but writing them from scratch takes too much boilerplate and trial-and-error, and I suck as math anyways so there's that.

I recently found [this article by Tyler Hobbs](https://www.tylerxhobbs.com/words/flow-fields) and wanted to build a tool I could expand and learn from for future experimentation and work.

I wanted something where you:

- Drag nodes around
- Immediately see the field
- Immediately see particles flowing
- Immediately get working code
- Can test it in isolation

Without digging through geometry or math just to get started.

This tool gives beginners (and future-me) a plug-and-play way into flow fields:

- Clear visualization
- Real math, real output
- Editable code
- Copy → paste → done

No libraries, no frameworks. Just some black magic and a whole lot of event-listeners and DOM action heh. I mean, who knows regex anyways?

---

# Tech Stack

- TypeScript
- Canvas 2D
- DOM-based UI (no frameworks)
- URL hash routing for state transfer
- Vite (dev)
- GitHub Pages (deployment)

---

# Post-Mortem (Week 4)

## Key Concepts Explored

### Architecture & Systems

- Unified node schema for all field types
- Live node → code → preview pipeline
- Viewport system with pan + zoom
- Camera export/import via URL hash
- Dynamic code cleanup for turning TS → runnable JS
- Real-time tracer simulation with wrap-around logic

### UI & Interaction Design

- Drag/pan/zoom canvas
- Per-node config cards
- Visibility toggles (grid, arrows, cards)
- Two-panel split layout (designer | code)
- Seamless transition to tester mode
- Custom syntax-highlighting overlay (extra bonus, I’ll reuse this a lot :D)

### Code Generation

- Deterministic JS modules
- Clean TS → JS stripping
- Shorthand-return safety patches
- Beginner-friendly, readable output

### Integration

- Designer/tester share the same mental model
- URL hash preserves:
  - code
  - zoom
  - camera offset
- Pure frontend - no backend or build step required

---

---

## What Worked

- The tester mode feels *amazing*, actually
- Node editing is intuitive and direct - a bit ugly visually, which is kinda funny considering I’m supposed to be a designer, but again; I digress :D
- Code output ended up much cleaner than I expected (clear interfaces help a ton)
- Camera synchronization works perfectly
- Tracers give instant “feel” to node adjustments
- The architectural split stayed clean and maintainable

## What Hurt

- Flow field math still feels like wizardry, but this tool helps at the least
- Regex-based cleanup was… I don't even know (read: **mindfuck / shoot-me-please**)
- Getting the textarea overlay pixel-perfect took actual effort
- Viewport sync across navigation was trickier than expected
- Debugging visual distortions at 2am was… not fun at all

## Lessons Learned

- Visual debugging tools make everything easier
- Well-structured state machines matter, even in small tools
- Don’t overthink math - visualization reveals the errors instantly
- Bridging “nice TS” and “runnable JS” is totally worth the effort
- AI-assisted pair-programming massively boosts architectural clarity
- Simplicity makes tools actually usable

# Run Locally

Clone the repo and open `index.html` with Live Server.
Everything works in-browser; no backend or libraries needed.

# **Next Steps / Stretch Ideas**

* Node presets (swirls, turbulence, flow motifs)
* Import/export field JSON
* More falloff types (inverse-square, steep, custom curves)
* Colored tracer modes
* Export to PNG/GIF particle renders
* Save/share designer state via permalink
* Multi-field blending modes
* Optional WebGL renderer for large particle counts

---

## **Contact / Follow**

* **Portfolio** : https://andershofsten.com
* **Threads** : https://www.threads.com/@ruido_outpost
* **LinkedIn** : https://www.linkedin.com/in/ahofsten/
* **X** : https://x.com/soundsbyhofsten

Feel free to DM — I’m always open to feedback or discussion.
