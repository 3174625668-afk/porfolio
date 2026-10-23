import { renderProject } from '../shared/detail.js?v=ounce-pages-1';
import { project } from './project-data.js?v=nothing-1';

const supportedImage = /\.(jpe?g|png|webp|avif)$/i;
const numberOrder = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
const siteRoot = new URL('../../', import.meta.url);

async function discoverPages() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  const known = new Map(project.pages.map(page => [page.file, page]));
  try {
    // Public source listing, backed by the verified local list for offline/API limits.
    const response = await fetch(
      'https://api.github.com/repos/3174625668-afk/porfolio/contents/public/images/nothing-yet-not-nothing/pages?ref=main',
      { signal: controller.signal, credentials: 'omit', headers: { Accept: 'application/vnd.github+json' } },
    );
    if (!response.ok) throw new Error('Source listing unavailable');
    const files = await response.json();
    if (!Array.isArray(files)) throw new Error('Invalid source listing');
    const candidates = files.filter(file => file.type === 'file' && file.size > 0 && supportedImage.test(file.name));
    const pages = await Promise.all(candidates.map(async file => {
      if (known.has(file.name)) return known.get(file.name);
      // Newly committed files may precede Pages deployment: include only public copies.
      const imageRoot = new URL(project.imageDirectory, siteRoot);
      const live = await fetch(new URL(encodeURIComponent(file.name), imageRoot), {
        method: 'HEAD', signal: controller.signal,
      });
      return live.ok && live.headers.get('content-type')?.startsWith('image/')
        ? { file: file.name, alt: project.fullTitle }
        : null;
    }));
    return pages.filter(Boolean).sort((a, b) => numberOrder.compare(a.file, b.file));
  } catch {
    return [...project.pages].sort((a, b) => numberOrder.compare(a.file, b.file));
  } finally {
    clearTimeout(timeout);
  }
}

// Loading and reading remain independent of the optional animation module.
export const ready = discoverPages().then(pages => renderProject({ ...project, pages }));
