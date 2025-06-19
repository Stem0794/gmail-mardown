(function () {
  console.log('[Markdown4Gmail] injector.js loaded');

  const MAX_ATTEMPTS = 50;
  let attempts = 0;

  const interval = setInterval(() => {
    const emailBody = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');
    console.log(`[Markdown4Gmail] Attempt ${attempts}, emailBody found: ${!!emailBody}`);
    console.log(`[Markdown4Gmail] typeof marked: ${typeof marked}`);

    if (emailBody && typeof marked?.parse === 'function') {
      clearInterval(interval);

      chrome.storage.sync.get({ gfm: true, sanitize: false }, (opts) => {
        const selection = window.getSelection();
        const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        if (range && emailBody.contains(range.commonAncestorContainer)) {
          const selectedText = selection.toString();
          if (selectedText.trim()) {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = marked.parse(selectedText, { gfm: opts.gfm, sanitize: opts.sanitize });
            range.deleteContents();
            range.insertNode(tempContainer);
          }
        } else {
          const markdown = emailBody.innerText;
          const html = marked.parse(markdown, { gfm: opts.gfm, sanitize: opts.sanitize });
          emailBody.innerHTML = html;
        }
      });
    } else {
      attempts++;
      if (attempts > MAX_ATTEMPTS) {
        clearInterval(interval);
        console.log("[Markdown4Gmail] Still couldn't find the email body or Markdown parser after waiting.");
      }
    }
  }, 300);
})();