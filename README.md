# Cursor Auto Hide

`Cursor Auto Hide` is a small Chrome/Edge extension that hides the **mouse pointer** while you type in text fields, then shows it again as soon as you move the mouse, click, scroll, switch tabs, or stop typing.

## Install locally

1. Open `chrome://extensions` or `edge://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select `E:\GitHub\cursor-auto-hide`.

Use the extension popup to turn the behavior on or off for all sites.

## What it works with

- `input`
- `textarea`
- `contenteditable`

Browser pages like `chrome://` and `edge://` are excluded by the browser.

## Release

From `E:\GitHub\cursor-auto-hide`:

```powershell
.\scripts\bump-version.ps1 -Version 0.1.1
.\scripts\package.ps1
```

That creates a zip in `dist\` for store uploads.

## Publish

Upload the zip from `dist\` to:

- Chrome Web Store
- Microsoft Edge Add-ons

## Privacy

This extension does not collect browsing history, keystrokes, page content, or personal data. It only stores one synced setting: whether the extension is enabled.

See `PRIVACY.md` for the short version you can reuse in store listings.
