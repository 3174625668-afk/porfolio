# Not That Scary — installation project

This page is separate from `not-that-scary-ii` (the graduation etching series).
The six verified originals `纯艺（20页）_09.webp` through `_14.webp` are displayed
in numeric order, at their natural 4400 × 2200 ratio. No introduction is supplied.

`project-data.js` stores the verified page list and intrinsic sizes. `reader.js`
uses the existing shared landscape renderer and optional public source-directory
discovery; a blocked or unavailable API falls back to the verified six-page list.
JPG/JPEG, PNG and WebP filenames are supported, sorted numerically. Reading images
are lazy-loaded after the first page, without cropping or resampling the originals.

The project-scoped animation and image-viewer modules mirror the stable Nothing,
Yet Not Nothing implementation. They keep the existing projects and shared files
unchanged, with local selectors and a separate viewer dialog. The viewer opens the
same original image and supports zoom, drag, keyboard controls and touch pinch.
Reduced-motion users get a static reader; animation failures restore visible images.

The homepage points to `projects/not-that-scary/`. Its appearance is unchanged;
only this project link and the route-data cache versions were updated.
