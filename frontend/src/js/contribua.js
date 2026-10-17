// Página Contribua: estilos + botão "Copiar" da chave PIX.
import '../css/contribua.css';

document.querySelectorAll('[data-copiar]').forEach((botao) => {
  const valor = botao.dataset.copiar.trim();
  const rotulo = botao.textContent;
  const aviso = botao.parentElement.querySelector('[data-copiar-aviso]');

  // Enquanto for placeholder "[INSERIR ...]", o botão fica desativado
  if (valor.startsWith('[')) {
    botao.disabled = true;
    botao.title = 'Disponível quando a chave oficial for inserida em src/config/site.js';
    return;
  }

  botao.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(valor);
      botao.textContent = 'Copiado ✓';
      if (aviso) aviso.textContent = 'Chave copiada para a área de transferência.';
    } catch {
      if (aviso) aviso.textContent = 'Não foi possível copiar automaticamente. Selecione a chave e copie manualmente.';
    }
    setTimeout(() => {
      botao.textContent = rotulo;
      if (aviso) aviso.textContent = '';
    }, 3000);
  });
});