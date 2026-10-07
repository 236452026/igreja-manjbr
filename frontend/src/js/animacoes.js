import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const raiz = document.documentElement;
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// AJUSTES DE VELOCIDADE E ESTILO: altere aqui para deixar mais lento/rápido.
const CONFIG = {
  ease: 'expo.out',      // curva de suavidade (alternativas: 'power3.out', 'power2.out')
  duracao: 1.1,          // segundos de cada entrada
  distancia: 48,         // px que os blocos "sobem" ao aparecer
  atrasoInicial: 0.35,   // segundos após abrir a cortina
  rolagem: 1.1,          // suavidade da rolagem (maior = mais "deslizante")
};

// Rolagem suave (Lenis) ligada ao GSAP
function rolagemSuave() {
  const lenis = new Lenis({ duration: CONFIG.rolagem });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Divide títulos [data-dividir] em palavras (usar só em h1/h2/h3 com texto simples)
function dividirTextos() {
  document.querySelectorAll('[data-dividir]').forEach((el) => {
    const texto = el.textContent.trim();
    el.setAttribute('aria-label', texto); // leitores de tela leem o título inteiro
    el.textContent = '';
    texto.split(/\s+/).forEach((palavra, i, todas) => {
      const casca = document.createElement('span');
      casca.className = 'palavra';
      casca.setAttribute('aria-hidden', 'true');
      const interno = document.createElement('span');
      interno.className = 'palavra-i';
      interno.textContent = palavra;
      casca.appendChild(interno);
      el.appendChild(casca);
      if (i < todas.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
}

// "Página se montando": elementos [data-entrada] entram em sequência quando a cortina abre
function montarPagina() {
  const tl = gsap.timeline({ paused: true, defaults: { ease: CONFIG.ease } });
  tl.from('.header-inner', { y: -24, opacity: 0, duration: 1 }, 0);
  if (document.querySelector('[data-hero-midia]')) tl.from('[data-hero-midia]', { opacity: 0, duration: 1.6 }, 0);

  document.querySelectorAll('[data-entrada]').forEach((el, i) => {
    const palavras = el.querySelectorAll('.palavra-i');
    const inicio = 0.1 + i * 0.12;
    if (palavras.length) tl.from(palavras, { yPercent: 115, duration: 1.2, stagger: 0.07 }, inicio);
    else tl.from(el, { y: 40, opacity: 0, duration: CONFIG.duracao, clearProps: 'transform,opacity' }, inicio);
  });
  return tl;
}

// Aparecer ao rolar: [data-revelar], [data-revelar-grupo] (filhos em sequência) e títulos divididos
function revelacoes() {
  gsap.utils.toArray('[data-revelar]').forEach((el) => {
    gsap.from(el, {
      y: CONFIG.distancia, opacity: 0, duration: CONFIG.duracao, ease: CONFIG.ease, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  gsap.utils.toArray('[data-revelar-grupo]').forEach((grupo) => {
    gsap.from(grupo.children, {
      y: CONFIG.distancia, opacity: 0, duration: CONFIG.duracao, stagger: 0.12, ease: CONFIG.ease, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: grupo, start: 'top 88%', once: true },
    });
  });
  gsap.utils.toArray('[data-dividir]:not([data-entrada])').forEach((el) => {
    gsap.from(el.querySelectorAll('.palavra-i'), {
      yPercent: 115, duration: 1.1, stagger: 0.06, ease: CONFIG.ease,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

// Parallax moderado em imagens [data-parallax] dentro de um .quadro
function parallax() {
  gsap.utils.toArray('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

// Hero: o vídeo dá zoom, escurece e o texto sobe/some conforme você rola
function hero() {
  const secao = document.querySelector('[data-hero]');
  if (!secao) return;
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: secao, start: 'top top', end: 'bottom top', scrub: true },
  })
    .to(secao.querySelector('[data-hero-midia]'), { scale: 1.2, yPercent: 10 }, 0)
    .to(secao.querySelector('[data-hero-veu]'), { opacity: 0.65 }, 0)
    .to(secao.querySelector('[data-hero-conteudo]'), { y: -90, opacity: 0 }, 0);
}

// Barra de progresso de leitura
function progresso() {
  gsap.to('.progresso', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
}

// Cabeçalho: esconde ao descer, volta ao subir (e ao navegar por teclado)
function cabecalhoInteligente() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const esconder = gsap.to(header, { yPercent: -100, duration: 0.4, ease: 'power3.out', paused: true });
  ScrollTrigger.create({
    start: 'top -80',
    end: 'max',
        onUpdate: (self) => {
      if (header.classList.contains('is-open')) return;
      if (self.scroll() < 80) { esconder.reverse(); return; } // no topo, sempre visível
      self.direction === 1 ? esconder.play() : esconder.reverse();
    },
    onLeaveBack: () => esconder.reverse(),
  });
  header.addEventListener('focusin', () => esconder.reverse());
}

export function iniciarAnimacoes() {
  // Movimento reduzido: sem animações, só abre a página
  if (reduzir) { raiz.classList.add('pronto'); return; }

  gsap.registerPlugin(ScrollTrigger);
  rolagemSuave();
  dividirTextos();
  const entrada = montarPagina();
  hero();
  revelacoes();
  parallax();
  progresso();
  cabecalhoInteligente();

  // Espera a fonte carregar (máx. 1,5 s), abre a cortina e monta a página
  const fonte = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
  fonte.then(() => {
    raiz.classList.add('pronto');
    gsap.delayedCall(CONFIG.atrasoInicial, () => entrada.play());
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}