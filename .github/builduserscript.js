const fs = require("fs");
const path = require("path");

const here = __dirname;
const root = path.resolve(here, "..");
const rd = p => fs.readFileSync(path.join(root, p), "utf8");
const b64 = p => fs.readFileSync(path.join(root, p)).toString("base64");

const must = (before, after, label) => {
  if (before === after) throw new Error("transform did not apply: " + label);
  return after;
};

const tl = s => "`" + s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";

/*//////////////////////////////////////////////////////////////////////*/

const manifest = JSON.parse(rd("manifest.json"));
const version = manifest.version || "0";

const iconsvg = rd("images/icon.svg").trim();
const iconmeta = "data:image/svg+xml;base64," + b64("images/icon.svg");

let panelcss = rd("panel.css");
panelcss = must(panelcss, panelcss.replace(/\s*@font-face\s*\{[^{}]*Chirp[^{}]*\}/g, ""), "strip @font-face");
panelcss = must(panelcss, panelcss.replace(/"Chirp"/g, '"TwitterChirp"'), "chirp family -> twitterchirp");

const rawhtml = rd("panel.html");
const panelhtml = rawhtml.slice(rawhtml.indexOf("<body>") + 6, rawhtml.indexOf("<script")).trim();

const injectsrc = rd("src/inject.js");
const devsrc = rd("src/dev.js");

function parsejsonc(text) {
  let o = "", str = false, q = "", i = 0;
  while (i < text.length) {
    const c = text[i], n = text[i + 1];
    if (str) { o += c; if (c === "\\") { o += text[i + 1]; i += 2; continue } if (c === q) str = false; i++ }
    else if (c === '"' || c === "'") { str = true; q = c; o += c; i++ }
    else if (c === "/" && n === "/") { while (i < text.length && text[i] !== "\n") i++ }
    else if (c === "/" && n === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i += 2 }
    else { o += c; i++ }
  }
  return JSON.parse(o.replace(/,(\s*[}\]])/g, "$1"));
}
const configsrc = "window.twitterflagsconfigs = " + JSON.stringify({
  desc: parsejsonc(rd("configs/descriptions.jsonc")),
  switches: parsejsonc(rd("configs/switches.jsonc")),
  upsells: parsejsonc(rd("configs/upsells.jsonc")),
  options: parsejsonc(rd("configs/options.jsonc"))
}, null, 2) + ";";

let panelsrc = rd("panel.js");
panelsrc = must(panelsrc, panelsrc.replace("(function () {", "(function (chrome, root) {"), "panel iife open");
panelsrc = must(panelsrc, panelsrc.replace("const query = selector => document.querySelector(selector);", "const query = selector => root.querySelector(selector);"), "panel query scope");
panelsrc = must(panelsrc, panelsrc.replace(/\}\)\(\);\s*$/, "})(__tfshim, __tfroot);\n"), "panel iife close");

/*//////////////////////////////////////////////////////////////////////*/

const hostcss = `
    :host {all: initial}
    .tffab {
      position: fixed; z-index: 2147483646;
      right: calc(16px + var(--tfsb, 0px)); bottom: 16px;
      width: 40px; height: 40px; border-radius: 999px;
      background-color: #1d9bf0; border: none; cursor: grab;
      pointer-events: auto; touch-action: none;
      display: flex; align-items: center; justify-content: center;
      padding: 0
    }
    .tffab:active {cursor: grabbing}
    .tffab svg {width: 22px; height: 22px; pointer-events: none}
    .tfpanelwrap {
      position: fixed; top: 0; right: var(--tfsb, 0px);
      width: 390px; max-width: 100vw;
      height: 100vh; height: 100dvh;
      background-color: var(--bg); color: var(--text);
      font: 14px "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
      display: flex; flex-direction: column;
      overflow: hidden; user-select: none;
      z-index: 2147483647;
      pointer-events: auto; visibility: hidden;
      border-left: 1px solid var(--border);
      transform: translateX(100%);
      transition: transform 0.18s ease
    }
    .tfpanelwrap.open {transform: none; visibility: visible}
    .tfclose {
      position: absolute; top: 6px; right: 10px; z-index: 3;
      background-color: rgba(42,43,43,0); border: none; cursor: pointer;
      padding: 5px; border-radius: 999px;
      display: inline-flex; align-items: center; justify-content: center;
      transition: background-color 0.15s ease
    }
    .tfclose:hover {background-color: var(--hover)}
    .tfclose svg {width: 20px; height: 20px; fill: var(--text)}
    /* keep the top row (search + prefix) from sliding under the close button */
    .row1 {padding-right: 30px}
`;

const closesvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/></svg>';

/*//////////////////////////////////////////////////////////////////////*/

const appmatches = [
  "https://x.com/*",
  "https://*.x.com/*",
  "https://mobile.x.com/*",
  "https://twitter.com/*",
  "https://*.twitter.com/*",
  "https://mobile.twitter.com/*",
  "https://twitter.app.link/*",
  "https://twitter.test-app.link/*",
  "https://twitter-alternate.test-app.link/*",
  "https://x.app.link/*",
  "https://x-alternate.app.link/*",
  "https://x.test-app.link/*",
  "https://x-alternate.test-app.link/*"
];
const notapp = [
  "ads", "ads-api", "analytics", "business", "developer", "help", "support",
  "blog", "about", "careers", "legal", "privacy", "pro", "transparency", "cards",
  "publish", "platform", "api", "upload", "ton", "media", "brand", "marketing",
  "investor", "engineering", "press", "pr", "gdpr"
];

const excludematches = [];
for (const s of notapp) excludematches.push("https://" + s + ".x.com/*", "https://" + s + ".twitter.com/*");
const excludes = ["/\\.(?:js|mjs|json|css|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|mp4|webm|m3u8|wasm|xml|txt|pdf)(?:[?#].*)?$/i"];

const metagroups = [
  [["@name", "twitter flags & more"], ["@description", "browse hidden stuff inside the twitter client with a side panel!"], ["@version", version]],
  [["@namespace", "https://github.com/sogful/twitter-flags"], ["@author", "cv"]],
  appmatches.map(m => ["@match", m]),
  excludematches.map(m => ["@exclude", m]),
  [...excludes.map(r => ["@exclude", r]), ["@icon", iconmeta], ["@run-at", "document-start"], ["@grant", "none"]]
];
const dirw = Math.max(...metagroups.flat().map(p => p[0].length));
const fmt = ([d, v]) => "// " + d.padEnd(dirw) + "  " + v;
const meta = "// ==UserScript==\n\n" + metagroups.map(g => g.map(fmt).join("\n")).join("\n\n") + "\n\n// ==/UserScript==\n";

const head = `(function () {
  "use strict";

  const iconsvg = ${tl(iconsvg)};
  const panelcss = ${tl(panelcss)};
  const hostcss = ${tl(hostcss)};
  const panelhtml = ${tl(panelhtml)};
  const closesvg = ${tl(closesvg)};

  /*//////////////////////////////////////////////////////////////////////*/
`;

const mountopen = `
  /*//////////////////////////////////////////////////////////////////////*/

  function makeshim() {
    const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
    let last = null;
    const listeners = [];
    window.addEventListener("message", e => {
      if (e.source !== window) return;
      const d = e.data;
      if (!d || d.source !== PCHAN) return;
      if (d.type === "state") last = d;
      listeners.forEach(fn => {try {fn(d)} catch {}});
    });
    const local = {
      get(keys, cb) {
        const out = {};
        const arr = Array.isArray(keys) ? keys : keys == null ? [] : [keys];
        try {for (const k of arr) {const raw = localStorage.getItem("twitterflags.store." + k); if (raw != null) out[k] = JSON.parse(raw)}} catch {}
        if (cb) cb(out);
      },
      set(obj, cb) {
        try {for (const k in obj) localStorage.setItem("twitterflags.store." + k, JSON.stringify(obj[k]))} catch {}
        if (cb) cb();
      }
    };
    return {
      runtime: {onMessage: {addListener: fn => listeners.push(fn)}, lastError: undefined, getURL: p => p},
      tabs: {
        query: (q, cb) => {const t = [{id: 1, url: location.href}]; if (cb) {cb(t); return} return Promise.resolve(t)},
        sendMessage: (id, msg, cb) => {if (msg && msg.cmd === "ping") {if (cb) cb(last); return} try {window.postMessage(msg, location.origin)} catch {}},
        onActivated: {addListener: () => {}},
        onUpdated: {addListener: () => {}},
        reload: () => {try {location.reload()} catch {}},
        create: o => {try {window.open(o.url, "_blank")} catch {}}
      },
      storage: {local}
    };
  }

  function mountpanel() {
    if (document.getElementById("tfuserscripthost")) return;
    const host = document.createElement("div");
    host.id = "tfuserscripthost";
    const root = host.attachShadow({mode: "open"});

    const style = document.createElement("style");
    style.textContent = panelcss + hostcss;
    root.appendChild(style);

    const wrap = document.createElement("div");
    wrap.className = "tfpanelwrap";
    wrap.innerHTML = '<button class="tfclose" title="close">' + closesvg + "</button>" + panelhtml;
    root.appendChild(wrap);

    const fab = document.createElement("button");
    fab.className = "tffab"; fab.title = "drag me twin (alt+shift+f to show / hide)";
    fab.innerHTML = iconsvg;
    root.appendChild(fab);

    (document.body || document.documentElement).appendChild(host);

    const setsb = () => {try {const w = window.innerWidth - document.documentElement.clientWidth; host.style.setProperty("--tfsb", (w > 0 ? w : 0) + "px")} catch {}};
    setsb();
    window.addEventListener("resize", setsb);

    function squish(on) {
      try {
        const rr = document.querySelector("#react-root");
        if (!rr) return;
        if (on && window.innerWidth > 500) {
          rr.style.setProperty("width", "calc(100vw - 390px)", "important");
          rr.style.setProperty("overflow-x", "hidden", "important");
        } else {
          rr.style.width = ""; rr.style.overflowX = "";
        }
      } catch {}
    }
    const setopen = on => {wrap.classList.toggle("open", on); squish(on)};
    // mid-isolation the page reloads each step, so pop the drawer back open so
    // the "is it still broken?" prompt is right there without reopening
    try {if (localStorage.getItem("twitterflags.isolation")) setopen(true)} catch {}

    // show / hide the circle
    const sethidden = h => {try {localStorage.setItem("twitterflags.fabhidden", h ? "1" : "0")} catch {} fab.style.display = h ? "none" : ""};
    try {if (localStorage.getItem("twitterflags.fabhidden") === "1") fab.style.display = "none"} catch {}
    window.addEventListener("keydown", e => {
      if (e.altKey && e.shiftKey && ((e.key || "").toLowerCase() === "f" || e.code === "KeyF")) {e.preventDefault(); sethidden(fab.style.display !== "none")}
    }, true);

    try {
      const pos = JSON.parse(localStorage.getItem("twitterflags.fabpos") || "null");
      if (pos && typeof pos.left === "number") {fab.style.left = pos.left + "px"; fab.style.top = pos.top + "px"; fab.style.right = "auto"; fab.style.bottom = "auto"}
    } catch {}

    let down = false, moved = false, sx = 0, sy = 0, ox = 0, oy = 0;
    fab.addEventListener("pointerdown", e => {
      down = true; moved = false;
      const r = fab.getBoundingClientRect();
      ox = r.left; oy = r.top; sx = e.clientX; sy = e.clientY;
      try {fab.setPointerCapture(e.pointerId)} catch {}
    });
    fab.addEventListener("pointermove", e => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      const nx = Math.max(0, Math.min(window.innerWidth - fab.offsetWidth, ox + dx));
      const ny = Math.max(0, Math.min(window.innerHeight - fab.offsetHeight, oy + dy));
      fab.style.left = nx + "px"; fab.style.top = ny + "px"; fab.style.right = "auto"; fab.style.bottom = "auto";
    });
    fab.addEventListener("pointerup", e => {
      if (!down) return;
      down = false;
      try {fab.releasePointerCapture(e.pointerId)} catch {}
      if (moved) {try {localStorage.setItem("twitterflags.fabpos", JSON.stringify({left: fab.offsetLeft, top: fab.offsetTop}))} catch {}}
      else setopen(!wrap.classList.contains("open"));
    });
    wrap.querySelector(".tfclose").addEventListener("click", () => setopen(false));

    const __tfshim = makeshim();
    const __tfroot = root;

    /*//////////////////////////////////////////////////////////////////////*/

`;

const mountclose = `
  }

  if (document.body) mountpanel();
  else document.addEventListener("DOMContentLoaded", mountpanel, {once: true});

})();
`;

/*//////////////////////////////////////////////////////////////////////*/

const parts = [meta, head, configsrc, injectsrc, devsrc, mountopen, panelsrc, mountclose];
const output = parts.join("\n");

const outpath = path.join(here, "twitterflags.user.js");
fs.writeFileSync(outpath, output);
console.log("built! ^^", outpath);
console.log("size:", (output.length / 1024).toFixed(1) + " kb");
