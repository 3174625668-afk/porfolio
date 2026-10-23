import { ready } from './reader.js?v=journal-1';
import { attachResearchViewer } from '../research-shared/image-viewer.js?v=research-pages-1';

await ready;
// On this two-page reader, a touch close can dispatch a compatibility click onto
// the other page after scroll restoration. Suppress that click across controls
// and reading images, while preserving real touch releases and keyboard clicks.
let lastTouchRelease = -Infinity;
const activationTarget = target => target instanceof Element
  && target.closest('.reading-page img, .research-viewer-tools button');
document.addEventListener('pointerup', event => {
  if (['touch', 'pen'].includes(event.pointerType) && activationTarget(event.target)) {
    lastTouchRelease = performance.now();
  }
}, true);
document.addEventListener('click', event => {
  const fromTouch = event.pointerType
    ? ['touch', 'pen'].includes(event.pointerType)
    : event.sourceCapabilities?.firesTouchEvents !== false;
  if (event.detail !== 0 && fromTouch && activationTarget(event.target)
      && performance.now() - lastTouchRelease < 700) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);
attachResearchViewer();
