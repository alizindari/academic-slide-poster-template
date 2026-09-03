# Poster template

This is an 860 × 1160 mm portrait research-poster template.

Edit `index.html`, replace `assets/logo-placeholder.svg`, and adjust the color
variables near the top of `style.css`. Use SVG figures when possible so plots
remain sharp at poster size.

To export from the repository root, run:

```bash
./scripts/render-poster.sh templates/poster/index.html templates/poster/poster.pdf
```

Alternatively, open the page in a Chromium browser and print with:

- paper size taken from CSS;
- zero margins;
- background graphics enabled;
- scale set to 100%.

The displayed numbers and chart are placeholders, not research results.

The committed `poster.pdf` is the rendered counterpart of `index.html`.
