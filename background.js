chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convert-md",
    title: "Convert Markdown to Rich Text",
    contexts: ["editable"]
  });
  chrome.contextMenus.create({
    id: "convert-html-md",
    title: "Convert HTML to Markdown",
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

function injectHtmlToMarkdown(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['turndown.js']
  }, () => {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['html2md.js']
    });
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convert-md") {
    injectMarkdownTools(tab.id);
  } else if (info.menuItemId === "convert-html-md") {
    injectHtmlToMarkdown(tab.id);
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
  } else if (command === "convert_html_markdown") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      injectHtmlToMarkdown(tabs[0].id);
    });
  }
});

