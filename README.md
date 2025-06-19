# Markdown for Gmail Chrome Extension

This extension allows you to write emails in Markdown when composing a message in Gmail. Convert the Markdown to rich text via the provided context menu item or with the keyboard shortcut `Ctrl+Shift+M`.

An options page allows you to configure automatic conversion on send, parser settings, and a custom keyboard shortcut.

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

