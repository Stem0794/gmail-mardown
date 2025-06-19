(function () {
  'use strict';

  const MAX_ATTEMPTS = 50;
  let attempts = 0;

  const EMOJI_MAP = typeof window !== 'undefined' && window.EMOJI_MAP ? window.EMOJI_MAP : {
    smile: '😄',
    grin: '😁',
    wink: '😉',
    cry: '😢',
    laugh: '😆',
    heart: '❤️',
    rocket: '🚀',
    tada: '🎉',
    thumbsup: '👍',
    thumbs_up: '👍'
  };

  function replaceEmojis(text) {
    if (typeof window !== 'undefined' && window.replaceEmojis) {
      return window.replaceEmojis(text);
    }
    return text.replace(/:([a-zA-Z0-9_+-]+):/g, (m, p1) => EMOJI_MAP[p1] || m);
  }

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
            tempContainer.innerHTML = marked.parse(replaceEmojis(selectedText), { gfm: opts.gfm, sanitize: opts.sanitize });
            range.deleteContents();
            while (tempContainer.firstChild) {
              range.insertNode(tempContainer.firstChild);
              range.collapse(false);
            }
          }
        } else {
          const markdown = emailBody.innerText;
          const html = marked.parse(replaceEmojis(markdown), { gfm: opts.gfm, sanitize: opts.sanitize });
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

