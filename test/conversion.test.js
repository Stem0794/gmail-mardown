const assert = require('chai').assert;
const marked = require('marked');
const TurndownService = require('turndown');

describe('Markdown conversion', function() {
  it('converts Markdown to HTML', function() {
    const html = marked.parse('# Hello').trim();
    assert.equal(html, '<h1>Hello</h1>');
  });

  it('converts HTML to Markdown', function() {
    const td = new TurndownService();
    const md = td.turndown('<strong>Hi</strong>').trim();
    assert.equal(md, '**Hi**');
  });
});
