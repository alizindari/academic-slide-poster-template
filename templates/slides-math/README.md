# Mathematical slides

A restrained, theorem-oriented HTML deck for professional technical talks. It
demonstrates convergence results for gradient descent and stochastic gradient
descent using generic, public-safe material.

The design uses Computer Modern Unicode for HTML text, bundled KaTeX for
mathematics, a white 16:9 canvas, centered page numbers, light blue theorem
boxes, and the original compact spacing rules.

## Files

- `index.html` — HTML source
- `deck.css` — deck-specific layouts and exact typography
- `slides.pdf` — rendered deck

Serve the repository root and open `/templates/slides-math/`, or regenerate
both formats from the repository root:

```sh
./scripts/render-all.sh
```

Replace the title, author, and mathematical content while keeping the slide
shells and semantic box classes. Arrow keys, Page Up/Page Down, Space, Home,
and End navigate the HTML deck.
