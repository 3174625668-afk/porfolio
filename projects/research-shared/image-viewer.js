// Shared stable viewer; readers call this after their own pages are ready.
export function attachResearchViewer() {
  if (document.body.dataset.section === 'research' && document.querySelector('.reading-page img') && 'showModal' in HTMLDialogElement.prototype) {
    const dialog = document.createElement('dialog');
    dialog.className = 'research-viewer';
    dialog.id = 'research-image-viewer';
    dialog.setAttribute('aria-label', 'Research document — high-resolution image viewer');
    const tools = document.createElement('div');
    tools.className = 'research-viewer-tools';
    function control(text, label) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = text;
      button.setAttribute('aria-label', label);
      tools.append(button);
      return button;
    }
    const minus = control('−', 'Zoom out');
    const plus = control('+', 'Zoom in');
    const close = control('×', 'Close image viewer');
    const stage = document.createElement('div');
    stage.className = 'research-viewer-stage';
    const image = document.createElement('img');
    image.className = 'research-viewer-image';
    image.draggable = false;
    image.decoding = 'async';
    stage.append(image);
    dialog.append(tools, stage);
    document.body.append(dialog);

    const pointers = new Map();
    let origin;
    let savedScroll = 0;
    let bodyStyle = '';
    let rootStyle = '';
    let locked = false;
    let baseWidth = 0;
    let baseHeight = 0;
    let naturalWidth = 0;
    let naturalHeight = 0;
    let zoom = 1;
    let maximum = 1;
    let panX = 0;
    let panY = 0;
    let frame = 0;

    function render() {
      frame = 0;
      if (!dialog.open || !baseWidth) return;
      const limitX = Math.max(0, (baseWidth * zoom - stage.clientWidth) / 2);
      const limitY = Math.max(0, (baseHeight * zoom - stage.clientHeight) / 2);
      panX = Math.max(-limitX, Math.min(limitX, panX));
      panY = Math.max(-limitY, Math.min(limitY, panY));
      const x = (stage.clientWidth - baseWidth * zoom) / 2 + panX;
      const y = (stage.clientHeight - baseHeight * zoom) / 2 + panY;
      image.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
      stage.classList.toggle('is-zoomed', zoom > 1.001);
      stage.classList.toggle('is-dragging', zoom > 1.001 && pointers.size > 0);
      minus.disabled = zoom <= 1.001;
      plus.disabled = zoom >= maximum - 0.001;
    }

    function queueRender() {
      if (!frame) frame = requestAnimationFrame(render);
    }

    function fit(reset = false) {
      if (!dialog.open || !naturalWidth || !naturalHeight) return;
      const padding = stage.clientWidth <= 760 ? 12 : 24;
      const fitScale = Math.min((stage.clientWidth - padding * 2) / naturalWidth,
        (stage.clientHeight - padding * 2) / naturalHeight, 1);
      const previousWidth = baseWidth;
      baseWidth = naturalWidth * Math.max(0.001, fitScale);
      baseHeight = naturalHeight * Math.max(0.001, fitScale);
      // Stop at the original image's pixel width instead of upscaling a smaller source.
      maximum = Math.max(1, Math.min(16, naturalWidth / baseWidth));
      if (reset) { zoom = 1; panX = 0; panY = 0; }
      else {
        zoom = Math.min(zoom, maximum);
        if (previousWidth) { panX *= baseWidth / previousWidth; panY *= baseWidth / previousWidth; }
      }
      image.style.width = `${baseWidth}px`;
      image.style.height = `${baseHeight}px`;
      render();
    }

    function zoomAt(next, point = null, delta = { x: 0, y: 0 }) {
      if (!baseWidth) return;
      const bounds = stage.getBoundingClientRect();
      const x = point ? point.x - bounds.left - stage.clientWidth / 2 : 0;
      const y = point ? point.y - bounds.top - stage.clientHeight / 2 : 0;
      const nextZoom = Math.max(1, Math.min(maximum, next));
      const ratio = nextZoom / zoom;
      panX = x - (x - panX) * ratio + delta.x;
      panY = y - (y - panY) * ratio + delta.y;
      zoom = nextZoom;
      if (zoom === 1) { panX = 0; panY = 0; }
      queueRender();
    }

    function open(source) {
      if (dialog.open) return;
      origin = source;
      savedScroll = window.scrollY;
      bodyStyle = document.body.style.cssText;
      rootStyle = document.documentElement.style.cssText;
      locked = true;
      document.documentElement.style.overflow = 'hidden';
      Object.assign(document.body.style, { position: 'fixed', top: `${-savedScroll}px`, left: '0', width: '100%' });
      baseWidth = 0;
      naturalWidth = source.naturalWidth;
      naturalHeight = source.naturalHeight;
      image.alt = source.alt;
      image.hidden = true;
      minus.disabled = plus.disabled = true;
      image.onload = () => {
        if (!dialog.open) return;
        naturalWidth = image.naturalWidth;
        naturalHeight = image.naturalHeight;
        fit(baseWidth === 0);
        image.hidden = false;
      };
      image.onerror = () => { if (dialog.open) closeViewer(); };
      image.src = source.currentSrc || source.src;
      dialog.showModal();
      if (naturalWidth && naturalHeight) { fit(true); image.hidden = false; }
      close.focus({ preventScroll: true });
    }

    function restoreReader() {
      if (!locked) return;
      locked = false;
      cancelAnimationFrame(frame);
      frame = 0;
      pointers.clear();
      document.body.style.cssText = bodyStyle;
      document.documentElement.style.cssText = rootStyle;
      window.scrollTo(0, savedScroll);
      origin?.focus({ preventScroll: true });
    }
    function closeViewer() {
      dialog.close();
      restoreReader(); // Restore before the next paint, not the queued dialog close event.
    }
    dialog.addEventListener('close', () => { if (!dialog.open) restoreReader(); });
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeViewer(); });
    // Share touch suppression with the underlying page triggers: closing the
    // modal must not let the compatibility click reopen the image beneath it.
    let lastTouch = -Infinity;
    function bindActivation(element, action) {
      element.addEventListener('pointerup', event => {
        if (element.disabled || !['touch', 'pen'].includes(event.pointerType)) return;
        const rect = element.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
        // Browsers can suppress click after a pinch. Handle the actual touch release,
        // then ignore its optional compatibility click so controls never fire twice.
        event.preventDefault();
        lastTouch = performance.now();
        action();
      });
      element.addEventListener('click', event => {
        if (element.disabled) return;
        if (event.detail !== 0 && performance.now() - lastTouch < 700) {
          event.preventDefault();
          return;
        }
        action();
      });
    }
    bindActivation(close, closeViewer);
    bindActivation(plus, () => zoomAt(zoom * 1.35));
    bindActivation(minus, () => zoomAt(zoom / 1.35));
    stage.addEventListener('dblclick', event => {
      event.preventDefault();
      zoomAt(zoom > 1.001 ? 1 : Math.min(2.5, maximum), { x: event.clientX, y: event.clientY });
    });
    stage.addEventListener('wheel', event => {
      if (!dialog.open) return;
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1);
      zoomAt(zoom * Math.exp(-delta * (event.ctrlKey ? 0.01 : 0.002)), { x: event.clientX, y: event.clientY });
    }, { passive: false });

    function pair() {
      const [a, b] = [...pointers.values()];
      return { center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, distance: Math.hypot(a.x - b.x, a.y - b.y) };
    }
    stage.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      queueRender();
    });
    stage.addEventListener('pointermove', event => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const oldPair = pointers.size >= 2 ? pair() : null;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (oldPair) {
        const nextPair = pair();
        zoomAt(zoom * nextPair.distance / Math.max(1, oldPair.distance), oldPair.center,
          { x: nextPair.center.x - oldPair.center.x, y: nextPair.center.y - oldPair.center.y });
      } else if (zoom > 1) {
        panX += event.clientX - previous.x;
        panY += event.clientY - previous.y;
        queueRender();
      }
    });
    function endPointer(event) { pointers.delete(event.pointerId); queueRender(); }
    stage.addEventListener('pointerup', endPointer);
    stage.addEventListener('pointercancel', endPointer);
    stage.addEventListener('lostpointercapture', endPointer);
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        const enabled = [...tools.querySelectorAll('button:not(:disabled)')];
        const first = enabled[0];
        const last = enabled[enabled.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
      else if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomAt(zoom * 1.35); }
      else if (event.key === '-' || event.key === '−') { event.preventDefault(); zoomAt(zoom / 1.35); }
      else if (event.key === '0') { event.preventDefault(); zoomAt(1); }
      else if (zoom > 1 && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'ArrowLeft') panX += 50;
        if (event.key === 'ArrowRight') panX -= 50;
        if (event.key === 'ArrowUp') panY += 50;
        if (event.key === 'ArrowDown') panY -= 50;
        queueRender();
      }
    });
    window.addEventListener('resize', () => fit());
    window.visualViewport?.addEventListener('resize', () => fit());

    for (const source of document.querySelectorAll('.reading-page img')) {
      source.tabIndex = 0;
      source.setAttribute('role', 'button');
      source.setAttribute('aria-label', `Enlarge ${source.alt}`);
      source.setAttribute('aria-haspopup', 'dialog');
      source.setAttribute('aria-controls', dialog.id);
      bindActivation(source, () => open(source));
      source.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        open(source);
      });
    }
  }
}
