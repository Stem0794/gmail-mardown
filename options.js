function saveOptions() {
  const opts = {
    autoConvert: document.getElementById('autoConvert').checked,
    gfm: document.getElementById('gfm').checked,
    sanitize: document.getElementById('sanitize').checked,
    shortcut: document.getElementById('shortcut').value.trim(),
    disableDefault: document.getElementById('disableDefault').checked
  };
  chrome.storage.sync.set(opts);
}

function restoreOptions() {
  chrome.storage.sync.get({
    autoConvert: false,
    gfm: true,
    sanitize: false,
    shortcut: 'Ctrl+Shift+M',
    disableDefault: false
  }, (items) => {
    document.getElementById('autoConvert').checked = items.autoConvert;
    document.getElementById('gfm').checked = items.gfm;
    document.getElementById('sanitize').checked = items.sanitize;
    document.getElementById('shortcut').value = items.shortcut;
    document.getElementById('disableDefault').checked = items.disableDefault;
  });
}

document.getElementById('save').addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
