# Vertical poster template

This is the 860 × 1160 mm portrait version of the shared research-poster
template.

Edit `index.html`, replace `assets/logo-placeholder.svg`, and adjust the color
variables in `../../shared/poster-system/theme.css`. Use SVG figures when
possible so plots remain sharp at poster size.

To export from the repository root, run:

```bash
./scripts/render-poster.sh templates/poster-vertical/index.html templates/poster-vertical/poster.pdf
```

The orientation is set by `data-orientation="vertical"` on the root `<html>`
element. You can preview the horizontal layout by adding
`?orientation=horizontal` to the page URL.

The displayed numbers and chart are placeholders, not research results. The
committed `poster.pdf` is the rendered counterpart of `index.html`.
