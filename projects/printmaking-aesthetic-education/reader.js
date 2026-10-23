import { renderProject } from '../shared/detail.js?v=ounce-pages-1';
import { researchProjects } from '../research-shared/project-data.js?v=journal-1';

// This article has two verified, already-watermarked pages. No raw PDF is read.
export const ready = Promise.resolve().then(() => {
  const project = researchProjects['printmaking-aesthetic-education'];
  const order = new Intl.Collator('en', { numeric: true });
  const pages = project.pages.filter(page => /\.webp$/i.test(page.file))
    .slice().sort((a, b) => order.compare(a.file, b.file));
  renderProject({ ...project, pages });
});
