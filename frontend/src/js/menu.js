// Menu mobile: abre/fecha, atualiza aria-expanded, fecha com Esc e ao clicar em um link.
const header = document.querySelector('[data-header]');
const botao = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

if (header && botao && nav) {
  const definir = (aberto) => {
    header.classList.toggle('is-open', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
  };

  botao.addEventListener('click', () => definir(botao.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) definir(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      definir(false);
      botao.focus();
    }
  });
  // Ao ampliar a janela para desktop, garante o menu fechado
  window.matchMedia('(min-width: 60em)').addEventListener('change', (e) => { if (e.matches) definir(false); });
}