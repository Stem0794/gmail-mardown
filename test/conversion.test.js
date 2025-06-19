const assert = require('chai').assert;
const marked = require('marked');
const TurndownService = require('turndown');
const { EMOJI_MAP, replaceEmojis } = require('../emoji.js');

describe('Markdown conversion', function() {
  it('converts Markdown to HTML', function() {
    const html = marked.parse('# Hello').trim();
    assert.equal(html, '<h1>Hello</h1>');
  });

  it('parses Markdown containing emojis', function() {
    const md = 'I love it :heart:';
    const html = marked.parse(replaceEmojis(md)).trim();
    assert.equal(html, '<p>I love it ❤️</p>');
  });

  it('supports emoji replacement', function() {
    const result = replaceEmojis('Great job :tada:');
    assert.equal(result, 'Great job 🎉');
  });

  it('leaves unknown emoji codes unchanged', function() {
    const result = replaceEmojis('Unknown :notaremoji:');
    assert.equal(result, 'Unknown :notaremoji:');
  });

  it('retains emoji characters already in the text', function() {
    const html = marked.parse(replaceEmojis('Keep it 👍')).trim();
    assert.equal(html, '<p>Keep it 👍</p>');
  });
  it('emoji map is extensive', function() {
    assert.isAbove(Object.keys(EMOJI_MAP).length, 1000);
  });

  it('converts HTML to Markdown', function() {
    const td = new TurndownService();
    const md = td.turndown('<strong>Hi</strong>').trim();
    assert.equal(md, '**Hi**');
  });
});
