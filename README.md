# Markdown for Gmail Chrome Extension

This extension allows you to write emails in Markdown when composing a message in Gmail. Convert the Markdown to rich text via the provided context menu item or with the keyboard shortcut `Ctrl+Shift+M`.


An options page allows you to configure automatic conversion on paste, parser settings, emoji support, and a custom keyboard shortcut. The shortcut string recognizes `ctrl`, `shift`, `alt`, and `cmd`/`meta` tokens so macOS users can specify combinations like `cmd+shift+m`. When you save a new shortcut it is applied to the extension's command automatically, so there is no need to update it through the **Extension shortcuts** page.

## Features
- Write emails in pure Markdown directly in Gmail.
- Convert Markdown to rich text from the context menu or by pressing `Ctrl+Shift+M`.
- Convert existing HTML back to Markdown with `Ctrl+Shift+H`.
- Automatically convert text on paste or when sending the message.
- Supports GitHub‑flavored Markdown and optional HTML sanitization.
- Extensive emoji shortcode map with characters left intact when typed directly.
- Slash command `/note` inserts a callout block with editable text.
- Choose between *clean*, *Notion-style*, or *email-friendly* themes.
- Configure a custom keyboard shortcut or disable the default one.

## Installation
1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and choose this folder.

## How to Use
- Compose a new email in Gmail and write it using Markdown syntax.
- Right-click inside the editable area and choose **Convert Markdown to Rich Text**, or press `Ctrl+Shift+M`.
- Use **Convert HTML to Markdown** from the context menu (or `Ctrl+Shift+H`) to reverse the conversion in Gmail.
- The extension converts the Markdown to rich text within the compose area and can convert existing HTML back to Markdown when requested.
- Emoji shortcodes like `:smile:` are automatically converted to their corresponding characters.
- The extension now includes a comprehensive emoji map so most GitHub-style codes are recognized.
- Emoji characters you type directly, like 👍, stay unchanged when converting.
- Links written as `[text](url)` become plain `text (url)` links for readability.
- Choose between *clean*, *Notion-style*, or *email-friendly* themes for rendered Markdown.
- Typing `/note` inserts a grey callout block to highlight important info.

## Development
The conversion is performed using the [Marked](https://github.com/markedjs/marked) library which is bundled inside `injector.js`.

For troubleshooting features like the `/note` slash command, you can enable verbose
logging by setting `window.GM_DEBUG = true` in the page's developer console.

## Packaging
1. Ensure that all extension files are present and any build steps have been run.
2. Compress the entire extension folder into a `.zip` archive. This is the package that will be uploaded.
3. Sign in to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) and upload the zip file as a new item or update.
4. Follow the Chrome Web Store instructions to submit the extension for review and publication.
5. Update the `version` field in `manifest.json` before submitting a new release.

![Gmail Markdown conversion example](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6XdvFUAAAAASUVORK5CYII=)
## Running Tests
First install the development dependencies with:
```bash
npm install
```
This installs packages like `mocha` that are needed for the test suite.

Run the tests using:
```bash
npm test
```

![Gmail Markdown conversion example](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6XdvFUAAAAASUVORK5CYII=)

