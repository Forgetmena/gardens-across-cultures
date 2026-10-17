import { createSharedReveal } from './shared-reveal';

/** Uses the entrance controller's existing scheduling and preference lifecycle. */
export function createCulturalReveal(root: HTMLElement) {
  const shared = createSharedReveal(root);
  const elements = [...root.querySelectorAll<HTMLElement>('[data-culture-reveal]')];
  const anchorSelector = '.c-context-heading,.c-evidence-pair,.c-context-note,.c-compare-heading,.c-compare-frame,.c-dimension-reading,.c-parallel-reading,[data-shared-anchor],[data-closing-anchor]';
  let enabled = false;
  let reading: { element: HTMLElement; top: number } | null = null;
  function restore() {
    if (reading) window.scrollTo(0, scrollY + reading.element.getBoundingClientRect().top - reading.top);
  }
  function clear() {
    shared.clear();
    for (const el of elements) {
      el.style.removeProperty('opacity');
      el.style.removeProperty('visibility');
      el.style.removeProperty('--culture-y');
      el.style.removeProperty('--culture-inset');
      el.removeAttribute('inert');
    }
  }
  function render() {
    const section = root.querySelector<HTMLElement>('#culture');
    if (section && section.getBoundingClientRect().top <= innerHeight * .25) {
      const current = [...root.querySelectorAll<HTMLElement>(anchorSelector)].filter(el => el.getBoundingClientRect().top <= innerHeight * .3).at(-1);
      reading = current ? { element: current, top: current.getBoundingClientRect().top } : null;
    } else reading = null;
    if (!enabled) return;
    try {
      shared.render();
      for (const el of elements) {
        const kind = el.dataset.cultureReveal;
        const [begin, finish] = kind === 'image' ? [.98, .68] : kind === 'title' ? [.85, .65] : [.73, .51];
        const top = el.getBoundingClientRect().top;
        const t = Math.max(0, Math.min(1, (innerHeight * begin - top) / (innerHeight * (begin - finish))));
        const p = t * t * (3 - 2 * t);
        el.style.opacity = String(p);
        el.style.setProperty('--culture-y', `${10 * (1 - p)}px`);
        el.style.setProperty('--culture-inset', `${6 * (1 - p)}%`);
        el.style.visibility = p > .001 ? 'visible' : 'hidden';
        el.toggleAttribute('inert', p < .999);
      }
    } catch { enabled = false; clear(); }
  }
  return { render, refresh() { restore(); render(); }, configure(allow: boolean) { enabled = allow; clear(); restore(); render(); }, dispose: clear };
}
