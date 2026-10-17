import { createViewsJourney } from './views-journey';
import { createCulturalReveal } from './cultural-reveal';

/** One reversible scroll scheduler for the entrance, gallery and S02 views. */
export interface EntranceJourney {
  enter: () => void;
  jumpToGallery: () => void;
  returnToStart: () => void;
  refresh: () => void;
  setStill: (value: boolean) => void;
  dispose: () => void;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export function createEntranceJourney(root: HTMLElement): EntranceJourney {
  const requireElement = <T extends HTMLElement>(selector: string) => {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Entrance element missing: ${selector}`);
    return element;
  };
  const track = requireElement('.g-entry-track');
  const stage = requireElement('.g-entry-stage');
  const gate = requireElement<HTMLAnchorElement>('.g-gate');
  const world = requireElement('.g-transition-world');
  const painting = requireElement('.g-world-paint');
  const paper = requireElement('.g-world-paper');
  const mist = requireElement('.g-world-mist');
  const gallery = requireElement('#portraits');
  const heading = requireElement('#portraits-title');
  const header = requireElement('.g-header');
  const hero = requireElement('.g-hero');
  const previews = [...root.querySelectorAll<HTMLElement>('.g-world-photo')];
  const photos = [...gallery.querySelectorAll<HTMLElement>('.g-photo')];
  const textReveals = [...gallery.querySelectorAll<HTMLElement>('[data-scroll-reveal]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const views = createViewsJourney(root);
  const cultural = createCulturalReveal(root);
  let enabled = false;
  let still = false;
  let disposed = false;
  let failed = false;
  let frame = 0;
  let autoFrame = 0;
  let initialFrame = 0;
  let observer: ResizeObserver | null = null;
  let automatic = false;
  let start = 0;
  let distance = 1;
  let height = innerHeight;
  let width = stage.clientWidth;
  let lastProgress = -1;
  let circle = { x: 0, y: 0, radius: 0, cover: 0, size: 0, left: 0, top: 0 };
  let targets: Array<{ left: number; top: number; width: number; height: number }> = [];

  const set = (name: string, value: number) => root.style.setProperty(name, String(value));
  function cancelAuto() {
    cancelAnimationFrame(autoFrame);
    autoFrame = 0;
    automatic = false;
    root.removeAttribute('data-entry-auto');
  }
  function clearEnhancement() {
    root.classList.remove('g-journey-ready');
    world.style.visibility = 'hidden';
    header.inert = false;
    hero.inert = false;
    gallery.inert = false;
    root.style.removeProperty('--entry-height');
    root.style.removeProperty('--entry-distance');
    stage.style.removeProperty('top');
  }
  function failOpen() {
    failed = true;
    enabled = false;
    cancelAuto();
    clearEnhancement();
    views.configure(false);
    cultural.configure(false);
    root.dataset.entryStage = 'static';
  }

  function render(force = false) {
    if (disposed) return;
    try {
      cultural.render();
      if (!enabled) return;
      views.render();
      const travelled = scrollY - start;
      const p = travelled >= distance - 1 ? 1 : travelled <= 1 ? 0 : clamp(travelled / distance);
      // S01 reading reveals use their own viewport positions. Keep this ahead of
      // the scene-progress guard so ordinary reading continues after p reaches 1.
      const viewportHeight = window.innerHeight;
      const mobile = innerWidth < 768;
      for (const element of textReveals) {
        const top = element.getBoundingClientRect().top;
        const stageName = element.dataset.scrollReveal;
        const [begin, finish] = mobile
          ? stageName === 'body' ? [0.4, 0.22]
            : stageName === 'source' ? [0.2, 0.12]
              : [0.6, 0.42]
          : stageName === 'body' ? [0.64, 0.44]
            : stageName === 'source' ? [0.5, 0.34]
              : [0.91, 0.67];
        const progress = clamp((viewportHeight * begin - top) / (viewportHeight * (begin - finish)));
        element.style.opacity = String(progress);
        element.style.transform = `translate3d(0, ${(1 - progress) * 16}px, 0)`;
        element.style.visibility = progress > 0.001 ? 'visible' : 'hidden';
        element.toggleAttribute('inert', progress < 0.999);
      }
      if (!force && Math.abs(lastProgress - p) < 0.000001) return;
      lastProgress = p;
      const passing = smooth(0.025, 0.39, p);
      const reveal = smooth(0.36, 0.73, p);
      const settle = smooth(0.69, 1, p);
      const handoff = smooth(0.965, 1, p);
      const stageTop = stage.getBoundingClientRect().top;
      root.dataset.entryProgress = p.toFixed(4);
      root.dataset.entryStage = p < 0.025 ? 'view' : p < 0.39 ? 'threshold' : p < 0.76 ? 'mist' : p < 1 ? 'gallery' : 'reading';
      set('--entry-copy', 1 - smooth(0.015, 0.22, p));
      set('--entry-nav', 1 - smooth(0.9, 1, p));
      set('--entry-copy-y', -24 * smooth(0.015, 0.25, p));
      set('--entry-frame', 1 - smooth(0.035, 0.26, p));
      set('--entry-original', 1 - smooth(0, 0.035, p));
      set('--gallery-heading', smooth(0.85, 0.98, p));
      set('--gallery-heading-y', 26 * (1 - smooth(0.85, 0.98, p)));
      set('--gallery-photo', handoff);
      set('--gallery-copy', smooth(0.95, 1, p));
      header.inert = p >= 0.999;
      hero.inert = p > 0.27;
      gallery.inert = p < 0.88;
      world.style.visibility = p > 0 && p < 1 ? 'visible' : 'hidden';
      world.style.opacity = String(smooth(0, 0.025, p));
      world.style.clipPath = `circle(${mix(circle.radius, circle.cover, passing)}px at ${circle.x}px ${circle.y}px)`;
      paper.style.opacity = String(1 - smooth(0.73, 0.98, p));
      const depth = smooth(0.03, 0.63, p);
      const zoom = innerWidth < 768 ? 1.85 : 2.35;
      painting.style.transform = `translate(${(width / 2 - circle.x) * depth}px, ${(height * 0.47 - circle.y) * depth}px) scale(${mix(1, zoom, depth)})`;
      painting.style.opacity = String(1 - smooth(0.42, 0.79, p));
      const distant = painting.querySelector<HTMLElement>('.g-art-back');
      const shore = painting.querySelector<HTMLElement>('.g-art-water');
      const near = painting.querySelector<HTMLElement>('.g-art-foreground');
      if (distant) distant.style.transform = `translateY(${-12 - 4 * depth}%)`;
      if (shore) shore.style.transform = `translate(${1 + depth}%, ${8 - 3 * depth}%) scale(${1.06 + 0.05 * depth})`;
      if (near) near.style.transform = `translate(${5 - 5 * depth}%, ${20 - 8 * depth}%) scale(${0.57 + 0.09 * depth})`;
      mist.style.opacity = String(Math.sin(smooth(0.29, 0.91, p) * Math.PI) * 0.54);
      mist.style.transform = `translate3d(${mix(-4, 4, reveal)}%, ${mix(2, -3, reveal)}%, 0)`;
      previews.forEach((preview, index) => {
        const target = targets[index];
        if (!target) return;
        const mobile = innerWidth < 768;
        const origin = mobile
          ? { left: width * (index ? 0.25 : 0.07), top: height * (index ? 0.43 : 0.16), width: width * (index ? 0.68 : 0.86), height: height * (index ? 0.4 : 0.43) }
          : { left: width * (index ? 0.535 : 0.065), top: height * (index ? 0.24 : 0.18), width: width * 0.4, height: height * 0.62 };
        preview.style.left = `${mix(origin.left, target.left, settle)}px`;
        preview.style.top = `${mix(origin.top - stageTop, target.top - scrollY - stageTop, settle)}px`;
        preview.style.width = `${mix(origin.width, target.width, settle)}px`;
        preview.style.height = `${mix(origin.height, target.height, settle)}px`;
        preview.style.opacity = String(reveal * (1 - handoff));
        preview.style.transform = `translate3d(0, ${(1 - reveal) * (index ? 24 : 40)}px, 0)`;
        const edge = reveal * 132;
        const mask = `linear-gradient(180deg, #000 0%, #000 ${Math.max(0, edge - 24)}%, transparent ${edge}%)`;
        preview.style.maskImage = mask;
        preview.style.webkitMaskImage = mask;
        preview.style.filter = `saturate(${mix(0.42, 1, reveal)})`;
      });
    } catch {
      failOpen();
    }
  }

  function scheduleRender() {
    if (frame || !enabled) return;
    frame = requestAnimationFrame(() => { frame = 0; render(); });
  }

  function measure() {
    height = Math.max(innerHeight, stage.offsetHeight);
    width = stage.clientWidth;
    distance = Math.round(innerHeight * (innerWidth < 768 ? 1.02 : 1.55));
    root.style.setProperty('--entry-height', `${height}px`);
    root.style.setProperty('--entry-distance', `${distance}px`);
    stage.style.top = `${Math.min(0, innerHeight - height)}px`;
    start = track.getBoundingClientRect().top + scrollY;
    const stageRect = stage.getBoundingClientRect();
    const rect = gate.getBoundingClientRect();
    const x = rect.left - stageRect.left + rect.width / 2;
    const y = rect.top - stageRect.top + rect.height / 2;
    circle = {
      x, y, radius: rect.width * 0.448, size: rect.width,
      left: rect.left - stageRect.left, top: rect.top - stageRect.top,
      cover: Math.max(Math.hypot(x, y), Math.hypot(width - x, y), Math.hypot(x, height - y), Math.hypot(width - x, height - y)) + 4,
    };
    painting.style.left = `${circle.left}px`;
    painting.style.top = `${circle.top}px`;
    painting.style.width = `${circle.size}px`;
    painting.style.height = `${circle.size}px`;
    targets = photos.map((photo) => {
      const r = photo.getBoundingClientRect();
      return { left: r.left, top: r.top + scrollY, width: r.width, height: r.height };
    });
  }

  function refresh() {
    if (disposed) return;
    if (!enabled) { cultural.refresh(); return; }
    cancelAuto();
    const p = clamp((scrollY - start) / distance);
    const inGallery = p >= 1;
    const oldGalleryTop = gallery.getBoundingClientRect().top + scrollY;
    const galleryOffset = scrollY - oldGalleryTop;
    measure();
    if (inGallery) window.scrollTo(0, gallery.getBoundingClientRect().top + scrollY + galleryOffset);
    else if (p > 0) window.scrollTo(0, start + p * distance);
    views.refresh();
    cultural.refresh();
    render(true);
  }

  function jumpToGallery() {
    cancelAuto();
    window.scrollTo(0, gallery.getBoundingClientRect().top + scrollY);
    render(true);
    heading.focus({ preventScroll: true });
    history.replaceState(null, '', '#portraits');
  }

  function returnToStart() {
    cancelAuto();
    window.scrollTo(0, track.getBoundingClientRect().top + scrollY);
    render(true);
    history.replaceState(null, '', '#entrance');
  }

  function configure() {
    if (disposed) return;
    cancelAuto();
    const galleryOffset = scrollY - (gallery.getBoundingClientRect().top + scrollY);
    const wasGallery = galleryOffset >= -2;
    const oldProgress = enabled ? clamp((scrollY - start) / distance) : 0;
    const allow = !failed && !still && !reduced.matches && innerHeight >= 600 && CSS.supports('clip-path', 'circle(1px at 1px 1px)');
    clearEnhancement();
    for (const element of textReveals) {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.style.removeProperty('visibility');
      element.removeAttribute('inert');
    }
    enabled = allow;
    if (enabled) {
      root.classList.add('g-journey-ready');
      measure();
      if (wasGallery) window.scrollTo(0, gallery.getBoundingClientRect().top + scrollY + galleryOffset);
      else if (oldProgress > 0) window.scrollTo(0, start + oldProgress * distance);
    } else {
      root.dataset.entryStage = 'static';
      if (wasGallery) window.scrollTo(0, gallery.getBoundingClientRect().top + scrollY + galleryOffset);
      else if (oldProgress > 0.01) jumpToGallery();
    }
    views.configure(allow);
    cultural.configure(allow);
    render(true);
  }

  function enter() {
    if (automatic) return;
    if (!enabled || lastProgress >= 0.999) { jumpToGallery(); return; }
    const from = scrollY;
    const to = start + distance;
    const began = performance.now();
    const duration = 1850;
    automatic = true;
    root.dataset.entryAuto = 'true';
    const tick = (now: number) => {
      if (!automatic || disposed) return;
      const t = clamp((now - began) / duration);
      const eased = t * t * (3 - 2 * t);
      window.scrollTo(0, mix(from, to, eased));
      render();
      if (t < 1) autoFrame = requestAnimationFrame(tick);
      else {
        cancelAuto();
        heading.focus({ preventScroll: true });
        history.replaceState(null, '', '#portraits');
      }
    };
    autoFrame = requestAnimationFrame(tick);
  }

  function interruptKey(event: KeyboardEvent) {
    if (!event.defaultPrevented && ['Escape', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancelAuto();
  }
  function resize() { configure(); }
  function hashChange() {
    if (location.hash === '#portraits') jumpToGallery();
    else if (location.hash === '#entrance') returnToStart();
  }
  function dispose() {
    disposed = true;
    cancelAuto();
    cancelAnimationFrame(frame);
    cancelAnimationFrame(initialFrame);
    observer?.disconnect();
    reduced.removeEventListener('change', configure);
    window.removeEventListener('scroll', scheduleRender);
    window.removeEventListener('wheel', cancelAuto);
    window.removeEventListener('touchmove', cancelAuto);
    window.removeEventListener('keydown', interruptKey);
    window.removeEventListener('resize', resize);
    window.removeEventListener('hashchange', hashChange);
    clearEnhancement();
    views.dispose();
    cultural.dispose();
  }
  try {
    observer = new ResizeObserver(() => refresh());
    observer.observe(stage);
    observer.observe(gallery.querySelector('.g-section-heading') || gallery);
    window.addEventListener('scroll', scheduleRender, { passive: true });
    window.addEventListener('wheel', cancelAuto, { passive: true });
    window.addEventListener('touchmove', cancelAuto, { passive: true });
    window.addEventListener('keydown', interruptKey);
    window.addEventListener('resize', resize);
    window.addEventListener('hashchange', hashChange);
    reduced.addEventListener('change', configure);
    configure();
    initialFrame = requestAnimationFrame(() => {
      if (location.hash === '#portraits') jumpToGallery();
      else {
        // These sections follow S02's enhanced height; align after it is measured.
        if (['#culture', '#compare', '#journey-end', '#shared', '#shared-exit', '#credits', '#exhibition-sources'].includes(location.hash)) {
          root.querySelector<HTMLElement>(location.hash)?.scrollIntoView({ behavior: 'instant' });
        }
        render(true);
      }
    });
    document.fonts?.ready.then(() => { if (!disposed) refresh(); });
  } catch (error) {
    dispose();
    throw error;
  }

  return {
    enter, jumpToGallery, returnToStart, refresh,
    setStill(value) { if (still !== value) { still = value; configure(); } },
    dispose,
  };
}
