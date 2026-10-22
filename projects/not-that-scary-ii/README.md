# Not That Scary Ⅱ — comparison preview

Direct pages (same page, two retained studies):

- `./?layout=a` — Open Field / 开放星座
- `./?layout=b` — Offset Folios / 错页对话

Neither study is a finalized layout. The in-page tabs switch previews without changing the eight-work reading sequence. This page is intentionally independent: homepage source, artwork, typography, cursor, and hover/click handlers remain unchanged while the layouts are reviewed.

## Images and data

`series-data.js` is the single editable source for Chinese/English titles, medium, dimensions, year, media fields, reading order, and both authored placement maps. English titles are provisional and are not burned into images.

The eight `thumbnail` paths point to the original unmodified files in `public/images/not-that-scary-ii/`. The overview uses those actual images only. No crops, filters, compression, image rotation, borders, shadows, or covering layers are applied. Natural image dimensions reserve their original aspect ratios. Long edges use the same scale per physical centimetre in both designs; photographed proportions take precedence over deriving a new aspect ratio from the printed dimensions. This avoids distorting photographs that include different margins.

`viewingOrder` independently controls full-work sequence and numbering. `overviewLayouts[*].placements` controls each overview, with a 1200-unit width. Coordinates and long-edge scale are editable data; no manual dragging is required. Up to 900px the overview becomes a natural single column.

## High-resolution work component

Each work has `fullImage: null` and an editable `plannedFullImage` path. The planned path is a suggestion, not an existing file or a network request. Once the artist uploads real high-resolution images (to that directory or any other chosen directory), set each `fullImage` to its actual relative path. Do not point it to `thumbnail`. The component explicitly rejects a thumbnail URL reused as a full image.

Until then, each valid `#work-a` through `#work-h` target shows the correct bilingual title and metadata plus FULL IMAGE COMING SOON. No image request is made for a null field. With a fullImage path configured, loading begins near the work's section and an image is inserted only after successful loading. A failed file leaves the coming-soon text, never a broken image. Both image orientations are centered and contained at natural proportions.

The artist's English statement is not supplied and remains `series.introduction: null`. Add the provided text there to reveal the reserved introduction paragraph. No creative statement was invented.

## Checks

Validated both desktop layouts at 1280/1600/1920px: all eight genuine images, four portrait/four landscape, undistorted full images, a shared long-edge scale, no pairwise overlap, no borders/shadows/filters/rotation, hidden captions by default, hover labels without layout shift, all eight working work anchors, query deep links and switch tabs, exact titles and dimensions, and all eight coming-soon states. Phone/tablet checks include no horizontal overflow, single-column flow and tap navigation. A missing configured full-image file retains the textual fallback without inserting a broken image. Source image and homepage Git diffs are empty.
