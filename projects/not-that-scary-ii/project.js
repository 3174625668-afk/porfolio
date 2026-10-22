import { series, viewingOrder, overviewLayouts } from './series-data.js';

const works = new Map(series.works.map(work => [work.id, work]));
const overview = document.querySelector('.overview');
const tabs = document.querySelector('.layout-options');
const readingNumber = new Map(viewingOrder.map((id, index) => [id, String(index + 1).padStart(2, '0')]));
const motion = matchMedia('(prefers-reduced-motion: reduce)');
if (series.introduction) {
  const statement = document.querySelector('.statement');
  statement.textContent = series.introduction;
  statement.hidden = false;
}

function selectLayout(id, updateAddress = true) {
  const layout = overviewLayouts.find(item => item.id === id) || overviewLayouts[0];
  overview.replaceChildren();
  overview.style.aspectRatio = `${layout.width} / ${layout.height}`;
  overview.dataset.layout = layout.id;
  overview.setAttribute('aria-labelledby', `layout-${layout.id}`);
  tabs.querySelectorAll('button').forEach(button => {
    const selected = button.dataset.layout === layout.id;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.querySelector('.layout-name').textContent = `${layout.label} / ${layout.name} — ${layout.englishName}`;
  document.querySelector('.layout-description').textContent = layout.description;
  for (const placement of layout.placements) {
    const work = works.get(placement.id);
    const longEdge = work.longestSideCm * layout.pixelsPerCm;
    const width = work.width > work.height ? longEdge : longEdge * work.width / work.height;
    const figure = document.createElement('figure');
    figure.className = 'artwork';
    figure.dataset.work = work.id;
    Object.assign(figure.style, {
      left: placement.x / layout.width * 100 + '%',
      top: placement.y / layout.height * 100 + '%',
      width: width / layout.width * 100 + '%',
    });
    const proportion = width / 340;
    figure.style.setProperty('--mobile-width', `min(${proportion * 100}cqw, ${proportion * 380}px)`);
    const link = document.createElement('a');
    link.className = 'artwork-link';
    link.href = `#work-${work.id}`;
    link.setAttribute('aria-label', `${work.chineseTitle} / ${work.englishTitle} — view work ${readingNumber.get(work.id)}`);
    const image = document.createElement('img');
    image.src = work.thumbnail;
    image.width = work.width;
    image.height = work.height;
    image.alt = `${work.chineseTitle} / ${work.englishTitle}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    const number = document.createElement('span');
    number.className = 'artwork-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = readingNumber.get(work.id);
    link.append(image, number);
    const caption = document.createElement('figcaption');
    caption.className = 'artwork-caption';
    const chinese = document.createElement('span');
    chinese.textContent = work.chineseTitle;
    const english = document.createElement('span');
    english.className = 'caption-english';
    english.textContent = work.englishTitle;
    caption.append(chinese, english);
    link.addEventListener('click', event => {
      // Native anchors remain valid without this enhancement.
      event.preventDefault();
      const destination = document.getElementById(`work-${work.id}`);
      history.pushState(null, '', `?layout=${layout.id}#work-${work.id}`);
      destination.focus({ preventScroll: true });
      destination.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
    });
    figure.append(link, caption);
    overview.append(figure);
  }
  const decoration = document.createElement('span');
  decoration.className = 'star overview-decoration';
  decoration.setAttribute('aria-hidden', 'true');
  decoration.style.left = layout.decoration.x / layout.width * 100 + '%';
  decoration.style.top = layout.decoration.y / layout.height * 100 + '%';
  overview.append(decoration);
  if (updateAddress) history.replaceState(null, '', `?layout=${layout.id}${location.hash}`);
}

for (const layout of overviewLayouts) {
  const button = document.createElement('button');
  button.textContent = `${layout.label} · ${layout.name}`;
  button.id = `layout-${layout.id}`;
  button.dataset.layout = layout.id;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-controls', 'overview-panel');
  button.addEventListener('click', () => selectLayout(layout.id));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? 'a' : event.key === 'End' ? 'b' : layout.id === 'a' ? 'b' : 'a';
    selectLayout(target);
    document.getElementById(`layout-${target}`).focus();
  });
  tabs.append(button);
}

for (const id of viewingOrder) {
  const work = works.get(id);
  if (!work) throw new Error(`Unknown work: ${id}`);
  const article = document.createElement('article');
  article.className = 'work';
  article.id = `work-${work.id}`;
  article.tabIndex = -1;
  const number = document.createElement('p');
  number.className = 'work-number';
  number.textContent = `${readingNumber.get(work.id)} / 08`;
  const status = document.createElement('p');
  status.className = 'full-image-status';
  status.textContent = 'FULL IMAGE COMING SOON';
  const chinese = document.createElement('h3');
  chinese.id = `title-${work.id}`;
  chinese.textContent = work.chineseTitle;
  article.setAttribute('aria-labelledby', chinese.id);
  const english = document.createElement('p');
  english.className = 'work-english';
  english.textContent = work.englishTitle;
  const metadata = document.createElement('p');
  metadata.className = 'work-meta';
  metadata.textContent = `${work.medium} · ${work.dimensions} · ${work.year}`;
  article.append(number, status, chinese, english, metadata);
  document.querySelector('#individual-works').append(article);
  // Full images are deliberately null until separately uploaded. No thumbnail fallback.
  if (work.fullImage) {
    if (new URL(work.fullImage, location.href).href === new URL(work.thumbnail, location.href).href) {
      throw new Error('A thumbnail cannot be used as a full-resolution image');
    }
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const image = new Image();
      image.className = 'work-image';
      image.alt = `${work.chineseTitle} / ${work.englishTitle}`;
      image.decoding = 'async';
      image.onload = () => status.replaceWith(image);
      image.onerror = () => { status.textContent = 'FULL IMAGE COMING SOON'; };
      image.src = work.fullImage;
    }, { rootMargin: '600px' });
    observer.observe(article);
  }
}
selectLayout(new URLSearchParams(location.search).get('layout'), false);
window.addEventListener('popstate', () => selectLayout(new URLSearchParams(location.search).get('layout'), false));
if (location.hash.startsWith('#work-')) {
  requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'instant' }));
}
