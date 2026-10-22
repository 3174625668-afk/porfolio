// Text-only particles: the live, accessible title stays in the DOM throughout.
export function attachTextDust(target) {
  const title = target.querySelector('strong');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let layer, context, points = [], frame = 0, started = 0, cursor = { x: 0, y: 0 };
  const padding = 24;

  function build() {
    const rect = title.getBoundingClientRect();
    const style = getComputedStyle(title);
    const mask = document.createElement('canvas');
    mask.width = Math.ceil(rect.width);
    mask.height = Math.ceil(rect.height);
    const ink = mask.getContext('2d', { willReadFrequently: true });
    ink.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ink.fillStyle = '#111';
    ink.textBaseline = 'alphabetic';
    const ascent = ink.measureText('M').fontBoundingBoxAscent;
    const text = title.firstChild;
    const range = document.createRange();
    // Use the browser's actual character positions, including line wrapping/alignment.
    for (let i = 0; i < text.length; i++) {
      range.setStart(text, i);
      range.setEnd(text, i + 1);
      const box = range.getBoundingClientRect();
      ink.fillText(text.textContent[i], box.x - rect.x, box.y - rect.y + ascent);
    }
    const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;
    points = [];
    for (let y = 1; y < mask.height; y += 3) {
      for (let x = 1; x < mask.width; x += 3) {
        if (pixels[(y * mask.width + x) * 4 + 3] > 100) {
          const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          points.push({ x, y, random: seed - Math.floor(seed) });
        }
      }
    }
    if (!layer) {
      layer = document.createElement('canvas');
      layer.className = 'title-dust';
      layer.setAttribute('aria-hidden', 'true');
      target.append(layer);
    }
    const scale = Math.min(devicePixelRatio || 1, 2);
    const layerWidth = Math.min(rect.width + padding * 2, document.documentElement.clientWidth - rect.left + padding);
    layer.width = Math.ceil(layerWidth * scale);
    layer.height = Math.ceil((rect.height + padding * 2) * scale);
    layer.style.width = layerWidth + 'px';
    layer.style.height = rect.height + padding * 2 + 'px';
    context = layer.getContext('2d');
    context.scale(scale, scale);
  }

  function draw(now) {
    if (!target.classList.contains('is-dispersing') || motion.matches) return;
    const progress = Math.min(1, (now - started) / 280);
    const eased = 1 - (1 - progress) ** 3;
    const width = parseFloat(layer.style.width), height = parseFloat(layer.style.height);
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#111';
    context.shadowColor = 'rgba(17,17,17,.28)';
    context.shadowBlur = 1.2;
    for (const point of points) {
      const dx = point.x - cursor.x, dy = point.y - cursor.y;
      const distance = Math.hypot(dx, dy);
      const influence = Math.max(0, 1 - distance / 145);
      const angle = point.random * Math.PI * 2;
      const spread = eased * (2 + influence * 14) * (0.35 + point.random * .65);
      const drift = Math.sin(now / 620 + point.random * 6) * .7 * eased;
      const x = point.x + Math.cos(angle) * spread + drift;
      const y = point.y + Math.sin(angle) * spread + drift;
      context.globalAlpha = .45 + point.random * .5;
      context.beginPath();
      context.arc(x + padding, y + padding, .65 + point.random * .65, 0, Math.PI * 2);
      context.fill();
    }
    frame = requestAnimationFrame(draw);
  }

  function stop() {
    cancelAnimationFrame(frame);
    target.classList.remove('is-dispersing');
  }
  target.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || motion.matches) return;
    const rect = title.getBoundingClientRect();
    cursor = { x: event.clientX - rect.x, y: event.clientY - rect.y };
    build();
    cancelAnimationFrame(frame);
    started = performance.now();
    target.classList.add('is-dispersing');
    frame = requestAnimationFrame(draw);
  });
  target.addEventListener('pointermove', event => {
    const rect = title.getBoundingClientRect();
    cursor = { x: event.clientX - rect.x, y: event.clientY - rect.y };
  });
  target.addEventListener('pointerleave', stop);
  motion.addEventListener('change', stop);
  new MutationObserver(() => {
    if (target.closest('.projects').hidden) stop();
  }).observe(target.closest('.projects') || target.parentNode || target, { attributes: true, attributeFilter: ['hidden'] });
  window.addEventListener('resize', stop, { passive: true });
}
