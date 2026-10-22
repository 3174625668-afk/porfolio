// Cache dense stipple textures during idle time. Hover never samples glyphs or runs a paint loop.
const dustMotion = matchMedia('(prefers-reduced-motion: reduce)');
const dustPointer = matchMedia('(hover: hover) and (pointer: fine)');
const dustEntries = new Set();
let dustTimer;

function duringIdle(task) {
  if ('requestIdleCallback' in window) requestIdleCallback(task, { timeout: 800 });
  else setTimeout(task, 32);
}

function prepareDust(entry) {
  if (entry.ready || dustMotion.matches || !dustPointer.matches) return;
  const { target, title } = entry;
  const panel = target.closest('.projects');
  // Measure hidden sections without revealing them or changing the live layout.
  const measuringPanel = document.createElement('section');
  measuringPanel.className = panel.className;
  measuringPanel.setAttribute('aria-hidden', 'true');
  measuringPanel.inert = true;
  Object.assign(measuringPanel.style, {
    left: '-10000px', right: 'auto', top: '0', visibility: 'hidden', animation: 'none', pointerEvents: 'none',
  });
  const list = document.createElement('div');
  list.className = 'entries';
  let measuredTarget;
  // Retain nth-child width rules and the title's explicit line spans.
  for (const source of panel.querySelector('.entries').children) {
    const row = source.cloneNode(true);
    row.removeAttribute('id');
    row.removeAttribute('aria-describedby');
    row.classList.remove('is-dispersing');
    row.querySelectorAll('canvas').forEach(canvas => canvas.remove());
    row.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    list.append(row);
    if (source === target) measuredTarget = row;
  }
  measuringPanel.append(list);
  panel.parentNode.append(measuringPanel);
  const measuredTitle = measuredTarget.querySelector('strong');
  const rect = measuredTitle.getBoundingClientRect();
  const style = getComputedStyle(measuredTitle);
  const padding = 12;
  const mask = document.createElement('canvas');
  mask.width = Math.ceil(rect.width);
  mask.height = Math.ceil(rect.height);
  const ink = mask.getContext('2d', { willReadFrequently: true });
  ink.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const ascent = ink.measureText('M').fontBoundingBoxAscent || parseFloat(style.fontSize) * .9;
  const range = document.createRange();
  const walker = document.createTreeWalker(measuredTitle, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const text = walker.currentNode;
    for (let i = 0; i < text.length; i++) {
      if (/\s/.test(text.textContent[i])) continue;
      range.setStart(text, i);
      range.setEnd(text, i + 1);
      const box = range.getBoundingClientRect();
      ink.fillText(text.textContent[i], box.x - rect.x, box.y - rect.y + ascent);
    }
  }
  measuringPanel.remove();
  const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;
  const layer = entry.layer || document.createElement('canvas');
  layer.className = 'title-dust';
  layer.setAttribute('aria-hidden', 'true');
  layer.width = mask.width + padding * 2;
  layer.height = mask.height + padding * 2;
  layer.style.width = layer.width + 'px';
  layer.style.height = layer.height + 'px';
  const context = layer.getContext('2d');
  // Small solid stamps, no per-dot blur/shadow, no arcs, and no device-pixel-ratio multiplier.
  context.fillStyle = 'rgba(17,17,17,.9)';
  for (let y = 1; y < mask.height; y += 2) {
    for (let x = 1; x < mask.width; x += 2) {
      if (pixels[(y * mask.width + x) * 4 + 3] < 100) continue;
      const seed = Math.imul(x + 1, 73856093) ^ Math.imul(y + 1, 19349663);
      const dx = ((seed >>> 2) % 9 - 4) * .65;
      const dy = ((seed >>> 10) % 9 - 4) * .65;
      const size = .85 + (seed >>> 20) % 3 * .22;
      context.fillRect(x + padding + dx, y + padding + dy, size, size);
    }
  }
  if (!entry.layer) target.append(layer);
  entry.layer = layer;
  entry.ready = true;
  target.classList.add('dust-ready');
}

function warmDust() {
  if (!dustPointer.matches || dustMotion.matches) return;
  const queue = [...dustEntries].filter(entry => !entry.ready);
  function next() {
    const entry = queue.shift();
    if (entry) {
      if (dustEntries.has(entry)) prepareDust(entry);
      if (queue.length) duringIdle(next);
    }
  }
  duringIdle(next);
}

export function attachTextDust(target) {
  const entry = { target, title: target.querySelector('strong'), ready: false, layer: null };
  dustEntries.add(entry);
  function stop() { target.classList.remove('is-dispersing'); }
  target.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || dustMotion.matches) return;
    // A CSS stipple fallback is instant even if an idle cache is not ready yet.
    target.classList.add('is-dispersing');
  });
  target.addEventListener('pointerleave', stop);
  new MutationObserver(() => { if (target.closest('.projects').hidden) stop(); })
    .observe(target.closest('.projects'), { attributes: true, attributeFilter: ['hidden'] });
  // Register all titles first, and wait for the final font before caching.
  clearTimeout(dustTimer);
  dustTimer = setTimeout(() => document.fonts.ready.then(warmDust), 0);
}

window.addEventListener('resize', () => {
  clearTimeout(dustTimer);
  for (const entry of dustEntries) {
    entry.ready = false;
    entry.target.classList.remove('is-dispersing', 'dust-ready');
  }
  dustTimer = setTimeout(warmDust, 180);
}, { passive: true });
dustMotion.addEventListener('change', () => {
  if (dustMotion.matches) for (const entry of dustEntries) entry.target.classList.remove('is-dispersing');
  else warmDust();
});
dustPointer.addEventListener('change', warmDust);
