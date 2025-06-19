chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convert-md",
    title: "Convert Markdown to Rich Text",
    contexts: ["editable"]
  });
});

function injectMarkdownTools(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['marked.min.js']
  }, () => {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['injector.js']
    });
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convert-md") {
    injectMarkdownTools(tab.id);
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "convert_markdown") {
    chrome.storage.sync.get({ disableDefault: false }, ({ disableDefault }) => {
      if (disableDefault) return;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        injectMarkdownTools(tabs[0].id);
      });
    });
  }
});

