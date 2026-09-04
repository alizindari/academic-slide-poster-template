# Horizontal poster template

This is the 1160 × 860 mm landscape version of the shared research-poster
template. It uses the same components, typography, palette, and source structure
as the vertical version, with spacing and content density adjusted for the wider
canvas.

Edit `index.html`, replace `assets/logo-placeholder.svg`, and adjust the color
variables in `../../shared/poster-system/theme.css`. Use SVG figures when
possible so plots remain sharp at poster size.

To export from the repository root, run:

```bash
./scripts/render-poster.sh templates/poster-horizontal/index.html templates/poster-horizontal/poster.pdf
```

The orientation is set by `data-orientation="horizontal"` on the root `<html>`
element. You can preview the vertical layout by adding `?orientation=vertical`
to the page URL.

The displayed numbers and chart are placeholders, not research results. The
committed `poster.pdf` is the rendered counterpart of `index.html`.
