(function() {
  const DEFAULTS = {
    convertOnPaste: false,
    autoConvert: false,
    gfm: true,
    sanitize: false,
    theme: 'clean',
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

  function getEditable() {
    return document.querySelector('div[aria-label="Message Body"][contenteditable="true"]');
  }

  function replaceEmojis(text) {
    return text.replace(/:([a-zA-Z0-9_+-]+):/g, (m, p1) => EMOJI_MAP[p1] || m);
  }

  function convertLinksToReadable(text) {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
  }

  function applyTheme(theme) {
    const id = 'md-theme-style';
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = chrome.runtime.getURL('themes.css');
      document.documentElement.appendChild(link);
    }
    const body = getEditable();
    if (body) {
      body.classList.remove('md-theme-clean', 'md-theme-notion', 'md-theme-email');
      body.classList.add('md-theme-' + theme);
    }
  }

  function observeShortcuts() {
    function attachListener(body) {
      body.addEventListener('keydown', (e) => {
        if (e.key !== ' ' && e.key !== 'Enter') return;
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        if (!body.contains(range.startContainer)) return;
        let container = range.startContainer;
        let idx = range.startOffset;
        if (container.nodeType !== Node.TEXT_NODE) {
          if (container.lastChild && container.lastChild.nodeType === Node.TEXT_NODE) {
            container = container.lastChild;
            idx = container.textContent.length;
          } else {
            return;
          }
        }
        const text = container.textContent;
        if (text.slice(idx - 5, idx) === '/note') {
          container.textContent = text.slice(0, idx - 5) + '> ';
          sel.collapse(container, idx - 3);
          e.preventDefault();
        } else if (text.slice(idx - 6, idx) === '/table') {
          const tmpl = '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |';
          container.textContent = text.slice(0, idx - 6) + tmpl;
          sel.collapse(container, idx - 6 + tmpl.length);
          e.preventDefault();
        }
      });
    }
    const existing = getEditable();
    if (existing) attachListener(existing);
    const observer = new MutationObserver(() => {
      const body = getEditable();
      if (body) attachListener(body);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  chrome.storage.sync.get(DEFAULTS, (opts) => {
    const { convertOnPaste, autoConvert, shortcut, theme } = opts;

    applyTheme(theme);
    observeShortcuts();

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
          callback(text);
        }
      }, true);
    }

    const existing = getEditable();
    if (existing) {
      attachListener(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const body = getEditable();
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
      applyTheme(opts.theme);
      const emailBody = getEditable();
      if (!emailBody || typeof marked?.parse !== 'function') return;
      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const markedOpts = { gfm: opts.gfm, sanitize: opts.sanitize };

      if (markdownText !== undefined) {
        const converted = convertLinksToReadable(markdownText);
        const html = marked.parse(replaceEmojis(converted), markedOpts);
        if (document.queryCommandSupported && document.queryCommandSupported('insertHTML')) {
          document.execCommand('insertHTML', false, html);
        } else if (range) {
          const temp = document.createElement('div');
          temp.innerHTML = html;
          range.deleteContents();
          range.insertNode(temp);
        }
        emailBody.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }

      if (range && emailBody.contains(range.commonAncestorContainer) && selection.toString().trim()) {
        const tempContainer = document.createElement('div');
        const converted = convertLinksToReadable(selection.toString());
        tempContainer.innerHTML = marked.parse(replaceEmojis(converted), markedOpts);
        range.deleteContents();
        range.insertNode(tempContainer);
      } else {
        const converted = convertLinksToReadable(emailBody.innerText);
        const html = marked.parse(replaceEmojis(converted), markedOpts);
        emailBody.innerHTML = html;
      }
      emailBody.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
})();
