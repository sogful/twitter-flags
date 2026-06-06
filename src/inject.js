(function () {
  "use strict";

  const LOG = true;
  const log = (...a) => {if (LOG) try {console.log("%c[twitterflags]", "color:#1d9bf0;font-weight:700", ...a)} catch {}};

  const flags = {};
  let captured = false;
  let source = "none";
  let onchange = null;

  /*//////////////////////////////////////////////////////////////////////*/

  let overrides = {};
  try {overrides = JSON.parse(localStorage.getItem("twitterflags.overrides") || "{}") || {}} catch {overrides = {}}
  let dirty = false;
  const saveOverrides = () => { try {localStorage.setItem("twitterflags.overrides", JSON.stringify(overrides))} catch {}};
  const hasOverride = k => Object.prototype.hasOwnProperty.call(overrides, k);
  const effective = k => (hasOverride(k) ? overrides[k] : flags[k]);

  function applyOverrides(s) {
    try {
      const fs = s && s.featureSwitch;
      if (!fs) return;
      if (!fs.customOverrides || typeof fs.customOverrides !== "object") fs.customOverrides = {};
      let c = 0;
      for (const k in overrides) { fs.customOverrides[k] = overrides[k]; c++ }
      if (c) log("applied", c, "saved override(s) into customOverrides for this load");
    } catch (e) {log("applyOverrides error:", e && e.message)}
  }

  function ingestConfig(cfg, from) {
    if (!cfg || typeof cfg !== "object") return 0;
    let hits = 0;
    for (const k in cfg) {
      const v = cfg[k];
      if (v && typeof v === "object" && "value" in v) { flags[k] = v.value; hits++ }
      else if (typeof v === "boolean" || typeof v === "number" || typeof v === "string") { flags[k] = v; hits++ }
    }
    if (hits) {
      captured = true; source = from || source;
      log("ingested", hits, "flags from", from, "- total now", Object.keys(flags).length);
      if (onchange) onchange();
    }
    return hits;
  }

  function ingestManifest(d, from) {
    if (!d || typeof d !== "object") return 0;
    const cfg = (d.config && typeof d.config === "object") ? d.config : d;
    return ingestConfig(cfg, from || "manifest");
  }

  function ingestText(text, from) {
    let data; try { data = JSON.parse(text) } catch { return 0 }
    const pools = [data && data.config, data && data.settings, data].filter(x => x && typeof x === "object");
    let total = 0;
    for (const pool of pools) {
      let local = 0;
      for (const k in pool) if (pool[k] && typeof pool[k] === "object" && "value" in pool[k]) local++;
      if (local >= 10) total += ingestConfig(pool, from || "fetch");
    }
    return total;
  }

  /*//////////////////////////////////////////////////////////////////////*/

  const IS = "__INITIAL_STATE__";
  function grabState(s, from) {
    try {
      const fs = s && s.featureSwitch;
      if (!fs) return 0;
      let n = 0;
      if (fs.defaultConfig) n += ingestConfig(fs.defaultConfig, from + ":default");
      if (fs.customOverrides) n += ingestConfig(fs.customOverrides, from + ":override");
      return n;
    } catch (e) { log("grabState error:", e && e.message); return 0 }
  }
  let isInstalled = false;
  try {
    let bIS = window[IS];
    if (bIS !== undefined) { log(IS, "present at install"); grabState(bIS, "initial(pre)"); applyOverrides(bIS) }
    Object.defineProperty(window, IS, {
      configurable: true,
      get() { return bIS },
      set(v) { bIS = v; log(IS, "set, featureSwitch:", !!(v && v.featureSwitch)); grabState(v, "initial(set)"); applyOverrides(v) }
    });
    isInstalled = true;
  } catch (e) { log("could not define " + IS + " accessor:", e && e.message) }

  const MAN = "__FEATURE_SWITCH_MANIFEST__";
  let manInstalled = false;
  function wrapResolver(real, tag) {
    return function (data) { try { ingestManifest(data, tag) } catch { } return real.apply(this, arguments) };
  }
  try {
    let backing = window[MAN];
    if (backing !== undefined) {
      log("manifest already present at install, type:", typeof backing);
      if (typeof backing === "function") { backing = wrapResolver(backing, "manifest(resolve-pre)"); log("wrapped pre-existing resolver") }
      else ingestManifest(backing, "manifest(pre)");
    }
    Object.defineProperty(window, MAN, {
      configurable: true,
      get() { return backing },
      set(v) {
        log("manifest set, type:", typeof v, v && typeof v === "object" ? "(has config: " + !!v.config + ")" : "");
        if (typeof v === "function") backing = wrapResolver(v, "manifest(resolve)");
        else { ingestManifest(v, "manifest(set)"); backing = v }
      }
    });
    manInstalled = true;
  } catch (e) {log("couldnt define manifest accessor:", e && e.message)}

  const somesettings = u => typeof u === "string" && u.indexOf("help/settings") >= 0;
  const veryswag = u => typeof u === "string" && /settings|feature.?switch|manifest/i.test(u);

  let fetchhooked = false;
  const ofetch = window.fetch;
  if (ofetch) {
    window.fetch = function (...a) {
      const u = (typeof a[0] === "string" ? a[0] : a[0] && a[0].url) || "";
      if (veryswag(u)) log("fetch ->", u);
      return ofetch.apply(this, a).then(r => {
        try { if (somesettings(u) || somesettings(r && r.url)) r.clone().text().then(t => { const n = ingestText(t, "fetch"); log("settings fetch parsed", n, "flags") }).catch(() => { }) } catch { }
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
      this.addEventListener("load", () => { try { if (somesettings(this.xfu)) { const n = ingestText(this.responseText, "xhr"); log("settings xhr parsed", n, "flags") } } catch { } });
      return osend.apply(this, arguments);
    };
    xhrhooked = true;
  } catch (e) { log("could not hook xhr:", e && e.message) }

  log("installed. initial-state:", isInstalled, "manifest:", manInstalled, "fetch:", fetchhooked, "xhr:", xhrhooked,
    "| expect an 'ingested N flags from initial(set):default' line on full reload. if it never appears, the script is sandboxed out of page context.");

  window.twitterflags = flags;
  window.twitterflagsDebug = {
    flags, overrides,
    effective: k => effective(k),
    set: (k, v) => { overrides[k] = v; saveOverrides(); dirty = true; if (onchange) onchange(); return v },
    clear: k => { delete overrides[k]; saveOverrides(); dirty = true; if (onchange) onchange() },
    clearAll: () => { for (const k in overrides) delete overrides[k]; saveOverrides(); dirty = true; if (onchange) onchange() },
    status: () => ({ captured, source, count: Object.keys(flags).length, overrides: Object.keys(overrides).length, dirty, isInstalled, manInstalled, fetchhooked, xhrhooked }),
    scan: () => {
      let best = null, bestN = 0;
      const seen = new Set();
      function walk(o, depth) {
        if (!o || typeof o !== "object" || depth > 4 || seen.has(o)) return;
        seen.add(o);
        let n = 0;
        for (const k in o) { try { const v = o[k]; if (v && typeof v === "object" && "value" in v && Object.keys(v).length <= 3) n++ } catch { } }
        if (n > bestN) { bestN = n; best = o }
        for (const k in o) { try { walk(o[k], depth + 1) } catch { } }
      }
      try { walk(window, 0) } catch { }
      if (best && bestN >= 10) { const n = ingestConfig(best, "scan"); log("scan found", n, "flags"); return n }
      log("scan found nothing flag-shaped"); return 0;
    }
  };

  /*//////////////////////////////////////////////////////////////////////*/

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";

  function snapshot() {
    return {
      captured, source, dirty, flags, overrides,
      status: {count: Object.keys(flags).length, isInstalled, manInstalled, fetchhooked, xhrhooked}
    };
  }
  function poststate() {
    try {window.postMessage({source: PCHAN, type: "state", payload: snapshot()}, location.origin)} catch { }
  }

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.source !== UCHAN) return;
    switch (d.cmd) {
      case "getstate": poststate(); break;
      case "set": overrides[d.name] = d.value; saveOverrides(); dirty = true; poststate(); break;
      case "setmany":
        if (d.set && typeof d.set === "object") for (const k in d.set) overrides[k] = d.set[k];
        if (Array.isArray(d.clear)) for (const k of d.clear) delete overrides[k];
        saveOverrides(); dirty = true; poststate(); break;
      case "clear": delete overrides[d.name]; saveOverrides(); dirty = true; poststate(); break;
      case "clearall": for (const k in overrides) delete overrides[k]; saveOverrides(); dirty = true; poststate(); break;
      case "reload": location.reload(); break;
    }
  });
  onchange = () => { try { poststate() } catch { } };
  poststate();
})();
