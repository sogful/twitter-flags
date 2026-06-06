(function () {
  "use strict";

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
  const HOST = /^https:\/\/(x|twitter)\.com\//;
  const EXT = typeof chrome !== "undefined" && !!(chrome.runtime && chrome.runtime.onMessage && chrome.tabs);

  let captured = false, source = "none", dirty = false;
  let flags = {}, overrides = {}, status = {};
  let devconfig = { jfDev: false, inspect: false };
  const hasOverride = k => Object.prototype.hasOwnProperty.call(overrides, k);
  const effective = k => (hasOverride(k) ? overrides[k] : flags[k]);

  /*//////////////////////////////////////////////////////////////////////*/

  let tabId = null;

  async function resolveTab() {
    let t;
    try { [t] = await chrome.tabs.query({ active: true, lastFocusedWindow: true }) } catch { }
    if (!t || !HOST.test(t.url || "")) {
      let all = [];
      try { all = await chrome.tabs.query({ lastFocusedWindow: true }) } catch { }
      t = all.find(x => HOST.test(x.url || "")) || t;
    }
    tabId = t && HOST.test(t.url || "") ? t.id : null;
    return tabId;
  }

  function send(cmd, extra) {
    if (!EXT || tabId == null) return;
    try { chrome.tabs.sendMessage(tabId, Object.assign({ source: UCHAN, cmd }, extra || {})) } catch { }
  }

  function ping() {
    if (tabId == null) return;
    try {
      chrome.tabs.sendMessage(tabId, { source: UCHAN, cmd: "ping" }, resp => {
        void chrome.runtime.lastError;
        if (resp && resp.source === PCHAN && resp.payload) applyState(resp.payload);
      });
    } catch { }
  }

  async function refresh() {
    if (!EXT) { loadplaceholder(); return }
    await resolveTab();
    if (tabId == null) {captured = false; render(true); return}
    ping();
    send("getstate");
    send("devget");
  }

  function applyState(p) {
    captured = !!p.captured; source = p.source || "none"; dirty = !!p.dirty;
    flags = p.flags || {}; overrides = p.overrides || {}; status = p.status || {};
    render();
  }

  function loadplaceholder() {
    captured = true; source = "placeholder"; dirty = true;
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
    render(); syncdev();
  }

  if (EXT) {
    chrome.runtime.onMessage.addListener(msg => {
      if (!msg || msg.source !== PCHAN) return;
      if (msg.type === "state") applyState(msg.payload);
      else if (msg.type === "dev") { Object.assign(devconfig, msg.config || {}); syncdev() }
    });
    chrome.tabs.onActivated.addListener(refresh);
    chrome.tabs.onUpdated.addListener((id, info) => { if (id === tabId && info.status === "complete") refresh() });
    window.addEventListener("focus", refresh);
  }

  /*//////////////////////////////////////////////////////////////////////*/

  // cosmetic metadata from configs/descriptions.js; fall back to empty so a
  // missing/unloaded config degrades to auto descriptions instead of blanking ui
  const knowndesc = window.twitterflagsknowndesc || {};
  const dangerknowndesc = window.twitterflagsdangerdesc || {};

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
      if (t.startsWith("[")) { try { return JSON.parse(t) } catch { } }
      return t === "" ? [] : t.split(",").map(x => x.trim()).filter(x => x !== "");
    }
    if (type === "json") { try { return JSON.parse(raw) } catch { return raw } }
    return raw;
  }

  /*//////////////////////////////////////////////////////////////////////*/

  const query = selector => document.querySelector(selector);
  const search = query(".search"), prefixselect = query(".prefixselect"), list = query(".list");
  const header = query(".header"), footer = query(".footer"), reload = query(".reload"), undo = query(".undo");

  const TICK = '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></g></svg>';
  const WARN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 18.25l-8.4-14.51c-.96-1.66-3.36-1.66-4.32 0l-8.4 14.51C.47 19.91 1.68 22 3.6 22h16.8c1.92 0 3.13-2.09 2.16-3.75zM13.25 8.5L13 14.2s-.5-.2-1-.2-1 .2-1 .2l-.25-5.7h2.5zM12 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>';
  const UNDO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.29 2.29l1.42 1.42L5.41 6H15c3.87 0 7 3.13 7 7s-3.13 7-7 7H8v-2h7c2.76 0 5-2.24 5-5s-2.24-5-5-5H5.41l2.3 2.29-1.42 1.42L1.59 7l4.7-4.71z"/></svg>';

  const filters = {true: false, safe: false, danger: false, mod: false};

  header.querySelectorAll(".checklabel").forEach(lbl => {
    const box = document.createElement("span");
    box.className = "checkbox"; box.innerHTML = TICK;
    lbl.insertBefore(box, lbl.firstChild);
  });
  function paintchecks() {
    header.querySelectorAll(".checklabel").forEach(lbl => {
      const grp = lbl.getAttribute("data-group"), k = lbl.getAttribute("data-key");
      let on;
      if (grp === "dev") on = !!devconfig[k];
      else if (grp === "flag") on = effective(lbl.getAttribute("data-flag")) === true;
      else on = !!filters[k];
      lbl.querySelector(".checkbox").classList.toggle("on", on);
    });
  }
  // bulk-toggle every safe (non-danger) boolean flag as a throwaway profile; leaves
  // dangerous flags and non-boolean (number/string/list) values untouched so your
  // tuned/risky settings survive. "reset" clears only the safe overrides.
  function bulkSafe(mode) {
    const set = {}, clear = [];
    for (const name of Object.keys(flags)) {
      if (typeOf(flags[name]) !== "boolean" || dangerFor(name)) continue;
      if (mode === "reset") { if (hasOverride(name)) { delete overrides[name]; clear.push(name) } }
      else { const val = mode === "on"; overrides[name] = val; set[name] = val }
    }
    if (!Object.keys(set).length && !clear.length) return;
    dirty = true; send("setmany", { set, clear }); render();
  }
  header.addEventListener("click", e => {
    const bb = e.target.closest(".bulkbtn");
    if (bb) { e.preventDefault(); bulkSafe(bb.getAttribute("data-bulk")); return }
    const lbl = e.target.closest(".checklabel");
    if (!lbl) return;
    e.preventDefault();
    const grp = lbl.getAttribute("data-group"), k = lbl.getAttribute("data-key");
    if (grp === "dev") {devconfig[k] = !devconfig[k]; paintchecks(); pushDev()}
    else if (grp === "flag") {
      const f = lbl.getAttribute("data-flag");
      if (effective(f) === true) { delete overrides[f]; send("clear", { name: f }) }
      else { overrides[f] = true; send("set", { name: f, value: true }) }
      dirty = true; render();
    }
    else {filters[k] = !filters[k]; paintchecks(); render()}
  });
  function syncdev() { paintchecks() }
  const pushDev = () => send("devset", { config: devconfig });
  paintchecks();

  const prefixOf = n => n.startsWith("responsive_web_") ? "responsive_web" : n.split("_")[0];

  function fillPrefixes(counts) {
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
  const isMod = name => hasOverride(name) && !eq(overrides[name], flags[name]);

  function updateFoot() { footer.hidden = !dirty }

  function render(noTab) {
    updateFoot();
    paintchecks();
    if (noTab) {
      list.innerHTML = `<div class="empty">open x.com/twitter.com first!</div>`;
      return;
    }
    if (!captured) {
      const s = status || {};
      list.innerHTML = `<div class="empty">no flags captured yet, try reloading the page!</div>`;
      const sb = list.querySelector(".scan");
      if (sb) sb.onclick = () => send("reload");
      return;
    }
    const names = Object.keys(flags).sort();
    const counts = {};
    for (const n of names) { const p = prefixOf(n); counts[p] = (counts[p] || 0) + 1 }
    const small = new Set(Object.keys(counts).filter(p => counts[p] <= 2));
    fillPrefixes(counts);
    const term = search.value.toLowerCase().trim();
    const pref = prefixselect.value;
    let html = "";
    for (const name of names) {
      if (pref) { const pf = prefixOf(name); if (pref === "__other__" ? !small.has(pf) : pf !== pref) continue }
      if (filters.true && effective(name) !== true) continue;
      const mod = isMod(name);
      if (filters.mod && !mod) continue;
      const dangerinfo = dangerFor(name);
      if (filters.danger && !dangerinfo) continue;
      if (filters.safe && dangerinfo) continue;
      const d = descFor(name);
      if (term && !(name.toLowerCase().includes(term) || d.text.toLowerCase().includes(term))) continue;
      const meta = dangerinfo ? `<div class="meta"><span class="dangerzone">${WARN}<span>${escapehtml(dangerinfo)}</span></span></div>` : "";
      const title = d.auto
        ? `<div class="name ident" data-name="${escapehtml(name)}">${escapehtml(name)}</div>`
        : `<div class="name">${escapehtml(d.text)}</div><div class="ident" data-name="${escapehtml(name)}">${escapehtml(name)}</div>`;
      html += `<div class="item${dangerinfo ? " danger" : ""}${mod ? " mod" : ""}">
      <div class="info">${title}${meta}</div>
      <div class="controls"><button class="reset${mod ? "" : " off"}" data-name="${escapehtml(name)}" title="reset to default" aria-hidden="${!mod}">${UNDO}</button>${control(name)}</div>
    </div>`;
    }
    list.innerHTML = html || `<div class="empty center"><div class="face">:(</div><div>no matches</div></div>`;
  }

  /*//////////////////////////////////////////////////////////////////////*/

  function commit(input) {
    const name = input.getAttribute("data-name"), t = input.getAttribute("data-type");
    const val = parseInput(t, input.value);
    overrides[name] = val; dirty = true; send("set", { name, value: val }); render();
  }
  list.addEventListener("change", e => { const el = e.target.closest(".editfield"); if (el) commit(el) });
  list.addEventListener("keydown", e => { if (e.key === "Enter") { const el = e.target.closest(".editfield"); if (el && el.tagName !== "TEXTAREA") { commit(el); e.preventDefault() } } });
  list.addEventListener("click", e => {
    const cb = e.target.closest(".checkbox");
    if (cb) { const n = cb.getAttribute("data-name"); const val = !(effective(n) === true); overrides[n] = val; dirty = true; send("set", { name: n, value: val }); render(); return }
    const resetbtn = e.target.closest(".reset");
    if (resetbtn) { const n = resetbtn.getAttribute("data-name"); delete overrides[n]; dirty = true; send("clear", { name: n }); render(); return }
    const id = e.target.closest(".ident");
    if (id) {
      const n = id.getAttribute("data-name");
      try { navigator.clipboard.writeText(n) } catch { }
      if (!id.querySelector(".copied")) { const c = document.createElement("span"); c.className = "copied"; c.textContent = "copied"; id.appendChild(c); setTimeout(() => c.remove(), 900) }
    }
  });

  search.oninput = () => render(); prefixselect.onchange = () => render();
  reload.onclick = () => send("reload");
  undo.onclick = () => { overrides = {}; dirty = true; send("clearall"); render() };
  refresh();

})();
