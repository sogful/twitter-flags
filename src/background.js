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
