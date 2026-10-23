# Reusable project detail pages

Two initial previews use the same HTML structure and shared renderer/styles:

- `projects/to-the-last-ounce/`: landscape art-project reading width (up to 1160px).
- `projects/art-brut-and-naive-art/`: portrait research reading width (up to 780px).

Homepage and `projects/not-that-scary-ii/` are independent and unchanged. These two
previews are deliberately not connected to the homepage until content is ready.

## Add content

1. Upload only web display images to the project's folder:
   `public/images/<project-id>/pages/`. Do not upload original research PDFs.
2. In `project-data.js`, fill in the artist-approved `introduction` and list `pages`
   in the intended reading order. No filename order is inferred automatically.
3. A page entry is `{ file: '01.jpg', alt: 'Your description', width: 1600, height: 900 }`.
   Supply the image's actual pixel dimensions. Supported extensions: JPG/JPEG,
   PNG, WebP and AVIF. Images stay complete at their natural aspect ratio.
4. Keep `introduction: null` and `pages: []` until the actual content is available.
   Empty content produces no placeholder, invented description or unfinished label.

`displayTitle` retains the short listing title. The detail heading uses `fullTitle`.
`type` is stored for future use and is not displayed. `template` is `landscape` or
`portrait`; it selects reading width rather than forcing an aspect ratio or crop.
`imageDirectory` is relative to the site root, including on GitHub Pages `/porfolio/`.

## Add another project later

Copy one of the two project HTML entry files into `projects/<project-id>/index.html`.
Set its `data-project`, initial `data-template`, title and heading, then add its
content record to `project-data.js`. Both formats continue using `detail.css` and
`detail.js`; do not duplicate the renderer. Homepage linking is a separate step.

No PDF embeds, downloads, nested scroll containers, carousels, animation, image
filters or placeholder images are included. Stars and lines use the homepage's
four-point polygon, black fill and one-pixel line style, scoped to these pages.

## One-time scroll entrance (opt-in)

`scroll-reveal.js` is enabled only by a page's `data-scroll-reveal` selector.
The added research readers select each reading image; The Law selects an entire
single/spread trigger; Not That Scary Ⅱ selects overview figures and full-work units;
Printmaking selects individual artwork figures. Their original DOM, dimensions,
spacing, reading order, decorations and child hover transforms stay intact.

Only targets still below the viewport are prepared. They fade in and rise 16px
once over 520ms, matching the existing art-project effect. Already-visible/passed
targets are never reset. Hover, touch and focus complete the target immediately so
captions, zoom and jump links remain responsive. Effects are canceled after finishing,
leaving the identical visible base style. No CSS permanently hides any image.

Intersection Observer is backed by passive, frame-batched scroll checks. A child-list
observer handles readers that render or discover pages asynchronously. Unsupported
APIs, animation failures, reduced-motion changes and history/pagehide restore readable
base styles. Only pending entrances need scroll listeners. No persistent `will-change`,
scroll snapping, parallax, scale or image processing is introduced.

The two reference projects (Nothing, Yet Not Nothing and Not That Scary) and To the
Last Ounce retain their existing equivalent animations; this helper is not layered
onto them. The homepage remains unchanged. Printmaking's static builder inlines this
same helper so its canonical and comparison pages remain self-contained.
