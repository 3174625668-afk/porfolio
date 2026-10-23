# Research image reading structure

`project-data.js` contains the four confirmed Research & Curation project titles,
project categories, image directories, page arrays and null introductions.
Moments in Between now uses twelve artist-uploaded, watermarked WebPs. The other
three research projects remain empty. Only Moments in Between is linked from the
homepage; the existing Art Brut and Naïve Art page remains an empty template. The essay's short display title and full formal title stay distinct.

| Homepage project id | Future page route | Current state |
| --- | --- | --- |
| art-brut-and-naive-art | projects/art-brut-and-naive-art/ | Existing empty portrait template |
| moments-in-between | projects/moments-in-between/ | 12 approved WebP spreads connected |
| at-that-time-this-moment | projects/at-that-time-this-moment/ | Data prepared; page not published |
| printmaking-aesthetic-education | projects/printmaking-aesthetic-education/ | Data prepared; page not published |

The homepage opens Moments in Between; its other research entries retain the
existing availability notice. Homepage visuals and hover interactions are unchanged. There are no fake essays, synthetic
test pages, placeholders, PDF embeds, download links or raw PDF paths in this reader.

The research reader reuses the unchanged shared renderer: 780px maximum width
for portrait papers, 1160px for the actual 2:1 Moments in Between spreads, natural
image ratios, ordinary continuous scrolling and lazy loading after the first page. The research-scoped viewer mirrors the existing stable image
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
`scripts/research-watermark/pdf_to_webp.py`. Projects without approved uploads retain empty page arrays.
For another research entry later, reuse the existing research HTML structure with its
own `data-project` id and `data-section="research"`, and include this reader/viewer.
