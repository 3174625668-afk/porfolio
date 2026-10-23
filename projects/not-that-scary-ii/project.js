import { series, staticLayout } from './series-data.js?v=names-1';

const overview = document.querySelector('#artworks');
const worksById = new Map(series.works.map(work => [work.id, work]));

// Authored positions and viewing order stay separate from the image files.
// All long edges share one physical scale; the original caption space stays reserved.
let activeFigure = null;
function activate(figure) {
  if (activeFigure === figure) return;
  if (activeFigure) {
    activeFigure.classList.remove('is-active');
    activeFigure.querySelector('button').setAttribute('aria-expanded', 'false');
  }
  activeFigure = figure;
  if (figure) {
    figure.classList.add('is-active');
    figure.querySelector('button').setAttribute('aria-expanded', 'true');
  }
}
for (const placement of staticLayout.placements) {
  const work = worksById.get(placement.id);
  const longEdge = work.longestSideCm * staticLayout.pixelsPerCm;
  const width = longEdge * work.width / Math.max(work.width, work.height);
  const figure = document.createElement('figure');
  figure.className = 'artwork';
  figure.dataset.work = work.id;
  figure.style.left = `${placement.x / staticLayout.width * 100}%`;
  figure.style.top = `${placement.y / staticLayout.height * 100}%`;
  figure.style.width = `${width / staticLayout.width * 100}%`;
  figure.style.setProperty('--mobile-width', `min(${width / 300 * 100}cqw, ${width / 300 * 360}px)`);

  const image = document.createElement('img');
  image.src = work.thumbnail;
  image.alt = `${work.chineseTitle} — ${work.englishTitle}`;
  image.width = work.width;
  image.height = work.height;
  image.decoding = 'async';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'artwork-trigger';
  trigger.setAttribute('aria-label', image.alt);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', `caption-${work.id}`);
  trigger.append(image);
  trigger.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') activate(figure);
  });
  trigger.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && activeFigure === figure) activate(null);
  });
  trigger.addEventListener('click', () => activate(figure));
  trigger.addEventListener('focus', () => {
    if (trigger.matches(':focus-visible')) activate(figure);
  });
  trigger.addEventListener('blur', () => {
    if (activeFigure === figure) activate(null);
  });

  const caption = document.createElement('figcaption');
  caption.id = `caption-${work.id}`;
  const chinese = document.createElement('span');
  chinese.className = 'caption-chinese';
  chinese.lang = 'zh-CN';
  chinese.textContent = work.chineseTitle;
  const english = document.createElement('span');
  english.className = 'caption-english';
  english.textContent = work.englishTitle;
  caption.append(chinese, english);
  figure.append(trigger, caption);
  overview.append(figure);
}

document.addEventListener('click', event => {
  if (!event.target.closest('.artwork-trigger')) activate(null);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') activate(null);
});

for (const { type, x, y, size } of staticLayout.decorations) {
  const decoration = document.createElement('span');
  decoration.className = `decoration ${type}`;
  decoration.setAttribute('aria-hidden', 'true');
  decoration.style.left = `${x / staticLayout.width * 100}%`;
  decoration.style.top = `${y / staticLayout.height * 100}%`;
  if (size) {
    decoration.style.width = `${size}px`;
    if (type === 'star') decoration.style.height = `${size}px`;
  }
  overview.append(decoration);
}
