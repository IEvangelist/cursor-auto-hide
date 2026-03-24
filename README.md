# Cursor Auto Hide

`Cursor Auto Hide` is a small Chrome/Edge extension that hides the **mouse pointer** while you type in text fields, then shows it again as soon as you move the mouse, click, scroll, switch tabs, or stop typing.

## Public landing page

The public landing page is:

`https://ievangelist.github.io/cursor-auto-hide/`

Direct download for the current package is published with the site at:

`https://ievangelist.github.io/cursor-auto-hide/downloads/cursor-auto-hide-latest.zip`

Pushes to `main` rebuild the Pages site and refresh the downloadable ZIP automatically.

## Install locally

1. Download `https://ievangelist.github.io/cursor-auto-hide/downloads/cursor-auto-hide-latest.zip`.
2. Extract the ZIP.
3. Open `chrome://extensions` or `edge://extensions` manually in the browser address bar.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted `cursor-auto-hide-*` folder.

Browsers block websites from directly opening `chrome://` and `edge://` pages, so the landing page should copy those addresses rather than trying to navigate to them.

If Chrome or Edge warns that the extension includes a `.pem` or private key file, you picked the wrong folder. Go back and select only the extracted `cursor-auto-hide-*` folder, not a parent directory that also contains signing material.

Use the extension popup to turn the behavior on or off for all sites.

## What it works with

- `input`
- `textarea`
- `contenteditable`

Browser pages like `chrome://` and `edge://` are excluded by the browser.

## Validate locally

From `E:\GitHub\cursor-auto-hide`:

```powershell
.\scripts\validate.ps1
```

GitHub Actions runs the same validation on pushes and pull requests.

## Release

From `E:\GitHub\cursor-auto-hide`:

```powershell
.\scripts\bump-version.ps1 -Version 0.1.1
.\scripts\package.ps1
```

That creates a zip in `dist\` for store uploads.

The packaging and validation scripts now fail fast if the project folder contains `.pem`, `.key`, `.p12`, `.pfx`, `.pvk`, `.snk`, or similarly named private key files.

## Publish

Upload the zip from `dist\` to:

- Chrome Web Store
- Microsoft Edge Add-ons

Prepared Microsoft Edge Add-ons submission assets live in `artifacts\edge-addons\`, including the draft listing JSON, 300x300 store logo, store screenshots, and the HTML source used to capture those screenshots.

## Privacy

This extension does not collect browsing history, keystrokes, page content, or personal data. It only stores one synced setting: whether the extension is enabled.

See `PRIVACY.md` for the short version you can reuse in store listings.
