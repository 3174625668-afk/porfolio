import { renderProject } from '../shared/detail.js?v=ounce-pages-1';
import { researchProjects } from './project-data.js?v=research-pages-1';

const numericOrder = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
const siteRoot = new URL('../../', import.meta.url);
const sortPages = pages => [...pages].sort((a, b) => numericOrder.compare(a.file, b.file));

async function discover(project) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  const known = new Map(project.pages.map(page => [page.file, page]));
  try {
    const response = await fetch(`https://api.github.com/repos/3174625668-afk/porfolio/contents/${project.imageDirectory.replace(/\/$/, '')}?ref=main`, {
      signal: controller.signal, credentials: 'omit', headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) throw new Error('Directory listing unavailable');
    const listing = await response.json();
    if (!Array.isArray(listing)) throw new Error('Invalid directory listing');
    const files = listing.filter(file => file.type === 'file' && file.size > 0 && typeof file.name === 'string' && /^[^/\\]+\.webp$/i.test(file.name));
    const pages = await Promise.all(files.map(async file => {
      if (known.has(file.name)) return known.get(file.name);
      // An uploaded source file may not have reached Pages yet. Never expose a
      // broken image; only include new files once their public WebP is available.
      const image = new URL(encodeURIComponent(file.name), new URL(project.imageDirectory, siteRoot));
      const live = await fetch(image, { method: 'HEAD', signal: controller.signal });
      if (!live.ok || !live.headers.get('content-type')?.startsWith('image/webp')) return null;
      return { file: file.name, alt: project.fullTitle };
    }));
    return sortPages(pages.filter(Boolean));
  } catch {
    // Known real uploads still render on slow networks or when the API is limited.
    return sortPages(project.pages);
  } finally {
    clearTimeout(timer);
  }
}

export const ready = (async () => {
  const project = researchProjects[document.body.dataset.project];
  if (!project) return;
  const known = sortPages(project.pages.filter(page => /\.webp$/i.test(page.file)));
  renderProject({ ...project, pages: known });
  if (!project.autoDiscover) return;
  const pages = await discover(project);
  if (JSON.stringify(pages) !== JSON.stringify(known)) renderProject({ ...project, pages });
})();
