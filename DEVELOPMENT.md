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

On mouse devices, `assets/explore-cursor.svg` is the native browser cursor: a small grey × and HOVER TO EXPLORE. The cursor hotspot is exactly (5,12), the cross center; the text begins to its right. No JavaScript mouse tracking or cursor animation runs. Desktop fixed hint text is hidden to avoid duplication. Touch retains the small TAP TO EXPLORE hint and normal touch interactions. Type captions sit 2px closer to their title without changing row positions.

Only `.illustration-visual` transforms on hover: scale(1.04) and translateY(-3px), 250ms ease-out. Original-art images have no filters or color changes. The second image is a separate external-only shadow layer. `python scripts/build-shadows.py` builds those layers from silhouette masks, fills internal transparent holes, and subtracts the complete filled silhouette from the shadow. This prevents shadow from entering face/clothing transparency. The generator never writes to original image paths; it requires Pillow only when regenerating helpers. Committed helpers need no runtime image processing. Shadow geometry accounts for the originals' actual object-fit/letterboxing. Reduced motion disables lift and shadow.

`text-dust.js` now builds each title's dense 2px stipple texture once during idle time after fonts load. Hidden, inert, aria-hidden measuring panels preserve real desktop widths and nested line spans without revealing projects. Drawing uses small solid stamps with no per-particle shadows, no arcs, and no device-pixel-ratio multiplier. Hover only changes a class; it does not sample pixels, measure character ranges, or run any continuous repaint loop. The cached layer uses brief opacity/transform transitions. A CSS stipple mask responds instantly if the idle cache is not ready. Resize invalidates caches with a debounce. Reduced motion and touch bypass the effect, keeping crisp accessible live text. There are no project image previews or detail pages.

## Validation

Verified 1600/1920/2560px desktops and 390/820px touch layouts: symmetric title edges, matching header anchors, unchanged row gaps, foot-level left composition, fixed artwork/decorations, exclusive sections, hover transfer, categories and group heading, nested-line particles, keyboard, touch, reduced motion, and the offline bundle. Pixel-level glyph/artwork collision checks passed at 1600×900 and 1920×900. PNG assets and the original JSON have no changes. Publish updates by pushing main; the existing GitHub Pages branch deployment handles the static website.


The effects revision additionally verifies cold-cache fallback, native cursor hotspot/fallback, no synchronous canvas reads on hover, no steady-state canvas painting, touch hints, resize cache reuse, and the standalone bundle. In the same Chromium test with 4× CPU throttling, the previous effect's hover handler measured about 24.6ms and its 95th-percentile animation frame 66.7ms; the cached version measured about 2ms and 16.8ms respectively. These are local measurements, not a guarantee for every device. A screenshot comparison with exterior shadow toggled found zero changed interior silhouette pixels while the exterior shadow was visibly present. Original PNGs and JSON remain byte-for-byte unchanged.
