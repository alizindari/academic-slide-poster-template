# Shared poster system

`theme.css` contains the common poster components and both orientation layouts.
It includes the navy, rust, and gold palette, flat colored section headers,
equation boxes, diagrams, and charts used by both templates. Palette variables
are at the top of the file; the text and math fonts are unchanged.
`orientation.js` reads the `data-orientation` value from the root `<html>`
element and applies the matching print dimensions.

The supported values are:

- `vertical`: 860 × 1160 mm
- `horizontal`: 1160 × 860 mm

Each template folder sets its default orientation in `index.html` and keeps a
matching `@page` fallback in its local `style.css`. To test the other layout
without editing the file, append `?orientation=horizontal` or
`?orientation=vertical` to the URL. The poster rendering script accepts the
same values as its optional third argument.

## Theorem headings

Theorem boxes have solid rust headings with white text above a pale body.
Use `theorem-box--proposition` or `theorem-box--lemma` for navy headings, or
`theorem-box--corollary` for gold headings. All variants work in both
orientations without changing the fonts.

```html
<div class="theorem-box theorem-box--corollary">
  <strong>Corollary 1</strong>
  <p>State the consequence of the theorem here.</p>
</div>
```
