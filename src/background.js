// chrome
if (typeof chrome !== "undefined" && chrome.sidePanel) {
  const setbehavior = () => chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch(() => {});
  chrome.runtime.onInstalled.addListener(setbehavior);
  setbehavior();
}

// firefox
else if (typeof browser !== "undefined" && browser.sidebarAction && browser.action) {
  browser.action.onClicked.addListener(() => browser.sidebarAction.toggle());
}
