# Homepage preview

No build or package installation is needed. From `/workspace/porfolio`, run:

```sh
python -m http.server 3000 --bind 0.0.0.0
```

`index.html`, `style.css`, and `app.js` implement the homepage only. Desktop composition follows the supplied 1600 × 900 JSON. `assets/logo.png`, `person.png`, and `desk.png` are decoded byte-for-byte from its embedded image sources; supplied root images and JSON remain unchanged. CSS uses proportional image fitting without editing image files. The small decorations JSON copies only decorative items to avoid downloading the full embedded-image layout at runtime.

Hover or click each illustration to reveal its list. Arrow Down on its button opens the list and focuses the first project; Escape, Close, or an outside click closes it. Touch uses tap to expand. Lists occupy the outer side columns to avoid the fixed artwork, with independent overflow when needed. Small screens show lists below the artwork. Project buttons show an explicit pending-details notice; no project-detail content or email has been invented.

Before adding detail pages, obtain approval of the homepage. Email remains to be supplied. Original JSON remains the composition reference; update CSS coordinates deliberately if the composition changes.

## Current homepage interactions

`projects.js` stores the approved homepage `displayTitle`, future `fullTitle`, and uppercase category. Other Works is a noninteractive heading in Art Practice only. The graduation project is a separate entry, Not That Scary Ⅱ (U+2161), with its Chinese original title preserved in data. A small licensed font subset ensures that numeral renders on systems missing the glyph; it does not affect other text or artwork.

Opening a section does not reveal any categories. Hovering a project title or focusing it with the keyboard reveals only that project's type. Space is reserved below every title so labels do not shift other rows. Hovering the label itself stays inside the same project target. Moving through the canvas between illustration and list keeps the list open. Escape, Close, an outside click, or leaving the entire canvas closes it. The two sections are mutually exclusive, and decorations stay visible and fixed while expanded.

On touch devices, tap an illustration to expand/collapse it. The first tap on a project reveals its category; the second shows the existing availability notice. Tap another project to switch the category. There are no project detail pages or project preview images.

Run `python scripts/build-preview.py` after homepage edits to refresh `previews/home-interactive.html`. This is a standalone interactive copy that can be downloaded from GitHub and opened directly in a local browser; it needs no server or external files. The original source remains index.html, style.css, app.js, projects.js, and assets/.
