# Printmaking — static clustered edition

22 original WebPs form nine distinct viewing units. There are no hover effects,
image links, lightboxes, captions, group labels or animations.

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
12–15 together. All other series, artwork titles, physical dimensions, media and
years remain exactly as previously stored (null). Pixel sizes only describe files.

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
