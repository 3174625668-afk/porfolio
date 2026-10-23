import { series, staticLayout } from './series-data.js?v=balance-3';

const overview = document.querySelector('#artworks');
const worksById = new Map(series.works.map(work => [work.id, work]));

// Authored positions and viewing order stay separate from the image files.
// All long edges share one physical scale; captions remain in normal figure flow.
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

  const caption = document.createElement('figcaption');
  const chinese = document.createElement('span');
  chinese.className = 'caption-chinese';
  chinese.lang = 'zh-CN';
  chinese.textContent = work.chineseTitle;
  const english = document.createElement('span');
  english.className = 'caption-english';
  english.textContent = work.englishTitle;
  caption.append(chinese, english);
  figure.append(image, caption);
  overview.append(figure);
}

for (const { type, x, y } of staticLayout.decorations) {
  const decoration = document.createElement('span');
  decoration.className = `decoration ${type}`;
  decoration.setAttribute('aria-hidden', 'true');
  decoration.style.left = `${x / staticLayout.width * 100}%`;
  decoration.style.top = `${y / staticLayout.height * 100}%`;
  overview.append(decoration);
}
