/**
 * MAIN ENTRY POINT
 * Inicializa todos os módulos do Design System.
 */

import { initHeroEntrance } from './modules/hero.js';
import { initNavigation } from './modules/navigation.js';
import { initScrollAnimations } from './modules/animations.js';
import { initTestimonialRotator } from './modules/testimonials.js';
import { initThemeSwitcher } from './modules/theme.js';
import { initTokenCopy } from './modules/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa a sequência de entrada (Preloader/Hero)
  initHeroEntrance();

  // Inicializa Navegação e Interações de Scroll
  initNavigation();

  // Inicializa Animações de Elementos
  initScrollAnimations();

  // Inicializa Depoimentos
  initTestimonialRotator();

  // Utilitários opcionais
  initTokenCopy();

  console.info('[PersonalOrganizer] Modularized System Initialized ✓');
});
