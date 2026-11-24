(function () {
  "use strict";

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
  let last = null;
  let syncedoverrides = null, synceddev = null;
  let checkingclient = false;

  const post = m => {try {window.postMessage(m, location.origin)} catch {}};

  async function checkclient() {
    if (checkingclient || location.origin !== "https://x.com") return;
    const target = new URL(location.href);
    if (target.searchParams.has("twitterflags-default") ||
        /^\/(?:i\/(?:oauth|flow)|login|logout|account|intent|oauth|legal|privacy|tos)(?:\/|$)/i.test(target.pathname)) return;
    checkingclient = true;
    try {
      const preference = await chrome.runtime.sendMessage({source: UCHAN, cmd: "clientpreference"});
      if (!preference?.enabled) return;
      const deadline = Date.now() + 6000;
      const tryswitch = () => {
        if (Date.now() >= deadline || last?.payload?.client !== "old" || location.href !== target.href) return;
        const shell = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"],[data-testid="SideNav_NewTweet_Button"]');
        if (!shell) {setTimeout(tryswitch, 120); return}
        const path = target.pathname + target.search + target.hash;
        const previous = Number(sessionStorage.getItem("twitterflags.clientattempt"));
        if (Date.now() - previous < 15000) return;
        sessionStorage.setItem("twitterflags.clientattempt", String(Date.now()));
        location.replace("https://x.com/i/oauth2/authorize#twitterflags=" + encodeURIComponent(path));
      };
      tryswitch();
    } catch {}
  }

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.source !== PCHAN) return;
    if (d.type === "state") {
      last = d;
      if (d.payload?.client === "old") void checkclient();
      if (d.payload?.client === "new" && location.pathname !== "/i/oauth2/authorize") {
        try {sessionStorage.removeItem("twitterflags.clientattempt")} catch {}
      }
      if (d.payload && d.payload.overrides) {
        const current = JSON.stringify(d.payload.overrides);
        if (syncedoverrides !== null && current !== syncedoverrides && d.payload.dirty) {
          syncedoverrides = current;
          try {chrome.storage.local.set({overrides: d.payload.overrides})} catch {}
        }
        if (d.payload.captured) {
          try {chrome.storage.local.set({laststate: d.payload})} catch {}
        }
      }
    }
    else if (d.type === "dev" && d.config) {
      synceddev = JSON.stringify(d.config);
      try {chrome.storage.local.set({devconfig: d.config})} catch {}
    }
    try {chrome.runtime.sendMessage(d).catch(() => {})} catch {}
  });

  chrome.runtime.onMessage.addListener((msg, sender, reply) => {
    if (!msg || msg.source !== UCHAN) return;
    if (msg.cmd === "ping") {reply(last); return true}
    post(msg);
    return false;
  });

  function syncfromstorage() {
    try {
      chrome.storage.local.get(["overrides", "devconfig"], r => {
        void chrome.runtime.lastError;
        if (!r) return;
        const overrides = r.overrides || {};
        const j = JSON.stringify(overrides);
        if (j !== syncedoverrides) {
          syncedoverrides = j;
          if (r.overrides) post({source: UCHAN, cmd: "syncoverrides", overrides});
        }
        if (r.devconfig) {
          const j = JSON.stringify(r.devconfig);
          if (j !== synceddev) {synceddev = j; post({source: UCHAN, cmd: "devset", config: r.devconfig})}
        }
      });
    } catch {}
  }

  syncfromstorage();
  window.addEventListener("pageshow", syncfromstorage);
  document.addEventListener("visibilitychange", () => {if (document.visibilityState === "visible") syncfromstorage()});

  post({source: UCHAN, cmd: "getstate"});

})();
