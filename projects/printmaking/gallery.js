import { artworkRecords, galleryGroups } from './gallery-data.js?v=clusters-2';

const gallery = document.querySelector('#gallery');
const artworks = new Map(artworkRecords.map(work => [work.id, work]));
let imageIndex = 0;
for (const group of galleryGroups) {
  const cluster = document.createElement('div');
  cluster.className = `gallery-cluster layout-${group.layout} align-${group.align}`;
  cluster.dataset.layoutGroup = group.id;
  cluster.style.setProperty('--cluster-width', `${group.maxWidth}px`);
  // Proportional columns create matching heights where useful, without cropping
  // or forcing any image into a standardized frame.
  cluster.style.setProperty('--ratio-columns', group.artworkIds.map(id => {
    const work = artworks.get(id);
    return `${work.pixelWidth / work.pixelHeight}fr`;
  }).join(' '));
  for (const id of group.artworkIds) {
    const work = artworks.get(id);
    const figure = document.createElement('figure');
    figure.className = 'artwork';
    figure.dataset.artworkId = work.id;
    const image = document.createElement('img');
    image.src = work.image;
    image.alt = work.title || `Printmaking artwork ${work.id}`;
    image.width = work.pixelWidth;
    image.height = work.pixelHeight;
    image.loading = imageIndex++ === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    figure.append(image);
    cluster.append(figure);
  }
  for (const mark of group.decorations) {
    const decoration = document.createElement('span');
    decoration.className = `cluster-decoration ${mark.type}`;
    decoration.setAttribute('aria-hidden', 'true');
    decoration.style.left = `${mark.x}%`;
    decoration.style.width = `${mark.size}px`;
    if (mark.type === 'star') decoration.style.height = `${mark.size}px`;
    cluster.append(decoration);
  }
  gallery.append(cluster);
}
