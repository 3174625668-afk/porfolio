# Research reading structure — no real content in phase one

`project-data.js` contains the four confirmed Research & Curation project titles,
original categories, future image directories, empty page arrays and null introductions.
Only the existing Art Brut and Naïve Art entry page is connected to this renderer.
Other research entry pages and all four homepage links remain unopened until content
is approved. The essay's short display title and full formal title stay distinct.

| Homepage project id | Future page route | Current state |
| --- | --- | --- |
| art-brut-and-naive-art | projects/art-brut-and-naive-art/ | Existing empty portrait template |
| moments-in-between | projects/moments-in-between/ | Data prepared; page not published |
| at-that-time-this-moment | projects/at-that-time-this-moment/ | Data prepared; page not published |
| printmaking-aesthetic-education | projects/printmaking-aesthetic-education/ | Data prepared; page not published |

The homepage still shows its existing availability notice for these entries; no
homepage visuals or interactions were changed. There are no fake essays, synthetic
test pages, placeholders, PDF embeds, download links or raw PDF paths in this reader.

The research reader reuses the unchanged shared portrait renderer (maximum width
780px, natural image ratios, continuous ordinary document scrolling and lazy loading
after the first image). The research-scoped viewer mirrors the existing stable image
viewer: same original WebP, full-page fit, +/−, wheel/double-click zoom, drag, Esc,
keyboard access, touch pinch and scroll restoration. No dialog is created for empty
content. Existing Art Practice and Printmaking files are not modified.

After approval, put only watermarked WebPs in the corresponding public image directory.
Add entries in reading order:

```js
pages: [
  { file: '01.webp', width: 1985, height: 2807, alt: 'Artist-approved page description' },
]
```

Use actual exported pixel sizes from the private conversion manifest, not a guessed
A4 size. The reader accepts WebPs only; the converter lives at
`scripts/research-watermark/pdf_to_webp.py`. All page arrays remain empty in phase one.
For another research entry later, reuse the existing research HTML structure with its
own `data-project` id and `data-section="research"`, and include this reader/viewer.
