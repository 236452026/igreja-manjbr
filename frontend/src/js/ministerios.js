// Página Ministérios: busca a lista na API (MySQL) e desenha os cards.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../css/ministerios.css';

// Em produção, defina VITE_API_URL (ex.: https://minha-api.onrender.com). Em desenvolvimento fica vazio (usa o proxy do Vite).
const API = import.meta.env.VITE_API_URL || '';
const PASTA_IMAGENS = '/images/'; // SUBSTITUA/ADICIONE as imagens dos ministérios em frontend/public/images/
const IMAGEM_VALIDA = /^[\w-]+\.(jpe?g|png|webp|avif)$/i; // só nomes simples de arquivo
const TEMPO_LIMITE_MS = 60000; // a API gratuita pode levar até ~1 min para "acordar"

const lista = document.querySelector('[data-ministerios]');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function criar(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto) e.textContent = texto; // textContent: seguro contra XSS
  return e;
}

function mostrarStatus(texto, comBotao = false) {
  lista.replaceChildren();
  const caixa = criar('p', 'ministerios-status', texto);
  if (comBotao) {
    const botao = criar('button', 'btn btn-primario', 'Tentar novamente');
    botao.type = 'button';
    botao.addEventListener('click', carregar);
    caixa.appendChild(document.createElement('br'));
    caixa.appendChild(botao);
  }
  lista.appendChild(caixa);
}

function criarInicial(nome) {
  const letra = (nome.match(/[\p{L}\p{N}]/u) || ['?'])[0].toUpperCase();
  const e = criar('div', 'ministerio-inicial', letra);
  e.setAttribute('aria-hidden', 'true');
  return e;
}

function criarCard(m) {
  const nome = String(m.nome || 'Ministério');
  const card = criar('article', 'ministerio-card');

  const foto = criar('div', 'ministerio-foto');
  if (typeof m.imagem === 'string' && IMAGEM_VALIDA.test(m.imagem)) {
    const img = document.createElement('img');
    img.src = PASTA_IMAGENS + m.imagem;
    img.alt = ''; // decorativa: o nome do ministério já está no texto ao lado
    img.width = 800; img.height = 600; img.loading = 'lazy';
    img.addEventListener('error', () => foto.replaceChildren(criarInicial(nome)));
    foto.appendChild(img);
  } else {
    foto.appendChild(criarInicial(nome));
  }
  card.appendChild(foto);

  const corpo = criar('div', 'ministerio-corpo');
  corpo.appendChild(criar('h2', '', nome));
  if (m.lider) corpo.appendChild(criar('p', 'ministerio-lider', `Líder: ${m.lider}`));
  if (m.descricao) corpo.appendChild(criar('p', '', m.descricao));
  card.appendChild(corpo);
  return card;
}

function desenhar(ministerios) {
  lista.replaceChildren();
  if (ministerios.length === 0) {
    mostrarStatus('Nenhum ministério cadastrado no momento.');
    return;
  }
  const cards = ministerios.map(criarCard);
  lista.append(...cards);

  // Entrada dos cards ao rolar (os cards nascem depois do carregamento, por isso é feito aqui)
  if (!reduzir) {
    gsap.registerPlugin(ScrollTrigger);
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 48, opacity: 0, duration: 1, delay: (i % 3) * 0.08, ease: 'expo.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: card, start: 'top 92%', once: true },
      });
    });
    ScrollTrigger.refresh();
  }
}

async function buscar() {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  try {
    const resp = await fetch(`${API}/api/ministerios`, { headers: { Accept: 'application/json' }, signal: controle.signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const dados = await resp.json();
    if (!Array.isArray(dados)) throw new Error('Formato inesperado');
    return dados;
  } finally {
    clearTimeout(limite);
  }
}

async function carregar() {
  lista.setAttribute('aria-busy', 'true');
  mostrarStatus('Carregando ministérios…');
  const aviso = setTimeout(() => mostrarStatus('Ainda carregando… o servidor pode levar alguns segundos para acordar.'), 4000);
  try {
    desenhar(await buscar());
  } catch {
    mostrarStatus('Não foi possível carregar os ministérios agora.', true);
  } finally {
    clearTimeout(aviso);
    lista.setAttribute('aria-busy', 'false');
  }
}

if (lista) carregar();