import { projects } from './projects.js?v=ounce-research-marks-1';
import { attachTextDust } from './text-dust.js';

const canvas = document.querySelector('.canvas');
const interactionArea = document.querySelector('main');
const status = document.querySelector('#status');
const notice = document.querySelector('dialog');
let active = null;
let activeProject = null;
let exitTimer;

function revealType(button = null) {
  activeProject = button;
  document.querySelectorAll('.type-target').forEach(project => {
    const selected = project === button;
    project.toggleAttribute('data-type-active', selected);
    project.querySelector('small').setAttribute('aria-hidden', String(!selected));
    if (selected) project.setAttribute('aria-describedby', project.querySelector('small').id);
    else project.removeAttribute('aria-describedby');
  });
}

function activate(section) {
  clearTimeout(exitTimer);
  if (active !== section) revealType();
  active = section;
  if (section) {
    canvas.dataset.active = section;
    canvas.classList.add('has-explored');
  }
  else delete canvas.dataset.active;
  document.querySelectorAll('[data-section]').forEach(button => {
    button.setAttribute('aria-expanded', String(button.dataset.section === section));
  });
  for (const key of Object.keys(projects)) document.getElementById(key + '-list').hidden = key !== section;
  status.textContent = section ? `${section === 'art' ? 'Art Practice' : 'Research & Curation'} projects open` : '';
}

for (const [key, items] of Object.entries(projects)) {
  const panel = document.getElementById(key + '-list');
  const entries = panel.querySelector('.entries');
  for (const item of items) {
    const isGroup = item.kind === 'group';
    const button = document.createElement(isGroup ? 'h2' : 'button');
    button.className = isGroup ? 'group-label type-target' : 'project type-target';
    if (isGroup) button.tabIndex = 0;
    button.dataset.projectId = item.id;
    const title = document.createElement('strong');
    const category = document.createElement('small');
    title.textContent = item.displayTitle;
    if (item.desktopLines) {
      title.replaceChildren();
      item.desktopLines.forEach((line, index) => {
        if (index) title.append(document.createTextNode(' '));
        const span = document.createElement('span');
        span.className = 'title-line';
        span.textContent = line;
        title.append(span);
      });
    }
    category.textContent = item.category;
    category.id = item.id + '-type';
    category.setAttribute('aria-hidden', 'true');
    button.append(title, category);
    let pointerType = '';
    button.addEventListener('pointerdown', event => { pointerType = event.pointerType; });
    button.addEventListener('pointerenter', event => {
      clearTimeout(exitTimer);
      if (event.pointerType === 'mouse') revealType(button);
    });
    button.addEventListener('pointerleave', event => {
      if (event.pointerType === 'mouse' && activeProject === button) revealType();
    });
    button.addEventListener('focus', () => {
      clearTimeout(exitTimer);
      if (button.matches(':focus-visible')) revealType(button);
    });
    button.addEventListener('blur', () => {
      if (activeProject === button) revealType();
    });
    button.addEventListener('click', event => {
      if (isGroup) {
        revealType(button);
        return;
      }
      // On touch, keep the first tap for the type; the next opens the project or notice.
      const isTouch = event.detail !== 0 && (pointerType === 'touch' || pointerType === 'pen');
      if (isTouch && activeProject !== button) {
        revealType(button);
        status.textContent = `${item.displayTitle}: ${item.category}. ${item.href ? 'Tap again to open project.' : 'Tap again for project availability.'}`;
        return;
      }
      if (item.href) {
        window.location.assign(new URL(item.href, document.baseURI).href);
        return;
      }
      notice.querySelector('h2').textContent = item.displayTitle;
      notice.showModal();
    });
    entries.append(button);
    attachTextDust(button);
  }
  panel.querySelector('.close').addEventListener('click', () => {
    activate(null);
    document.querySelector(`[data-section="${key}"]`).focus();
  });
}

for (const button of document.querySelectorAll('[data-section]')) {
  button.addEventListener('pointerenter', event => {
    clearTimeout(exitTimer);
    if (event.pointerType === 'mouse') activate(button.dataset.section);
  });
  button.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      button.classList.remove('tap-feedback');
      void button.offsetWidth;
      button.classList.add('tap-feedback');
    }
  });
  button.addEventListener('animationend', () => button.classList.remove('tap-feedback'));
  button.addEventListener('click', event => {
    // A mouse click after hover keeps the already open list available.
    if (event.pointerType === 'mouse') activate(button.dataset.section);
    else activate(active === button.dataset.section ? null : button.dataset.section);
  });
  button.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activate(button.dataset.section);
      document.querySelector(`#${button.dataset.section}-list .project`).focus();
    }
  });
}

// Keep the list open across the whole gap between the illustration and its titles.
interactionArea.addEventListener('pointerenter', () => clearTimeout(exitTimer));
interactionArea.addEventListener('pointerleave', event => {
  if (event.pointerType === 'mouse' && !notice.open && !document.activeElement.closest('.projects')) {
    exitTimer = setTimeout(() => activate(null), 650);
  }
});
canvas.addEventListener('focusout', event => {
  if (event.relatedTarget && !canvas.contains(event.relatedTarget) && !notice.contains(event.relatedTarget)) activate(null);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !notice.open) {
    const trigger = active && document.querySelector(`[data-section="${active}"]`);
    activate(null);
    trigger?.focus({ preventScroll: true });
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.illustration,.projects,dialog')) activate(null);
});
notice.querySelectorAll('button').forEach(button => button.addEventListener('click', () => notice.close()));

const layout = await fetch('assets/decorations.json').then(response => {
  if (!response.ok) throw new Error('Could not load homepage decorations');
  return response.json();
});
for (const item of layout.items) {
  const decoration = document.createElement('span');
  decoration.className = 'decoration ' + item.type;
  Object.assign(decoration.style, {
    left: item.x / 16 + '%', top: item.y / 9 + '%',
    width: item.w / 16 + '%', height: item.h / 9 + '%',
  });
  decoration.style.setProperty('--mobile-top', item.y / 900 * 760 + 'px');
  decoration.style.setProperty('--mobile-height', item.h / 900 * 760 + 'px');
  document.querySelector('#decorations').append(decoration);
}
