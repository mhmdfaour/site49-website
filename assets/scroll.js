// Gentle hero parallax. Skipped entirely when the visitor prefers reduced motion.
const hero = document.querySelector('.hero-art');
const badge = document.querySelector('[data-drift]');
const motion = matchMedia('(prefers-reduced-motion: no-preference)');
let frame = 0;

function render() {
  frame = 0;
  if (!motion.matches) {
    hero.style.removeProperty('--drift');
    badge.style.removeProperty('--drift');
    return;
  }
  const offset = Math.min(22, Math.max(0, window.scrollY * 0.075));
  hero.style.setProperty('--drift', offset + 'px');
  badge.style.setProperty('--drift', -offset / 2 + 'px');
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(render);
}

if (hero && badge) {
  addEventListener('scroll', schedule, { passive: true });
  motion.addEventListener('change', schedule);
  schedule();
}
