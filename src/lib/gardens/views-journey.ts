/** S02 renderer. Scheduling, preferences and lifecycle belong to entrance-journey. */
export interface ViewsJourney {
  configure: (allowMotion: boolean) => void;
  refresh: () => void;
  render: () => void;
  dispose: () => void;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export function createViewsJourney(exhibition: HTMLElement): ViewsJourney {
  const root = exhibition.querySelector<HTMLElement>('.g-path');
  const track = root?.querySelector<HTMLElement>('.g-path-track');
  const stage = root?.querySelector<HTMLElement>('.g-path-stage');
  if (!root || !track || !stage) return { configure() {}, refresh() {}, render() {}, dispose() {} };
  const scenes = [...root.querySelectorAll<HTMLElement>('[data-path-scene]')].map((article) => ({
    article,
    shell: article.querySelector<HTMLElement>('.g-path-image-shell')!,
    plane: article.querySelector<HTMLElement>('.g-path-image-plane')!,
    veil: article.querySelector<HTMLElement>('.g-path-veil')!,
    frame: article.querySelector<HTMLElement>('.g-path-frame')!,
    label: article.querySelector<HTMLElement>('.g-path-label')!,
    caption: article.querySelector<HTMLElement>('.g-path-caption')!,
    reflection: article.querySelector<HTMLElement>('.g-path-reflection')!,
  }));
  const markers = [...root.querySelectorAll<HTMLElement>('[data-path-step]')];
  const begins = [0, 0.25, 0.5, 0.75];
  const pictureEnds = [0.065, 0.335, 0.595, 0.845];
  const captionStarts = [0.08, 0.35, 0.61, 0.86];
  const captionEnds = [0.115, 0.38, 0.64, 0.89];
  const textStarts = [0.135, 0.4, 0.66, 0.91];
  const textEnds = [0.18, 0.445, 0.705, 0.965];
  let mode: 'desktop' | 'mobile' | 'static' = 'static';
  let broken = false;
  let start = 0;
  let distance = 1;
  let end = 0;
  let tops: number[] = [];
  let current = -1;
  let reading: { scene: number; p: number; offset: number } | null = null;

  function showText(element: HTMLElement, progress: number) {
    element.style.opacity = String(progress);
    element.style.setProperty('--path-text-y', `${12 * (1 - progress)}px`);
    element.style.visibility = progress > 0.001 ? 'visible' : 'hidden';
    element.toggleAttribute('inert', progress < 0.999);
  }
  function mark(index: number) {
    if (current === index) return;
    current = index;
    root!.dataset.pathView = scenes[index].article.dataset.asset;
    markers.forEach((marker, i) => {
      marker.classList.toggle('is-current', i === index);
      if (i === index) marker.setAttribute('aria-current', 'step');
      else marker.removeAttribute('aria-current');
    });
  }
  function clear() {
    root!.classList.remove('is-path-desktop', 'is-path-mobile');
    root!.style.removeProperty('--path-height');
    root!.style.removeProperty('--path-distance');
    for (const scene of scenes) {
      for (const element of [scene.article, scene.shell, scene.plane, scene.veil, scene.frame, scene.label, scene.caption, scene.reflection]) {
        for (const property of ['opacity', 'visibility', 'transform', 'clip-path', '--path-text-y']) element.style.removeProperty(property);
        element.removeAttribute('inert');
      }
    }
  }
  function measure() {
    start = track!.getBoundingClientRect().top + scrollY;
    distance = Math.round(innerHeight * 5.2);
    if (mode === 'desktop') {
      root!.style.setProperty('--path-height', `${innerHeight}px`);
      root!.style.setProperty('--path-distance', `${distance}px`);
      end = start + distance;
    } else end = track!.getBoundingClientRect().bottom + scrollY - innerHeight;
    tops = scenes.map(({ article }) => article.getBoundingClientRect().top + scrollY);
  }
  function restore(previous: typeof reading, previousMode: typeof mode) {
    if (!previous) return;
    if (mode === 'desktop') {
      const p = previousMode === 'desktop' ? previous.p : Math.min(0.97, begins[previous.scene] + 0.18);
      window.scrollTo(0, start - innerHeight * 0.85 + p * (distance + innerHeight * 0.85));
    } else {
      const offset = previousMode === 'desktop' ? -innerHeight * 0.12 : previous.offset;
      window.scrollTo(0, tops[previous.scene] + offset);
    }
  }
  function configure(allowMotion: boolean) {
    const previous = reading;
    const previousMode = mode;
    clear();
    mode = !allowMotion || broken ? 'static' : innerWidth >= 1024 && innerHeight >= 760 ? 'desktop' : 'mobile';
    if (mode !== 'static') root!.classList.add(`is-path-${mode}`);
    measure();
    restore(previous, previousMode);
    render();
  }
  function refresh() {
    const previous = reading;
    measure();
    restore(previous, mode);
    render();
  }
  function render() {
    if (mode === 'static') { reading = null; return; }
    try {
      if (mode === 'desktop') {
        const prefix = innerHeight * 0.85;
        const p = clamp((scrollY - start + prefix) / (distance + prefix));
        root!.dataset.pathProgress = p.toFixed(4);
        root!.style.setProperty('--path-progress', String(p));
        const index = begins.reduce((chosen, begin, i) => p >= begin ? i : chosen, 0);
        mark(index);
        reading = scrollY >= start - 1 && scrollY <= end + 1 ? { scene: index, p, offset: 0 } : null;
        scenes.forEach((scene, i) => {
          const reveal = smooth(begins[i], pictureEnds[i], p);
          const next = begins[i + 1] ?? 2;
          const leaving = smooth(next, next + 0.13, p);
          const photoOpacity = 1 - smooth(next + 0.045, next + 0.13, p);
          const textOut = 1 - smooth(next - 0.025, next + 0.015, p);
          scene.article.style.visibility = reveal > 0.0001 && photoOpacity > 0.0001 ? 'visible' : 'hidden';
          scene.article.style.opacity = String(photoOpacity);
          scene.article.toggleAttribute('inert', smooth(captionStarts[i], captionEnds[i], p) * textOut < 0.999);
          const r = scene.shell.getBoundingClientRect();
          if (i === 1) {
            const radius = Math.max(Math.hypot(r.width * 0.5, r.height * 0.63), Math.hypot(r.width * 0.5, r.height * 0.37)) + 2;
            scene.shell.style.clipPath = `circle(${radius * reveal}px at 50% 63%)`;
          } else if (i === 2) {
            const edge = reveal * 100;
            scene.shell.style.clipPath = `polygon(0 0, ${edge}% 0, ${Math.max(0, edge - 14 * (1 - reveal))}% 100%, 0 100%)`;
          } else if (i === 3) {
            scene.shell.style.clipPath = `inset(${52 * (1 - reveal)}% ${70 * (1 - reveal)}% ${48 * (1 - reveal)}% ${30 * (1 - reveal)}%)`;
          } else scene.shell.style.clipPath = `inset(${10 * (1 - reveal)}% ${50 * (1 - reveal)}% ${10 * (1 - reveal)}% ${50 * (1 - reveal)}%)`;
          const settle = smooth(begins[i], textEnds[i], p);
          const scale = i === 1 ? 1.012 - 0.012 * settle : 1.035 - 0.035 * settle + leaving * 0.012;
          scene.plane.style.transform = `translate3d(${(1 - settle) * (i < 2 ? 9 : -12) - leaving * 14}px, ${(1 - settle) * 6}px, 0) scale(${scale})`;
          scene.frame.style.transform = `translate3d(${-14 * (1 - settle) + leaving * 20}px, 0, 0)`;
          scene.veil.style.opacity = String(Math.sin(reveal * Math.PI) * (i === 2 ? 0.46 : 0.2));
          scene.veil.style.transform = `translate3d(${(reveal * 2 - 1) * 85}%, 0, 0)`;
          const caption = smooth(captionStarts[i], captionEnds[i], p) * textOut;
          showText(scene.label, caption);
          showText(scene.caption, caption);
          showText(scene.reflection, smooth(textStarts[i], textEnds[i], p) * textOut);
        });
      } else {
        let index = 0;
        scenes.forEach((scene, i) => {
          const r = scene.shell.getBoundingClientRect();
          const reveal = smooth(0, 1, (innerHeight * 0.94 - r.top) / (innerHeight * 0.52));
          scene.shell.style.clipPath = `inset(${8 * (1 - reveal)}% ${4 * (1 - reveal)}% ${24 * (1 - reveal)}% ${4 * (1 - reveal)}%)`;
          scene.plane.style.transform = `translate3d(0, ${8 * (1 - reveal)}px, 0) scale(${1.015 - reveal * 0.015})`;
          const caption = smooth(0, 1, (innerHeight * 0.84 - scene.caption.getBoundingClientRect().top) / (innerHeight * 0.2));
          const label = smooth(0, 1, (innerHeight * 0.8 - scene.label.getBoundingClientRect().top) / (innerHeight * 0.2));
          const reflection = smooth(0, 1, (innerHeight * 0.68 - scene.reflection.getBoundingClientRect().top) / (innerHeight * 0.22));
          showText(scene.caption, caption);
          showText(scene.label, label);
          showText(scene.reflection, reflection);
          if (scene.article.getBoundingClientRect().top < innerHeight * 0.5) index = i;
        });
        mark(index);
        root!.dataset.pathProgress = ((index + 1) / 4).toFixed(4);
        reading = scrollY >= start - 1 && scrollY <= end + 1 ? { scene: index, p: 0, offset: scrollY - tops[index] } : null;
      }
    } catch {
      broken = true;
      clear();
      mode = 'static';
      reading = null;
    }
  }
  return { configure, refresh, render, dispose: clear };
}
