// Import the existing reader unchanged, then enhance only this project.
import '../shared/detail.js?v=ounce-pages-1';

if (document.body.dataset.project === 'to-the-last-ounce') {
  const pages = [...document.querySelectorAll('.reading-page')];
  const ornaments = [
    [{ type: 'star', side: 'left', top: 22 }, { type: 'line', side: 'right', top: 70 }],
    [{ type: 'line', side: 'left', top: 40 }, { type: 'star', side: 'right', top: 18 }],
    [{ type: 'star', side: 'left', top: 62 }, { type: 'line', side: 'right', top: 32 }],
  ];
  pages.forEach((page, index) => {
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
  let observer;

  // Images are visible in the base CSS. No hidden class or observer dependency:
  // unsupported APIs, a failed enhancement or slow images cannot hide the reader.
  if (!motion.matches && 'IntersectionObserver' in window && 'animate' in Element.prototype) {
    try {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (motion.matches) continue;
          try {
            const animation = entry.target.querySelector('img').animate(
              [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
              { duration: 520, easing: 'ease-out' },
            );
            animations.add(animation);
            animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
          } catch {
            // Leave the original, fully visible image untouched.
          }
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
      pages.forEach(page => observer.observe(page));
    } catch {
      observer?.disconnect();
    }
  }

  motion.addEventListener('change', event => {
    if (!event.matches) return;
    observer?.disconnect();
    for (const animation of animations) animation.cancel();
    animations.clear();
  });
}
