# Nothing, Yet Not Nothing

Uses the existing shared landscape reader without modifying it. Project-only CSS
and animations follow To the Last Ounce's current title, gutter marks and one-time
entrance style. No introduction is invented; `introduction` remains null.

## Images

Upload display images to `public/images/nothing-yet-not-nothing/pages/`.
Supported formats: WebP, JPG/JPEG, PNG and AVIF. Original PDFs are not exposed.
The five actual pages 01–05 were moved here unchanged from the project folder.
`project-data.js` records real filenames and pixel dimensions (4400 × 2200).

`reader.js` reads the public GitHub source directory and sorts filenames numerically
(2 before 10). New source images are included only once their public Pages copies
exist. Requests time out after 1.5 seconds; offline/API-limit failures use the verified
fallback list. Add future uploads to `project-data.js` with real dimensions as well
for offline fallback and reserved layout space. Unknown dimensions are never guessed;
image metadata discovery does not download full images. Native lazy loading remains.

## Resilience

Reading loads independently of `project.js`. The animation module decorates gutters
and prepares only offscreen images with known dimensions for a one-time 520ms,
16px entrance. Already visible images are never reset to transparent. Reduced-motion
preferences restore ordinary reading. Missing animation APIs or a failed enhancement
script leave the reader visible.

The homepage change is the URL plus resource version updates only. To the Last Ounce,
Not That Scary Ⅱ, shared styling/rendering and research pages are unchanged.
