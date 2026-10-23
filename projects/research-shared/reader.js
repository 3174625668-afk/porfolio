import { renderProject } from '../shared/detail.js?v=ounce-pages-1';
import { researchProjects } from './project-data.js?v=watermark-prep-1';

// Shared rendering preserves each exported page's true ratio and original order.
// No remote directory discovery, PDF embeds, downloads or synthetic sample pages.
export const ready = Promise.resolve().then(() => {
  const project = researchProjects[document.body.dataset.project];
  if (!project) return;
  const pages = project.pages.filter(page => /\.webp$/i.test(page.file));
  renderProject({ ...project, pages });
});
