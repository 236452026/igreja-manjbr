// Interações de mouse: inclinação 3D nos cards e botões "magnéticos".
// Só ativa com mouse e sem "movimento reduzido". Em celular/tablet não faz nada.
const podeInteragir =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (podeInteragir) {
  // AJUSTES: altere aqui a intensidade
  const ALVOS_INCLINAR = '.card, .ministerio-card, .valor'; // quais elementos inclinam
  const INCLINACAO = 7;   // graus máximos de inclinação (0 desliga)
  const IMA = 0.35;       // força do botão magnético (0 desliga, máximo recomendado 0.4)

  // Aplica um efeito enquanto o mouse está sobre o elemento e limpa ao sair
  function seguir(seletor, aplicar) {
    let atual = null;
    const limpar = () => { if (atual) { atual.style.transform = ''; atual = null; } };

    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const alvo = e.target.closest?.(seletor) ?? null;
      if (atual && atual !== alvo) limpar();
      atual = alvo;
      if (alvo) aplicar(alvo, e);
    }, { passive: true });

    document.documentElement.addEventListener('pointerleave', limpar);
    window.addEventListener('scroll', limpar, { passive: true });
  }

  // Cards: inclinação 3D seguindo o mouse
  if (INCLINACAO > 0) {
    seguir(ALVOS_INCLINAR, (el, e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(900px) rotateX(${(-y * INCLINACAO * 2).toFixed(2)}deg) ` +
        `rotateY(${(x * INCLINACAO * 2).toFixed(2)}deg) translateY(-6px)`;
    });
  }

  // Botões: puxam levemente em direção ao cursor
  if (IMA > 0) {
    seguir('.btn:not([disabled])', (el, e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${(dx * IMA).toFixed(1)}px, ${(dy * IMA).toFixed(1)}px)`;
    });
  }
}