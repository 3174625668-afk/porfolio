// Opt-in, one-time image entrance. Base CSS is always fully visible.
(() => {
  'use strict';
  const selector = document.body.dataset.scrollReveal;
  const root = document.querySelector('main');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!selector || !root || motion.matches || typeof IntersectionObserver !== 'function'
      || typeof Element.prototype.animate !== 'function') return;

  const registered = new WeakSet();
  const pending = new Map();
  const active = new Map();
  let intersection;
  let mutations;
  let frame = 0;
  let listening = false;
  let disabled = false;

  function stopListening() {
    if (!listening) return;
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    window.removeEventListener('pageshow', schedule);
    listening = false;
  }
  function listen() {
    if (listening) return;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    listening = true;
  }
  function cancel(element) {
    pending.delete(element);
    intersection?.unobserve(element);
    active.get(element)?.cancel();
    active.delete(element);
    if (!pending.size) stopListening();
  }
  function reveal(element, immediate = false) {
    registered.add(element);
    if (immediate) { cancel(element); return; }
    const animation = pending.get(element);
    if (!animation) return;
    pending.delete(element);
    intersection?.unobserve(element);
    try { animation.play(); } catch { cancel(element); }
    if (!pending.size) stopListening();
  }
  function restore() {
    disabled = true;
    intersection?.disconnect();
    mutations?.disconnect();
    stopListening();
    cancelAnimationFrame(frame);
    frame = 0;
    for (const animation of active.values()) animation.cancel();
    pending.clear();
    active.clear();
  }
  function scan() {
    for (const element of root.querySelectorAll(selector)) {
      if (registered.has(element)) continue;
      const bounds = element.getBoundingClientRect();
      // Lazy sources without reserved dimensions stay visible until measurable.
      if (!bounds.width || !bounds.height) continue;
      registered.add(element);
      // Never reset an already-visible or already-passed work to opacity zero.
      if (bounds.top < window.innerHeight) continue;
      let animation;
      try {
        animation = element.animate(
          [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 520, easing: 'ease-out', fill: 'both' },
        );
        active.set(element, animation);
        animation.pause();
        animation.currentTime = 0;
        pending.set(element, animation);
        animation.finished.then(() => {
          if (active.get(element) !== animation) return;
          active.delete(element);
          animation.cancel(); // Return to the identical, visible base appearance.
        }, () => {});
        intersection.observe(element);
        listen();
      } catch {
        animation?.cancel();
        pending.delete(element);
        active.delete(element);
      }
    }
  }
  function schedule() {
    if (disabled || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      scan();
      for (const element of pending.keys()) {
        if (!element.isConnected) { cancel(element); continue; }
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom < 0) reveal(element, true);
        else if (bounds.top <= window.innerHeight + 16) reveal(element);
      }
      // Directory discovery can replace previously animated reading nodes.
      for (const element of active.keys()) if (!element.isConnected) cancel(element);
    });
  }
  function activate(event) {
    const element = event.target instanceof Element ? event.target.closest(selector) : null;
    if (element && root.contains(element)) reveal(element, true);
  }

  try {
    intersection = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
    }, { threshold: 0, rootMargin: '0px 0px 16px 0px' });
    mutations = new MutationObserver(schedule);
    mutations.observe(root, { childList: true, subtree: true });
    root.addEventListener('load', schedule, true);
    root.addEventListener('pointerenter', activate, true);
    root.addEventListener('pointerdown', activate, true);
    root.addEventListener('focusin', activate);
    motion.addEventListener('change', event => { if (event.matches) restore(); });
    window.addEventListener('pagehide', restore, { once: true });
    schedule();
  } catch {
    restore(); // Failed enhancements must never leave unreadable, hidden images.
  }
})();
