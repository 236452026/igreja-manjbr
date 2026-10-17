// Página Nossa História: estilos + linha do tempo que "se desenha" ao rolar.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/historia.css';

const progresso = document.querySelector('[data-tempo-progresso]');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Com movimento reduzido (ou sem JS), a linha já aparece completa.
if (progresso && !reduzir) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo(progresso, { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: progresso.parentElement, start: 'top 70%', end: 'bottom 70%', scrub: true },
  });
}