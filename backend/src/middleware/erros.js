// Tratamento de erros: o visitante recebe mensagem genérica; o log não guarda dados sensíveis.
export function naoEncontrado(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada.' });
}

// eslint-disable-next-line no-unused-vars
export function tratarErros(erro, req, res, next) {
  console.error('[erro]', erro.code || erro.name); // só o código do erro, sem senha nem consulta
  res.status(500).json({ erro: 'Erro interno. Tente novamente mais tarde.' });
}