const mobile = /android|mobile/i.test((typeof navigator !== "undefined" && navigator.userAgent) || "");

// desktop chrome
if (!mobile && typeof chrome !== "undefined" && chrome.sidePanel) {
  const setbehavior = () => chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch(() => {});
  chrome.runtime.onInstalled.addListener(setbehavior);
  setbehavior();
}

// desktop firefox
else if (!mobile && typeof browser !== "undefined" && browser.sidebarAction && browser.action) {
  browser.action.onClicked.addListener(() => browser.sidebarAction.toggle());
}

// mobile (kiwi, firefox etc..)
else {
  const api = typeof browser !== "undefined" ? browser : chrome;
  const setpopup = () => {try {const p = api.action.setPopup({popup: "panel.html"}); if (p && p.catch) p.catch(() => {})} catch {}};
  api.runtime.onInstalled.addListener(setpopup);
  setpopup();
  api.action.onClicked.addListener(() => {try {api.tabs.create({url: api.runtime.getURL("panel.html")})} catch {}});
}

/*//////////////////////////////////////////////////////////////////////*/

const clientrule = {
  id: 1,
  priority: 1,
  action: {
    type: "redirect",
    redirect: {regexSubstitution: "https://x.com/i/oauth2/authorize#twitterflags-path=\\1"}
  },
  condition: {
    regexFilter: "^https://x\\.com(/(?:home|explore|notifications|i/bookmarks|i/lists)?(?:\\?[^#]*)?)$",
    resourceTypes: ["main_frame"],
    requestMethods: ["get"]
  }
};

if (typeof chrome !== "undefined" && chrome.declarativeNetRequest) {
  const rules = chrome.declarativeNetRequest;
  const bypassrule = {
    id: 2,
    priority: 2,
    action: {type: "allow"},
    condition: {urlFilter: "||x.com^*twitterflags-default=1", resourceTypes: ["main_frame"]}
  };

  chrome.runtime.onMessage.addListener((message, sender, reply) => {
    if (message?.source !== "twitterflagspanel" || message.cmd !== "clientpreference") return;
    const settings = sender.url === chrome.runtime.getURL("panel.html");
    const reading = message.enabled === undefined && sender.tab && sender.url?.startsWith("https://x.com/");
    if (!settings && !reading) return;
    const update = async () => {
      if (typeof message.enabled === "boolean") {
        await rules.updateDynamicRules({
          removeRuleIds: [clientrule.id, bypassrule.id],
          addRules: message.enabled ? [clientrule, bypassrule] : []
        });
      }
      const current = await rules.getDynamicRules();
      return {enabled: current.some(rule => rule.id === clientrule.id)};
    };
    update().then(reply, () => reply({error: "could not save client preference"}));
    return true;
  });
}
