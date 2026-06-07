chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch(() => {});
});
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch(() => {});