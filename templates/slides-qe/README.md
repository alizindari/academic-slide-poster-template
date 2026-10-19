# PhD qualifying-exam slides

Ali Zindari's populated QE deck, **Learning When to Adapt: Fine-Tuning with
Less Forgetting**, kept as a reusable presentation template. The research
content, diagrams, speaker notes, and appendix are included, not replaced with
empty slides.

The design uses TeX Gyre Termes for text and locally bundled KaTeX for math,
with a warm off-white background, charcoal text, and burgundy accents on a
1280 × 720 canvas. Its text font differs from the CMU Serif used by
[`slides-math`](../slides-math/), but both use the same math fonts.

## Open the deck

- [HTML presentation](index.html)
- [Presentation PDF](slides.pdf): one page per reveal step
- [Handout PDF](slides-handout.pdf): one complete page per slide
- [Speaker notes and timing](speaker-notes.md)
- [Sources and figure credits](references.md)
- [BibTeX bibliography](references.bib)

Serve the repository root with `./scripts/serve.sh`, then open
`http://localhost:8000/templates/slides-qe/`.

The sample has 23 talk slides, one references slide, an appendix divider, and
14 backup slides. Both PDFs include the appendix. The presentation PDF repeats
logical slide numbers as content is revealed; the handout has 39 pages.

## Controls

| Key | Action |
| --- | --- |
| Right, Down, Space, Page Down | Reveal the next group, then advance |
| Left, Up, Page Up | Go back one reveal step |
| Home / End | First / last slide |
| F | Toggle fullscreen |
| N / Escape | Toggle / close speaker notes |
| B | Jump to the appendix |

Use a URL hash such as `#14` to open a slide directly. Notes open on the same
screen, so do not open them on a projector unless you intend to show them.

## Files and customization

- `index.html`: slide content, inline SVG diagrams, notes, and timing estimates
- `deck.css`: layouts, colors, and reveal/print styling
- `reveals.js`: ordered reveal groups and labels for each slide
- `runtime.js`: this deck's reveal-aware navigation
- `presentation.js`: notes, fullscreen, and appendix shortcuts
- `assets/`: the six SVG figure files used by the deck
- `data/appendix-examples.json`: source records and attribution for dataset examples
- `references.bib`: bibliography records used to generate the references slide
- `scripts/`: bibliography, notes, and PDF export helpers

Copy this folder while keeping the relative path to `shared/slide-system/`,
or update the stylesheet/script paths if you move it elsewhere. The shared
folder supplies the base theme, fonts, KaTeX, and their licenses. Navigation is
local to this template so its reveal behavior does not change the other decks.

Replace the title, author, research content, and figures for your own talk.
Keep each slide in a `<section class="slide">` and update its `data-title`,
`data-seconds`, number, and speaker notes. When changing a layout, also update
its selectors in `reveals.js`; missing reveal targets are reported during
export. Slides marked `data-backup` stay fully visible without reveals.

Edit bibliography records in `references.bib` and the citation order in
`scripts/export-references.py`, not the generated HTML bibliography block.
Original research figures and dataset excerpts retain their source credits;
see `references.md` before reusing them.

## Build

Requirements: Node.js 22 or newer, a Chromium browser, Python 3, and BibTeX
(included in TeX Live/MacTeX). No npm installation or network access is needed.

From the repository root:

```sh
bash templates/slides-qe/build.sh
```

This refreshes the bibliography, both neighboring PDFs, and the notes. It is
also included in `./scripts/render-slides.sh` and `./scripts/render-all.sh`.
Set `CHROME_BIN` if the renderer cannot find your browser.

To save slide screenshots and validation results outside the repository:

```sh
bash templates/slides-qe/build.sh --check-dir /tmp/qe-deck-check
```

The renderer checks fonts, math, images, reveal visibility, keyboard
navigation, notes, direct links, and overflow. Inspect the screenshots as well
after making layout changes.
