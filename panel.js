(function () {
  "use strict";

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
  const HOST = /^https:\/\/(x|twitter)\.com\//;
  const EXT = typeof chrome !== "undefined" && !!(chrome.runtime && chrome.runtime.onMessage && chrome.tabs);

  let captured = false, source = "none", dirty = false, cached = false;
  let flags = {}, overrides = {}, status = {}, applied = {};
  let devconfig = { jfDev: false, inspect: false }, applieddev = {};
  const hasoverride = k => Object.prototype.hasOwnProperty.call(overrides, k);
  const effective = k => (hasoverride(k) ? overrides[k] : flags[k]);
  const persist = () => {if (EXT) try {chrome.storage.local.set({overrides})} catch {}};
  const canon = o => {try {return JSON.stringify(Object.keys(o).sort().map(k => [k, o[k]]))} catch {return ""}};
  const clone = o => {try {return JSON.parse(JSON.stringify(o))} catch {return {}}};
  // dev toggles that need a reload to apply count toward unsaved
  const DEVPERSIST = ["jfDev", "exposeDebug", "forceDevEnv"];
  const devkey = c => JSON.stringify(DEVPERSIST.map(k => [k, !!(c && c[k])]));
  const markdirty = () => {dirty = canon(overrides) !== canon(applied) || devkey(devconfig) !== devkey(applieddev)};

  /*//////////////////////////////////////////////////////////////////////*/

  let tabId = null;

  async function resolveTab() {
    let t;
    try { [t] = await chrome.tabs.query({ active: true, lastFocusedWindow: true }) } catch {}
    if (!t || !HOST.test(t.url || "")) {
      let all = [];
      try { all = await chrome.tabs.query({ lastFocusedWindow: true }) } catch {}
      t = all.find(x => HOST.test(x.url || "")) || t;
    }
    if (!t || !HOST.test(t.url || "")) {
      let all = [];
      try { all = await chrome.tabs.query({}) } catch {}
      t = all.find(x => HOST.test(x.url || "")) || t;
    }
    tabId = t && HOST.test(t.url || "") ? t.id : null;
    return tabId;
  }

  function send(cmd, extra) {
    if (!EXT || tabId == null) return;
    try { const p = chrome.tabs.sendMessage(tabId, Object.assign({ source: UCHAN, cmd }, extra || {})); if (p && p.catch) p.catch(() => {}) } catch {}
  }

  function ping() {
    if (tabId == null) return;
    try {
      chrome.tabs.sendMessage(tabId, { source: UCHAN, cmd: "ping" }, resp => {
        void chrome.runtime.lastError;
        if (resp && resp.source === PCHAN && resp.payload) stateapply(resp.payload);
      });
    } catch {}
  }

  let livestamp = 0, cachetimer = 0;

  async function refresh() {
    if (!EXT) {loadplaceholder(); return}
    await resolveTab();
    if (tabId == null) {loadcached(() => {captured = false; render(true)}); return}
    const before = livestamp;
    ping();
    send("getstate");
    send("devget");
    clearTimeout(cachetimer);
    cachetimer = setTimeout(() => {if (livestamp === before) loadcached()}, 800);
  }

  function stateapply(p, fromcache) {
    if (!p) return;
    if (fromcache) cached = true;
    else {cached = false; livestamp = Date.now()}
    if (p.captured) captured = true; 
    
    const incoming = p.flags || {};
    if (Object.keys(incoming).length) flags = Object.assign(flags, incoming);
    source = p.source || source; overrides = p.overrides || {}; status = p.status || {};
    applied = p.applied || {}; markdirty();
    rafrender();
  }

  function loadcached(fallback) {
    const before = livestamp;
    try {
      chrome.storage.local.get(["laststate", "overrides"], r => {
        void chrome.runtime.lastError;
        if (livestamp !== before) return;
        const p = r && r.laststate;
        if (!p) {if (fallback) fallback(); return}
        if (r.overrides) p.overrides = r.overrides;
        stateapply(p, true);
      });
    } catch {if (fallback) fallback()}
  }

  function loadplaceholder() {
    captured = true; source = "placeholder";
    flags = {
      responsive_web_grok_voice_mode_enabled: false,
      responsive_web_edit_tweet_enabled: true,
      rweb_conf_only_enabled: false,
      responsive_web_api_transition_enabled: true,
      rweb_debugger_enabled: false,
      rweb_conf_dev_enabled: false,
      network_layer_503_backoff_mode: 2,
      media_async_upload_longer_video_max_video_duration: 600,
      responsive_web_grok_personality: "default",
      responsive_web_some_unknown_preview_enabled: false
    };
    overrides = {
      responsive_web_grok_voice_mode_enabled: true,
      rweb_conf_only_enabled: true,
      network_layer_503_backoff_mode: 5
    };
    devconfig = {jfDev: false, inspect: false, exposeDebug: false};
    status = {count: Object.keys(flags).length, isInstalled: true, manInstalled: true, fetchHooked: true, xhrHooked: true};
    applied = {}; markdirty(); render(); syncdev();
  }

  if (EXT) {
    chrome.runtime.onMessage.addListener(msg => {
      if (!msg || msg.source !== PCHAN) return;
      if (msg.type === "state") stateapply(msg.payload);
      else if (msg.type === "dev") { Object.assign(devconfig, msg.config || {}); if (msg.applied) applieddev = msg.applied; syncdev() }
    });
    chrome.tabs.onActivated.addListener(refresh);
    chrome.tabs.onUpdated.addListener((id, info) => { if (id === tabId && info.status === "complete") refresh() });
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", () => {if (!document.hidden) refresh()});
  }

  /*//////////////////////////////////////////////////////////////////////*/

  let knowndesc = {}, dangerknowndesc = {}, switchcfg = {}, upsellflags = [], optionsmap = {};

  // minimal jsonc
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

  async function loadconfigs() {
    if (window.twitterflagsconfigs) return window.twitterflagsconfigs;
    const get = async f => {
      try {
        const url = (EXT && chrome.runtime.getURL) ? chrome.runtime.getURL("configs/" + f) : "configs/" + f;
        return parsejsonc(await (await fetch(url)).text());
      } catch { return {} }
    };
    const [desc, switches, upsells, options] = await Promise.all([get("descriptions.jsonc"), get("switches.jsonc"), get("upsells.jsonc"), get("options.jsonc")]);
    return { desc, switches, upsells, options };
  }

  const prefixes = ["responsive_web_", "rweb_", "c9s_"];

  function descFor(name) {
    if (knowndesc[name]) return { text: knowndesc[name], auto: false };
    let s = name;
    for (const p of prefixes) { if (s.startsWith(p)) { s = s.slice(p.length); break } }
    s = s.replace(/_enabled$/, "").replace(/_/g, " ").trim();
    return { text: s, auto: true };
  }

  const dangerregex = /(_only_enabled|killswitch|_migration|api_transition|redux_use_fragment|maintenance_mode|session_binding|service_worker|503_backoff)/;
  function dangerFor(name) {
    if (dangerknowndesc[name]) return dangerknowndesc[name];
    if (dangerregex.test(name)) return "matches a risky pattern";
    return null;
  }

  /*//////////////////////////////////////////////////////////////////////*/

  const escapehtml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  function typeOf(v) {
    if (typeof v === "boolean") return "boolean";
    if (typeof v === "number") return "number";
    if (Array.isArray(v)) return "list";
    if (v && typeof v === "object") return "json";
    return "string";
  }
  function asInputValue(v) {
    if (Array.isArray(v) || (v && typeof v === "object")) return JSON.stringify(v);
    return v == null ? "" : String(v);
  }
  function parseInput(type, raw) {
    if (type === "number") { const n = Number(raw); return raw.trim() === "" || Number.isNaN(n) ? raw : n }
    if (type === "list") {
      const t = raw.trim();
      if (t.startsWith("[")) { try { return JSON.parse(t) } catch {} }
      return t === "" ? [] : t.split(",").map(x => x.trim()).filter(x => x !== "");
    }
    if (type === "json") { try { return JSON.parse(raw) } catch { return raw } }
    return raw;
  }

  /*//////////////////////////////////////////////////////////////////////*/

  const query = selector => document.querySelector(selector);
  const search = query(".search"), prefixfield = query(".prefixfield"), prefixlabel = query(".prefixlabel"), list = query(".list");
  let prefixvalue = "", prefbig = [], prefhasother = false;
  const header = query(".header"), footer = query(".footer"), reload = query(".reload"), undo = query(".undo");
  const flagcount = query(".flagcount");
  const panel = header.parentNode;

  const TICK = '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg>';
  const WARN = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M10.5 17a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m1.5-3 1 .2.3-5.7h-2.6l.3 5.7zm10.6 6.7q.6-1.2 0-2.5L14.2 3.7q-.8-1.1-2.2-1.2c-1.4-.1-1.7.5-2.2 1.2L1.4 18.2q-.6 1.3 0 2.5.8 1.3 2.2 1.3h16.8q1.5 0 2.2-1.3m-10.2-16 8.4 14.6q.1.3 0 .4 0 .2-.4.3H3.6l-.4-.3q-.1 0 0-.4l8.4-14.6.4-.2z"/></svg>';
  const UNDO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.29 2.29l1.42 1.42L5.41 6H15c3.87 0 7 3.13 7 7s-3.13 7-7 7H8v-2h7c2.76 0 5-2.24 5-5s-2.24-5-5-5H5.41l2.3 2.29-1.42 1.42L1.59 7l4.7-4.71z"/></svg>';

  // switch option icons!
  const FICONS = {
    check: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3.8a8.2 8.2 0 1 0 0 16.4 8.2 8.2 0 0 0 0-16.4M1.8 12a10.3 10.3 0 1 1 20.5 0 10.3 10.3 0 0 1-20.5 0m14.6-2.7-5.2 7.1L7 13.2l1.2-1.6 2.5 2 4-5.5z"/></svg>',
    pencil: '<svg fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M13.5 4a4.5 4.5 0 0 1 6.5 6.5l-8.8 8.7a5 5 0 0 1-3 1.4l-5.3.5.5-5.2a5 5 0 0 1 1.4-3.1zM6.2 14.2a3 3 0 0 0-.8 1.8L5 19l2.9-.3a3 3 0 0 0 1.8-.8l6.8-6.8L13 7.4zm12.3-8.7c-1-1-2.6-1-3.5 0l-.6.5L18 9.6l.5-.6c1-1 1-2.6 0-3.5" clip-rule="evenodd"/><path d="M21 21h-8.8l.4-.4 1.6-1.6H21z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12zm8.84 0l-2.3-2.29 1.42-1.42 2.29 2.3 2.29-2.3 1.42 1.42-2.3 2.29 2.3 2.29-1.42 1.42-2.29-2.3-2.29 2.3-1.42-1.42 2.3-2.29z"/></svg>',
    tick: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"/></svg>',
    compose: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M11 4.5H7.3L6 4.9a3 3 0 0 0-1.3 1.3q-.2.3-.2 1.3L4.4 10v6.7l.3 1.3q.5.8 1.3 1.3.3.2 1.3.2l2.5.1h6.7l1.3-.3a3 3 0 0 0 1.3-1.3q.2-.4.2-1.3l.1-2.5v-1h2v3.7q-.1 1-.5 2a5 5 0 0 1-2.2 2.2q-1 .4-2 .4l-2.7.1H7.2q-1-.1-2-.5A5 5 0 0 1 3 18.8q-.4-1-.4-2l-.1-2.7V7.2q.1-1 .5-2A5 5 0 0 1 5.2 3q1-.4 2-.4l2.7-.1h1z"/><path fill-rule="evenodd" d="M16.3 3.3a3.1 3.1 0 1 1 4.4 4.4l-5.5 5.5-1.3 1.2-1.1.6-1.8.3-2.7.4.4-2.7.3-1.8.6-1.1 1.2-1.3zm3 1.4q-.8-.6-1.6 0l-5.5 5.5-1 1-.3.7-.2 1.4 1.4-.2.7-.4 1-1 5.5-5.4q.6-.8 0-1.6" clip-rule="evenodd"/></svg>',
    chevron: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M3.5 9 5 7.5l7 7 7-7L20.5 9 12 17.4z"/></svg>',
    shield: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 4 5 6.6V12q.1 3.2 2.2 5 2 1.7 4.8 3.1 2.8-1.5 4.8-3.1a7 7 0 0 0 2.2-5V6.5zm-1 11v-2.2a2.5 2.5 0 1 1 2 0V15a1 1 0 0 1-2 0m10-3q-.1 4-2.8 6.3a27 27 0 0 1-5.7 3.7 1 1 0 0 1-1 0q-3-1.5-5.7-3.7A8 8 0 0 1 3 12V6.5a2 2 0 0 1 1.4-2l7-2.3h.1q.6-.3 1.1 0l7 2.4h.2A2 2 0 0 1 21 6.5z"/></svg>',
    warn: WARN
  };
  const FCOLORS = {default: "#536471", green: "#00ba7c", yellow: "#e0b219", red: "#f4212e", blue: "#1d9bf0"};
  const filters = {state: "all", type: "all", danger: "all"};

  function buildswitches() {
    const devrow = query(".row2.dev"), swrow = query(".row2.swrow"), filtrow = query(".row2.filters"), bulk = filtrow.querySelector(".bulk");
    const mk = (s, defgroup) => {
      const lbl = document.createElement("label");
      lbl.className = "checklabel";
      lbl.setAttribute("data-group", s.flag ? "flag" : defgroup);
      if (s.flag) lbl.setAttribute("data-flag", s.flag); else lbl.setAttribute("data-key", s.key);
      if (s.title) lbl.setAttribute("title", s.title);
      const box = document.createElement("span"); box.className = "checkbox"; box.innerHTML = TICK;
      lbl.appendChild(box); lbl.appendChild(document.createTextNode(s.label));
      return lbl;
    };
    const mkswitch = f => {
      const sw = document.createElement("div");
      sw.className = "fswitch"; sw.setAttribute("data-filter", f.key);
      const handle = document.createElement("div"); handle.className = "fhandle";
      sw.appendChild(handle);
      (f.options || []).forEach(o => {
        const seg = document.createElement("button");
        seg.className = "fseg"; seg.type = "button";
        seg.setAttribute("data-val", o.val);
        if (o.color) seg.setAttribute("data-color", o.color);
        const ic = (o.icon && FICONS[o.icon]) ? `<span class="fico">${FICONS[o.icon]}</span>` : "";
        seg.innerHTML = ic + `<span class="fseglbl" data-label="${escapehtml(o.label)}">${escapehtml(o.label)}</span>`;
        sw.appendChild(seg);
      });
      return sw;
    };
    (switchcfg.actions || []).forEach(a => {
      const b = document.createElement("button");
      b.className = "swbtn"; b.textContent = a.label;
      b.setAttribute("data-sw", a.action);
      if (a.title) b.setAttribute("title", a.title);
      swrow.appendChild(b);
    });
    (switchcfg.dev || []).forEach(s => (s.row === "sw" ? swrow : devrow).appendChild(mk(s, "dev")));
    (switchcfg.filters || []).forEach(f => {if (!(f.key in filters)) filters[f.key] = ((f.options || [])[0] || {}).val || "all"; filtrow.insertBefore(mkswitch(f), bulk)});
    paintswitches();
  }

  function paintchecks() {
    panel.querySelectorAll(".checklabel").forEach(lbl => {
      const grp = lbl.getAttribute("data-group");
      let on;
      if (grp === "dev") on = !!devconfig[lbl.getAttribute("data-key")];
      else if (grp === "flag") on = effective(lbl.getAttribute("data-flag")) === true;
      else return;
      lbl.querySelector(".checkbox").classList.toggle("on", on);
    });
  }

  function paintswitches() {
    query(".row2.filters").querySelectorAll(".fswitch").forEach(sw => {
      const cur = filters[sw.getAttribute("data-filter")], handle = sw.querySelector(".fhandle");
      let active = null;
      sw.querySelectorAll(".fseg").forEach(seg => {const on = seg.getAttribute("data-val") === cur; seg.classList.toggle("on", on); if (on) active = seg});
      if (active && handle) {
        handle.style.left = active.offsetLeft + "px";
        handle.style.width = active.offsetWidth + "px";
        handle.style.backgroundColor = FCOLORS[active.getAttribute("data-color")] || FCOLORS.default;
      }
    });
  }

  function bulkplan(mode) {
    const set = {}, clear = [];
    for (const name of Object.keys(flags)) {
      if (typeOf(flags[name]) !== "boolean" || dangerFor(name)) continue;
      if (mode === "reset") { if (hasoverride(name)) clear.push(name) }
      else {
        const val = mode === "on";
        if (eq(val, flags[name])) { if (hasoverride(name)) clear.push(name) }
        else set[name] = val;
      }
    }
    return {set, clear};
  }
  function applybulk(mode) {
    const {set, clear} = bulkplan(mode);
    if (!Object.keys(set).length && !clear.length) return;
    for (const k of clear) delete overrides[k];
    for (const k in set) overrides[k] = set[k];
    markdirty(); persist(); send("setmany", {set, clear}); render();
  }

  function applyupsells(mode) {
    const set = {}, clear = [];
    for (const u of upsellflags) {
      if (!u || typeof u.flag !== "string") continue;
      if (mode === "off") { overrides[u.flag] = u.off; set[u.flag] = u.off }
      else if (hasoverride(u.flag)) { delete overrides[u.flag]; clear.push(u.flag) }
    }
    if (!Object.keys(set).length && !clear.length) return;
    markdirty(); persist(); send("setmany", { set, clear }); render();
  }

  function dopagereload() {
    if (!EXT) {send("reload"); return}
    if (tabId != null) try {chrome.tabs.reload(tabId)} catch {send("reload")}
    else try {chrome.tabs.create({url: "https://x.com/"})} catch {}
  }

  // small in-panel confirm/notice overlay. position:absolute covers the panel
  // in both the extension window and the userscript drawer (.tfpanelwrap)
  let modalel = null;
  function closemodal() {if (modalel) {modalel.remove(); modalel = null}}
  function modal(message, buttons) {
    closemodal();
    modalel = document.createElement("div");
    modalel.className = "tfmodal";
    const btns = buttons.map(b => `<button class="tfmodalbtn ${b.cls || "cancel"}" type="button" data-mret="${b.ret}">${escapehtml(b.label)}</button>`).join("");
    modalel.innerHTML = `<div class="tfmodalcard"><div class="tfmodaltext">${message}</div><div class="tfmodalbtns">${btns}</div></div>`;
    modalel.addEventListener("click", ev => {
      if (ev.target === modalel) {closemodal(); return}
      const b = ev.target.closest("[data-mret]");
      if (!b) return;
      const ret = b.getAttribute("data-mret");
      closemodal();
      if (ret !== "cancel") { const fn = (buttons.find(x => x.ret === ret) || {}).onok; if (fn) fn() }
    });
    panel.appendChild(modalel);
  }
  const confirmdanger = (message, oklabel, onok) => modal(message, [{ret: "cancel", label: "cancel"}, {ret: "ok", cls: "danger", label: oklabel, onok}]);
  const notify = message => modal(message, [{ret: "cancel", label: "got it"}]);

  /*//////////////////////////////////////////////////////////////////////*/

  // isolation thing

  const ISOKEY = "twitterflags.isolation";
  let iso = null;
  function isoload() {try {iso = JSON.parse(localStorage.getItem(ISOKEY) || "null")} catch {iso = null}}
  function isosave() {try {iso ? localStorage.setItem(ISOKEY, JSON.stringify(iso)) : localStorage.removeItem(ISOKEY)} catch {}}

  function isopush(disabled, reload) {
    overrides = clone(iso.original);
    for (const k of disabled) delete overrides[k];
    markdirty(); persist(); send("syncoverrides", {overrides}); isosave();
    if (reload) setTimeout(dopagereload, 150);
  }
  function isostart() {
    const suspects = Object.keys(overrides).filter(isMod);
    if (suspects.length < 2) {notify("isolation needs at least 2 of your own changed flags to search through. flip a few flags first, then come back."); return}
    iso = {original: clone(overrides), suspects, disabled: [], step: 0, found: null, done: false};
    isonext(true);
  }
  function isonext(reload) {
    if (iso.suspects.length <= 1) {iso.done = true; iso.found = iso.suspects[0] || null; iso.disabled = []; isosave(); renderiso(); return}
    iso.step++;
    iso.disabled = iso.suspects.slice(0, Math.ceil(iso.suspects.length / 2));
    isopush(iso.disabled, reload);
    renderiso();
  }
  function isoanswer(gone) {
    if (!iso) return;
    iso.suspects = gone ? iso.disabled.slice() : iso.suspects.filter(n => !iso.disabled.includes(n));
    isonext(true);
  }
  function isofinish(keepoff) {
    if (!iso) return;
    const culprit = iso.found;
    overrides = clone(iso.original);
    if (keepoff && culprit) delete overrides[culprit];
    iso = null; isosave();
    markdirty(); persist(); send("syncoverrides", {overrides}); dopagereload();
    renderiso();
  }
  function isocancel() {
    if (!iso) return;
    overrides = clone(iso.original);
    iso = null; isosave();
    markdirty(); persist(); send("syncoverrides", {overrides}); dopagereload();
    renderiso();
  }
  function renderiso() {
    const bar = query(".isolationbar");
    if (!bar) return;
    if (!iso) {bar.hidden = true; bar.innerHTML = ""; return}
    bar.hidden = false;
    if (iso.done) {
      bar.innerHTML = iso.found
        ? `<div class="isotitle">found!</div><div class="isotext"><span class="isoflag">${escapehtml(iso.found)}</span> is likely causing issues.</div><div class="isobtns"><button class="isobtn danger" data-iso="keepoff">disable</button><button class="isobtn" data-iso="restore">restore changes</button></div>`
        : `<div class="isotitle">nothing isolated</div><div class="isotext">couldn't narrow it to a single flag.</div><div class="isobtns"><button class="isobtn" data-iso="restore">restore all my changes</button></div>`;
      return;
    }
    bar.innerHTML = `<div class="isotitle">isolation #${iso.step}</div><div class="isotext">reverted <b>${iso.disabled.length}</b> of your changed flags to default and reloaded. is the problem still happening?</div><div class="isobtns"><button class="isobtn ok" data-iso="gone">fixed</button><button class="isobtn danger" data-iso="still">broken</button><button class="isobtn" data-iso="cancel">cancel</button></div>`;
  }

  panel.addEventListener("click", e => {
    const isob = e.target.closest("[data-iso]");
    if (isob) {
      e.preventDefault();
      const a = isob.getAttribute("data-iso");
      if (a === "gone") isoanswer(true);
      else if (a === "still") isoanswer(false);
      else if (a === "cancel") isocancel();
      else if (a === "keepoff") isofinish(true);
      else if (a === "restore") isofinish(false);
      return;
    }
    if (e.target.closest("[data-isolate]")) { e.preventDefault(); isostart(); return }
    const sw = e.target.closest(".swbtn");
    if (sw) {
      e.preventDefault();
      send("sw", {action: sw.getAttribute("data-sw")});
      const orig = sw.textContent; sw.textContent = "sent";
      setTimeout(() => {sw.textContent = orig}, 900);
      return;
    }
    const up = e.target.closest("[data-upsell]");
    if (up) { e.preventDefault(); applyupsells(up.getAttribute("data-upsell")); return }
    const seg = e.target.closest(".fseg");
    if (seg) { e.preventDefault(); filters[seg.closest(".fswitch").getAttribute("data-filter")] = seg.getAttribute("data-val"); paintswitches(); render(); return }
    const bb = e.target.closest(".bulkbtn");
    if (bb) {
      e.preventDefault();
      const mode = bb.getAttribute("data-bulk");
      if (mode === "on" || mode === "off") {
        const {set, clear} = bulkplan(mode);
        const n = Object.keys(set).length + clear.length;
        if (!n) return;
        confirmdanger(`<h2 style='text-align: center'>this changes <b>${n}</b> flag${n === 1 ? "" : "s"}!</h2> flags marked as dangerous won't be enabled, but this can still break the site or log you out.`, "all " + mode, () => applybulk(mode));
      } else applybulk(mode);
      return;
    }
    const lbl = e.target.closest(".checklabel");
    if (!lbl) return;
    e.preventDefault();
    const grp = lbl.getAttribute("data-group"), k = lbl.getAttribute("data-key");
    if (grp === "dev") {devconfig[k] = !devconfig[k]; devpush(); syncdev()}
    else if (grp === "flag") {
      const f = lbl.getAttribute("data-flag");
      const base = flags[f], val = !(effective(f) === true);
      if (eq(val, base)) { delete overrides[f]; send("clear", { name: f }) }
      else { overrides[f] = val; send("set", { name: f, value: val }) }
      markdirty(); persist(); render();
    }
  });

  function syncdev() {paintchecks(); markdirty(); updateFoot()}
  const devpush = () => {send("devset", {config: devconfig}); if (EXT) try {chrome.storage.local.set({devconfig})} catch {}};
  paintchecks();

  const prefof = n => n.startsWith("responsive_web_") ? "responsive_web" : n.split("_")[0];

  const preflabel = v => v === "" ? "all prefixes" : v === "__other__" ? "(other..)" : v;
  function setprefixlabel() { if (prefixlabel) prefixlabel.textContent = preflabel(prefixvalue) }
  function preffill(counts) {
    prefbig = Object.keys(counts).filter(p => counts[p] >= 3).sort();
    prefhasother = Object.keys(counts).some(p => counts[p] <= 2);
    const valid = ["", ...prefbig, ...(prefhasother ? ["__other__"] : [])];
    if (!valid.includes(prefixvalue)) prefixvalue = "";
    setprefixlabel();
  }

  function control(name) {
    const eff = effective(name), t = typeOf(flags[name]);
    if (t === "boolean") return `<span class="checkbox${eff === true ? " on" : ""}" role="checkbox" aria-checked="${eff === true}" data-name="${escapehtml(name)}"><svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg></span>`;
    if (t === "number") return `<input type="number" class="editfield num" data-name="${escapehtml(name)}" data-type="number" value="${escapehtml(asInputValue(eff))}">`;
    return `<textarea class="editfield" data-name="${escapehtml(name)}" data-type="${t}" rows="1" spellcheck="false">${escapehtml(asInputValue(eff))}</textarea>`;
  }

  function eq(a, b) {
    if (a === b) return true;
    if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
    try { return JSON.stringify(a) === JSON.stringify(b) } catch { return false }
  }
  const isMod = name => hasoverride(name) && !eq(overrides[name], flags[name]);
  function updateFoot() { footer.classList.toggle("show", dirty && !iso) }

  let lasthtml = "";
  let lastsig = "";
  let renderraf = 0;
  function rafrender() {
    if (renderraf) return;
    const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (f => setTimeout(f, 16));
    renderraf = raf(() => {renderraf = 0; render()});
  }

  function render(noTab) {
    updateFoot();
    paintchecks();
    if (flagcount) { const n = Object.keys(flags).length; flagcount.textContent = (!noTab && captured && n) ? n + " flags" : "??? flags" }
    if (noTab) {
      lasthtml = "";
      list.innerHTML = `<div class="empty">open x.com/twitter.com first!</div>`;
      return;
    }
    if (!captured) {
      lasthtml = "";
      const s = status || {};
      list.innerHTML = `<div class="empty">no flags captured yet, try reloading the page!</div>`;
      const sb = list.querySelector(".scan");
      if (sb) sb.onclick = () => send("reload");
      return;
    }
    const names = Object.keys(flags).sort();
    const counts = {};
    for (const n of names) { const p = prefof(n); counts[p] = (counts[p] || 0) + 1 }
    const small = new Set(Object.keys(counts).filter(p => counts[p] <= 2));
    preffill(counts);
    const term = search.value.toLowerCase().trim();
    const pref = prefixvalue;
    let html = "";
    const shown = [];
    for (const name of names) {
      if (pref) { const pf = prefof(name); if (pref === "__other__" ? !small.has(pf) : pf !== pref) continue }
      const mod = isMod(name);
      const dangerinfo = dangerFor(name);
      const tp = typeOf(flags[name]);
      // state axis: all / enabled / modified / disabled
      if (filters.state === "enabled" && effective(name) !== true) continue;
      if (filters.state === "disabled" && effective(name) !== false) continue;
      if (filters.state === "modified" && !mod) continue;
      // type axis: all / checkboxes / inputs / dropdown inputs
      if (filters.type === "bool" && tp !== "boolean") continue;
      if (filters.type === "input" && tp === "boolean") continue;
      if (filters.type === "opts" && !(optionsmap[name] && optionsmap[name].length)) continue;
      // danger axis: all / safe / dangerous
      if (filters.danger === "safe" && dangerinfo) continue;
      if (filters.danger === "danger" && !dangerinfo) continue;
      const d = descFor(name);
      if (term && !(name.toLowerCase().includes(term) || d.text.toLowerCase().includes(term))) continue;
      shown.push(name);
      const meta = dangerinfo ? `<div class="meta"><span class="dangerzone">${WARN}<span>${escapehtml(dangerinfo)}</span></span></div>` : "";
      const opts = typeOf(flags[name]) !== "boolean" ? optionsmap[name] : null;
      const optsline = (opts && opts.length) ? `<div class="opts" data-name="${escapehtml(name)}">${opts.length} available option${opts.length === 1 ? "" : "s"}</div>` : "";
      const title = d.auto
        ? `<div class="name ident" data-name="${escapehtml(name)}">${escapehtml(name)}</div>`
        : `<div class="name">${escapehtml(d.text)}</div><div class="ident" data-name="${escapehtml(name)}">${escapehtml(name)}</div>`;
      html += `<div class="item${dangerinfo ? " danger" : ""}${mod ? " mod" : ""}" data-name="${escapehtml(name)}">
      <div class="info">${title}${meta}${optsline}</div>
      <div class="controls"><button class="reset${mod ? "" : " off"}" data-name="${escapehtml(name)}" title="reset to default" aria-hidden="${!mod}">${UNDO}</button>${control(name)}</div>
    </div>`;
    }
    const note = cached ? `<div class="cachednote">page is asleep or closed, showing last captured flags.. changes still save and apply on next page load</div>` : "";
    const out = note + (html || `<div class="empty center"><div class="face">:(</div><div>no matches</div></div>`);
    if (out === lasthtml) return;
    lasthtml = out;
    
    const sig = shown.join("");
    const samerows = sig === lastsig;
    lastsig = sig;
    const rawscroll = list.scrollTop;
    let anchorName = "", anchorTop = 0;
    if (!samerows) try {
      for (const it of list.querySelectorAll(".item")) {
        const top = it.offsetTop - list.scrollTop;
        if (top >= -1) { anchorName = it.getAttribute("data-name") || ""; anchorTop = top; break }
      }
    } catch {}
    list.innerHTML = out;
    if (samerows) { list.scrollTop = rawscroll; return }
    try {
      const sel = anchorName && (window.CSS && CSS.escape ? CSS.escape(anchorName) : anchorName);
      const el = sel && list.querySelector('.item[data-name="' + sel + '"]');
      if (el) list.scrollTop = el.offsetTop - anchorTop;
    } catch {}
  }

  /*//////////////////////////////////////////////////////////////////////*/

  function commit(input) {
    const name = input.getAttribute("data-name"), t = input.getAttribute("data-type");
    const val = parseInput(t, input.value);
    if (eq(val, flags[name])) { delete overrides[name]; send("clear", { name }) }
    else { overrides[name] = val; send("set", { name, value: val }) }
    markdirty(); persist(); render();
  }
  list.addEventListener("change", e => {const el = e.target.closest(".editfield"); if (el) commit(el)});
  list.addEventListener("keydown", e => {if (e.key === "Enter") {const el = e.target.closest(".editfield");
  if (el && el.tagName !== "TEXTAREA") {commit(el); e.preventDefault()}}
  if (e.key === "Escape") hidedrop()});

  /*//////////////////////////////////////////////////////////////////////*/

  let drop = null, dropfield = null, dropselect = null;
  function dropparent() { const r = list.getRootNode(); return r.host ? r : document.body }
  function ensuredrop() {
    if (drop) return drop;
    drop = document.createElement("div");
    drop.className = "optsdrop";
    drop.addEventListener("mousedown", e => {
      const it = e.target.closest(".optsitem");
      if (!it) return;
      e.preventDefault();
      const v = it.getAttribute("data-val"), fn = dropselect;
      hidedrop();
      if (fn) fn(v);
    });
    dropparent().appendChild(drop);
    return drop;
  }
  function paintdrop(items, current) {
    let html = "";
    for (const o of items) {
      const val = String(o.val), label = o.label != null ? String(o.label) : val, desc = o.desc || "";
      html += `<div class="optsitem${val === current ? " sel" : ""}" data-val="${escapehtml(val)}"><span class="optsval">${escapehtml(label)}</span>${desc ? `<span class="optsdesc">${escapehtml(desc)}</span>` : ""}</div>`;
    }
    ensuredrop().innerHTML = html || `<div class="optsempty">no match</div>`;
  }
  function optsfor(field) { const n = field && field.getAttribute("data-name"); const o = n && optionsmap[n]; return (o && o.length) ? o : null }
  function filldrop(field, dofilter) {
    const opts = optsfor(field); if (!opts) return false;
    const cur = field.value.trim(), curl = cur.toLowerCase();
    const items = [];
    for (const o of opts) {
      const s = String(o && typeof o === "object" ? o.val : o);
      const desc = (o && typeof o === "object" && o.desc) ? o.desc : "";
      if (dofilter && curl && s.toLowerCase().indexOf(curl) < 0 && desc.toLowerCase().indexOf(curl) < 0) continue;
      items.push({val: s, desc});
    }
    paintdrop(items, cur);
    return true;
  }
  function positiondrop(field) {
    const d = ensuredrop(), r = field.getBoundingClientRect();
    d.style.minWidth = r.width + "px";
    let left = r.left;
    if (left + d.offsetWidth > window.innerWidth - 8) left = Math.max(8, window.innerWidth - 8 - d.offsetWidth);
    d.style.left = left + "px";
    d.style.top = ""; d.style.bottom = "";
    const room = window.innerHeight - r.bottom;
    if (d.offsetHeight > room - 8 && r.top > room) d.style.bottom = (window.innerHeight - r.top + 4) + "px";
    else d.style.top = (r.bottom + 4) + "px";
  }
  function showdrop(field) {
    dropfield = field;
    dropselect = v => { field.value = v; commit(field) };
    if (!filldrop(field, false)) { hidedrop(); return }
    ensuredrop().style.display = "block";
    positiondrop(field);
  }
  function hidedrop() { if (drop) drop.style.display = "none"; dropfield = null; dropselect = null }

  const prefixopen = () => !!(drop && drop.style.display === "block" && dropfield === null);
  function openprefix() {
    const items = [{val: "", label: "all prefixes"}, ...prefbig.map(p => ({val: p, label: p})), ...(prefhasother ? [{val: "__other__", label: "(other...)"}] : [])];
    dropfield = null;
    dropselect = v => { if (v !== prefixvalue) {prefixvalue = v; setprefixlabel(); render()} };
    paintdrop(items, prefixvalue);
    ensuredrop().style.display = "block";
    positiondrop(prefixfield);
  }
  prefixfield.addEventListener("mousedown", () => {if (prefixopen()) hidedrop(); else openprefix()});
  prefixfield.addEventListener("keydown", e => {
    if (e.key === "Escape") hidedrop();
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (prefixopen()) hidedrop(); else openprefix() }
  });
  prefixfield.addEventListener("focusout", () => setTimeout(() => {if (dropfield === null) hidedrop()}, 120));

  list.addEventListener("focusin", e => {const el = e.target.closest(".editfield"); if (el) showdrop(el)});
  list.addEventListener("focusout", e => {const el = e.target.closest(".editfield"); if (el) setTimeout(() => {if (list.getRootNode().activeElement !== el) hidedrop()}, 120)});
  list.addEventListener("input", e => {const el = e.target.closest(".editfield"); if (el && dropfield === el) {filldrop(el, true); positiondrop(el)}});
  list.addEventListener("scroll", () => {if (dropfield) hidedrop()});

  list.addEventListener("click", e => {
    const cb = e.target.closest(".checkbox");
    
    if (cb) { const n = cb.getAttribute("data-name");
    const base = flags[n], val = !(effective(n) === true);
    if (eq(val, base)) { delete overrides[n]; send("clear", {name: n}) }
    else { overrides[n] = val; send("set", {name: n, value: val}) }
    markdirty(); persist(); render(); return }
    const resetbtn = e.target.closest(".reset");

    if (resetbtn) {
      const n = resetbtn.getAttribute("data-name");
      delete overrides[n]; markdirty(); persist(); send("clear", {name: n}); render(); return
    }
    const optsel = e.target.closest(".opts");
    if (optsel) { const it = optsel.closest(".item"); const f = it && it.querySelector(".editfield"); if (f) f.focus(); return }
    const id = e.target.closest(".ident");

    if (id) {
      const n = id.getAttribute("data-name");
      try {navigator.clipboard.writeText(n)} catch {}
      if (!id.querySelector(".copied")) { const c = document.createElement("span"); 
      c.className = "copied"; c.textContent = "copied"; 
      id.appendChild(c); setTimeout(() => c.remove(), 900) }
    }
  });

  search.oninput = () => rafrender();
  reload.onclick = () => dopagereload();
  undo.onclick = () => {
    overrides = clone(applied);
    let devchanged = false;
    for (const k of DEVPERSIST) { const base = !!(applieddev && applieddev[k]); if (!!devconfig[k] !== base) {devconfig[k] = base; devchanged = true} }
    markdirty(); persist(); send("syncoverrides", {overrides});
    if (devchanged) devpush();
    render();
  };

  loadconfigs().then(cfg => {
    knowndesc = (cfg.desc && cfg.desc.known) || {};
    dangerknowndesc = (cfg.desc && cfg.desc.danger) || {};
    switchcfg = cfg.switches || {};
    upsellflags = Object.values(cfg.upsells || {}).filter(Array.isArray).flat();
    optionsmap = (cfg.options && typeof cfg.options === "object") ? cfg.options : {};

    buildswitches(); paintchecks();
    isoload(); renderiso(); refresh();

    setTimeout(paintswitches, 400);
    try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(paintswitches) } catch {}
    window.addEventListener("resize", paintswitches);
  });

})();
