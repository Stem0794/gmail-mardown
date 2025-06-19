(function() {
  const DEFAULTS = {
    convertOnPaste: false,
    autoConvert: false,
    gfm: true,
    sanitize: false,
    shortcut: 'Ctrl+Shift+M',
    disableDefault: false
  };

  const EMOJI_MAP = {
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
    return text.replace(/:([a-zA-Z0-9_+-]+):/g, (m, p1) => EMOJI_MAP[p1] || m);
  }

  chrome.storage.sync.get(DEFAULTS, (opts) => {
    const { convertOnPaste, autoConvert, shortcut } = opts;

    if (convertOnPaste) {
      observePaste((text) => convertMarkdown(opts, text));
    }

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
    const meta = parts.includes('meta') || parts.includes('cmd');
    return e.key.toLowerCase() === key &&
           e.ctrlKey === ctrl &&
           e.shiftKey === shift &&
           e.altKey === alt &&
           e.metaKey === meta;
  }

  function observePaste(callback) {
    function attachListener(body) {
      body.addEventListener('paste', (e) => {
        const text = e.clipboardData.getData('text/plain');
        if (text) {
          e.preventDefault();
          e.stopImmediatePropagation();
          callback(text);
        }
      }, true);
    }

    const existing = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');
    if (existing) {
      attachListener(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const body = document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');
      if (body) {
        attachListener(body);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function observeSendButton(callback) {
    const observer = new MutationObserver(() => {
      const btn = document.querySelector('div[aria-label^="Send"]');
      if (btn) {
        btn.addEventListener('click', () => callback(), true);
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
        const html = marked.parse(replaceEmojis(markdownText), markedOpts);
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
        tempContainer.innerHTML = marked.parse(replaceEmojis(selection.toString()), markedOpts);
        range.deleteContents();
        range.insertNode(tempContainer);
      } else {
        const html = marked.parse(replaceEmojis(emailBody.innerText), markedOpts);
        emailBody.innerHTML = html;
      }
    });
  }
})();
