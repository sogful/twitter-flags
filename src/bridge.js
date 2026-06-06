(function () {
  "use strict";

  const PCHAN = "twitterflagspage", UCHAN = "twitterflagspanel";
  let last = null;

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    const d = e.data;
    if (!d || d.source !== PCHAN) return;
    if (d.type === "state") last = d;
    try {chrome.runtime.sendMessage(d).catch(() => {})} catch { }
  });

  chrome.runtime.onMessage.addListener((msg, sender, reply) => {
    if (!msg || msg.source !== UCHAN) return;
    if (msg.cmd === "ping") {reply(last); return true}
    try {window.postMessage(msg, location.origin)} catch { }
    return false;
  });

  try {window.postMessage({source: UCHAN, cmd: "getstate"}, location.origin)} catch { }

})();
