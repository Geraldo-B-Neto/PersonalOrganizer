/**
 * SCROLL ANIMATIONS (IntersectionObserver)
 * Ativa a classe .is-visible nos elementos com .anim--*
 */
export function initScrollAnimations() {
  const SELECTOR = '.anim--fade-in-up, .anim--fade-in, .anim--scale-up';
  const elements = document.querySelectorAll(SELECTOR);

  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = el.dataset.animDelay;

        if (delay) {
          el.style.setProperty('--anim-delay', delay + 'ms');
          el.style.animationDelay = delay + 'ms';
        }

        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}
