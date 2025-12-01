import"./modulepreload-polyfill-B5Qt9EMX.js";function Te(e,t){const o=document.getElementById("card-layer");if(o)for(const s of e){let n=o.querySelector(`.node-wrapper[data-node-id="${s.id}"]`);n||(n=ke(o,s,t,e));const{dot:c,connector:a,card:r,typeSelect:f,forceInput:l,radiusInput:i,falloffSelect:p,extraRow:d}=Be(n);$e(s,f,l,i,p,d),De(s,t,c,r,a)}}function ke(e,t,o,s){const n=document.createElement("div");n.className="node-wrapper",n.dataset.nodeId=t.id,n.style.position="absolute",e.appendChild(n);const c=document.createElement("div");c.className="node-dot",n.appendChild(c);const a=document.createElement("div");a.className="node-connector",n.appendChild(a);const r=document.createElement("div");r.className="node-card";const f=document.createElement("div");f.className="node-card-row node-card-type",r.appendChild(f);const l=document.createElement("div");l.className="node-card-row node-card-force",r.appendChild(l);const i=document.createElement("div");i.className="node-card-row node-card-radius",r.appendChild(i);const p=document.createElement("div");p.className="node-card-row node-card-extra",r.appendChild(p);const d=document.createElement("button");d.type="button",d.className="node-card-delete",d.textContent="x",r.appendChild(d),d.addEventListener("click",h=>{h.stopPropagation(),h.preventDefault();const v=s.indexOf(t);v!==-1&&s.splice(v,1),n.remove()});const m=document.createElement("span");m.textContent="type:",m.className="node-card-label";const g=document.createElement("select");g.className="node-card-select node-card-kind",["attract","repel","flow","vortex"].forEach(h=>{const v=document.createElement("option");v.value=h,v.textContent=h,g.appendChild(v)}),f.appendChild(m),f.appendChild(g);const x=document.createElement("span");x.textContent="force:",x.className="node-card-label";const b=document.createElement("input");b.type="number",b.step="0.1",b.className="node-card-input node-card-force-input",l.appendChild(x),l.appendChild(b);const M=document.createElement("span");M.textContent="radius:",M.className="node-card-label";const L=document.createElement("input");L.type="number",L.step="1",L.className="node-card-input node-card-radius-input";const E=document.createElement("span");E.textContent="falloff:",E.className="node-card-label";const k=document.createElement("select");return k.className="node-card-select node-card-falloff",["linear","smooth"].forEach(h=>{const v=document.createElement("option");v.value=h,v.textContent=h,k.appendChild(v)}),i.appendChild(M),i.appendChild(L),i.appendChild(E),i.appendChild(k),n.appendChild(r),g.addEventListener("change",()=>{t.kind=g.value,t.kind!=="flow"&&(t.directionDeg=void 0),t.kind!=="vortex"&&(t.spin=void 0)}),b.addEventListener("change",()=>{const h=parseFloat(b.value);Number.isNaN(h)||(t.force=h)}),L.addEventListener("change",()=>{const h=parseFloat(L.value);Number.isNaN(h)||(t.radius=h)}),k.addEventListener("change",()=>{const h=k.value;(h==="linear"||h==="smooth")&&(t.falloff=h)}),r.addEventListener("mousedown",h=>{const v=h.target;if(v.tagName==="INPUT"||v.tagName==="SELECT"||v.tagName==="OPTION"||v.tagName==="BUTTON"||v.tagName==="TEXTAREA")return;h.stopPropagation(),h.preventDefault(),z(!0);const w=h.clientX,N=h.clientY,S=t.cardX,X=t.cardY,B=D=>{const j=D.clientX-w,J=D.clientY-N,Q=j/o.scale,Ye=J/o.scale;t.cardX=S+Q,t.cardY=X+Ye},$=()=>{window.removeEventListener("mousemove",B),window.removeEventListener("mouseup",$),z(!1)};window.addEventListener("mousemove",B),window.addEventListener("mouseup",$)}),c.addEventListener("mousedown",h=>{h.stopPropagation(),h.preventDefault(),z(!0);const v=h.clientX,w=h.clientY,N=t.x,S=t.y,X=$=>{const D=$.clientX-v,j=$.clientY-w,J=D/o.scale,Q=j/o.scale;t.x=N+J,t.y=S+Q},B=()=>{window.removeEventListener("mousemove",X),window.removeEventListener("mouseup",B),z(!1)};window.addEventListener("mousemove",X),window.addEventListener("mouseup",B)}),n}function Be(e){const t=e.querySelector(".node-dot"),o=e.querySelector(".node-connector"),s=e.querySelector(".node-card"),n=s.querySelector(".node-card-type"),c=s.querySelector(".node-card-force"),a=s.querySelector(".node-card-radius"),r=s.querySelector(".node-card-extra"),f=n.querySelector(".node-card-kind"),l=c.querySelector(".node-card-force-input"),i=a.querySelector(".node-card-radius-input"),p=a.querySelector(".node-card-falloff");return{dot:t,connector:o,card:s,typeSelect:f,forceInput:l,radiusInput:i,falloffSelect:p,extraRow:r}}function $e(e,t,o,s,n,c){t.value!==e.kind&&(t.value=e.kind);const a=String(e.force);o.value!==a&&(o.value=a);const r=String(e.radius);if(s.value!==r&&(s.value=r),n.value!==e.falloff&&(n.value=e.falloff),c.dataset.kind!==e.kind)if(c.innerHTML="",c.dataset.kind=e.kind,e.kind==="flow"){const l=document.createElement("span");l.textContent="dir:",l.className="node-card-label";const i=document.createElement("input");i.type="number",i.step="1",i.className="node-card-input node-card-dir-input",i.value=String(e.directionDeg??0),i.addEventListener("change",()=>{const p=parseFloat(i.value);Number.isNaN(p)||(e.directionDeg=p)}),c.appendChild(l),c.appendChild(i)}else if(e.kind==="vortex"){const l=document.createElement("span");l.textContent="spin:",l.className="node-card-label";const i=document.createElement("select");i.className="node-card-select node-card-spin",["cw","ccw"].forEach(p=>{const d=document.createElement("option");d.value=p,d.textContent=p,i.appendChild(d)}),i.value=e.spin??"ccw",i.addEventListener("change",()=>{const p=i.value;(p==="cw"||p==="ccw")&&(e.spin=p)}),c.appendChild(l),c.appendChild(i)}else c.textContent="";else if(e.kind==="flow"){const l=c.querySelector(".node-card-dir-input");if(l){const i=String(e.directionDeg??0);l.value!==i&&(l.value=i)}}else if(e.kind==="vortex"){const l=c.querySelector(".node-card-spin");if(l){const i=e.spin??"ccw";l.value!==i&&(l.value=i)}}}function De(e,t,o,s,n){const c=document.getElementById("canvas"),a=document.getElementById("card-layer");let r=0,f=0;if(c&&a){const M=c.getBoundingClientRect(),L=a.getBoundingClientRect();r=M.left-L.left,f=M.top-L.top}const l=ce(e.x,e.y,t),i=ce(e.cardX,e.cardY,t);s.style.left=`${i.sx+r}px`,s.style.top=`${i.sy+f}px`,o.style.left=`${l.sx+r}px`,o.style.top=`${l.sy+f}px`;const p=i.sx+r+s.offsetWidth/2,d=i.sy+f+s.offsetHeight/2,m=p-(l.sx+r),g=d-(l.sy+f),x=Math.sqrt(m*m+g*g),b=Math.atan2(g,m);n.style.left=`${l.sx+r}px`,n.style.top=`${l.sy+f}px`,n.style.width=`${x}px`,n.style.transform=`rotate(${b}rad)`}function ce(e,t,o){return{sx:e*o.scale+o.offsetX,sy:t*o.scale+o.offsetY}}function Fe(e,t,o,s,n){const c=-e.offsetX/e.scale,a=-e.offsetY/e.scale,r=c+o/e.scale,f=a+s/e.scale,l=n,i=Math.floor(c/l)*l,p=Math.floor(a/l)*l;t.strokeStyle="#1c1c1c",t.lineWidth=1/e.scale,t.beginPath();for(let d=i;d<=r;d+=l)t.moveTo(d,a),t.lineTo(d,f);for(let d=p;d<=f;d+=l)t.moveTo(c,d),t.lineTo(r,d);t.stroke()}let re=6;function Ae(e,t,o,s="rgba(255, 255, 255, 0.9)"){e.save();let n=s;const c=s.match(/^rgba\(([^)]+)\)$/);if(c){const a=c[1].split(",");a.length===4&&(a.pop(),n=`rgba(${a.join(",")}`)}for(const a of t){if(a.history.length<2)continue;let r=1;if(a.maxAge>0){const i=a.maxAge-a.age;i<=0?r=0:i<re&&(r=i/re)}let f=o+Math.random()*40.2;e.lineWidth=a.lineWidth??f,e.lineCap=a.lineCap??"round",a.color?(e.strokeStyle=a.color,e.globalAlpha=r):(e.strokeStyle=c&&r>=0&&r<=1?`${n}, ${r})`:s,e.globalAlpha=1),e.beginPath();const l=a.history[0];e.moveTo(l.x,l.y);for(let i=1;i<a.history.length;i++){const p=a.history[i];e.lineTo(p.x,p.y)}e.lineTo(a.position.x,a.position.y),e.stroke()}e.globalAlpha=1,e.restore()}function ve(e,t,o){let s=0,n=0;for(const c of o){const a=c.x-e,r=c.y-t,f=Math.hypot(a,r)||1;if(f>c.radius)continue;const l=a/f,i=r/f,p=f/c.radius;let d=c.force*(1-p);if(c.falloff==="smooth"){const m=1-p,g=m*m*(3-2*m);d=c.force*g}switch(c.kind){case"attract":{s+=l*d,n+=i*d;break}case"repel":{s-=l*d,n-=i*d;break}case"flow":{const m=(c.directionDeg??0)*(Math.PI/180),g=Math.cos(m),x=Math.sin(m);s+=g*d,n+=x*d;break}case"vortex":{const m=c.spin==="cw"?-1:1,g=-i*m,x=l*m;s+=g*d,n+=x*d;break}}}return{vx:s,vy:n}}function Re(e,t,o,s,n,c=60,a=!0){const r=Math.hypot(s,n)||1,f=s/r,l=n/r,i=t+f*c,p=o+l*c,d=12;if(e.beginPath(),e.moveTo(t,o),e.lineTo(i,p),a){const m=Math.atan2(l,f);e.lineTo(i-d*Math.cos(m-Math.PI/8),p-d*Math.sin(m-Math.PI/8)),e.moveTo(i,p),e.lineTo(i-d*Math.cos(m+Math.PI/8),p-d*Math.sin(m+Math.PI/8))}e.strokeStyle="#ffffff",e.lineWidth=1,e.stroke()}function We(e,t,o,s,n,c=!0,a=20,r){const f=-r.offsetX/r.scale,l=-r.offsetY/r.scale,i=f+t/r.scale,p=l+o/r.scale;for(let d=f;d<i;d+=s)for(let m=l;m<p;m+=s){const{vx:g,vy:x}=ve(d,m,n);g===0&&x===0||Re(e,d,m,g,x,a,c)}}function Pe(){return{offsetX:0,offsetY:0,scale:1}}const T={viewport:Pe(),nodes:[],tracers:[],showArrows:!0,showGrid:!0};function qe(e,t,o,s,n){const c=e.width,a=e.height;t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,c,a),t.setTransform(o.scale,0,0,o.scale,o.offsetX,o.offsetY),T.showGrid&&Fe(o,t,c,a,50),T.showArrows&&We(t,c,a,40,s,!0,25,o),Ae(t,n,8.5,""),Te(s,o)}let G=20,xe=30;function ie(e,t){G=Math.max(.1,Math.min(e,t)),xe=Math.max(G,t)}function we(){const e=xe-G;return G+Math.random()*e}function be(e,t,o,s,n){const c=[];for(let a=0;a<e;a++){const r=n[Math.floor(Math.random()*n.length)],f=Math.random()*Math.PI*2,l=Math.random()*r.radius,i=r.x+Math.cos(f)*l,p=r.y+Math.sin(f)*l;c.push({position:{x:i,y:p},history:[],speed:t,maxHistory:o,age:0,maxAge:we(),color:`hsl(${Math.random()*360}, 70%, 70%)`,lineWidth:s+Math.random()*2.2,lineCap:Math.random()<.5?"round":"butt"})}return c}function R(e,t){const o=t[Math.floor(Math.random()*t.length)],s=Math.random()*Math.PI*2,n=Math.random()*o.radius;e.position.x=o.x+Math.cos(s)*n,e.position.y=o.y+Math.sin(s)*n,e.history=[],e.age=0,e.maxAge=we(),e.lineWidth=e.lineWidth+Math.random()*2.2}function Oe(e,t,o,s,n,c){const a=-s.offsetX/s.scale,r=-s.offsetY/s.scale,f=a+n/s.scale,l=r+c/s.scale,i=.001,p=4;for(const d of e){const{x:m,y:g}=d.position;if(d.age+=o,d.age>d.maxAge){R(d,t);continue}const x=ve(m,g,t),b=Math.hypot(x.vx,x.vy);if(!Number.isFinite(b)){R(d,t);continue}let M=m,L=g;if(b>i){const w=x.vx/b,N=x.vy/b,S=w*d.speed*o,X=N*d.speed*o;M=m+S,L=g+X}d.history.push({x:m,y:g}),d.history.length>d.maxHistory&&d.history.shift(),d.position.x=M,d.position.y=L;const E=d.history[0];if(!E)continue;let k=!1;for(const w of t){const N=d.position.x-w.x,S=d.position.y-w.y,X=Math.hypot(N,S),B=E.x-w.x,$=E.y-w.y,D=Math.hypot(B,$);if(X<=p&&D<=p){k=!0;break}}if(k){R(d,t);continue}let h=!1;for(const w of t){const N=E.x-w.x,S=E.y-w.y;if(Math.hypot(N,S)<=w.radius){h=!0;break}}if(!h){R(d,t);continue}if(E.x<a||E.x>f||E.y<r||E.y>l){R(d,t);continue}}}const ze=180,He=90;function Ge(e){const t=[];return t.push(`kind: "${e.kind}"`),t.push(`x: ${e.x}`),t.push(`y: ${e.y}`),t.push(`force: ${e.force}`),t.push(`radius: ${e.radius}`),t.push(`falloff: "${e.falloff}"`),e.directionDeg!=null&&t.push(`directionDeg: ${e.directionDeg}`),e.spin&&t.push(`spin: "${e.spin}"`),`  {
    ${t.join(`,
    `)}
  }`}function ee(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function _e(e){return`// Generated by Flow Field Designer
// Paste this into your project and call \`evaluateField(pos, FIELD_NODES)\`.

export type NodeKind = "attract" | "repel" | "flow" | "vortex"
export type Falloff = "linear" | "smooth"
export type Spin = "cw" | "ccw"

export interface InfluenceNode {
  kind: NodeKind

  // field origin (world space)
  x: number
  y: number

  force: number
  radius: number
  falloff: Falloff
  directionDeg?: number // flow
  spin?: Spin // vortex
}

export interface Vec2 {
  x: number
  y: number
}

// --- field definition (from editor) ---

export const FIELD_NODES: InfluenceNode[] = [
${e.map(Ge).join(`,

`)}
]

// --- field math ---

function falloffFactor(dist: number, radius: number, mode: Falloff): number {
  if (dist >= radius) return 0
  const t = 1 - dist / radius
  if (mode === "linear") return t
  // smooth
  return t * t * (3 - 2 * t)
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function evaluateField(pos: Vec2, nodes: InfluenceNode[]): Vec2 {
  let vx = 0
  let vy = 0

  for (const node of nodes) {
    const dx = pos.x - node.x
    const dy = pos.y - node.y
    const dist = Math.hypot(dx, dy)
    if (dist === 0) continue

    const f = falloffFactor(dist, node.radius, node.falloff)
    if (f === 0) continue

    const nx = dx / dist
    const ny = dy / dist

    if (node.kind === "attract") {
      const s = -node.force * f
      vx += nx * s
      vy += ny * s
    } else if (node.kind === "repel") {
      const s = node.force * f
      vx += nx * s
      vy += ny * s
    } else if (node.kind === "flow") {
      const angle = degToRad(node.directionDeg ?? 0)
      const fx = Math.cos(angle)
      const fy = Math.sin(angle)
      const s = node.force * f
      vx += fx * s
      vy += fy * s
    } else if (node.kind === "vortex") {
      const spin = node.spin ?? "ccw"
      const tx = spin === "ccw" ? -ny : ny
      const ty = spin === "ccw" ? nx : -nx
      const s = node.force * f
      vx += tx * s
      vy += ty * s
    }
  }

  return { x: vx, y: vy }
}

// Example usage:
//
// const acc = evaluateField(boid.position, FIELD_NODES)
// boid.vx += acc.x * dt
// boid.vy += acc.y * dt
// boid.x  += boid.vx * dt
// boid.y  += boid.vy * dt
`}const Ue=new Set(["export","import","from","const","let","var","function","return","if","else","for","of","in","while","type","interface","extends","implements","new","class","switch","case","break","default","as","number","string","boolean","void","any","unknown"]);function Ve(e){const t=[];let o="",s="plain",n=0;const c=e.length;function a(){o&&(t.push({kind:s,text:o}),o="")}for(;n<c;){const r=e[n],f=n+1<c?e[n+1]:"";if(s==="plain"&&r==="/"&&f==="/"){for(a(),s="comment",o+=r,n++,o+=e[n],n++;n<c&&e[n]!==`
`;)o+=e[n++];a(),s="plain";continue}if(s==="plain"&&r==="/"&&f==="*"){for(a(),s="comment",o+=r,n++,o+=e[n],n++;n<c;){const l=e[n],i=n+1<c?e[n+1]:"";if(o+=l,n++,l==="*"&&i==="/"){o+=i,n++;break}}a(),s="plain";continue}if(s==="plain"&&(r==='"'||r==="'"||r==="`")){a();const l=r;for(s="string",o+=r,n++;n<c;){const i=e[n];if(o+=i,n++,i==="\\"&&n<c){o+=e[n],n++;continue}if(i===l)break}a(),s="plain";continue}o+=r,n++}return a(),t}function Ze(e){return e.replace(/(\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b)/g,t=>/^\d/.test(t)?`<span class="tok-number">${t}</span>`:Ue.has(t)?`<span class="tok-kw">${t}</span>`:/^[A-Z]/.test(t)?`<span class="tok-type">${t}</span>`:t)}function Ke(e){const t=Ve(e);let o="";for(const s of t)s.kind==="comment"?o+=`<span class="tok-comment">${ee(s.text)}</span>`:s.kind==="string"?o+=`<span class="tok-string">${ee(s.text)}</span>`:o+=Ze(ee(s.text));return o}const Ee="flowFieldDesignerState";function je(){try{const e=localStorage.getItem(Ee);return e?JSON.parse(e):null}catch{return null}}function Je(e,t){const o={viewport:{offsetX:e.offsetX,offsetY:e.offsetY,scale:e.scale},nodes:t.map(s=>({...s}))};try{localStorage.setItem(Ee,JSON.stringify(o))}catch(s){console.warn("Failed to save designer state",s)}}document.querySelector("#app").innerHTML=`
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
`;const de=document.querySelector("#app"),le=document.querySelector(".code-container"),fe=document.querySelector(".canvas-container"),ue=document.getElementById("splitter");let te=!1;de&&le&&fe&&ue&&(ue.addEventListener("mousedown",e=>{e.preventDefault(),te=!0}),window.addEventListener("mousemove",e=>{if(!te)return;const t=de.getBoundingClientRect();let s=(e.clientX-t.left)/t.width;s=Math.max(.15,Math.min(.85,s));const n=s*100,c=100-n;le.style.flex=`0 0 ${n}%`,fe.style.flex=`0 0 ${c}%`,ae()}),window.addEventListener("mouseup",()=>{te=!1}));const pe=document.querySelector(".code-content");let se="";function Qe(e){if(!pe)return;const t=_e(e);se=t;const o=Ke(t);pe.innerHTML=`<pre><code class="ts">${o}</code></pre>`}const et=document.getElementById("copyButton");et?.addEventListener("click",()=>{const e=se||document.querySelector(".code-content")?.textContent?.trim()||"";e&&navigator.clipboard.writeText(e).then(()=>{alert("Code copied to clipboard!")}).catch(t=>{console.error("Failed to copy text: ",t)})});const q=document.getElementById("tracerWidthInput"),O=document.getElementById("tracerLengthInput"),W=document.getElementById("tracerLifetimeInput"),me=document.getElementById("toggleGridButton"),he=document.getElementById("toggleArrowsButton"),ge=document.getElementById("hideCardsButton"),Ce=document.querySelector("#canvas");if(!Ce)throw new Error('Canvas element with id "canvas" not found');const y=Ce,Le=y.getContext("2d");if(!Le)throw new Error("Could not get 2D 2D context");function ae(){const e=y.getBoundingClientRect();y.width=e.width,y.height=e.height}ae();window.addEventListener("resize",()=>{ae()});let F=!1;function z(e){F=e}const u=T.viewport,C=T.nodes,A=document.getElementById("zoomLabel"),_=document.getElementById("posLabel"),H=25;(function(){u.offsetX=y.width/2,u.offsetY=y.height/2,u.scale=1;const t=je();if(t&&t.nodes&&t.nodes.length){u.offsetX=t.viewport.offsetX,u.offsetY=t.viewport.offsetY,u.scale=t.viewport.scale,C.length=0;for(const o of t.nodes)C.push(o)}else C.push({id:"n1",kind:"vortex",spin:"ccw",x:0,y:0,force:1,radius:380,falloff:"smooth",cardX:300,cardY:100});A&&(A.textContent=`Zoom: ${(u.scale*100).toFixed(0)}%`)})();let Y="none",I=null,U=0,V=0,ne=0,oe=0,Me=60,Ne=180,Z=90,K=4;y.addEventListener("mousedown",e=>{const t=y.getBoundingClientRect(),o=e.clientX-t.left,s=e.clientY-t.top,n=Se(o,s,u),c=12;for(const a of C){const r=n.x-a.x,f=n.y-a.y;if(Math.hypot(r,f)<=c){Y="node",I=a,U=n.x-a.x,V=n.y-a.y,F=!0;return}}for(const a of C)if(n.x>=a.cardX&&n.x<=a.cardX+ze&&n.y>=a.cardY&&n.y<=a.cardY+He){Y="card",I=a,U=n.x-a.cardX,V=n.y-a.cardY,F=!0;return}Y="pan",ne=e.clientX,oe=e.clientY});window.addEventListener("mousemove",e=>{if(Y==="none")return;if(Y==="pan"){const c=e.clientX-ne,a=e.clientY-oe;u.offsetX+=c,u.offsetY+=a,ne=e.clientX,oe=e.clientY,A&&(A.textContent=`Zoom: ${(u.scale*100).toFixed(0)}%`);return}if(!I)return;const t=y.getBoundingClientRect(),o=e.clientX-t.left,s=e.clientY-t.top,n=Se(o,s,u);Y==="node"?(I.x=n.x-U,I.y=n.y-V):Y==="card"&&(I.cardX=n.x-U,I.cardY=n.y-V)});window.addEventListener("mouseup",()=>{Y="none",I=null,F=!1});window.addEventListener("mouseleave",()=>{Y="none",I=null,F=!1});y.addEventListener("wheel",e=>{e.preventDefault();const t=1.1,o=y.getBoundingClientRect(),s=e.clientX-o.left,n=e.clientY-o.top,c=(s-u.offsetX)/u.scale,a=(n-u.offsetY)/u.scale;e.deltaY<0?u.scale*=t:u.scale/=t,u.scale=Math.max(.25,Math.min(8,u.scale));const r=c*u.scale,f=a*u.scale;u.offsetX=s-r,u.offsetY=n-f,A&&(A.textContent=`Zoom: ${(u.scale*100).toFixed(0)}%`)},{passive:!1});y.addEventListener("mousemove",e=>{const t=y.getBoundingClientRect(),o=e.clientX-t.left,s=e.clientY-t.top,n=(o-u.offsetX)/u.scale,c=(s-u.offsetY)/u.scale,a=Math.round(n/H)*H,r=Math.round(c/H)*H;_&&(_.textContent=`Cursor: (${a.toFixed(0)}, ${r.toFixed(0)})`)});y.addEventListener("mouseleave",()=>{_&&(_.textContent="Cursor: –")});function tt(e,t){console.log(`Creating new node at (${e}, ${t})`);const o=150,s=Math.random()*Math.PI*2,n=e+Math.cos(s)*o,c=t+Math.sin(s)*o;C.push({id:`n${C.length+1}`,kind:"attract",x:e,y:t,force:10,radius:100,falloff:"smooth",cardX:n,cardY:c})}function nt(){const e=document.getElementById("card-layer");e&&e.classList.add("hidden")}function ot(){const e=document.getElementById("card-layer");e&&e.classList.remove("hidden")}y.addEventListener("dblclick",e=>{const t=y.getBoundingClientRect(),o=e.clientX-t.left,s=e.clientY-t.top,n=(o-u.offsetX)/u.scale,c=(s-u.offsetY)/u.scale;tt(n,c),console.log(`Double click at world coords: (${n}, ${c})`)});function Se(e,t,o){return{x:(e-o.offsetX)/o.scale,y:(t-o.offsetY)/o.scale}}const P=be(Me,Ne,Z,K,C);T.tracers=P;function Xe(){P.length=0;const e=be(Me,Ne,Z,K,C);P.push(...e)}q&&(q.value=String(K),q.addEventListener("input",()=>{K=Number(q.value)||1,Xe()}));O&&(O.value=String(Z),O.addEventListener("input",()=>{Z=Number(O.value)||10,Xe()}));if(W){W.value="25";const e=Number(W.value);ie(e*.75,e*1.25),W.addEventListener("input",()=>{const t=Number(W.value)||10,o=t*.75,s=t*1.25;ie(o,s)})}ge&&ge.addEventListener("click",()=>{const e=document.getElementById("card-layer");e&&(e.classList.contains("hidden")?ot():nt())});me&&me.addEventListener("click",()=>{T.showGrid=!T.showGrid});he&&he.addEventListener("click",()=>{T.showArrows=!T.showArrows});const st=document.getElementById("tryButton");st?.addEventListener("click",()=>{const e=se||document.querySelector(".code-content")?.textContent?.trim()||"";if(!e)return;Je(u,C);const t=(y.width/2-u.offsetX)/u.scale,o=(y.height/2-u.offsetY)/u.scale,s=encodeURIComponent(e),n=encodeURIComponent(String(u.scale)),c=encodeURIComponent(String(t)),a=encodeURIComponent(String(o)),r=location.pathname.replace(/\/[^/]*$/,"/"),f=`${location.origin}${r}test.html#code=${s}&zoom=${n}&camx=${c}&camy=${a}`;location.href=f});let ye=performance.now();function Ie(e){const t=e-ye;ye=e;const o=t/1e3;F||Oe(P,C,o,u,y.width,y.height),Qe(C),qe(y,Le,u,C,P),requestAnimationFrame(Ie)}requestAnimationFrame(Ie);
