# Contributing

Thank you for improving the templates.

## Before opening a pull request

1. Keep template content generic and public-safe.
2. Do not add unpublished papers, private notes, institutional data, or
   copyrighted reference PDFs.
3. Regenerate and commit every paired PDF after changing renderable source.
   Keep temporary build directories out of Git.
4. Preserve third-party license files.
5. Run `./scripts/render-all.sh` and inspect the resulting page counts.
6. Test slide navigation and print rendering in a current Chromium browser.
7. Check that every local image, stylesheet, script, and font path resolves.

## Design principles

- Favor legibility at presentation distance.
- Keep layouts reusable rather than tied to one research project.
- Use semantic HTML and meaningful `alt` text.
- Maintain strong color contrast and avoid communicating meaning by color alone.
- Keep each slide focused on one message.

Please describe the layout or bug you changed and include a screenshot when a
pull request affects rendering.
