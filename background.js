chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convert-md",
    title: "Convert Markdown to Rich Text",
    contexts: ["editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convert-md") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['injector.js']
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "convert_markdown") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['injector.js']
      });
    });
  }
});