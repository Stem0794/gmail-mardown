function saveOptions() {
  const opts = {
    convertOnPaste: document.getElementById('convertOnPaste').checked,
    autoConvert: document.getElementById('autoConvert').checked,
    gfm: document.getElementById('gfm').checked,
    sanitize: document.getElementById('sanitize').checked,
    theme: document.getElementById('theme').value,
    shortcut: document.getElementById('shortcut').value.trim(),
    disableDefault: document.getElementById('disableDefault').checked
  };
  chrome.storage.sync.set(opts, () => {
    const status = document.getElementById('status');
    if (status) {
      status.textContent = 'Options saved';
      setTimeout(() => {
        status.textContent = '';
      }, 1500);
    }
    if (chrome.commands && chrome.commands.update) {
      chrome.commands.update({ name: 'convert_markdown', shortcut: opts.shortcut }, () => {
        if (chrome.runtime.lastError) {
          console.warn('Failed to update command shortcut', chrome.runtime.lastError);
        }
      });
    }
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    convertOnPaste: false,
    autoConvert: false,
    gfm: true,
    sanitize: false,
    theme: 'clean',
    shortcut: 'Ctrl+Shift+M',
    disableDefault: false
  }, (items) => {
    document.getElementById('convertOnPaste').checked = items.convertOnPaste;
    document.getElementById('autoConvert').checked = items.autoConvert;
    document.getElementById('gfm').checked = items.gfm;
    document.getElementById('sanitize').checked = items.sanitize;
    document.getElementById('theme').value = items.theme;
    document.getElementById('shortcut').value = items.shortcut;
    document.getElementById('disableDefault').checked = items.disableDefault;
  });
}

document.getElementById('save').addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
