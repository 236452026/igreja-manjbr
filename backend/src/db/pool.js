// Conexão com o MySQL. Os dados vêm do arquivo .env (nunca escreva senhas aqui).
import mysql from 'mysql2/promise';

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSL } = process.env;

// Falha cedo e com mensagem clara se faltar alguma configuração
for (const [nome, valor] of Object.entries({ DB_HOST, DB_NAME, DB_USER, DB_PASSWORD })) {
  if (!valor) throw new Error(`Variável de ambiente ausente: ${nome} (confira backend/.env)`);
}

export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT) || 3306,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 5,
  connectTimeout: 10000,
  // Em produção (Etapa 18) a conexão ao banco da hospedagem usa SSL
  ssl: DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
});