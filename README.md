# Markdown for Gmail Chrome Extension

This extension allows you to write emails in Markdown when composing a message in Gmail. Convert the Markdown to rich text via the provided context menu item or with the keyboard shortcut `Ctrl+Shift+M`.

## Installation
1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and choose this folder.

## Usage
- Compose a new email in Gmail and write your message using Markdown syntax.
- Right-click inside the message body and choose **Convert Markdown to Rich Text**, or press `Ctrl+Shift+M`.
- The extension will convert the Markdown to HTML within the compose area.

## Development
The conversion is performed using the [Marked](https://github.com/markedjs/marked) library which is bundled inside `injector.js`.

## Packaging
1. Ensure that all extension files are present and any build steps have been run.
2. Compress the entire extension folder into a `.zip` archive. This is the package that will be uploaded.
3. Sign in to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) and upload the zip file as a new item or update.
4. Follow the Chrome Web Store instructions to submit the extension for review and publication.
5. Update the `version` field in `manifest.json` before submitting a new release.

![Gmail Markdown conversion example](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6XdvFUAAAAASUVORK5CYII=)

