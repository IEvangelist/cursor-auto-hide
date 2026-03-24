# Copilot instructions

## Project shape

- This repo is a small Manifest V3 browser extension for Chrome and Edge.
- Keep it dependency-free unless a user explicitly asks for a build tool or package manager.
- Prefer plain HTML, CSS, JavaScript, and PowerShell.

## Extension behavior

- The main feature lives in `content.js`.
- Preserve support for `input`, `textarea`, and `contenteditable`.
- Favor small, reliable event handling over framework-style abstractions.

## Icons and UI

- Chrome and Edge manifest icons must remain PNG files.
- If the icon design changes, keep `docs/assets/brand.svg` in sync with the PNG sizes used by `manifest.json`.
- Keep the popup simple and readable.
- Use the `playwright-cli` skill when previewing the landing page or popup UI.

## Validation and release

- Run `.\scripts\validate.ps1` after code changes.
- Use `.\scripts\bump-version.ps1 -Version x.y.z` when the packaged extension changes.
- Use `.\scripts\package.ps1` to create the store upload zip.
- Do not commit `dist\`.

## Docs and privacy

- Keep `README.md` and `PRIVACY.md` short.
- If permissions or data handling change, update `PRIVACY.md` and the store listing language.
