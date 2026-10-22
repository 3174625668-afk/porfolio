# Homepage preview

No build or package installation is needed. From `/workspace/porfolio`, run:

```sh
python -m http.server 3000 --bind 0.0.0.0
```

`index.html`, `style.css`, and `app.js` implement the homepage only. Desktop composition follows the supplied 1600 × 900 JSON. `assets/logo.png`, `person.png`, and `desk.png` are decoded byte-for-byte from its embedded image sources; supplied root images and JSON remain unchanged. CSS uses proportional image fitting without editing image files. The small decorations JSON copies only decorative items to avoid downloading the full embedded-image layout at runtime.

Hover or click each illustration to reveal its list. Arrow Down on its button opens the list and focuses the first project; Escape, Close, or an outside click closes it. Touch uses tap to expand. Desktop lists use the wide upper corners with independent scrolling, preserving JSON title sizes without covering the fixed artwork. Small screens show lists below the artwork. Project buttons show an explicit pending-details notice; no project-detail content or email has been invented.

Before adding detail pages, obtain approval of the homepage. Email remains to be supplied. Original JSON remains the composition reference; update CSS coordinates deliberately if the composition changes.

## Current homepage interactions

`projects.js` stores the approved homepage `displayTitle`, future `fullTitle`, and uppercase category. Other Works is a non-navigating, focusable group heading in Art Practice only; hovering, focusing, or tapping it reveals SELECTED WORKS. The graduation project is a separate entry, Not That Scary Ⅱ (U+2161), with its Chinese original title preserved in data. A small licensed font subset ensures that numeral renders on systems missing the glyph; it does not affect other text or artwork.

Opening a section does not reveal any categories. Hovering a project title or focusing it with the keyboard reveals only that project's type. Space is reserved below every title so labels do not shift other rows. Hovering the label itself stays inside the same project target. Moving through the canvas between illustration and list keeps the list open. Escape, Close, an outside click, or leaving the entire canvas closes it. The two sections are mutually exclusive, and decorations stay visible and fixed while expanded.

On touch devices, tap an illustration to expand/collapse it. The first tap on a project reveals its category; the second shows the existing availability notice. Tap another project to switch the category. There are no project detail pages or project preview images.

Run `python scripts/build-preview.py` after homepage edits to refresh `previews/home-interactive.html`. This is a standalone interactive copy that can be downloaded from GitHub and opened directly in a local browser; it needs no server or external files. The original source remains index.html, style.css, app.js, projects.js, and assets/.


## Full-size typography and illustration feedback

At the 1600×900 design size, Art Practice titles are 60px/900, Research & Curation titles 56px/900, and Other Works 60px/700. Font sizes scale with the composition width on other desktop sizes. The original full-size list cannot fit into the former narrow margins beside fixed illustrations. Lists therefore scroll in the wider upper corner spaces, following the JSON's starting positions; SCROLL FOR MORE indicates continuation. Touch layouts retain the existing below-artwork lists.

HOVER TO EXPLORE ↗ appears in central white space before the first section activation. Pointer-coarse or hoverless devices see TAP TO EXPLORE. Only the original image element transforms on hover: translateY(-3px), scale(1.04), a soft 10% black drop shadow, 250ms ease-out. Its button, category label, and surrounding composition do not move. Touch gets a transient 1.02 lift. prefers-reduced-motion disables transitions, animation, image transforms, and shadows. Cursor feedback and all navigation remain available.
