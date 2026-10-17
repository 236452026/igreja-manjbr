import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { SITE } from './src/config/site.js';

const caminho = (arquivo) => fileURLToPath(new URL(arquivo, import.meta.url));

// Insere cabeçalho/rodapé, o CSS crítico da cortina e troca {{chaves}} pelos valores de src/config/site.js
function parciais() {
  const ler = (nome, ext = 'html') => readFileSync(caminho(`./partials/${nome}.${ext}`), 'utf8');
  return {
    name: 'parciais-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const rota = ctx.path.split('?')[0];
        const atual = rota === '/index.html' || rota === '/' ? '/' : rota;
        const header = ler('header').replace(
          `href="${atual}" data-link`,
          `href="${atual}" data-link aria-current="page"`
        );
        const footer = ler('footer');
        return html
          .replace('</head>', () => `<style>${ler('critico', 'css')}</style>\n</head>`)
          .replace('<!--@header-->', () => header)
          .replace('<!--@footer-->', () => footer)
          .replace(/\{\{(\w+)\}\}/g, (m, chave) => (chave in SITE ? String(SITE[chave]) : m));
      },
    },
  };
}

export default defineConfig({
  plugins: [parciais()],
    // Em desenvolvimento, repassa /api para o backend local (evita CORS e URL fixa no código)
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } },
  build: {
    rollupOptions: {
      input: {
        home: caminho('./index.html'),
        historia: caminho('./nossa-historia.html'),
        contribua: caminho('./contribua.html'),
        ministerios: caminho('./ministerios.html'),
      },
    },
  },
});