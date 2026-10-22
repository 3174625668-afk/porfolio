# Homepage development

No package installation or build is required. From `/workspace/porfolio`:

```sh
python -m http.server 3000 --bind 0.0.0.0
```

The source is `index.html`, `style.css`, `app.js`, `projects.js`, `text-dust.js`, and `assets/`. Run `python scripts/build-preview.py` after edits to refresh the standalone interactive HTML in `previews/`. Original image files and layout JSON are preserved unchanged. The images in assets/ were originally decoded byte-for-byte from that JSON; they are never edited or regenerated.

## Composition

The artwork retains its centered 1600×900 stage. Desktop title columns and both top information labels instead anchor to symmetric browser edges, using a responsive 12–64px safety margin. This uses the outside whitespace on wide browser windows rather than keeping the text crowded inside the illustration stage. Nothing moves when sections activate; the lists have no internal scrolling or fading masks.

Left title type remains 60px/900, right 56px/900, and Other Works 60px/700 at the design size. The left row gap is still 3.6px, the right gap 10.4px, and line-height 1.04. Desktop-only line breaks in The Law and Not That Scary Ⅱ lengthen the left composition to the printmaker's feet without increasing spacing or changing project names. `desktopLines` is presentation metadata: the full text content and canonical displayTitle remain unchanged. Mobile spans display inline and wrap naturally. Narrow desktop windows give the final research title extra clearance and slightly tighter tracking to keep it clear of the desk, preserving 56px type.

## Interaction

Hover or tap either original illustration to reveal its section; only one section is open. Opening a section does not reveal any type labels. Hover or keyboard focus on a title reveals only its category. Other Works is a non-navigating, focusable group heading in Art Practice; its type is SELECTED WORKS. On touch, the first project tap reveals the category and a second opens the existing availability notice. Other Works never opens a notice or page. Escape, Close, an outside click, or leaving the full page interaction area closes the list. The full-width interaction area includes the outer gutters so moving between artwork and outlying titles remains stable. Empty list areas pass pointer events through to the artwork.

HOVER TO EXPLORE ↗ changes to TAP TO EXPLORE on touch devices and fades after first activation. Images alone receive a 1.04 scale, -3px lift, and soft 23% black drop shadow over 250ms ease-out; their layout boxes and category labels stay fixed. Touch uses a transient 1.02 scale with a lighter shadow.

`text-dust.js` samples the actual live glyph positions into a transparent canvas. The 2px grid gives approximately 2.25× the previous 3px sample density; a tighter dispersion radius keeps the text more cohesive. Nested line spans and natural wrapping are both supported. The semantic title stays present, particles never use illustration data, and leaving restores crisp type. Reduced-motion disables particle animation, image transforms, shadows, and transitions. No project image previews or detail pages are implemented.

## Validation

Verified 1600/1920/2560px desktops and 390/820px touch layouts: symmetric title edges, matching header anchors, unchanged row gaps, foot-level left composition, fixed artwork/decorations, exclusive sections, hover transfer, categories and group heading, nested-line particles, keyboard, touch, reduced motion, and the offline bundle. Pixel-level glyph/artwork collision checks passed at 1600×900 and 1920×900. PNG assets and the original JSON have no changes. Publish updates by pushing main; the existing GitHub Pages branch deployment handles the static website.
