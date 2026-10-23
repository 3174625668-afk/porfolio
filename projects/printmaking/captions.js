(() => {
  'use strict';
  // Only the label moves; original artwork geometry is never changed.
  const gallery = document.querySelector('#gallery');
  const works = [...gallery.querySelectorAll('.artwork')];
  let active = null;
  let keyboardNavigation = false;
  const rect = element => element.getBoundingClientRect();
  const intersects = (a, b, gap = 5) => a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;

  function positionLabel(work) {
    const label = work.querySelector('.artwork-caption');
    const image = rect(work.querySelector('img'));
    const group = rect(work.closest('.gallery-cluster'));
    const area = rect(document.querySelector('main'));
    label.style.width = 'max-content';
    label.style.maxWidth = `${Math.min(280, area.width)}px`;
    const size = rect(label);
    const blockers = [...document.querySelectorAll('.artwork img, .star, .line, h1, .back-home')].map(rect);
    const clampX = x => Math.min(Math.max(x, area.left), area.right - size.width);
    const candidates = [];
    const add = (left, top) => candidates.push({left: clampX(left), top});
    // Prefer directly beneath the artwork. Tight rows can use adjacent whitespace
    // or their group's outer margin rather than covering the next artwork.
    add(image.left, image.bottom + 8);
    add(image.left, image.top - size.height - 8);
    add(image.right + 12, image.bottom - size.height);
    add(image.left - size.width - 12, image.bottom - size.height);
    for (const top of [group.bottom + 8, group.top - size.height - 8]) {
      for (const left of [image.left, area.left, area.right - size.width, (area.left + area.right - size.width) / 2]) add(left, top);
    }
    // A small horizontal adjustment can avoid a thin decoration in the space
    // immediately above a tight row, keeping the label close to its own image.
    for (const mark of document.querySelectorAll('.star, .line')) {
      const b = rect(mark);
      for (const top of [image.bottom + 8, image.top - size.height - 8]) {
        add(b.right + 8, top);
        add(b.left - size.width - 8, top);
      }
    }
    // Also check the closest clear vertical slots on each side of nearby images.
    for (const blocker of blockers) {
      add(image.left, blocker.bottom + 8);
      add(image.left, blocker.top - size.height - 8);
    }
    const valid = candidates.filter(p => p.top >= -window.scrollY && p.top + size.height + 4 <= area.bottom && !blockers.some(b => intersects({...p, right:p.left + size.width, bottom:p.top + size.height}, b)));
    const distance = p => Math.max(image.top - p.top - size.height, p.top - image.bottom, 0)
      + Math.max(image.left - p.left - size.width, p.left - image.right, 0)
      + .15 * Math.abs(p.left - image.left) + (p.top < image.top ? 20 : 0);
    valid.sort((a, b) => distance(a) - distance(b));
    const target = valid[0];
    if (!target) return false;
    const origin = rect(work);
    label.style.left = `${target.left - origin.left}px`;
    label.style.top = `${target.top - origin.top}px`;
    return true;
  }
  function close(immediate = false) {
    if (!active) return;
    active.querySelector('.artwork-caption').style.transition = immediate ? 'none' : '';
    active.classList.remove('is-active');
    active.setAttribute('aria-expanded', 'false');
    active = null;
  }
  function open(work) {
    // End any previous fade-out before revealing another artwork's label.
    for (const other of works) {
      if (other !== work) other.querySelector('.artwork-caption').style.transition = 'none';
    }
    if (active !== work) close(true);
    if (!positionLabel(work)) return;
    work.querySelector('.artwork-caption').style.transition = '';
    active = work;
    work.classList.add('is-active');
    work.setAttribute('aria-expanded', 'true');
  }
  for (const work of works) {
    work.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' && !keyboardNavigation) open(work); });
    work.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse' && active === work) close(); });
    work.addEventListener('focus', () => open(work));
    work.addEventListener('blur', () => { if (active === work) close(); });
    work.addEventListener('click', () => open(work));
    work.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(work); }
    });
  }
  document.addEventListener('keydown', event => {
    keyboardNavigation = true;
    if (event.key === 'Escape') close();
  }, true);
  document.addEventListener('pointermove', () => { keyboardNavigation = false; });
  document.addEventListener('pointerdown', event => { if (!event.target.closest('.artwork')) close(); });
  window.addEventListener('resize', () => { if (active) positionLabel(active); });
  // Lazy images retain intrinsic sizes; remeasure if fonts or resource sizing changes.
  for (const image of gallery.querySelectorAll('img')) image.addEventListener('load', () => { if (active) positionLabel(active); });
})();
