# Not That Scary Ⅱ

This page currently renders one static composition of eight small previews using the original full-resolution WebPs,
with the series title and bilingual artwork names revealed on hover, keyboard focus,
or keyboard focus. Only one artwork is active at a time; clicking outside or
pressing Escape dismisses its name. Captions fade over 200ms, with reduced-motion
preferences respected. Homepage files are untouched.

Captions are positioned 9px below each image. The original 42px caption space is
reserved on every figure so both desktop and mobile image coordinates remain
unchanged. Small stars and hairlines are static, authored in existing white space.

Edit titles and retained artwork metadata in `series-data.js`. `staticLayout` controls
the current composition; `viewingOrder` independently controls the full-image reading
sequence. Historical layout studies are data only and are not rendered.

`thumbnail` retains the original JPG paths for reference. Both the overview and reading area use `fullImage`, pointing to the original uploaded
WebP in `public/images/not-that-scary-ii/full/`. Its intrinsic `fullWidth` and
`fullHeight` are separate from thumbnail geometry and reserve space before loading.
Reading-area images use native lazy loading. The first overview preview loads eagerly;
other previews receive their original WebP URL within 100px of the viewport, with
native lazy loading as the fallback when Intersection Observer is unavailable. The overview retains its authored preview
boxes and contains the WebPs without cropping or stretching, preserving the composition
despite small differences between the JPG and WebP aspect ratios.

Below the overview, all eight full images appear in `viewingOrder`, with permanent
Chinese and English titles and `Etching · dimensions · 2026` captions. Image-to-caption
spacing is 16px. Images retain their own ratios, center within the page, and fit
within a comfortable viewport height without enlarging portraits to landscape width.

Clicking or tapping an overview image scrolls to its matching full-image figure.
Keyboard activation works too; focus moves without a separate jump. Reduced-motion
preferences select ordinary scrolling instead of smooth scrolling. The homepage,
overview placements, title hover animation and decorations are unchanged.

All images retain their original proportions. One common physical long-edge scale
is applied to the desktop composition and mobile single-column layout.
