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
      function: convertMarkdownInEmail
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "convert_markdown") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: convertMarkdownInEmail
      });
    });
  }
});

function convertMarkdownInEmail() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('markdown.min.js');
  script.onload = () => {
    script.remove();
    const emailBody = document.querySelector('[aria-label="Message Body"]');
    if (emailBody && window.marked) {
      const markdown = emailBody.innerText;
      const html = window.marked.parse(markdown);
      emailBody.innerHTML = html;
    } else {
      alert("Could not find email body or Markdown parser");
    }
  };
  (document.head || document.documentElement).appendChild(script);
}