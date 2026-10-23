# Research & Curation image readers

Only artist-supplied, already-watermarked WebPs are connected. No raw PDFs,
unmarked exports, fake papers or synthetic demo pages belong in these readers.

| Project | Page route | Actual image directory | Pages |
| --- | --- | --- | --- |
| At That Time, This Moment | projects/at-that-time-this-moment/ | public/images/research/at-that-time-this-moment/pages/ | 01–05 |
| Art Brut and Naive Art | projects/art-brut-and-naive-art/ | public/images/research/art-brut-and-naive-art/pages/ | 01–14 |
| Moments in Between | projects/moments-in-between/ | public/images/research/exhibition-proposal/pages/ | 01–12 |
| The Value of Printmaking in Children's Aesthetic Education | projects/printmaking-aesthetic-education/ | public/images/research/value-of-printmaking/pages/ | 01–02 |

All four prepared project pages are linked from the existing homepage entries;
there are no duplicate Exhibition Proposal or space-containing project routes.
Art Brut and Naive Art uses the latest confirmed display spelling. Its previously
provided longer essay title is retained separately as `paperTitle` in the data,
without adding extra visible text. Project types are Research Essay and Exhibition
Review respectively. Introductions remain null; no years have been invented.

## Shared stable components

`project-data.js` stores titles, types, actual asset directories, verified numeric
page order and intrinsic image dimensions. Portrait papers use the unchanged shared
renderer at up to 780px wide; Moments in Between retains its 1160px-wide spread
reader. All images keep their true ratio. The first image loads eagerly and later
ones lazily. Original WebPs are never transformed or marked again.

`image-viewer.js` contains the existing stable research viewer extracted without
changing its behavior. `viewer.js` continues to initialize it for the Moments reader;
`essay-viewer.js` initializes it after the new essay/review reader is ready. It opens
the exact original source and supports full-page fit, +/−, wheel/double-click zoom,
drag, Escape, focus/keyboard support, touch pinch and restoration of scroll position.
Only the two essay/review pages load `essay.css`, so their gentle header entrance
and delayed static star/line appearance cannot affect Moments in Between. Reduced
motion disables these animations. There is no added image animation or CSS watermark.

## Uploading additional pages

Upload only watermarked WebPs to the exact directory in the table. Zero-padded
numeric filenames (`01.webp`, `02.webp`, …) are recommended. `essay-reader.js`
initially renders the verified local page list, then discovers each of these two
projects' public source-directory WebPs and sorts their names numerically. A new
file is included only after its public image URL is available in Pages; this avoids
broken images between upload and deployment. PDFs and directories are excluded.

If the public GitHub API is blocked, rate-limited or slow, the reader keeps the
verified list rather than leaving readers with a blank page. After later uploads,
refresh the `pages` fallback list and actual pixel dimensions in `project-data.js`
too, so all new pages remain available even without API access. Directory discovery
is scoped to these two projects and does not change the Moments reading behavior.

If both the verified data and uploaded directory are empty, the title/navigation
remain but no placeholder, invented text or empty viewer is displayed. All original
research input PDFs remain private and outside the public repository.

The two-page Chinese journal article uses its own small reader entry and the
shared portrait renderer/viewer. Its type is Published Journal Article. No abstract,
translation, journal name, year or other unconfirmed publication data is added.

## Static whitespace ornaments

All four research entry pages load `ornaments.css` / `ornaments.js`. Two small
header marks and a sparse alternating pattern along page margins reuse the existing
four-point star and one-pixel line. Marks remain outside the image rectangles and
are never baked into or placed over a work. Responsive offsets fit even narrow
phone margins. The enhancement adds no page height, reading gap, image transform,
animation or pointer target. A direct-child observer decorates any page nodes
replaced after optional source-directory discovery, without duplicating marks.
