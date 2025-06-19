(function () {
  'use strict';

  const MAX_ATTEMPTS = 50;
  let attempts = 0;

  const interval = setInterval(() => {
    const emailBody = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');

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
            while (tempContainer.firstChild) {
              range.insertNode(tempContainer.firstChild);
              range.collapse(false);
            }
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
      }
    }
  }, 300);
})();

