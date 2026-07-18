(function () {
  "use strict";

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
  const KEY = "twitterflags.dev";
  const DEFAULT = {jfDev: false, inspect: false, exposeDebug: false, forceDevEnv: false, forcechirp: false};
  const log = (...a) => {try {console.log("%c[twitterflags:dev]", "color:#00ba7c;font-weight:700", ...a)} catch {}};

  let cfg;
  try {cfg = Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY) || "{}"))}
  catch {cfg = Object.assign({}, DEFAULT)}
  // frozen load time snapshot so the panel can tell if a dev toggle is unsaved
  const applieddev = Object.assign({}, cfg);
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
  if (cfg.forcechirp) try {reapplychirp()} catch {}

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

  const onpanel = e => {
    const p = e.composedPath ? e.composedPath() : null;
    if (p) { for (const n of p) if (n && n.id === "tfuserscripthost") return true }
    return !!(e.target && e.target.closest && e.target.closest("#tfuserscripthost"));
  };
  const testidof = e => {
    if (onpanel(e)) return null;
    const p = e.composedPath ? e.composedPath() : null;
    if (p) { for (const n of p) if (n && n.nodeType === 1 && n.hasAttribute && n.hasAttribute("data-testid")) return n }
    return (e.target && e.target.closest) ? e.target.closest("[data-testid]") : null;
  };

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
    forcechirp(!!cfg.forcechirp);
  }

  function post() {try {window.postMessage({source: PCHAN, type: "dev", config: cfg, applied: applieddev}, location.origin)} catch {}}

  function reapplychirp() {
    try {
      const stack = '"TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      if (window.FontFace && document.fonts) {
        [["chirp-regular-web", "400"], ["chirp-medium-web", "500"], ["chirp-bold-web", "700"], ["chirp-heavy-web", "800"]].forEach(([n, weight]) => {
          try {
            const ff = new FontFace("TwitterChirp", 'url("https://abs.twimg.com/fonts/v1/' + n + '.woff2")', {weight: weight, display: "swap"});
            ff.load().then(f => document.fonts.add(f)).catch(e => log("chirp", weight, "failed:", e && e.message));
          } catch (e) {log("chirp", weight, "error:", e && e.message)}
        });
      }
      let s = document.getElementById("tf-chirp-force");
      if (!s) { s = document.createElement("style"); s.id = "tf-chirp-force"; (document.head || document.documentElement).appendChild(s) }
      s.textContent = "*, ::before, ::after { font-family: " + stack + " !important }";
      log("reapplied + forced TwitterChirp onto the page");
    } catch (e) {log("reapplychirp error:", e && e.message)}
  }

  // when the checkbox is on, keep the force live; off tears the style back out
  function forcechirp(on) {
    if (on) {reapplychirp(); return}
    const s = document.getElementById("tf-chirp-force");
    if (s) s.remove();
  }

  function swaction(action) {
    if (action === "chirp") {reapplychirp(); return}
    try {
      const sw = navigator.serviceWorker;
      if (!sw) {log("no serviceWorker api"); return}
      if (action === "unregister") {sw.getRegistrations().then(rs => {rs.forEach(r => r.unregister()); log("unregistered", rs.length, "service worker(s)")}); return}
      const type = action === "flush" ? "ACTION_FLUSH" : action === "refresh" ? "ACTION_REFRESH" : null;
      if (!type) return;
      if (sw.controller) {sw.controller.postMessage({type}); log("sent", type)}
      else log("no active service worker controller");
    } catch (e) {log("sw action failed:", e && e.message)}
  }

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.source !== UCHAN) return;
    if (d.cmd === "devget") post();
    else if (d.cmd === "devset") { Object.assign(cfg, d.config || {}); save(); apply(); post() }
    else if (d.cmd === "sw") swaction(d.action);
  });

  window.twitterflagsDev = {
    config: cfg,
    set: (k, v) => { cfg[k] = v; save(); apply(); post(); return cfg }
  };

  function init() { apply(); post(); log("ready", cfg) }
  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);

})();
