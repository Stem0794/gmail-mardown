const { assert } = require('chai');
const { JSDOM } = require('jsdom');

// setup helper to load the contentScript with JSDOM environment
function loadScript(html = '<div aria-label="Message Body" contenteditable="true"></div>') {
  const dom = new JSDOM(`<!DOCTYPE html>${html}`);
  global.window = dom.window;
  global.document = dom.window.document;
  global.Node = dom.window.Node;
  global.MutationObserver = class { constructor(cb){} observe(){} disconnect(){} };
  global.chrome = { runtime: { getURL: p => p }, storage: { sync: { get: (_d, cb) => cb({}) } } };
  return require('../contentScript.js');
}

describe('Extension features', function() {
  it('converts markdown links to readable text', function() {
    const { convertLinksToReadable } = loadScript();
    const result = convertLinksToReadable('See [Google](https://google.com)');
    assert.equal(result, 'See Google (https://google.com)');
  });

  it('matches keyboard shortcuts', function() {
    const { matchesShortcut } = loadScript();
    const e = { key: 'M', ctrlKey: true, shiftKey: true, altKey: false, metaKey: false };
    assert.isTrue(matchesShortcut(e, 'Ctrl+Shift+M'));
    assert.isFalse(matchesShortcut(e, 'Ctrl+M'));
  });

  it('applies theme classes to the email body', function() {
    const script = loadScript();
    const body = document.querySelector('div[aria-label="Message Body"]');
    script.applyTheme('notion');
    assert.isTrue(body.classList.contains('md-theme-notion'));
  });

});
