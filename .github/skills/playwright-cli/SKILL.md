# Playwright CLI preview

Use this skill when previewing the landing page, checking the popup UI, or capturing screenshots for docs and future store listings.

## What this skill is for

- Open the landing page from `docs/index.html`.
- Preview `popup.html` without the extension runtime blocking the UI.
- Capture screenshots after layout or branding changes.
- Check for console errors or broken links in consumer-facing pages.

## Suggested workflow

1. Open the landing page:

   ```text
   file:///E:/GitHub/cursor-auto-hide/docs/index.html
   ```

2. Open the popup preview:

   ```text
   file:///E:/GitHub/cursor-auto-hide/popup.html
   ```

3. Take screenshots after major UI changes.

4. If the layout changed, also re-run:

   ```powershell
   .\scripts\validate.ps1
   ```

## Cross-reference

- See `maintain-extension-ui` for popup, icon, and interaction changes.
- See `release-extension` before packaging or tagging a new version.
