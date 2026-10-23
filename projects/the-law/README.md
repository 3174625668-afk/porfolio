# The Law /《律》— book design reader

Canonical page: `projects/the-law/`. Its existing homepage entry is connected.
Resources remain under `public/images/the-law/{cover,interior,poster,invitation}/`.
All 34 artist uploads are used unchanged: 1 cover, 31 interiors, 1 poster, 1 invitation.
No original file is renamed, cropped, recompressed, composited or watermarked.

## Explicit reading order

`project-data.js` separately stores intrinsic image records and literal reading units:

- 11 `single-page` units: 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11.
- 10 `double-spread` units: 12+13, 14+15, 16+17, 18+19, 20+21, 22+23,
  24+25, 26+27, 28+29, 30+31.

Each unit owns its page IDs. CSS only displays those units; it never determines
pairs from wrapping, parity or `nth-child`. Page 11 cannot be paired with 12.
There is no blank page at the transition. All 31 IDs occur exactly once.
If an image record is unavailable later, the incomplete unit is omitted; subsequent
pairs never shift and no substitute/blank page is created.

Section order is fixed: The Law title → Cover → Book Interior → Poster → Invitation.
No year, material, introduction or invented project text is added.

## Ratios and seams

The actual numbered interior JPGs are each 1683 × 1190, and each is preserved as
one numbered source regardless of content inside that file. Single units are centered
up to 900px wide; a double unit uses the full reading width up to 1160px. Its two
images share a visual height, maintain their individual natural ratios and meet at
zero CSS gap. Original whitespace inside an image is retained, not cropped away.
No borders, shadows, page overlays or artificial gutters are added.

Mobile scales the complete horizontal unit; it never stacks the two pages.
The cover, poster and invitation follow their own original image proportions.
First image loads eagerly, later images lazily; dimensions reserve reading space.
The heading and each reading unit have gentle, one-time entrances, disabled for
reduced motion. A double spread animates as one complete unit, never two halves.

## Full-spread viewing

Click either part of a unit (or focus its button and press Enter/Space) to open it.
`viewer.js` uses the stable site's pan/zoom approach, scoped to this project. A spread
opens as two original image elements inside one transformable DOM surface. No new
combined image or low-resolution screenshot is generated. Both pages fit initially,
stay flush and move/zoom together. Zoom stops before enlarging beyond the limiting
source resolution. +/−, wheel, double-click, drag, keyboard controls, Esc and mobile
pinch are supported. Closing restores the reading position and focus. Touch
compatibility clicks are suppressed across controls so close cannot reopen a unit.

All code/styles are local to this page. Other completed project files and their
original resources are unchanged. Homepage changes only add The Law's route and
refresh route-module cache versions; its established visual design is unchanged.
