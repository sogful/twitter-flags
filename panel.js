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
    try { chrome.tabs.sendMessage(tabId, Object.assign({ source: UCHAN, cmd }, extra || {})) } catch {}
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
  const search = query(".search"), prefixselect = query(".prefixselect"), list = query(".list");
  const header = query(".header"), footer = query(".footer"), reload = query(".reload"), undo = query(".undo");
  const flagcount = query(".flagcount");

  const TICK = '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg>';
  const WARN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 17c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm1.5-3c.5 0 1 .2 1 .2l.25-5.7h-2.5l.25 5.7s.5-.2 1-.2zm10.568 6.745c.451-.783.45-1.717-.002-2.496l-8.4-14.511C13.712 2.957 12.903 2.49 12 2.49s-1.711.467-2.165 1.249l-8.4 14.509c-.453.78-.454 1.714-.002 2.497C1.886 21.531 2.696 22 3.6 22h16.8c.905 0 1.715-.469 2.168-1.255zM12.435 4.741l8.4 14.511c.125.214.053.402 0 .495-.044.076-.174.253-.435.253H3.6c-.261 0-.391-.177-.435-.253-.053-.093-.125-.281 0-.495l8.4-14.51c.131-.228.348-.252.435-.252s.304.024.435.251z"/></svg>';
  const UNDO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.29 2.29l1.42 1.42L5.41 6H15c3.87 0 7 3.13 7 7s-3.13 7-7 7H8v-2h7c2.76 0 5-2.24 5-5s-2.24-5-5-5H5.41l2.3 2.29-1.42 1.42L1.59 7l4.7-4.71z"/></svg>';

  // switch option icons!
  const FICONS = {
    check: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12zM16.4 9.28l-5.21 7.15-4.1-3.27 1.25-1.57 2.47 1.98 3.97-5.47 1.62 1.18z"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.543 4.04275C15.3142 2.27164 18.1858 2.27164 19.957 4.04275C21.7282 5.81396 21.7282 8.68558 19.957 10.4568L11.2314 19.1834C10.4044 20.0104 9.31319 20.5208 8.14844 20.6267L2.89551 21.1043L3.37305 15.8513C3.47901 14.6866 3.99039 13.5953 4.81738 12.7683L13.543 4.04275ZM6.23145 14.1824C5.73525 14.6786 5.42881 15.3341 5.36523 16.033L5.10449 18.8943L7.9668 18.6346C8.66565 18.571 9.32019 18.2645 9.81641 17.7683L16.585 10.9988L13 7.41385L6.23145 14.1824ZM18.543 5.45682C17.5528 4.46675 15.9472 4.46675 14.957 5.45682L14.4141 5.99979L17.999 9.58475L18.543 9.04275C19.5331 8.05257 19.5331 6.44698 18.543 5.45682Z" fill-rule="evenodd" clip-rule="evenodd"/><path d="M21 20.9998H12.207C12.3582 20.8723 12.5047 20.7382 12.6455 20.5974L14.2432 18.9998H21V20.9998Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12zm8.84 0l-2.3-2.29 1.42-1.42 2.29 2.3 2.29-2.3 1.42 1.42-2.3 2.29 2.3 2.29-1.42 1.42-2.29-2.3-2.29 2.3-1.42-1.42 2.3-2.29z"/></svg>',
    tick: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"/></svg>',
    compose: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.938 4.5H9.9c-1.136 0-1.929 0-2.546.05-.605.05-.953.143-1.216.277-.564.288-1.023.747-1.31 1.31-.135.264-.228.612-.277 1.218C4.5 7.97 4.5 8.765 4.5 9.9v4.2c0 1.136 0 1.929.05 2.546.05.605.143.953.277 1.216.288.565.747 1.023 1.31 1.31.264.135.612.228 1.217.277.617.05 1.41.051 2.546.051h4.2c1.136 0 1.929 0 2.545-.05.606-.05.954-.143 1.217-.277.565-.288 1.023-.746 1.31-1.31.135-.264.228-.612.277-1.217.05-.617.051-1.41.051-2.546v-1.037h2V14.1c0 1.103.001 1.992-.058 2.709-.06.728-.185 1.368-.487 1.96-.48.941-1.245 1.707-2.185 2.186-.593.302-1.233.428-1.961.488-.718.058-1.606.057-2.71.057H9.9c-1.103 0-1.991.001-2.709-.058-.728-.06-1.368-.185-1.96-.487-.941-.48-1.707-1.245-2.186-2.185-.302-.593-.428-1.233-.487-1.961-.059-.718-.058-1.606-.058-2.71V9.9c0-1.103-.001-1.991.058-2.709.06-.728.185-1.368.487-1.96.48-.941 1.245-1.707 2.185-2.186.593-.302 1.233-.428 1.961-.487.718-.059 1.606-.058 2.71-.058h1.037v2z"/><path d="M16.293 3.293c1.219-1.219 3.195-1.219 4.414 0 1.219 1.219 1.219 3.195 0 4.414l-5.491 5.491c-.533.533-.89.896-1.31 1.179-.356.24-.742.433-1.148.574-.478.167-.983.234-1.729.341l-2.708.387.387-2.708c.107-.746.174-1.25.34-1.729.142-.405.335-.792.575-1.148.283-.42.646-.777 1.179-1.31l5.491-5.491zm3 1.414c-.438-.438-1.148-.438-1.586 0l-5.491 5.491c-.587.587-.784.79-.934 1.013-.144.214-.26.445-.345.688-.088.254-.131.533-.248 1.354l-.01.067.068-.008c.82-.118 1.1-.161 1.354-.25.243-.084.474-.2.688-.344.223-.15.426-.347 1.013-.934l5.491-5.491c.438-.438.438-1.148 0-1.586z" fill-rule="evenodd" clip-rule="evenodd"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.057L5 6.464v5.448c0 2.165.851 3.687 2.188 4.952 1.275 1.208 2.965 2.155 4.812 3.154 1.847-1 3.537-1.946 4.813-3.154C18.148 15.6 19 14.077 19 11.912V6.464zM11 15v-2.21c-.882-.386-1.5-1.265-1.5-2.29C9.5 9.12 10.62 8 12 8s2.5 1.12 2.5 2.5c0 1.025-.618 1.904-1.5 2.29V15c0 .552-.448 1-1 1s-1-.448-1-1zm10-3.088c0 2.807-1.149 4.83-2.813 6.405-1.615 1.53-3.745 2.66-5.712 3.72-.297.16-.653.16-.95 0-1.967-1.06-4.097-2.19-5.713-3.72C4.15 16.742 3 14.72 3 11.912V6.464c0-.854.542-1.614 1.35-1.892l7-2.406.16-.047c.375-.095.772-.08 1.14.047l7 2.406.149.058C20.524 4.945 21 5.663 21 6.464z"/></svg>',
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
    header.querySelectorAll(".checklabel").forEach(lbl => {
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

  function bulksafe(mode) {
    const set = {}, clear = [];
    for (const name of Object.keys(flags)) {
      if (typeOf(flags[name]) !== "boolean" || dangerFor(name)) continue;
      if (mode === "reset") { if (hasoverride(name)) { delete overrides[name]; clear.push(name) } }
      else {
        const val = mode === "on";
        if (eq(val, flags[name])) { if (hasoverride(name)) { delete overrides[name]; clear.push(name) } }
        else { overrides[name] = val; set[name] = val }
      }
    }
    if (!Object.keys(set).length && !clear.length) return;
    markdirty(); persist(); send("setmany", { set, clear }); render();
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

  header.addEventListener("click", e => {
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
    if (bb) { e.preventDefault(); bulksafe(bb.getAttribute("data-bulk")); return }
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

  function preffill(counts) {
    const cur = prefixselect.value;
    const big = Object.keys(counts).filter(p => counts[p] >= 3).sort();
    const opts = ["", ...big];
    if (Object.keys(counts).some(p => counts[p] <= 2)) opts.push("__other__");
    prefixselect.innerHTML = opts.map(o => `<option value="${o}">${o === "" ? "all prefixes" : o === "__other__" ? "(other...)" : o}</option>`).join("");
    prefixselect.value = opts.includes(cur) ? cur : "";
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
  function updateFoot() { footer.classList.toggle("show", dirty) }

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
    const pref = prefixselect.value;
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
    // same rows in the same order (just a flag's state flipped) -> geometry is
    // identical, so keep the exact scroll. anchoring via offsetTop drifts here
    // because content-visibility:auto sizes offscreen items from the estimate
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

  let drop = null, dropfield = null;
  function dropparent() { const r = list.getRootNode(); return r.host ? r : document.body }
  function ensuredrop() {
    if (drop) return drop;
    drop = document.createElement("div");
    drop.className = "optsdrop";
    drop.addEventListener("mousedown", e => {
      const it = e.target.closest(".optsitem");
      if (!it || !dropfield) return;
      e.preventDefault();
      dropfield.value = it.getAttribute("data-val");
      commit(dropfield);
      hidedrop();
    });
    dropparent().appendChild(drop);
    return drop;
  }
  function optsfor(field) { const n = field && field.getAttribute("data-name"); const o = n && optionsmap[n]; return (o && o.length) ? o : null }
  function filldrop(field, dofilter) {
    const opts = optsfor(field); if (!opts) return false;
    const cur = field.value.trim(), curl = cur.toLowerCase();
    let html = "";
    for (const o of opts) {
      const s = String(o && typeof o === "object" ? o.val : o);
      const desc = (o && typeof o === "object" && o.desc) ? o.desc : "";
      if (dofilter && curl && s.toLowerCase().indexOf(curl) < 0 && desc.toLowerCase().indexOf(curl) < 0) continue;
      html += `<div class="optsitem${s === cur ? " sel" : ""}" data-val="${escapehtml(s)}"><span class="optsval">${escapehtml(s)}</span>${desc ? `<span class="optsdesc">${escapehtml(desc)}</span>` : ""}</div>`;
    }
    ensuredrop().innerHTML = html || `<div class="optsempty">no match</div>`;
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
    if (!filldrop(field, false)) { hidedrop(); return }
    dropfield = field;
    ensuredrop().style.display = "block";
    positiondrop(field);
  }
  function hidedrop() { if (drop) drop.style.display = "none"; dropfield = null }

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

  search.oninput = () => rafrender(); prefixselect.onchange = () => render();
  reload.onclick = () => {
    if (!EXT) {send("reload"); return}
    if (tabId != null) try {chrome.tabs.reload(tabId)} catch {send("reload")}
    else try {chrome.tabs.create({url: "https://x.com/"})} catch {}
  };
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
    buildswitches();
    paintchecks();
    refresh();
    setTimeout(paintswitches, 400);
    try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(paintswitches) } catch {}
    window.addEventListener("resize", paintswitches);
  });

})();
