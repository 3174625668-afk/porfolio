# Printmaking — static clustered edition

22 original WebPs form nine distinct viewing units. Images remain static.
Hover, keyboard focus or touch reveals one caption for the 18 standalone images.
Apple has one permanent shared series label; no lightbox is added.

## Editorial structure

1. 12–15: Apple alone, compact two-by-two quartet, with no other artwork inserted.
2. 21 / 06: warm colour and grey horizontal compositions, side by side.
3. 01 / 02 / 03: one broad lead image and two smaller upright companions.
4. 16 / 17 / 18: an upright triptych, returning to colour after the black/white group.
5. 10 / 11: an upright and a horizontal painted surface in a close dialogue.
6. 04 / 05: two horizontal works stacked as a compact, right-aligned unit.
7. 22 / 20: two upright grey compositions sharing a baseline and height.
8. 07 / 08 / 09: three bold black/white forms arranged around their different silhouettes.
9. 19: a larger independent circular composition, centered at the close.

These are visual relationships, not newly asserted media or formal series. Apple
remains the only confirmed series: the teacher's `纯艺（20页）_19.jpg` explicitly labels
12–15 together. Confirmed bilingual titles, media and years come from
`gallery-data.js`; physical dimensions remain null. Pixel sizes describe files only.

## Layout and data

`gallery-data.js` preserves the original asset/series records. `galleryGroups` now
stores group membership, a layout type, alignment, maximum width and sparse marks.
`galleryOrder` and each record's `groupId`/zero-based `displayOrder` derive from that
editorial sequence. Reference spreads inform composition but are never embedded.

Group interiors use 18–26px gaps on desktop; separate units have 110–160px of space.
On mobile, internal gaps reduce to 12–14px and units retain 76px separation. Layouts
adapt individually: the Apple quartet remains together, the lead image sits above
its companions, and portrait/ink groups keep their internal hierarchy. No cards,
frames, background panels or standardized image boxes are introduced. All images
use their own complete natural ratio, with intrinsic dimensions and lazy loading.

This revision changes only Printmaking files. The homepage destination was already
connected and is not modified, and all other project pages and originals stay intact.

## Self-contained public preview

Run `node projects/printmaking/build-static.mjs` after changing gallery data or CSS.
It generates `index.html` and `clusters-v2.html` with identical cluster markup and
inline styles. Neither page needs JavaScript or separately cached stylesheets to
render. `clusters-v2.html` provides a distinct preview URL for checking whether a
Pages deployment contains this revision. The data and CSS remain the edit sources;
regenerate rather than editing the generated HTML directly.

## Artwork captions

`captions.js` opens one label on pointer hover, focus or touch and closes it on
leaving, blur, Escape or an outside tap. All names and media/year lines are rendered
from the data at build time. Apple images have no individual hover controls or
captions. Its shared series label sits to the right of the quartet on wide screens,
and immediately below it, aligned right, when there is no lateral space. Overlay labels
prefer the 8px space beneath an image. When tight rows make this impossible,
they use nearby clear space above/beside the image or at the group's edge.
Collision checks include images, decorations, title, navigation and the shared
series label. No image,
cluster or page dimension changes. Reduced motion disables label transitions.
The build inlines the small caption script too, avoiding cached script versions.
