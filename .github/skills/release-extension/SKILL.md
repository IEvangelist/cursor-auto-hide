# Release extension

Use this skill when preparing a new extension version or store upload.

## Steps

1. Update the extension version:

   ```powershell
   .\scripts\bump-version.ps1 -Version x.y.z
   ```

2. Validate and package:

   ```powershell
   .\scripts\validate.ps1
   ```

3. Review the diff and test the unpacked extension in Chrome or Edge.

4. Commit and tag:

   ```powershell
   git add .
   git commit -m "Release vx.y.z"
   git tag vx.y.z
   ```

5. Push:

   ```powershell
   git push origin main --follow-tags
   ```

## Notes

- The upload zip is created in `dist\`.
- `dist\` stays out of git.
- If permissions or privacy behavior change, update `PRIVACY.md` before publishing.
