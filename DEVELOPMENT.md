# Homepage preview

No build or package installation is needed. From `/workspace/porfolio`, run:

```sh
python -m http.server 3000 --bind 0.0.0.0
```

`index.html`, `style.css`, and `app.js` implement the homepage only. Desktop composition follows the supplied 1600 × 900 JSON. `assets/logo.png`, `person.png`, and `desk.png` are decoded byte-for-byte from its embedded image sources; supplied root images and JSON remain unchanged. CSS uses proportional image fitting without editing image files. The small decorations JSON copies only decorative items to avoid downloading the full embedded-image layout at runtime.

Hover or click each illustration to reveal its list. Arrow Down on its button opens the list and focuses the first project; Escape, Close, or an outside click closes it. Touch uses tap to expand. Lists occupy the outer side columns to avoid the fixed artwork, with independent overflow when needed. Small screens show lists below the artwork. Project buttons show an explicit pending-details notice; no project-detail content or email has been invented.

Before adding detail pages, obtain approval of the homepage. Email remains to be supplied. Original JSON remains the composition reference; update CSS coordinates deliberately if the composition changes.
