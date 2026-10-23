import { ready } from './reader.js?v=scary-1';

await ready;
if (document.body.dataset.project === 'not-that-scary') {
  const pages = [...document.querySelectorAll('.reading-page')];
  const ornaments = [
    [{ type: 'line', side: 'left', top: 38 }, { type: 'star', side: 'right', top: 68 }],
    [{ type: 'star', side: 'left', top: 20 }, { type: 'line', side: 'right', top: 72 }],
    [{ type: 'line', side: 'left', top: 60 }, { type: 'star', side: 'right', top: 30 }],
    [{ type: 'star', side: 'left', top: 55 }, { type: 'line', side: 'right', top: 28 }],
    [{ type: 'line', side: 'left', top: 25 }, { type: 'star', side: 'right', top: 65 }],
  ];
  pages.forEach((page, index) => {
    const image = page.querySelector('img');
    const surface = document.createElement('div');
    surface.className = 'scary-page-surface';
    image.replaceWith(surface);
    surface.append(image);
    for (const { type, side, top } of ornaments[index % ornaments.length]) {
      const mark = document.createElement('span');
      mark.className = `${type} scary-page-${type} scary-${side}`;
      mark.style.top = `${top}%`;
      mark.setAttribute('aria-hidden', 'true');
      page.append(mark);
    }
  });

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  const pending = new Map();
  let observer;
  let frame = 0;

  function stopWatching() {
    observer?.disconnect();
    window.removeEventListener('scroll', scheduleCheck);
    window.removeEventListener('resize', scheduleCheck);
    window.removeEventListener('pageshow', scheduleCheck);
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function reveal(page) {
    const animation = pending.get(page);
    if (!animation) return;
    pending.delete(page);
    observer?.unobserve(page);
    try {
      if (motion.matches) animation.cancel();
      else animation.play();
    } catch {
      animation.cancel();
    }
    if (!pending.size) stopWatching();
  }

  function scheduleCheck() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      // Passive, frame-batched fallback if an observer callback is delayed or lost.
      for (const page of pending.keys()) {
        if (page.getBoundingClientRect().top <= window.innerHeight) reveal(page);
      }
    });
  }

  function restoreReader() {
    stopWatching();
    pending.clear();
    for (const animation of animations) animation.cancel();
    animations.clear();
  }

  // Never reset an image that has already been seen to opacity zero. Prepare only
  // offscreen images, before their first paint in the viewport. Base CSS stays visible.
  if (!motion.matches && 'IntersectionObserver' in window && 'animate' in Element.prototype) {
    try {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target);
        }
      }, { threshold: 0 });

      for (const page of pages) {
        if (page.getBoundingClientRect().top < window.innerHeight) continue;
        const image = page.querySelector('img');
        if (!image.hasAttribute('width') || !image.hasAttribute('height')) continue;
        // Animate the image and its clickable region together so they stay aligned.
        const animation = page.querySelector('.scary-page-surface').animate(
          [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 520, easing: 'ease-out', fill: 'both' },
        );
        animation.pause();
        animation.currentTime = 0;
        animations.add(animation);
        animation.finished.then(() => {
          animations.delete(animation);
          animation.cancel(); // Hand back to the identical, fully visible base style.
        }, () => animations.delete(animation));
        pending.set(page, animation);
        observer.observe(page);
      }

      if (pending.size) {
        window.addEventListener('scroll', scheduleCheck, { passive: true });
        window.addEventListener('resize', scheduleCheck, { passive: true });
        window.addEventListener('pageshow', scheduleCheck);
        scheduleCheck();
      } else stopWatching();
    } catch {
      restoreReader();
    }
  }

  motion.addEventListener('change', event => {
    if (event.matches) restoreReader();
  });
}
