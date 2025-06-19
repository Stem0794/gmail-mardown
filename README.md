# Markdown for Gmail and Slack Chrome Extension

This extension allows you to write emails in Markdown when composing a message in Gmail and also supports writing Slack messages in Markdown. Convert the Markdown to rich text via the provided context menu item or with the keyboard shortcut `Ctrl+Shift+M`.

An options page allows you to configure automatic conversion on paste, parser settings, emoji support, and a custom keyboard shortcut. The shortcut string recognizes `ctrl`, `shift`, `alt`, and `cmd`/`meta` tokens so macOS users can specify combinations like `cmd+shift+m`.

## Installation
1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and choose this folder.

## Usage
- Compose a new email in Gmail or a message in Slack and write it using Markdown syntax.
- Right-click inside the editable area and choose **Convert Markdown to Rich Text**, or press `Ctrl+Shift+M`.
- Use **Convert HTML to Markdown** from the context menu (or `Ctrl+Shift+H`) to reverse the conversion in Gmail.
- The extension converts the Markdown to rich text within the compose area and can convert existing HTML back to Markdown when requested.
- Emoji shortcodes like `:smile:` are automatically converted to their corresponding characters.

## Development
The conversion is performed using the [Marked](https://github.com/markedjs/marked) library which is bundled inside `injector.js`.

## Packaging
1. Ensure that all extension files are present and any build steps have been run.
2. Compress the entire extension folder into a `.zip` archive. This is the package that will be uploaded.
3. Sign in to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) and upload the zip file as a new item or update.
4. Follow the Chrome Web Store instructions to submit the extension for review and publication.
5. Update the `version` field in `manifest.json` before submitting a new release.

![Gmail/Slack Markdown conversion example](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6XdvFUAAAAASUVORK5CYII=)
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

