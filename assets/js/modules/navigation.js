/**
 * NAVIGATION MODULE
 * Gerencia Menu Mobile, Smart Reveal e Back to Top.
 */

export function initNavigation() {
  const header = document.getElementById('mainHeader');
  const hero = document.querySelector('.hero-v7');
  const menuToggle = document.getElementById('navMenuToggle');
  const navLinks = document.querySelectorAll('.nav-editorial__link');
  const backTopBtn = document.getElementById('backTop');

  if (!header) return;

  // 1. Back to Top Logic
  if (backTopBtn) {
    const THRESHOLD = 400;
    const onScrollTop = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      backTopBtn.classList.toggle('visible', scrolled > THRESHOLD);
    };
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', onScrollTop, { passive: true });
  }

  // 2. Navbar Scrolled State (Transparent to Solid)
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      header.classList.toggle('is-scrolled', !entry.isIntersecting);
    });
  }, observerOptions);

  if (hero) observer.observe(hero);

  // 3. Smart Reveal (Hide on scroll down, show on up)
  let lastScrollTop = 0;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(lastScrollTop - scrollTop) <= 5) return;

    if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
      if (!header.classList.contains('is-menu-open')) {
        header.classList.add('nav-hidden');
      }
    } else {
      header.classList.remove('nav-hidden');
    }
    lastScrollTop = scrollTop;
  }, { passive: true });

  // 4. Mobile Menu Toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      header.classList.toggle('is-menu-open');
      document.body.classList.toggle('menu-open-locked');
    });
  }

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('is-menu-open');
      document.body.classList.remove('menu-open-locked');
    });
  });
}
