/**
 * HERO & PRELOADER MODULE
 * Gerencia a entrada cinematográfica do site.
 */
export function initHeroEntrance() {
  const preloader = document.getElementById('preloader');
  const startBtn = document.getElementById('startExperience');
  const introOverlay = document.getElementById('introOverlay');
  const introVideo = document.getElementById('introVideo');
  const header = document.getElementById('mainHeader');
  const heroTitle = document.getElementById('heroTitle');
  const heroImageContainer = document.getElementById('heroImageContainer');

  if (!preloader || !startBtn) return;

  // 1. Mostrar o botão após o manifesto "Respire"
  setTimeout(() => {
    const preloaderText = document.querySelector('.preloader__text');
    if (preloaderText) preloaderText.classList.add('is-hidden');

    setTimeout(() => {
      startBtn.style.display = 'inline-block';
      setTimeout(() => {
        startBtn.classList.add('is-visible');
      }, 50);
    }, 1000);
  }, 2000);

  // 2. Iniciar experiência ao clicar
  startBtn.addEventListener('click', () => {
    startBtn.style.pointerEvents = 'none';
    startBtn.style.visibility = 'hidden';
    preloader.classList.add('preloader--hidden');
    introOverlay.classList.add('overlay--active');
    if (introVideo) introVideo.play();
  });

  // 3. Transição pós-vídeo
  if (introVideo) {
    introVideo.addEventListener('ended', () => {
      introVideo.pause();
      introOverlay.style.pointerEvents = 'none';
      introOverlay.classList.add('overlay--fade-out');

      setTimeout(() => {
        introOverlay.style.display = 'none';

        // A. Reveal das pedras
        if (heroImageContainer) heroImageContainer.classList.add('object--reveal');

        // B. Título expande
        setTimeout(() => {
          if (heroTitle) heroTitle.classList.add('title--expand');

          // C. Subtítulo e Navbar
          setTimeout(() => {
            const subtitle = document.querySelector('.hero-v7__subtitle');
            if (subtitle) subtitle.classList.add('is-revealed');
            if (header) header.classList.add('is-revealed');

            // D. Footer da Hero
            setTimeout(() => {
              const footer = document.querySelector('.hero-v7__footer');
              if (footer) footer.classList.add('is-revealed');
            }, 800);
          }, 1000);
        }, 1200);
      }, 800);
    });
  }
}
