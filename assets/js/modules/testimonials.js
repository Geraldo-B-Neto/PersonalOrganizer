/**
 * TESTIMONIAL ROTATOR
 * Motor dinâmico para o carrossel de depoimentos.
 */
export function initTestimonialRotator() {
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
