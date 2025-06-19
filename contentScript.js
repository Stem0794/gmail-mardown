(function() {
  const DEFAULTS = {
    convertOnPaste: false,
    autoConvert: false,
    gfm: true,
    sanitize: false,
    shortcut: 'Ctrl+Shift+M',
    disableDefault: false
  };

  chrome.storage.sync.get(DEFAULTS, (opts) => {
    const { convertOnPaste, autoConvert, shortcut } = opts;

    if (convertOnPaste) {
      observePaste((text) => convertMarkdown(opts, text));
    }

    if (autoConvert) {
      observeSendButton(() => convertMarkdown(opts));
    }

    observeComposeToolbar();

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

  function observeComposeToolbar() {
    const observer = new MutationObserver(() => {
      document.querySelectorAll('div[aria-label="Message Body"][contenteditable="true"]').forEach(body => {
        if (!body.dataset.mdToolbarInjected) {
          injectToolbar(body);
          body.dataset.mdToolbarInjected = 'true';
        }
      });

      document.querySelectorAll('.md-toolbar').forEach(toolbar => {
        const parentBodyId = toolbar.getAttribute('data-body-id');
        const body = document.querySelector(`div[aria-label="Message Body"][contenteditable="true"][data-body-id="${parentBodyId}"]`);
        if (!body) {
          toolbar.remove();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function injectToolbar(body) {
    const toolbar = document.createElement('div');
    toolbar.className = 'md-toolbar';
    toolbar.style.cssText = 'margin:4px 0;';
    toolbar.setAttribute('data-body-id', Date.now().toString());
    body.setAttribute('data-body-id', toolbar.getAttribute('data-body-id'));

    const buttons = [
      { label: 'B', wrap: '**' },
      { label: 'I', wrap: '_' },
      { label: 'Link', link: true },
      { label: 'Code', wrap: '`' }
    ];

    buttons.forEach(btn => {
      const el = document.createElement('button');
      el.textContent = btn.label;
      el.style.marginRight = '4px';
      el.addEventListener('click', () => {
        if (btn.link) {
          const url = prompt('Enter URL');
          if (url) wrapSelection(body, '[', `](${url})`);
        } else {
          wrapSelection(body, btn.wrap);
        }
      });
      toolbar.appendChild(el);
    });

    body.parentNode.insertBefore(toolbar, body);
  }

  function wrapSelection(body, start, end) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (!body.contains(range.commonAncestorContainer)) return;
    if (end === undefined) end = start;
    const text = sel.toString();
    range.deleteContents();
    range.insertNode(document.createTextNode(start + text + end));
  }
})();
