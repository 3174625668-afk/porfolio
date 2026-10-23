import { artworkRecords, galleryGroups } from './gallery-data.js?v=static-1';

const gallery = document.querySelector('#gallery');
const artworks = new Map(artworkRecords.map(work => [work.id, work]));
let imageIndex = 0;
for (const group of galleryGroups) {
  const scene = document.createElement('div');
  scene.className = 'gallery-scene';
  scene.dataset.layoutGroup = group.id;
  scene.style.setProperty('--scene-ratio', `${group.width} / ${group.height}`);
  for (const placement of group.placements) {
    const work = artworks.get(placement.id);
    const figure = document.createElement('figure');
    figure.className = 'artwork';
    figure.dataset.artworkId = work.id;
    figure.style.setProperty('--x', `${placement.x / group.width * 100}%`);
    figure.style.setProperty('--y', `${placement.y / group.height * 100}%`);
    figure.style.setProperty('--width', `${placement.width / group.width * 100}%`);
    figure.style.setProperty('--mobile-width', work.pixelWidth < work.pixelHeight ? 'min(82%, 380px)' : 'min(100%, 600px)');
    const image = document.createElement('img');
    image.src = work.image;
    image.alt = work.title || `Printmaking artwork ${work.id}`;
    image.width = work.pixelWidth;
    image.height = work.pixelHeight;
    image.loading = imageIndex++ === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    figure.append(image);
    scene.append(figure);
  }
  for (const mark of group.decorations) {
    const decoration = document.createElement('span');
    decoration.className = `gallery-decoration ${mark.type}`;
    decoration.setAttribute('aria-hidden', 'true');
    decoration.style.left = `${mark.x / group.width * 100}%`;
    decoration.style.top = `${mark.y / group.height * 100}%`;
    decoration.style.width = `${mark.size}px`;
    if (mark.type === 'star') decoration.style.height = `${mark.size}px`;
    scene.append(decoration);
  }
  gallery.append(scene);
}
