(function() {
  const DEFAULTS = {
    convertOnPaste: false,
    gfm: true,
    sanitize: false,
    shortcut: 'Ctrl+Shift+M',
    disableDefault: false
  };

  chrome.storage.sync.get(DEFAULTS, (opts) => {
    const { convertOnPaste, shortcut } = opts;

    if (convertOnPaste) {
      observePaste((text) => convertMarkdown(opts, text));
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

  function observePaste(callback) {
    const observer = new MutationObserver(() => {
      const body = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');
      if (body) {
        body.addEventListener('paste', (e) => {
          const text = e.clipboardData.getData('text/plain');
          if (text) {
            e.preventDefault();
            callback(text);
          }
        });
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
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

  function convertMarkdown(opts, markdownText) {
    loadMarked(() => {
      const emailBody = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');
      if (!emailBody || typeof marked?.parse !== 'function') return;
      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const markedOpts = { gfm: opts.gfm, sanitize: opts.sanitize };

      if (markdownText !== undefined) {
        const html = marked.parse(markdownText, markedOpts);
        if (document.queryCommandSupported && document.queryCommandSupported('insertHTML')) {
          document.execCommand('insertHTML', false, html);
        } else if (range) {
          const temp = document.createElement('div');
          temp.innerHTML = html;
          range.deleteContents();
          range.insertNode(temp);
        }
        return;
      }

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
