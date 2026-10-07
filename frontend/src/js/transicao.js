// Transição entre páginas: ao clicar num link interno, a cortina cobre a tela e depois a página muda.
const raiz = document.documentElement;
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DURACAO = 650; // ms. Deve ser igual à duração de "cortina-entra" em partials/critico.css

document.addEventListener('click', (e) => {
  if (reduzir || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = e.target.closest('a[href]');
  if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

  const destino = new URL(link.href, location.href);
  if (destino.origin !== location.origin) return;                                   // links externos: normal
  if (destino.pathname === location.pathname && destino.search === location.search) return; // mesma página/âncora

  e.preventDefault();
  raiz.classList.add('saindo');
  setTimeout(() => { location.href = destino.href; }, DURACAO);
});

// Ao voltar pelo botão "voltar" do navegador, remove a cortina
window.addEventListener('pageshow', (e) => { if (e.persisted) raiz.classList.remove('saindo'); });