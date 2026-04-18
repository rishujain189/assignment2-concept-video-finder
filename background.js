chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  chrome.contextMenus.create({
    id: "find-video-concept",
    title: "Find Video for '%s'",
    contexts: ["selection"]
  });

  // Enable side panel behavior (opens when clicking the extension icon if we wanted that)
  // For this extension, we'll ensure sidepanel opens on context menu click over text.
  // We can't guarantee `chrome.sidePanel.setPanelBehavior` alone will catch context menu,
  // so we will programmatically handle opening it in the click listener.
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "find-video-concept") {
    // 1. Open the side panel for this specific window.
    chrome.sidePanel.open({ windowId: tab.windowId });

    // 2. We use setTimeout to ensure the side panel has time to initialize and setup its listeners
    // Alternatively, Side Panel can just read the most recent concept from storage on load.
    // Storing it in storage is safer for cases where the side panel is loading from scratch.
    chrome.storage.local.set({ 
      selectedConcept: info.selectionText,
      timestamp: Date.now() // to force update if same text is selected again
    }, () => {
      console.log("Concept stored: " + info.selectionText);
    });
  }
});
