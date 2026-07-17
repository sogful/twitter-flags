(function () {
  "use strict";

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
  const KEY = "twitterflags.dev";
  const DEFAULT = {jfDev: false, inspect: false, exposeDebug: false, forceDevEnv: false};
  const log = (...a) => {try {console.log("%c[twitterflags:dev]", "color:#00ba7c;font-weight:700", ...a)} catch {}};

  let cfg;
  try {cfg = Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || "{}"))} 
  catch {cfg = Object.assign({}, DEFAULT)}
  const save = () => {try {localStorage.setItem(KEY, JSON.stringify(cfg))} catch {}};

  try { if (cfg.jfDev) sessionStorage.setItem("jfDev", "true") } catch {}
  function exposedebug(on) {
    try {
      const u = new URL(location.href), has = u.searchParams.has("exposeDebug");
      if (on && !has) {u.searchParams.set("exposeDebug", "1"); history.replaceState(history.state, "", u.toString())}
      else if (!on && has) {u.searchParams.delete("exposeDebug"); history.replaceState(history.state, "", u.toString())}
    } catch {}
  }
  exposedebug(!!cfg.exposeDebug);

  /*//////////////////////////////////////////////////////////////////////*/

  function cssensure() {
    if (document.getElementById("tfdev-style")) return;
    const s = document.createElement("style");
    s.id = "tfdev-style";

    s.textContent = `

    html.tfdev-inspect [data-testid] {cursor: crosshair !important}
    html.tfdev-inspect [data-testid]:hover {outline: 1px solid #1d9bf0 !important; outline-offset: -1px}

    .tfdev-tip {
      position: fixed; z-index: 2147483647; 
      pointer-events: none;
      background: #1d9bf0; color: #fff; 
      font: 12px TwitterChirp, system-ui, sans-serif;
      padding: 3px 8px; border-radius: 6px; 
      transform: translateY(-130%);
      max-width: 60vw; overflow: hidden; 
      text-overflow: ellipsis; white-space: nowrap; display: none
    }
    .tfdev-tip.copied {background: #00ba7c}

    `;

    (document.head || document.documentElement).appendChild(s);
  }

  /*//////////////////////////////////////////////////////////////////////*/

  let tip = null, copyT = 0;
  const SUPPRESS = ["mousedown", "mouseup", "pointerdown", "pointerup", "auxclick", "contextmenu"];

  // only act on real testid targets: everything else (blank areas, our own
  // shadow panel which has no testids) stays fully clickable while inspecting
  const testidof = e => (e.target && e.target.closest) ? e.target.closest("[data-testid]") : null;

  function onmove(e) {
    const t = testidof(e);
    if (!t || !tip) { if (tip) tip.style.display = "none"; return }
    if (!tip.classList.contains("copied")) tip.textContent = t.getAttribute("data-testid");
    tip.style.left = e.clientX + "px"; tip.style.top = e.clientY + "px"; tip.style.display = "block";
  }
  function suppress(e) {if (testidof(e)) {e.preventDefault(); e.stopPropagation()}}
  function onkeypress(e) {if (e.key === "Escape") { 
    cfg.inspect = false; 
    save(); apply(); post(); 
    log("inspector off (esc)")
  }}
  function onclick(e) {
    const t = testidof(e);
    if (!t || !tip) return;
    e.preventDefault(); e.stopPropagation();
    const name = t.getAttribute("data-testid");
    try { navigator.clipboard.writeText(name) } catch {}
    tip.textContent = "copied: " + name; tip.classList.add("copied");
    clearTimeout(copyT); copyT = setTimeout(() => { if (tip) tip.classList.remove("copied") }, 800);
  }

  function inspectset(on) {
    document.documentElement.classList.toggle("tfdev-inspect", on);
    if (on) {
      if (!tip && document.body) { tip = document.createElement("div"); 
      tip.className = "tfdev-tip"; document.body.appendChild(tip) }

      window.addEventListener("mousemove", onmove, true);
      window.addEventListener("click", onclick, true);
      window.addEventListener("keydown", onkeypress, true);
      SUPPRESS.forEach(t => window.addEventListener(t, suppress, true));
    } else {
      window.removeEventListener("mousemove", onmove, true);
      window.removeEventListener("click", onclick, true);
      window.removeEventListener("keydown", onkeypress, true);
      SUPPRESS.forEach(t => window.removeEventListener(t, suppress, true));

      if (tip) tip.style.display = "none";
    }
  }

  /*//////////////////////////////////////////////////////////////////////*/

  function apply() {
    cssensure();
    try {if (cfg.jfDev) sessionStorage.setItem("jfDev", "true"); 
    else if (sessionStorage.getItem("jfDev") === "true") sessionStorage.removeItem("jfDev")} catch {}
    exposedebug(!!cfg.exposeDebug);
    inspectset(!!cfg.inspect);
  }

  function post() {try {window.postMessage({source: PCHAN, type: "dev", config: cfg}, location.origin)} catch {}}

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.source !== UCHAN) return;
    if (d.cmd === "devget") post();
    else if (d.cmd === "devset") { Object.assign(cfg, d.config || {}); save(); apply(); post() }
  });

  window.twitterflagsDev = {
    config: cfg,
    set: (k, v) => { cfg[k] = v; save(); apply(); post(); return cfg }
  };

  function init() { apply(); post(); log("ready", cfg) }
  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);

})();
