import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { pool } from './db/pool.js';
import ministerios from './routes/ministerios.js';
import { naoEncontrado, tratarErros } from './middleware/erros.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Sites autorizados a chamar a API pelo navegador (CORS). Vem do .env, separados por vírgula.
const origensPermitidas = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// Em produção a API fica atrás do proxy da hospedagem (necessário para identificar o IP no limite)
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: origensPermitidas, methods: ['GET'] })); // lista vazia = ninguém autorizado

// Limite: 100 requisições por IP a cada 15 minutos
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));

// GET /api/saude → confere API + banco
app.get('/api/saude', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', banco: 'ok' });
  } catch {
    res.status(503).json({ status: 'erro', banco: 'indisponivel' });
  }
});

app.use('/api/ministerios', ministerios);

app.use(naoEncontrado);
app.use(tratarErros);

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));