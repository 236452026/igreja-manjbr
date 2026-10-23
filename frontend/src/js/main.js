// Ponto de entrada comum a todas as páginas.
import '@fontsource-variable/montserrat';
import '../css/tokens.css';
import '../css/base.css';
import '../css/animacoes.css';
import './menu.js';
import './transicao.js';
import './video.js';
import './interacoes.js';
import { iniciarAnimacoes } from './animacoes.js';

iniciarAnimacoes();