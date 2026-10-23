import { projectDetails } from './project-data.js?v=templates-1';

const siteRoot = new URL('../../', import.meta.url);

// One renderer for both formats: CSS controls reading width, never the image ratio.
export function renderProject(project) {
  document.body.dataset.template = project.template;
  document.title = `${project.fullTitle} — LINJUN YE`;
  document.querySelector('h1').textContent = project.fullTitle;
  document.querySelector('.back-home').href = siteRoot.href;

  const introduction = document.querySelector('.introduction');
  introduction.textContent = project.introduction || '';
  introduction.hidden = !project.introduction;

  const readingPages = document.querySelector('.reading-pages');
  readingPages.replaceChildren();
  const imageRoot = new URL(project.imageDirectory, siteRoot);
  for (const page of project.pages) {
    const source = new URL(page.file, imageRoot);
    // These templates expose reading images only, never original PDFs.
    if (!/\.(jpe?g|png|webp|avif)$/i.test(source.pathname)) continue;
    const figure = document.createElement('figure');
    figure.className = 'reading-page';
    const image = document.createElement('img');
    image.src = source.href;
    image.alt = page.alt || project.fullTitle;
    if (page.width > 0 && page.height > 0) {
      image.width = page.width;
      image.height = page.height;
    }
    image.loading = readingPages.childElementCount === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    figure.append(image);
    readingPages.append(figure);
  }
  readingPages.hidden = !readingPages.childElementCount;
}

const project = projectDetails[document.body.dataset.project];
if (project) renderProject(project);
