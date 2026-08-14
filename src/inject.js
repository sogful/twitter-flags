(function () {
  "use strict";

  const LOG = true;
  // very pretty................
  const log = (...a) => {if (LOG) try {console.log("%c[twitter flags]", "color:#1d9bf0;font-weight:700", ...a)} catch {}};

  const flags = {};
  let captured = false;
  let source = "none";
  let onchange = null;

  /*//////////////////////////////////////////////////////////////////////*/

  let overrides = {};
  try {overrides = JSON.parse(localStorage.getItem("twitterflags.overrides") || "{}") || {}} catch {overrides = {}}
  let appliedoverrides = {};
  try {appliedoverrides = JSON.parse(JSON.stringify(overrides))} catch {}
  let dirty = false;
  const saveoverrides = () => { try {localStorage.setItem("twitterflags.overrides", JSON.stringify(overrides))} catch {}};
  const hasoverride = k => Object.prototype.hasOwnProperty.call(overrides, k);
  const effective = k => (hasoverride(k) ? overrides[k] : flags[k]);
  const canon = o => {try {return JSON.stringify(Object.keys(o).sort().map(k => [k, o[k]]))} catch {return ""}};

  function applyoverrides(s) {
    try {
      const fs = s && s.featureSwitch;
      if (!fs) return;
      if (!fs.customoverrides || typeof fs.customoverrides !== "object") fs.customoverrides = {};
      const dc = fs.defaultConfig;
      let c = 0;
      for (const k in overrides) {
        fs.customoverrides[k] = overrides[k];
        if (dc) {
          if (dc[k] && typeof dc[k] === "object" && "value" in dc[k]) dc[k].value = overrides[k];
          else dc[k] = {value: overrides[k]};
        }
        c++;
      }
      if (c) log("applied", c, "saved overrides into customoverrides + defaultConfig for this load!");
    } catch (e) {log("applyoverrides error:", e && e.message)}
  }

  function configingest(cfg, from) {
    if (!cfg || typeof cfg !== "object") return 0;
    let hits = 0;
    for (const k in cfg) {
      const v = cfg[k];
      if (v && typeof v === "object" && "value" in v) { flags[k] = v.value; hits++ }
      else if (Array.isArray(v)) { flags[k] = v; hits++ }
      else if (typeof v === "boolean" || typeof v === "number" || typeof v === "string") { flags[k] = v; hits++ }
    }
    if (hits) {
      captured = true; source = from || source;
      log("ingested", hits, "flags from", from, "- total now", Object.keys(flags).length);
      if (onchange) onchange();
    }
    return hits;
  }

  function manifestingest(d, from) {
    if (!d || typeof d !== "object") return 0;
    const cfg = (d.config && typeof d.config === "object") ? d.config : d;
    return configingest(cfg, from || "manifest");
  }

  function ingestText(text, from) {
    let data; try { data = JSON.parse(text) } catch { return 0 }
    const pools = [data && data.config, data && data.settings, data].filter(x => x && typeof x === "object");
    let total = 0;
    for (const pool of pools) {
      let local = 0;
      for (const k in pool) if (pool[k] && typeof pool[k] === "object" && "value" in pool[k]) local++;
      if (local >= 10) total += configingest(pool, from || "fetch");
    }
    return total;
  }

  /*//////////////////////////////////////////////////////////////////////*/

  let forceenv = null;
  try { const dc = JSON.parse(localStorage.getItem("twitterflags.dev") || "{}"); if (dc && dc.forceDevEnv) forceenv = "devel" } catch {}
  if (forceenv) {
    try {
      let md = window.__META_DATA__;
      const patch = v => { try { if (v && typeof v === "object" && v.env !== forceenv) v.env = forceenv } catch {} return v };
      if (md !== undefined) patch(md);
      Object.defineProperty(window, "__META_DATA__", {
        configurable: true,
        get() { return md },
        set(v) { md = patch(v); log("forced __META_DATA__.env =", forceenv) }
      });
    } catch (e) { log("could not force env:", e && e.message) }
  }

  /*//////////////////////////////////////////////////////////////////////*/

  const IS = "__INITIAL_STATE__";
  function grabState(s, from) {
    try {
      const fs = s && s.featureSwitch;
      if (!fs) return 0;
      let n = 0;
      if (fs.defaultConfig) n += configingest(fs.defaultConfig, from + ":default");
      if (fs.customoverrides) n += configingest(fs.customoverrides, from + ":override");
      return n;
    } catch (e) {log("grabState error:", e && e.message); return 0}
  }
  let isInstalled = false;
  try {
    let bIS = window[IS];
    if (bIS !== undefined) {log(IS, "present at install"); grabState(bIS, "initial(pre)"); applyoverrides(bIS)}
    Object.defineProperty(window, IS, {
      configurable: true,
      get() { return bIS },
      set(v) { bIS = v; log(IS, "set, featureSwitch:", !!(v && v.featureSwitch)); grabState(v, "initial(set)"); applyoverrides(v) }
    });
    isInstalled = true;
  } catch (e) { log("could not define " + IS + " accessor:", e && e.message) }

  const MAN = "__FEATURE_SWITCH_MANIFEST__";
  let manInstalled = false;
  function resolvewrap(real, tag) {
    return function (data) {try {manifestingest(data, tag)} catch {} return real.apply(this, arguments)};
  }
  try {
    let backing = window[MAN];
    if (backing !== undefined) {
      log("manifest already present at install, type:", typeof backing);
      if (typeof backing === "function") { backing = resolvewrap(backing, "manifest(resolve-pre)"); log("wrapped pre-existing resolver") }
      else manifestingest(backing, "manifest(pre)");
    }
    Object.defineProperty(window, MAN, {
      configurable: true,
      get() { return backing },
      set(v) {
        log("manifest set, type:", typeof v, v && typeof v === "object" ? "(has config: " + !!v.config + ")" : "");
        if (typeof v === "function") backing = resolvewrap(v, "manifest(resolve)");
        else {manifestingest(v, "manifest(set)"); backing = v}
      }
    });
    manInstalled = true;
  } catch (e) {log("couldnt define manifest accessor?! ", e && e.message)}

  const somesettings = u => typeof u === "string" && u.indexOf("help/settings") >= 0;
  const veryswag = u => typeof u === "string" && /settings|feature.?switch|manifest/i.test(u);

  let fetchhooked = false;
  const ofetch = window.fetch;
  if (ofetch) {
    window.fetch = function (...a) {
      const u = (typeof a[0] === "string" ? a[0] : a[0] && a[0].url) || "";
      if (veryswag(u)) log("fetch ->", u);
      return ofetch.apply(this, a).then(r => {
        try { 
          if (somesettings(u) || somesettings(r && r.url)) r.clone().text().then(t => 
            {const n = ingestText(t, "fetch"); 
            log("settings fetch parsed", n, "flags")}).catch(() => {})
        } catch {}
        return r;
      });
    };
    fetchhooked = true;
  }

  let xhrhooked = false;
  try {
    const oopen = XMLHttpRequest.prototype.open, osend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, u) { this.xfu = u; if (veryswag(u)) log("xhr ->", u); return oopen.apply(this, arguments) };
    XMLHttpRequest.prototype.send = function () {
      this.addEventListener("load", () => { try { if (somesettings(this.xfu)) { const n = ingestText(this.responseText, "xhr"); log("settings xhr parsed", n, "flags") } } catch {} });
      return osend.apply(this, arguments);
    };
    xhrhooked = true;
  } catch (e) { log("couldn't hook xhr:", e && e.message) }

  /*//////////////////////////////////////////////////////////////////////*/

  const ISASSIGN = /__INITIAL_STATE__\s*=\s*\{/;
  let sourcegrabbed = false;

  function matchbraces(text, start) {
    let depth = 0, str = false, q = "";
    for (let i = start; i < text.length; i++) {
      const c = text[i];
      if (str) {if (c === "\\") {i++; continue} if (c === q) str = false; continue}
      if (c === '"' || c === "'" || c === "`") {str = true; q = c; continue}
      if (c === "{") depth++;
      else if (c === "}") {if (--depth === 0) return text.slice(start, i + 1)}
    }
    return null;
  }
  function extractassign(text, name) {
    let i = text.indexOf(name);
    while (i >= 0) {
      const b = text.indexOf("{", i + name.length);
      if (b >= 0 && b - (i + name.length) < 8) {
        const json = matchbraces(text, b);
        if (json) {try {return JSON.parse(json)} catch {}}
      }
      i = text.indexOf(name, i + name.length);
    }
    return null;
  }
  function scanhtmlsource() {
    if (sourcegrabbed) return 0;
    try {
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        const sc = scripts[i];
        if (sc.src) continue;
        const t = sc.textContent;
        if (!t || !ISASSIGN.test(t)) continue;
        const obj = extractassign(t, IS);
        if (obj && obj.featureSwitch) {
          const n = grabState(obj, "html-source");
          if (n) {sourcegrabbed = true; log("read the full flag list straight from the page source:", n, "flags"); return n}
        }
      }
    } catch (e) {log("scanhtmlsource error:", e && e.message)}
    return 0;
  }

  function fetchsourcefallback() {
    if (sourcegrabbed) return;
    try {
      const f = ofetch || window.fetch;
      if (!f) return;
      f.call(window, location.href, {credentials: "include"}).then(r => r.text()).then(t => {
        if (sourcegrabbed) return;
        const obj = extractassign(t, IS);
        if (obj && obj.featureSwitch) {const n = grabState(obj, "html-source(refetch)"); if (n) {sourcegrabbed = true; log("read the full flag list via document refetch:", n, "flags")}}
        else log("refetch had no parseable __INITIAL_STATE__");
      }).catch(e => log("refetch failed:", e && e.message));
    } catch (e) {log("fetchsourcefallback error:", e && e.message)}
  }
  function sourceloop() {
    if (scanhtmlsource()) return;
    let tries = 0, obs = null;
    const stop = () => {if (obs) {obs.disconnect(); obs = null}};
    try {obs = new MutationObserver(() => {if (scanhtmlsource()) stop()}); obs.observe(document.documentElement, {childList: true, subtree: true})} catch {}
    const iv = setInterval(() => {if (scanhtmlsource() || ++tries > 40) {clearInterval(iv); stop(); if (!sourcegrabbed) fetchsourcefallback()}}, 150);
    document.addEventListener("DOMContentLoaded", () => {scanhtmlsource()}, {once: true});
  }
  sourceloop();

  /*//////////////////////////////////////////////////////////////////////*/

  const switchrecievers = ["isTrue", "getValue", "getInt", "getString", "getList", "getStringList", "getDouble", "getFloat", "getLong", "getBoolean", "getJson"];

  function findswitches() {
    try {
      const root = document.querySelector("#react-root");
      const host = root && root.firstElementChild;
      if (!host) return null;
      const el = host.wrappedJSObject || host;
      const key = Object.keys(el).find(x => x.startsWith("__reactProps"));
      if (!key) return null;
      const seen = new Set();
      const stack = [el[key]];
      let n = 0;
      while (stack.length && n < 4000) {
        const cur = stack.pop(); n++;
        if (!cur || typeof cur !== "object" || seen.has(cur)) continue;
        seen.add(cur);
        const fsw = cur.featureSwitches;
        if (fsw && typeof fsw.isTrue === "function") return fsw;
        if (Array.isArray(cur)) {for (const c of cur) stack.push(c); continue}
        stack.push(cur.props, cur.children, cur.contextProviderProps, cur.value);
      }
    } catch (e) {log("findswitches error:", e && e.message)}
    return null;
  }

  function poolsize(pool) {
    if (!pool || typeof pool !== "object" || Array.isArray(pool)) return 0;
    let n = 0;
    try {
      for (const key in pool) {
        const dv = pool[key];
        if (dv && typeof dv === "object" && "value" in dv) n++;
        else if (Array.isArray(dv) || typeof dv === "boolean" || typeof dv === "number" || typeof dv === "string") n++;
        if (n >= 10) break;
      }
    } catch {}
    return n;
  }

  function harvestswitches(fsw) {
    try {
      let best = null, bestN = 0;
      const seen = new Set();
      let o = fsw;
      for (let d = 0; o && d < 3; d++, o = Object.getPrototypeOf(o)) {
        for (const k of Object.getOwnPropertyNames(o)) {
          if (seen.has(k)) continue; seen.add(k);
          let v; try {v = fsw[k]} catch {continue}
          const n = poolsize(v);
          if (n > bestN) {bestN = n; best = v}
        }
      }
      return best && bestN >= 10 ? configingest(best, "features(live)") : 0;
    } catch (e) {log("harvestswitches error:", e && e.message); return 0}
  }

  // retry for a while
  function harvestloop(fsw) {
    let tries = 0;
    const go = () => {const n = harvestswitches(fsw); if (n) log("harvested", n, "flags from the live manager"); return n > 0};
    if (go()) return;
    const iv = setInterval(() => {if (go() || ++tries > 25) {clearInterval(iv); if (tries > 25) log("harvest: no flag map found on the manager")}}, 300);
  }

  let capturetimer = 0;
  function schedcapture() {if (!capturetimer) capturetimer = setTimeout(() => {capturetimer = 0; if (onchange) onchange()}, 250)}

  function hookswitches(fsw) {
    if (!fsw || fsw.tfhooked) return false;
    let wrapped = 0;
    for (const name of switchrecievers) {
      const orig = fsw[name];
      if (typeof orig !== "function") continue;
      fsw[name] = function (k) {
        if (typeof k === "string" && hasoverride(k)) {const v = overrides[k]; return name === "isTrue" ? v === true : v}
        const res = orig.apply(this, arguments);
        if (typeof k === "string" && res !== undefined) {
          const fresh = !(k in flags);
          if (fresh || (name === "getValue" && typeof res !== "object" && flags[k] !== res)) {
            flags[k] = res;
            if (!captured) {captured = true; if (source === "none") source = "live-read"}
            schedcapture();
          }
        }
        return res;
      };
      wrapped++;
    }
    fsw.tfhooked = true;
    log("hooked featureSwitches:", wrapped, "getter(s); overrides apply live now");
    harvestloop(fsw);
    return true;
  }

  let swhooked = false;
  function trackswitches() {if (!swhooked) {const fsw = findswitches(); if (fsw) swhooked = hookswitches(fsw)}}

  trackswitches();
  if (!swhooked) {
    let obs = null, tries = 0;
    const stop = () => {if (obs) {obs.disconnect(); obs = null}};
    try {obs = new MutationObserver(() => {trackswitches(); if (swhooked) stop()}); obs.observe(document.documentElement, {childList: true, subtree: true})} catch {}
    const iv = setInterval(() => {trackswitches(); if (swhooked || ++tries > 150) {clearInterval(iv); stop()}}, 100);
  }

  /*//////////////////////////////////////////////////////////////////////*/

  log("installed!\ninitial-state:", isInstalled, "\nmanifest:", manInstalled, "\nfetch:", fetchhooked, "\nxhr:", xhrhooked,
    "\nexpect an \"ingested N flags from initial(set):default\" line on full reload.\nif it never appears, the script is unfortunately sandboxed :(");

  window.twitterflags = flags;
  window.twitterflagsDebug = {
    flags, overrides,
    effective: k => effective(k),
    findswitches, rehook: () => {const fsw = findswitches(); return fsw ? hookswitches(fsw) : (log("featureSwitches not found yet"), false)},
    set: (k, v) => { overrides[k] = v; saveoverrides(); dirty = true; if (onchange) onchange(); return v },
    clear: k => { delete overrides[k]; saveoverrides(); dirty = true; if (onchange) onchange() },
    clearAll: () => { for (const k in overrides) delete overrides[k]; saveoverrides(); dirty = true; if (onchange) onchange() },
    status: () => ({ captured, source, sourcegrabbed, count: Object.keys(flags).length, overrides: Object.keys(overrides).length, dirty, isInstalled, manInstalled, fetchhooked, xhrhooked }),
    rescan: () => scanhtmlsource(),
    scan: () => {
      let best = null, bestN = 0;
      const seen = new Set();
      function walk(o, depth) {
        if (!o || typeof o !== "object" || depth > 4 || seen.has(o)) return;
        seen.add(o);
        let n = 0;
        for (const k in o) { try { const v = o[k]; if (v && typeof v === "object" && "value" in v && Object.keys(v).length <= 3) n++ } catch {} }
        if (n > bestN) { bestN = n; best = o }
        for (const k in o) { try { walk(o[k], depth + 1) } catch {} }
      }
      try { walk(window, 0) } catch {}
      if (best && bestN >= 10) { const n = configingest(best, "scan"); log("scan found", n, "flags"); return n }
      log("scan found nothing flag-shaped"); return 0;
    }
  };

  /*//////////////////////////////////////////////////////////////////////*/

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";

  // slightly complex theme detection
  function tfrgb(str) {
    const m = /rgba?\(([^)]+)\)/.exec(str || "");
    if (!m) return null;
    const p = m[1].split(",").map(x => parseFloat(x));
    if (p.length < 3) return null;
    if (p.length >= 4 && p[3] === 0) return null;
    return [p[0] || 0, p[1] || 0, p[2] || 0];
  }
  function tfhex(h) {
    const m = /^#?([0-9a-f]{6})$/i.exec((h || "").trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function tflum(rgb) {
    const c = rgb.map(v => {v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)});
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function detecttheme() {
    try {
      let bg = document.body && tfrgb(getComputedStyle(document.body).backgroundColor);
      if (!bg && document.documentElement) bg = tfrgb(getComputedStyle(document.documentElement).backgroundColor);
      if (!bg) {const m = document.querySelector('meta[name="theme-color"]'); if (m) bg = tfhex(m.getAttribute("content"))}
      if (!bg) return null;
      return tflum(bg) > 0.5 ? "light" : "dark";
    } catch {return null}
  }
  let lasttheme = detecttheme();
  function themewatch() {const t = detecttheme(); if (t && t !== lasttheme) {lasttheme = t; if (onchange) onchange()}}
  try {
    const mo = new MutationObserver(themewatch);
    const obs = () => {try {mo.observe(document.documentElement, {attributes: true, attributeFilter: ["style", "class"]}); if (document.body) mo.observe(document.body, {attributes: true, attributeFilter: ["style", "class"]})} catch {}};
    obs();
    if (!document.body) document.addEventListener("DOMContentLoaded", () => {obs(); themewatch()}, {once: true});
  } catch {}

  function snapshot() {
    return {
      captured, source, dirty, flags, overrides,
      theme: lasttheme || detecttheme(),
      applied: appliedoverrides,
      status: {count: Object.keys(flags).length, isInstalled, manInstalled, fetchhooked, xhrhooked}
    };
  }
  function prostate() {
    try {window.postMessage({source: PCHAN, type: "state", payload: snapshot()}, location.origin)} catch {}
  }

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.source !== UCHAN) return;
    switch (d.cmd) {
      case "getstate": prostate(); break;
      case "set": overrides[d.name] = d.value; saveoverrides(); dirty = true; prostate(); break;
      case "setmany":
        if (d.set && typeof d.set === "object") for (const k in d.set) overrides[k] = d.set[k];
        if (Array.isArray(d.clear)) for (const k of d.clear) delete overrides[k];
        saveoverrides(); dirty = true; prostate(); break;
      case "clear": delete overrides[d.name]; saveoverrides(); dirty = true; prostate(); break;
      case "clearall": for (const k in overrides) delete overrides[k]; saveoverrides(); dirty = true; prostate(); break;
      case "syncoverrides": {
        const inc = (d.overrides && typeof d.overrides === "object" && !Array.isArray(d.overrides)) ? d.overrides : {};
        if (canon(inc) === canon(overrides)) break;
        for (const k in overrides) delete overrides[k];
        Object.assign(overrides, inc);
        saveoverrides();
        if (captured) dirty = true;
        applyoverrides(window[IS]);
        log("synced", Object.keys(inc).length, "override(s) from extension storage");
        prostate(); break;
      }
      case "reload": location.reload(); break;
    }
  });
  onchange = () => {try {prostate()} catch {}};
  prostate();
})();
