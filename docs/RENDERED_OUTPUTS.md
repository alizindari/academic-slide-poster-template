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

The HTML slide renderer requires a Chromium-based browser and `pdfunite` from
Poppler. Poster math loads through MathJax, so poster rendering requires network
access.

The README poster previews are rendered from these PDFs and stored in
`docs/assets/previews/`: `poster-disel.png`, `poster-lora.png`,
`poster-vertical.png`, and `poster-horizontal.png`. Refresh a preview with
Poppler after exporting its PDF, for example:

```sh
pdftoppm -f 1 -singlefile -scale-to 2200 -png templates/poster-vertical/poster.pdf docs/assets/previews/poster-vertical
```
