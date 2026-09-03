# Shared HTML slide system

The files in this directory provide the 1280 × 720 canvas, local fonts, offline math rendering, keyboard navigation, print styles, and PDF export used by all HTML slide decks.

## Contents

- `theme.css`: typography, colors, layout primitives, and print rules.
- `runtime.js`: KaTeX rendering, responsive scaling, hash links, and keyboard navigation.
- `render-pdf.sh`: exports each slide separately with Chromium and joins the pages with `pdfunite`.
- `vendor/katex/`: pinned KaTeX 0.16.22 runtime and math fonts.
- `fonts/`: TeX Gyre Termes and Computer Modern Unicode, with their licenses.

## Connect a deck

A deck two directories below the repository root loads the shared system like this:

```html
<link rel="stylesheet" href="../../shared/slide-system/vendor/katex/katex.min.css">
<link rel="stylesheet" href="../../shared/slide-system/theme.css">
<link rel="stylesheet" href="deck.css">

<main class="deck" data-slide-deck>
  <section class="slide is-active" data-title="Opening slide">
    <h1 class="slide__title">Opening slide</h1>
    <div class="slide__rule"></div>
    <div class="slide__content">Write math as \(x^2\).</div>
    <div class="slide__number">1</div>
  </section>
</main>

<script src="../../shared/slide-system/vendor/katex/katex.min.js"></script>
<script src="../../shared/slide-system/vendor/katex/contrib/auto-render.min.js"></script>
<script src="../../shared/slide-system/runtime.js"></script>
```

Add deck-specific layouts in a local `deck.css`. Arrow keys, Page Up/Page Down, Home, End, and Space navigate. A hash such as `#5` opens slide 5 directly.

## Export a PDF

From the repository root:

```bash
./shared/slide-system/render-pdf.sh templates/slides-math/index.html templates/slides-math/slides.pdf
```

The renderer detects Google Chrome or Chromium on macOS and Linux. Set `CHROME_BIN` to use another executable. It also requires `pdfunite` from Poppler.

KaTeX retains its MIT license in `vendor/katex/LICENSE`. TeX Gyre Termes retains
the GUST Font License in `fonts/GUST-FONT-LICENSE.txt`; Computer Modern Unicode
retains the SIL Open Font License in `fonts/CMU-OFL.txt`.
