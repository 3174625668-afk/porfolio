# Not That Scary Ⅱ

This page currently renders one static composition of the eight original thumbnails,
with the series title and bilingual artwork names revealed on hover, keyboard focus,
or a touch-device tap. Only one artwork is active at a time; clicking outside or
pressing Escape dismisses its name. Captions fade over 200ms, with reduced-motion
preferences respected. Homepage files are untouched.

Captions are positioned 9px below each image. The original 42px caption space is
reserved on every figure so both desktop and mobile image coordinates remain
unchanged. Small stars and hairlines are static, authored in existing white space.

Edit titles and retained artwork metadata in `series-data.js`. `staticLayout` controls
the current composition; `viewingOrder` independently preserves a future detail-view
sequence. Historical layout studies are data only and are not rendered.

`thumbnail` is used for this overview. `fullImage` remains null until a genuine
high-resolution image is uploaded; `plannedFullImage` reserves its future path.
Neither unfinished full-image sections nor metadata are currently displayed.

All images retain their original proportions. One common physical long-edge scale
is applied to the desktop composition and mobile single-column layout.
