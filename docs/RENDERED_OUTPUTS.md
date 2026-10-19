# Rendered outputs

Every poster or slide source has a committed PDF beside it. Regenerate the complete set from the repository root with:

```bash
./scripts/render-all.sh
```

| Source | PDF |
| --- | --- |
| `templates/poster-vertical/index.html` | `templates/poster-vertical/poster.pdf` |
| `templates/poster-horizontal/index.html` | `templates/poster-horizontal/poster.pdf` |
| `templates/slides-math/index.html` | `templates/slides-math/slides.pdf` |
| `examples/poster-disel/index.html` | `examples/poster-disel/poster.pdf` |
| `examples/poster-lora/index.html` | `examples/poster-lora/poster.pdf` |
| `templates/slides-transformer/index.html` | `templates/slides-transformer/slides.pdf` |
| `templates/slides-qe/index.html` (reveal steps) | `templates/slides-qe/slides.pdf` |
| `templates/slides-qe/index.html` (complete slides) | `templates/slides-qe/slides-handout.pdf` |

The HTML slide renderer requires a Chromium-based browser and `pdfunite` from
Poppler. Poster math loads through MathJax, so poster rendering requires network
access.

The QE deck uses its own reveal-aware renderer and also requires Node.js 22+,
Python 3, and BibTeX (TeX Live/MacTeX). Run `bash templates/slides-qe/build.sh`
to refresh just this deck, both PDFs, and its speaker notes. No network or npm
installation is needed. The handout has 39 pages; the presentation has one
page per reveal step and keeps the logical slide numbering.

The README poster previews are rendered from these PDFs and stored in
`docs/assets/previews/`: `poster-disel.png`, `poster-lora.png`,
`poster-vertical.png`, and `poster-horizontal.png`. Refresh a preview with
Poppler after exporting its PDF, for example:

```sh
pdftoppm -f 1 -singlefile -scale-to 2200 -png templates/poster-vertical/poster.pdf docs/assets/previews/poster-vertical
```

The QE preview shows complete slide 14 from the handout:

```sh
pdftoppm -f 14 -singlefile -scale-to 1600 -png templates/slides-qe/slides-handout.pdf docs/assets/previews/slides-qe
```
