// Import the existing reader unchanged, then enhance only this project.
import '../shared/detail.js?v=ounce-pages-1';

if (document.body.dataset.project === 'to-the-last-ounce') {
  const pages = [...document.querySelectorAll('.reading-page')];
  const videoUrl = 'https://youtu.be/La-A-LB2hyU';
  // Original 4400 × 2200 image coordinates around the printed blue links.
  const videoRegions = {
    '纯艺（20页）_06.jpg': { x: 2553, y: 327, width: 1118, height: 96 },
    '纯艺（20页）_08.jpg': { x: 2439, y: 805, width: 1138, height: 93 },
  };
  const ornaments = [
    [{ type: 'star', side: 'left', top: 22 }, { type: 'line', side: 'right', top: 70 }],
    [{ type: 'line', side: 'left', top: 40 }, { type: 'star', side: 'right', top: 18 }],
    [{ type: 'star', side: 'left', top: 62 }, { type: 'line', side: 'right', top: 32 }],
  ];
  pages.forEach((page, index) => {
    const image = page.querySelector('img');
    const surface = document.createElement('div');
    surface.className = 'ounce-page-surface';
    image.replaceWith(surface);
    surface.append(image);
    const filename = decodeURIComponent(new URL(image.src).pathname.split('/').pop());
    const region = videoRegions[filename];
    if (region) {
      const sourceWidth = Number(image.getAttribute('width'));
      const sourceHeight = Number(image.getAttribute('height'));
      const link = document.createElement('a');
      link.className = 'ounce-video-link';
      link.href = videoUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Watch To the Last Ounce on YouTube (opens in a new tab)');
      link.style.left = `${region.x / sourceWidth * 100}%`;
      link.style.top = `${(region.y + region.height / 2) / sourceHeight * 100}%`;
      link.style.width = `${region.width / sourceWidth * 100}%`;
      link.style.height = `${region.height / sourceHeight * 100}%`;
      surface.append(link);
    }
    for (const { type, side, top } of ornaments[index] || []) {
      const mark = document.createElement('span');
      mark.className = `${type} ounce-page-${type} ounce-${side}`;
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
        // Animate the image and its clickable region together so they stay aligned.
        const animation = page.querySelector('.ounce-page-surface').animate(
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
