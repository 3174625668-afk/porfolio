// Independent decoration enhancement: never wraps, moves or resizes an image.
if (document.body.dataset.section === 'research') {
  function mark(type, className) {
    const element = document.createElement('span');
    element.className = `${type} ${className}`;
    element.setAttribute('aria-hidden', 'true');
    return element;
  }
  const header = document.querySelector('.project-header');
  header.append(mark('star', 'research-header-star'), mark('line', 'research-header-line'));
  const patterns = [
    [{ type: 'star', side: 'left', top: 20 }, { type: 'line', side: 'right', top: 65 }],
    [{ type: 'line', side: 'left', top: 42 }],
    [{ type: 'star', side: 'right', top: 32 }],
    [{ type: 'line', side: 'left', top: 68 }, { type: 'star', side: 'right', top: 18 }],
    [{ type: 'star', side: 'left', top: 54 }],
    [{ type: 'line', side: 'right', top: 36 }],
  ];
  const pages = document.querySelector('.reading-pages');
  function decorate() {
    [...pages.querySelectorAll('.reading-page')].forEach((page, index) => {
      if (page.dataset.researchMarks) return;
      page.dataset.researchMarks = 'true';
      for (const { type, side, top } of patterns[index % patterns.length]) {
        const element = mark(type, `research-page-mark mark-${side}`);
        element.style.top = `${top}%`;
        page.append(element);
      }
    });
  }
  decorate();
  // The reader may finish directory discovery later and replace its page nodes.
  // Observe direct page-list changes only, not our own appended decoration nodes.
  new MutationObserver(decorate).observe(pages, { childList: true });
}
