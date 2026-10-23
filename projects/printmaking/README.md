# Printmaking — stage one

A static, authored gallery of all 22 original WebPs. No hover scaling, captions,
lightbox, entrance effects, scroll animation, media classification or invented text.

## Source assets

Actual filenames are `public/images/printmaking/artworks/1.webp` through `22.webp`.
The files are read unchanged. The six teacher-designed reference spreads inform
composition only; the gallery never requests or embeds them.

The spread `纯艺（20页）_19.jpg` explicitly labels the four images corresponding to
12–15 as Apple. Their series name is stored once in `series.apple`, and they remain
contiguous in both desktop placement and mobile reading order. Individual titles
remain null. All other titles, physical dimensions, media, years and series are null.
Pixel width/height are measured file geometry, not physical artwork dimensions.

## Editable data

`gallery-data.js` contains:

- `artworks`: IDs, exact source paths, measured pixel geometry and nullable metadata.
- `series`: confirmed series records with source evidence; no guessed memberships.
- `galleryGroups`: authored positions and widths on 1200-unit fields, plus sparse
  static stars/lines. These groups describe composition, not artwork classification.
- `galleryOrder`: editorial reading order, independent of source filenames.
- `artworkRecords`: records with zero-based `displayOrder` and `groupId` added.

The first arrangement moves from the red/blue quartet through related dark colour,
warm red, pale colour and muted painted surfaces into soft grey and denser black
textures. Reference relationships are echoed without copying portfolio-page layouts.

Desktop placement is fixed by the authored coordinates. At 800px and below, each
field becomes a natural single-column flow in the same editorial order. Images
always retain their intrinsic ratio; no fixed image frames, cropping, overlap,
borders, shadows, transforms or animations are used. Only the first image is eager;
remaining images use native lazy loading with intrinsic dimensions reserved.

The homepage changes only the existing Printmaking entry's destination and cache
versions. Other project pages and all original assets remain unchanged. Stage two
interactions are intentionally not implemented until the artist approves this layout.
