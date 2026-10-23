import { project, availableInteriorUnits } from './project-data.js?v=the-law-1';

const siteRoot = new URL('../../', import.meta.url);
const imageRoot = new URL(project.imageDirectory, siteRoot);
const supported = image => image && /\.(jpe?g|png|webp)$/i.test(image.file) && image.width > 0 && image.height > 0;
let imageIndex = 0;
function makeUnit(unit, section) {
  if (!unit.images.length || !unit.images.every(supported)) return;
  const figure = document.createElement('figure');
  figure.className = `reading-unit ${unit.kind}`;
  figure.dataset.unitId = unit.id;
  if (unit.pages) figure.dataset.pages = unit.pages.join(',');
  const trigger = document.createElement('button');
  trigger.className = 'unit-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label', unit.pages
    ? `Enlarge The Law — ${unit.pages.length === 2 ? 'spread' : 'page'} ${unit.pages.join(' + ')}`
    : `Enlarge The Law — ${section.querySelector('h2').textContent}`);
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'law-image-viewer');
  const surface = document.createElement('span');
  surface.className = 'unit-images';
  const ratio = unit.images.reduce((sum, image) => sum + image.width / image.height, 0);
  surface.style.aspectRatio = String(ratio);
  for (const page of unit.images) {
    const image = document.createElement('img');
    image.src = new URL(page.file, imageRoot).href;
    image.alt = page.page ? `The Law — interior page ${page.page}` : `The Law — ${section.querySelector('h2').textContent}`;
    image.width = page.width;
    image.height = page.height;
    image.style.width = `${100 * (page.width / page.height) / ratio}%`;
    image.loading = imageIndex++ === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    surface.append(image);
  }
  trigger.append(surface);
  figure.append(trigger);
  section.querySelector('.units').append(figure);
  section.hidden = false;
}

export const ready = Promise.resolve().then(() => {
  document.title = `${project.title} — LINJUN YE`;
  document.querySelector('h1').textContent = project.title;
  document.querySelector('.back-home').href = siteRoot.href;
  // Section order is explicit and independent of the number of interior pages.
  for (const id of ['cover', 'interior', 'poster', 'invitation']) {
    const section = document.getElementById(id);
    const units = id === 'interior' ? availableInteriorUnits()
      : project[id].map((image, index) => ({ id: `${id}-${index + 1}`, kind: 'single-page', images: [image] }));
    for (const unit of units) makeUnit(unit, section);
  }
});
