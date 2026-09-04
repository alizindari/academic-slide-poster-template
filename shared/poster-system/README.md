# Shared poster system

`theme.css` contains the common poster components and both orientation layouts.
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
