(function () {
  "use strict";

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
  let last = null;
  let syncedoverrides = null, synceddev = null;

  const post = m => {try {window.postMessage(m, location.origin)} catch {}};

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.source !== PCHAN) return;
    if (d.type === "state") {
      last = d;
      if (d.payload && d.payload.overrides) {
        syncedoverrides = JSON.stringify(d.payload.overrides);
        try {chrome.storage.local.set({overrides: d.payload.overrides, laststate: d.payload})} catch {}
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
        if (r.overrides) {
          const j = JSON.stringify(r.overrides);
          if (j !== syncedoverrides) {syncedoverrides = j; post({source: UCHAN, cmd: "syncoverrides", overrides: r.overrides})}
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
