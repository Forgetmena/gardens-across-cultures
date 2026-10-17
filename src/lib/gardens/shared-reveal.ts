/** Called by the existing cultural/entrance scheduler; no listeners or extra rAF. */
export function createSharedReveal(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>('#shared');
  const items = [...root.querySelectorAll<HTMLElement>('[data-shared-reveal]')];
  const ease = (p: number) => { const t = Math.max(0, Math.min(1, p)); return t * t * (3 - 2 * t); };
  function clear() {
    for (const el of items) {
      el.style.removeProperty('opacity');
      el.style.removeProperty('visibility');
      el.style.removeProperty('--shared-y');
      el.style.removeProperty('--shared-progress');
      el.removeAttribute('inert');
    }
  }
  function render() {
    if (!section) return;
    // Read the small chapter in one batch, then write; transforms do not alter flow.
    const sectionBox = section.getBoundingClientRect();
    if (sectionBox.top > innerHeight * 1.2) return;
    const tops = items.map(el => el.getBoundingClientRect().top - parseFloat(el.style.getPropertyValue('--shared-y') || '0'));
    // A finite document must never leave the last readable question half revealed.
    const endProgress = ease(1 - (document.documentElement.scrollHeight - innerHeight - scrollY) / 140);
    items.forEach((el, i) => {
      const kind = el.dataset.sharedReveal;
      const [begin, finish] = kind === 'image' || kind === 'line' ? [.98, .68]
        : kind === 'title' ? [.88, .65]
          : kind === 'question' || kind === 'source' ? [.69, .47] : [.78, .56];
      const p = Math.max(ease((innerHeight * begin - tops[i]) / (innerHeight * (begin - finish))), tops[i] < innerHeight ? endProgress : 0);
      el.style.opacity = String(p);
      el.style.setProperty('--shared-progress', p.toFixed(4));
      el.style.setProperty('--shared-y', `${(1 - p) * (kind === 'image' ? 8 : 6)}px`);
      el.style.visibility = p > .001 ? 'visible' : 'hidden';
      // Focus can scroll a native disclosure to the viewport centre. Avoid an
      // almost-complete (99.8%) reveal disabling that otherwise readable control.
      el.toggleAttribute('inert', p < .98);
    });
  }
  return { render, clear };
}
