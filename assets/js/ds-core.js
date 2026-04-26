/**
 * ================================================================
 *  DS-CORE.JS — Design System Core Interactions
 *  Sem dependências externas. Vanilla JS puro.
 *
 *  Módulos:
 *  1. initBackToTop        — botão de volta ao topo
 *  2. initScrollAnimations — entrada de elementos via IntersectionObserver
 *  3. initThemeSwitcher    — alternador de tema (light/dark)
 *  4. initTokenCopy        — copia valor de token ao clicar
 *  5. DSCore               — namespace público de inicialização
 * ================================================================
 */

'use strict';



/* ============================================================
   2. BACK TO TOP
   Mostra o botão após 400px de scroll e rola suavemente ao topo.
============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  const THRESHOLD = 400;

  function onScroll() {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle('visible', scrolled > THRESHOLD);
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
}

/* ============================================================
   3. SCROLL ANIMATIONS (IntersectionObserver)
   Ativa a classe .is-visible nos elementos com .anim--*
   quando entram na viewport.

   Suporta:
   - .anim--fade-in-up
   - .anim--fade-in
   - .anim--scale-up

   Atraso opcional via atributo data-anim-delay="200" (ms).
============================================================ */
function initScrollAnimations() {
  const SELECTOR = '.anim--fade-in-up, .anim--fade-in, .anim--scale-up';
  const elements = document.querySelectorAll(SELECTOR);

  if (!elements.length) return;

  // Fallback para navegadores sem suporte
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
        observer.unobserve(el); // anima apenas uma vez
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   4. THEME SWITCHER
   Alterna entre .dark e .light no <body> ou elemento alvo.
   Persiste a preferência em localStorage.
   Respeita prefers-color-scheme na primeira visita.
============================================================ */
function initThemeSwitcher(options = {}) {
  const {
    target = document.body,
    storageKey = 'ds-theme',
    toggleBtnId = 'themeToggle',
  } = options;

  // Detecta preferência inicial
  function getPreference() {
    const stored = localStorage.getItem(storageKey);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      target.classList.add('dark');
      target.setAttribute('data-theme', 'dark');
    } else {
      target.classList.remove('dark');
      target.setAttribute('data-theme', 'light');
    }
    localStorage.setItem(storageKey, theme);
  }

  function toggle() {
    const current = localStorage.getItem(storageKey) || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Inicializa
  applyTheme(getPreference());

  // Liga ao botão, se existir
  const btn = document.getElementById(toggleBtnId);
  if (btn) btn.addEventListener('click', toggle);

  // Expõe método para toggle externo
  return { toggle, applyTheme };
}

/* ============================================================
   5. TOKEN COPY
   Clique em qualquer elemento .ds-color-hex ou .ds-type-spec
   copia o conteúdo para a área de transferência e exibe feedback.
============================================================ */
function initTokenCopy() {
  const COPYABLE = '.ds-color-hex, .ds-type-spec, .ds-color-name';

  document.querySelectorAll(COPYABLE).forEach(el => {
    el.style.cursor = 'copy';
    el.title = 'Clique para copiar';

    el.addEventListener('click', () => {
      const text = el.textContent.trim();

      if (!navigator.clipboard) {
        // Fallback legado
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showCopyFeedback(el);
        return;
      }

      navigator.clipboard.writeText(text).then(() => showCopyFeedback(el));
    });
  });

  function showCopyFeedback(el) {
    const original = el.textContent;
    el.textContent = '✓ Copiado!';
    el.style.color = 'var(--color-success, #64a85e)';

    setTimeout(() => {
      el.textContent = original;
      el.style.color = '';
    }, 1500);
  }
}

/* ============================================================
  6. TESTIMONIAL ROTATOR
  Alterna depoimentos em layout editorial com timer visivel.
  Pausa em hover/focus para leitura confortavel.
============================================================ */
function initTestimonialRotator() {
  const stage = document.getElementById('poTestimonialStage');
  if (!stage) return;

  const photo = document.getElementById('poTestimonialPhoto');
  const tag = document.getElementById('poTestimonialTag');
  const quote = document.getElementById('poTestimonialQuote');
  const context = document.getElementById('poTestimonialContext');
  const signature = document.getElementById('poTestimonialSignature');
  const progress = document.getElementById('poTestimonialProgress');
  const countdown = document.getElementById('poTestimonialCountdown');

  if (!photo || !tag || !quote || !context || !signature || !progress || !countdown) return;

  const items = [
    {
      photo: './assets/img/perfil3.png',
      photoAlt: 'Cliente em casa com organizacao funcional',
      tag: 'Resultados reais',
      quote: '"A organizacao da Bianca foi um divisor de aguas na minha rotina. Hoje tenho clareza no meu dia e muito mais leveza em casa."',
      context: 'Com uma rotina intensa de trabalho e casa, eu precisava de um sistema simples para manter o que construimos juntas.',
      signature: '- Camila, medica'
    },
    {
      photo: './assets/img/perfil2.png',
      photoAlt: 'Closet organizado por categorias',
      tag: 'Transformacao duradoura',
      quote: '"Eu finalmente parei de perder tempo procurando roupas. Tudo ficou intuitivo, bonito e facil de manter."',
      context: 'Meu closet estava sempre voltando ao caos. Agora cada peca tem lugar e a manutencao virou parte natural da rotina.',
      signature: '- Renata, empresaria'
    },
    {
      photo: './assets/img/perfil1.png',
      photoAlt: 'Armarios de cozinha organizados',
      tag: 'Vida mais leve',
      quote: '"Cozinhar deixou de ser estresse. O sistema ficou tao claro que ate minha familia passou a manter tudo no lugar."',
      context: 'O ganho nao foi so visual. Economizo tempo todos os dias e sinto a casa mais tranquila e funcional.',
      signature: '- Paula, mae de dois'
    }
  ];

  const DURATION_MS = 7000;
  let index = 0;
  let paused = false;
  let cycleStart = performance.now();
  let pausedAt = 0;
  let rafId = null;

  function render(current) {
    quote.textContent = current.quote;
    context.textContent = current.context;
    signature.textContent = current.signature;
    tag.textContent = current.tag;
    photo.src = current.photo;
    photo.alt = current.photoAlt;

    const content = stage.querySelector('.po-testimonial-content');
    const media = stage.querySelector('.po-testimonial-media');
    if (content) {
      content.classList.remove('is-changing');
      void content.offsetWidth;
      content.classList.add('is-changing');
    }
    if (media) {
      media.classList.remove('is-changing');
      void media.offsetWidth;
      media.classList.add('is-changing');
    }
  }

  function next() {
    index = (index + 1) % items.length;
    render(items[index]);
    cycleStart = performance.now();
  }

  function tick(now) {
    const elapsed = now - cycleStart;
    const progressPct = Math.min(100, (elapsed / DURATION_MS) * 100);
    const remainingMs = Math.max(0, DURATION_MS - elapsed);
    const remainingSec = Math.max(1, Math.ceil(remainingMs / 1000));

    progress.style.width = progressPct + '%';
    countdown.textContent = String(remainingSec).padStart(2, '0') + 's';

    if (elapsed >= DURATION_MS) {
      next();
    }

    rafId = window.requestAnimationFrame(tick);
  }

  function pause() {
    if (paused) return;
    paused = true;
    pausedAt = performance.now();
    stage.classList.add('is-paused');
    if (rafId) window.cancelAnimationFrame(rafId);
  }

  function resume() {
    if (!paused) return;
    paused = false;
    const now = performance.now();
    const pausedDuration = now - pausedAt;
    cycleStart += pausedDuration;
    stage.classList.remove('is-paused');
    rafId = window.requestAnimationFrame(tick);
  }

  stage.addEventListener('mouseenter', pause);
  stage.addEventListener('mouseleave', resume);
  stage.addEventListener('focusin', pause);
  stage.addEventListener('focusout', (event) => {
    if (!stage.contains(event.relatedTarget)) resume();
  });

  render(items[index]);
  rafId = window.requestAnimationFrame(tick);
}

/* ============================================================
  7. DS CORE — Namespace Público
   Inicializa todos os módulos e expõe a API pública.

   Uso básico (incluindo este arquivo no HTML):
     <script src="assets/js/ds-core.js"></script>
     <!-- Inicializa automaticamente ao carregar -->

   Uso avançado (controle manual):
     DSCore.init({ scrollAnimations: false });
     DSCore.theme.toggle();
============================================================ */
const DSCore = (() => {
  let themeAPI = null;

  /**
   * @param {Object}  opts
   * @param {boolean} opts.scrollProgress   — default true
   * @param {boolean} opts.backToTop        — default true
   * @param {boolean} opts.scrollAnimations — default true
   * @param {boolean} opts.themeSwitcher    — default true
   * @param {boolean} opts.tokenCopy        — default true
   * @param {boolean} opts.testimonialRotator — default true
   * @param {Object}  opts.themeOptions     — passado ao initThemeSwitcher
   */
  function init(opts = {}) {
    const cfg = {
      backToTop: true,
      scrollAnimations: true,
      themeSwitcher: true,
      tokenCopy: true,
      testimonialRotator: true,
      themeOptions: {},
      ...opts,
    };


    if (cfg.backToTop) initBackToTop();
    if (cfg.scrollAnimations) initScrollAnimations();
    if (cfg.tokenCopy) initTokenCopy();
    if (cfg.themeSwitcher) themeAPI = initThemeSwitcher(cfg.themeOptions);
    if (cfg.testimonialRotator) initTestimonialRotator();

    console.info('[DSCore] Design System inicializado ✓');
  }

  return {
    init,
    get theme() { return themeAPI; },
    /* Expose internals para uso avançado */

    initBackToTop,
    initScrollAnimations,
    initThemeSwitcher,
    initTokenCopy,
    initTestimonialRotator,
  };
})();

/* ── Auto-inicialização ──────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DSCore.init());
} else {
  // DOM já carregado (script com defer ou no final do body)
  DSCore.init();
}

/* Expõe globalmente */
window.DSCore = DSCore;
