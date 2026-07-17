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

const fontchirp = b64("fonts/chirp.woff2");
const fontbold = b64("fonts/chirpbold.woff2");
const fontheavy = b64("fonts/chirpheavy.woff2");
const iconsvg = rd("images/icon.svg").trim();
const iconmeta = "data:image/svg+xml;base64," + b64("images/icon.svg");

let panelcss = rd("panel.css");
panelcss = must(panelcss, panelcss.replace('url("fonts/chirp.woff2")', "url(data:font/woff2;base64," + fontchirp + ")"), "font chirp");
panelcss = must(panelcss, panelcss.replace('url("fonts/chirpbold.woff2")', "url(data:font/woff2;base64," + fontbold + ")"), "font bold");
panelcss = must(panelcss, panelcss.replace('url("fonts/chirpheavy.woff2")', "url(data:font/woff2;base64," + fontheavy + ")"), "font heavy");

const rawhtml = rd("panel.html");
const panelhtml = rawhtml.slice(rawhtml.indexOf("<body>") + 6, rawhtml.indexOf("<script")).trim();

const injectsrc = rd("src/inject.js");
const devsrc = rd("src/dev.js");
const descsrc = rd("configs/descriptions.js");

let panelsrc = rd("panel.js");
panelsrc = must(panelsrc, panelsrc.replace("(function () {", "(function (chrome, root) {"), "panel iife open");
panelsrc = must(panelsrc, panelsrc.replace("const query = selector => document.querySelector(selector);", "const query = selector => root.querySelector(selector);"), "panel query scope");
panelsrc = must(panelsrc, panelsrc.replace(/\}\)\(\);\s*$/, "})(__tfshim, __tfroot);\n"), "panel iife close");

/*//////////////////////////////////////////////////////////////////////*/

const hostcss = `
    :host {all: initial}
    .tffab {
      position: fixed; z-index: 2147483647;
      right: 16px; bottom: 16px;
      width: 40px; height: 40px; border-radius: 999px;
      background-color: #1d9bf0; border: none; cursor: pointer;
      pointer-events: auto;
      display: flex; align-items: center; justify-content: center;
      padding: 0
    }
    .tffab svg {width: 22px; height: 22px}
    .tfpanelwrap {
      position: fixed; top: 0; right: 0;
      width: 390px; max-width: 100vw;
      height: 100vh; height: 100dvh;
      background-color: #000; color: #E5EAEC;
      font: 14px "Chirp", system-ui, sans-serif;
      display: flex; flex-direction: column;
      overflow: hidden; user-select: none;
      z-index: 2147483647;
      pointer-events: auto; visibility: hidden;
      border-left: 1px solid #242E36;
      box-shadow: -2px 0 24px rgba(0,0,0,0.6);
      transform: translateX(100%);
      transition: transform 0.18s ease
    }
    .tfpanelwrap.open {transform: none; visibility: visible}
    .tfpanelwrap .header {padding-top: 34px}
    .tfclose {
      position: absolute; top: 6px; right: 10px; z-index: 3;
      background: none; border: none; cursor: pointer; padding: 4px;
      display: inline-flex; align-items: center; justify-content: center
    }
    .tfclose svg {width: 20px; height: 20px; fill: #6B7F8E}
    .tfclose:hover svg {fill: #E5EAEC}
`;

const closesvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/></svg>';

/*//////////////////////////////////////////////////////////////////////*/

const meta = `// ==UserScript==
// @name         twitter flags & more
// @namespace    coolsite.cv
// @version      ${version}
// @description  browse hidden stuff inside the twitter client with an in-page panel!
// @author       cv
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         ${iconmeta}
// @run-at       document-start
// @grant        none
// ==/UserScript==
`;

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

    // fab last so it wins the z-index tie and stays clickable over the open drawer
    const fab = document.createElement("button");
    fab.className = "tffab"; fab.title = "twitter flags";
    fab.innerHTML = iconsvg;
    root.appendChild(fab);

    (document.body || document.documentElement).appendChild(host);

    fab.addEventListener("click", () => wrap.classList.toggle("open"));
    wrap.querySelector(".tfclose").addEventListener("click", () => wrap.classList.remove("open"));

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

const parts = [meta, head, injectsrc, devsrc, descsrc, mountopen, panelsrc, mountclose];
const output = parts.join("\n");

const distdir = path.join(here, "dist");
fs.mkdirSync(distdir, {recursive: true});
const outpath = path.join(distdir, "twitter-flags.user.js");
fs.writeFileSync(outpath, output);
console.log("built! ^^", outpath);
console.log("size:", (output.length / 1024).toFixed(1) + " kb");
