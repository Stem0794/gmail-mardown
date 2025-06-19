(function() {
  const DEFAULTS = {
    autoConvert: false,
    gfm: true,
    sanitize: false,
    shortcut: 'Ctrl+Shift+M',
    disableDefault: false
  };

  chrome.storage.sync.get(DEFAULTS, (opts) => {
    const {autoConvert, shortcut} = opts;

    if (autoConvert) {
      observeSendButton(() => convertMarkdown(opts));
    }

    if (shortcut) {
      document.addEventListener('keydown', (e) => {
        if (matchesShortcut(e, shortcut)) {
          e.preventDefault();
          convertMarkdown(opts);
        }
      });
    }
  });

  function matchesShortcut(e, combo) {
    const parts = combo.toLowerCase().split('+');
    const key = parts.pop();
    const ctrl = parts.includes('ctrl');
    const shift = parts.includes('shift');
    const alt = parts.includes('alt');
    return e.key.toLowerCase() === key &&
           e.ctrlKey === ctrl &&
           e.shiftKey === shift &&
           e.altKey === alt;
  }

  function observeSendButton(callback) {
    const observer = new MutationObserver(() => {
      const btn = document.querySelector('div[aria-label^="Send"]');
      if (btn) {
        btn.addEventListener('click', () => callback(), true);
        observer.disconnect();
      }
    });
    observer.observe(document.body, {childList: true, subtree: true});
  }

  function loadMarked(cb) {
    if (window.marked) {
      cb();
      return;
    }
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('marked.min.js');
    script.onload = cb;
    document.documentElement.appendChild(script);
  }

  function convertMarkdown(opts) {
    loadMarked(() => {
      const emailBody = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');
      if (!emailBody || typeof marked?.parse !== 'function') return;
      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const markedOpts = { gfm: opts.gfm, sanitize: opts.sanitize };
      if (range && emailBody.contains(range.commonAncestorContainer) && selection.toString().trim()) {
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = marked.parse(selection.toString(), markedOpts);
        range.deleteContents();
        range.insertNode(tempContainer);
      } else {
        const html = marked.parse(emailBody.innerText, markedOpts);
        emailBody.innerHTML = html;
      }
    });
  }
})();
