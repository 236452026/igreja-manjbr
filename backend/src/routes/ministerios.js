// Rotas de ministérios (somente leitura).
import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

// Só os campos públicos. "ativo", created_at e updated_at NÃO são enviados ao site.
const CAMPOS = 'id, nome, descricao, lider, imagem, ordem';

// GET /api/ministerios → lista dos ativos
router.get('/', async (req, res, next) => {
  try {
    const [linhas] = await pool.execute(
      `SELECT ${CAMPOS} FROM ministerios WHERE ativo = 1 ORDER BY ordem ASC, nome ASC`
    );
    res.json(linhas);
  } catch (erro) {
    next(erro);
  }
});

// GET /api/ministerios/:id → um ministério ativo
router.get('/:id', async (req, res, next) => {
  try {
    // Só números inteiros positivos são aceitos
    if (!/^\d{1,10}$/.test(req.params.id)) {
      return res.status(400).json({ erro: 'Identificador inválido.' });
    }
    const [linhas] = await pool.execute(
      `SELECT ${CAMPOS} FROM ministerios WHERE id = ? AND ativo = 1`,
      [Number(req.params.id)]
    );
    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Ministério não encontrado.' });
    }
    res.json(linhas[0]);
  } catch (erro) {
    next(erro);
  }
});

export default router;