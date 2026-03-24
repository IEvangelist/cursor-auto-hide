# Maintain extension UI

Use this skill when updating the popup, icons, or the core typing experience.

## Goals

- Keep the extension small and dependency-free.
- Preserve the simple UX: one global toggle, one clear behavior.
- Prefer readable CSS and direct DOM code over abstractions.

## Checklist

1. If you change popup copy or layout, keep it short and obvious.
2. If you change icons, remember that manifest icons for Chrome and Edge must stay PNG.
3. If you add an SVG source icon, keep it aligned with the packaged PNG icon set.
4. If you change typing behavior, preserve support for `input`, `textarea`, and `contenteditable`.
5. Validate with `.\scripts\validate.ps1`.

## Files you will usually touch

- `popup.html`
- `popup.css`
- `popup.js`
- `content.js`
- `icons\*`
- `manifest.json`

## Cross-reference

- See `playwright-cli` to preview the popup and landing page and capture screenshots after visual changes.
- See `release-extension` when the UI work should ship in a new version.
