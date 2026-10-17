import type { ExhibitionLanguage } from './content';

const clamp = (value: number) => Math.max(0, Math.min(100, value));
const ease = (from: number, to: number, value: number) => {
  const p = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return p * p * (3 - 2 * p);
};
const paintTimes = [520, 560, 600, 560, 480, 500, 680];

/** Event-driven frame writer: no React updates, geometry reads or scroll handler in pointermove. */
export function createComparisonController(root: HTMLElement, commit: (index: number | null) => void) {
  const frame = root.querySelector<HTMLElement>('.c-compare-frame')!;
  const input = root.querySelector<HTMLInputElement>('.c-compare-range')!;
  const output = root.querySelector<HTMLOutputElement>('.c-split-output')!;
  const presets = [...root.querySelectorAll<HTMLButtonElement>('[data-split-preset]')];
  const layers = Array.from({ length: 7 }, (_, i) => [...root.querySelectorAll<HTMLElement>(`[data-study-index="${i}"]`)]);
  const moods = [...root.querySelectorAll<HTMLElement>('.s04-mood')];
  const moodAlpha = Array<number>(7).fill(0);
  const reading = root.querySelector<HTMLElement>('.c-dimension-reading')!;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let language: ExhibitionLanguage = 'zh';
  let still = false;
  let disposed = false;
  let raf = 0;
  let pendingSplit: number | null = null;
  let value = 50;
  let lastRounded = -1;
  let gesture: { id: number; left: number; width: number; x: number; y: number; touch: boolean; horizontal: boolean } | null = null;
  let transition: { index: number; start: number; alpha: number[]; focus: number[]; moods: number[]; text: number; line: number; committed: boolean } | null = null;
  let pausedAt: number | null = null;
  let lineOpacity = 0;
  let selected: number | null = null;
  const alpha = Array<number>(7).fill(0);
  const focus = Array<number>(7).fill(0);
  let textOpacity = 1;

  function writeSplit(next: number) {
    value = clamp(next);
    const rounded = Math.round(value);
    root.style.setProperty('--comparison-split', `${value.toFixed(3)}%`);
    root.style.setProperty('--comparison-cn', String(value / 100));
    root.style.setProperty('--comparison-uk', String(1 - value / 100));
    root.dataset.split = value.toFixed(3);
    input.value = String(value);
    if (lastRounded !== rounded) {
      input.setAttribute('aria-valuetext', language === 'zh' ? `苏州 ${rounded}%，Stourhead ${100 - rounded}%` : `Suzhou ${rounded} percent, Stourhead ${100 - rounded} percent`);
      output.textContent = `${rounded}% / ${100 - rounded}%`;
      for (const button of presets) button.setAttribute('aria-pressed', String(rounded === Number(button.dataset.splitPreset)));
      lastRounded = rounded;
    }
  }
  function layer(index: number, opacity: number, light: number, open?: number) {
    alpha[index] = opacity;
    focus[index] = light;
    for (const el of layers[index]) {
      el.style.setProperty('--study-alpha', opacity.toFixed(4));
      el.style.setProperty('--study-focus', light.toFixed(4));
      if (open !== undefined) el.style.setProperty('--study-open', open.toFixed(4));
    }
    root.style.setProperty('--garden-focus', String(Math.max(...focus)));
  }
  function line(progress: number) {
    lineOpacity = progress;
    root.style.setProperty('--observation-line', String(progress));
  }
  function mood(index: number, opacity: number) {
    moodAlpha[index] = opacity;
    moods[index]?.style.setProperty('--mood-alpha', opacity.toFixed(4));
  }
  function text(title: number, body: number) {
    textOpacity = title;
    root.style.setProperty('--observation-title', String(title));
    root.style.setProperty('--observation-body', String(body));
    reading.toggleAttribute('inert', body < .999);
    reading.style.visibility = title > .001 ? 'visible' : 'hidden';
  }
  function request() { if (!raf && !disposed) raf = requestAnimationFrame(tick); }
  function tick(now: number) {
    raf = 0;
    if (disposed) return;
    if (pendingSplit !== null) { writeSplit(pendingSplit); pendingSplit = null; }
    if (!transition) return;
    // During a drag the divider owns the frame budget. Resume art from the same time on release.
    if (pausedAt !== null) return;
    const t = now - transition.start;
    const i = transition.index;
    const duration = paintTimes[i];
    // The environment crossfades while foreground emphasis returns to the photograph.
    for (let k = 0; k < 7; k++) {
      if (transition.moods[k] || k === i) mood(k, transition.moods[k] * (1 - ease(0, 950, t)) + (k === i ? ease(150, 1050, t) : 0));
    }
    if (t < 380) {
      const out = 1 - ease(0, 220, t);
      for (let k = 0; k < 7; k++) if (transition.alpha[k] || transition.focus[k]) layer(k, transition.alpha[k] * out, transition.focus[k] * out);
      line(transition.line * (1 - ease(0, 160, t)));
      text(transition.text * (1 - ease(0, 150, t)), 0);
      root.dataset.observationPhase = t < 220 ? 'returning' : 'photograph';
    } else {
      if (!transition.committed) { transition.committed = true; selected = i; commit(i); }
      const paint = ease(780, 780 + duration, t);
      layer(i, paint, ease(380, 880, t), ease(500, 1000, t));
      line(ease(900 + duration, 1250 + duration, t));
      text(ease(1150 + duration, 1450 + duration, t), ease(1300 + duration, 1750 + duration, t));
      root.dataset.observationPhase = t < 780 ? 'focusing' : t < 780 + duration ? 'interpreting' : t < 1250 + duration ? 'guiding' : 'reading';
    }
    if (t < 1750 + duration) request();
    else { transition = null; root.dataset.observationPhase = 'reading'; }
  }
  function stopPointer() {
    const previous = gesture;
    gesture = null;
    root.removeAttribute('data-dragging');
    if (pausedAt !== null) {
      if (transition) transition.start += performance.now() - pausedAt;
      pausedAt = null;
      if (transition) request();
    }
    if (previous && frame.hasPointerCapture(previous.id)) frame.releasePointerCapture(previous.id);
  }
  function pointerDown(event: PointerEvent) {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const box = frame.getBoundingClientRect(); // Once per gesture; never in move/tick.
    gesture = { id: event.pointerId, left: box.left, width: box.width, x: event.clientX, y: event.clientY, touch: event.pointerType === 'touch', horizontal: event.pointerType !== 'touch' };
    if (gesture.horizontal && transition) pausedAt = performance.now();
    frame.setPointerCapture(event.pointerId);
    input.focus({ preventScroll: true });
    if (!gesture.touch) { pendingSplit = (event.clientX - box.left) / box.width * 100; request(); }
    root.dataset.dragging = 'true';
  }
  function pointerMove(event: PointerEvent) {
    if (!gesture || gesture.id !== event.pointerId) return;
    if (!gesture.horizontal) {
      const dx = Math.abs(event.clientX - gesture.x);
      const dy = Math.abs(event.clientY - gesture.y);
      if (dy > dx && dy > 7) { stopPointer(); return; }
      if (dx < 5) return;
      gesture.horizontal = true;
      if (transition) pausedAt = performance.now();
    }
    pendingSplit = (event.clientX - gesture.left) / gesture.width * 100;
    request();
  }
  function pointerUp(event: PointerEvent) {
    if (!gesture || gesture.id !== event.pointerId) return;
    if (gesture.horizontal) { pendingSplit = (event.clientX - gesture.left) / gesture.width * 100; request(); }
    stopPointer();
  }
  function keyboard(event: KeyboardEvent) {
    const base = pendingSplit ?? value;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 100 : ['ArrowRight', 'ArrowUp'].includes(event.key) ? base + 5 : ['ArrowLeft', 'ArrowDown'].includes(event.key) ? base - 5 : null;
    if (next === null) return;
    event.preventDefault();
    pendingSplit = next;
    request();
  }
  function nativeInput() { pendingSplit = Number(input.value); request(); }
  function reset() {
    transition = null;
    selected = null;
    for (let i = 0; i < 7; i++) layer(i, 0, 0, 0);
    for (let i = 0; i < 7; i++) mood(i, 0);
    pausedAt = null;
    line(0);
    text(1, 1);
    commit(null);
    root.dataset.observationPhase = 'original';
  }
  function escape(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    stopPointer();
    reset();
  }
  function staticChanged() {
    if (!(still || media.matches)) return;
    if (transition) selected = transition.index;
    transition = null;
    pausedAt = null;
    for (let i = 0; i < 7; i++) layer(i, i === selected ? 1 : 0, i === selected ? 1 : 0, 1);
    for (let i = 0; i < 7; i++) mood(i, i === selected ? 1 : 0);
    line(selected === null ? 0 : 1);
    text(1, 1);
    commit(selected);
    root.dataset.observationPhase = selected === null ? 'original' : 'reading';
  }
  frame.addEventListener('pointerdown', pointerDown);
  frame.addEventListener('pointermove', pointerMove);
  frame.addEventListener('pointerup', pointerUp);
  frame.addEventListener('pointercancel', stopPointer);
  frame.addEventListener('lostpointercapture', stopPointer);
  input.addEventListener('keydown', keyboard);
  input.addEventListener('input', nativeInput);
  root.addEventListener('keydown', escape);
  window.addEventListener('resize', stopPointer);
  media.addEventListener('change', staticChanged);
  for (let i = 0; i < 7; i++) layer(i, 0, 0, 0);
  for (let i = 0; i < 7; i++) mood(i, 0);
  line(0);
  text(1, 1);
  writeSplit(50);
  root.dataset.observationPhase = 'original';
  return {
    select(index: number) {
      if (index < 0 || index >= 7) return;
      if (still || media.matches) { selected = index; staticChanged(); return; }
      transition = { index, start: performance.now(), alpha: [...alpha], focus: [...focus], moods: [...moodAlpha], text: textOpacity, line: lineOpacity, committed: false };
      if (gesture?.horizontal) pausedAt = performance.now();
      request();
    },
    setSplit(next: number) { pendingSplit = next; request(); },
    setLanguage(next: ExhibitionLanguage) { language = next; lastRounded = -1; writeSplit(value); },
    setStill(next: boolean) { still = next; staticChanged(); },
    reset,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      stopPointer();
      frame.removeEventListener('pointerdown', pointerDown);
      frame.removeEventListener('pointermove', pointerMove);
      frame.removeEventListener('pointerup', pointerUp);
      frame.removeEventListener('pointercancel', stopPointer);
      frame.removeEventListener('lostpointercapture', stopPointer);
      input.removeEventListener('keydown', keyboard);
      input.removeEventListener('input', nativeInput);
      root.removeEventListener('keydown', escape);
      window.removeEventListener('resize', stopPointer);
      media.removeEventListener('change', staticChanged);
      for (let i = 0; i < 7; i++) layer(i, 0, 0, 0);
      for (let i = 0; i < 7; i++) mood(i, 0);
      root.style.removeProperty('--observation-title');
      root.style.removeProperty('--observation-body');
      root.style.removeProperty('--observation-line');
      root.style.removeProperty('--garden-focus');
      reading.removeAttribute('inert');
      reading.style.visibility = 'visible';
    },
  };
}

export type ComparisonController = ReturnType<typeof createComparisonController>;
