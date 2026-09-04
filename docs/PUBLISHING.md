# Publishing this repository on GitHub

## Before the first push

1. Run `git status --short --ignored` and inspect every non-ignored file.
2. Confirm that `.private/`, temporary build directories, and operating-system files are ignored.
3. Run `./scripts/render-all.sh`; confirm that every final PDF beside its source is included in Git.
4. Run `git diff --check` and inspect the rendered page counts.
5. Add only the public repository files with `git add .`; do not force-add ignored material.

The local `.private/` directory is a safety holding area and is intentionally absent from Git history. If you distribute the project as a ZIP instead of through Git, exclude that directory manually.

## Recommended repository settings

- Create a public repository and push the reviewed tree.
- In **Settings → General**, enable **Template repository** so visitors see **Use this template**. See GitHub's [repository template documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository).
- In **Settings → Pages**, publish from the `main` branch and `/ (root)`. The included `index.html` becomes the project landing page. See [configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
- Add a short repository description and topics such as `academic-poster`, `presentation`, `slides`, `html`, `css`, and `katex`.
- Keep the MIT license visible and preserve the bundled third-party license files.

## What belongs in Git

Commit reusable source, small example assets, documentation, license files, and the six rendered poster/slide PDFs listed in `RENDERED_OUTPUTS.md`. Keep private notes, unpublished manuscripts, raw experiment dumps, and third-party reference PDFs outside the public history.

When renderable source changes, regenerate and commit its neighboring PDF in the same change.
