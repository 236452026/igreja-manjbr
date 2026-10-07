// Vídeo do hero: pausa quando sai da tela (economiza bateria) e tem botão de pausa (acessibilidade).
const video = document.querySelector('.hero-video');
const botao = document.querySelector('[data-video-pausar]');

if (video) {
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pausado = reduzir; // com movimento reduzido, começa pausado
  const tocar = () => video.play().catch(() => {});

  const atualizarBotao = () => { if (botao) botao.textContent = pausado ? 'Reproduzir vídeo' : 'Pausar vídeo'; };
  if (pausado) video.pause();
  atualizarBotao();

  new IntersectionObserver(([entrada]) => {
    if (pausado) return;
    entrada.isIntersecting ? tocar() : video.pause();
  }).observe(video);

  botao?.addEventListener('click', () => {
    pausado = !pausado;
    pausado ? video.pause() : tocar();
    atualizarBotao();
  });
}