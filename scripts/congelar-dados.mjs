// Trava de dados: falha o build se qualquer dado canônico mudar 1 byte.
// Uso: npm run travar-dados
import { CANDIDATOS } from '../src/data/candidatos.js';
import { PESQUISAS_SENADO, SENADO_URNA, JUSTICA } from '../src/data/eleitoral.js';
import { NIVEL_META } from '../src/lib/indicador.js';
import { DIREITA } from '../src/data/direita.js';
import fs from 'node:fs';

let erros = 0;
const ok = (cond, nome) => {
  if (!cond) { erros++; console.error('TRAVADO:', nome); }
  else console.log('ok:', nome);
};

ok(CANDIDATOS.length === 41, '41 candidatos');
ok(
  JSON.stringify(CANDIDATOS.map((c) => c.numero)) ===
    JSON.stringify(['222','2200','2201','2210','2211','2212','2220','2222','2223','2225','2226','2228','2233','2240','2255','2266','2277','2288','2299','22000','22022','22100','22111','22122','22123','22192','22217','22220','22222','22233','22244','22333','22344','22345','22400','22444','22500','22522','22555','22789','22888']),
  'números exatos dos 41'
);
ok(CANDIDATOS.filter((c) => c.vinculoFlavio === 'apoiado').map((c) => c.numero).join() === '222', 'apoio Flávio só 222');
ok(CANDIDATOS.filter((c) => c.impugnacao).map((c) => c.numero).join() === '2225,2266', 'impugnação só 2225/2266');

ok(
  JSON.stringify(PESQUISAS_SENADO.map((p) => p.registro)) ===
    JSON.stringify(['MA-02558/2026', 'MA-07074/2026', 'MA-07878/2026', 'MA-00523/2026']),
  '4 pesquisas com registro TSE'
);
ok(
  JSON.stringify(PESQUISAS_SENADO.map((p) => p.resultado)) ===
    JSON.stringify([
      { 'Cidônio Gonçalves': 1, 'Roseana': 16, 'Weverton': 11, 'Lahesio': 10, 'Eliziane': 9, 'Hilton': 5 },
      { 'Cidônio Gonçalves': 2, 'Roseana': 19, 'Fufuca': 15, 'Weverton': 11, 'Lahesio': 12, 'Eliziane': 8, 'Hilton': 4 },
      { 'Cidônio Gonçalves': 1.8, 'Roseana': 21.4, 'Fufuca': 18.45, 'Weverton': 12.95, 'Lahesio': 11.55, 'Eliziane': 9.05, 'Hilton': 7.5 },
      { 'Cidônio Gonçalves': 2.3, 'Roseana': 22.1, 'Fufuca': 19.5, 'Weverton': 13.1, 'Lahesio': 11.7, 'Eliziane': 9.2, 'Hilton': 8.1 },
    ]),
  'percentuais do Senado byte-a-byte'
);
ok(
  JSON.stringify(SENADO_URNA) ===
    JSON.stringify({
      'Cidônio Gonçalves': { urna: 'Cidônio Gonçalves', partido: 'PL', numero: '222' },
      'Roseana': { urna: 'Roseana Sarney', partido: 'MDB', numero: '151' },
      'Fufuca': { urna: 'Fufuca', partido: 'PP', numero: '111' },
      'Weverton': { urna: 'Weverton Rocha', partido: 'PDT', numero: '123' },
      'Lahesio': { urna: 'Lahesio Bonfim', partido: 'NOVO', numero: '300' },
      'Eliziane': { urna: 'Eliziane Gama', partido: 'PT', numero: '133' },
      'Hilton': { urna: 'Dr. Hilton Gonçalo', partido: 'MOBILIZA', numero: '333' },
    }),
  'SENADO_URNA intacto'
);
ok(JUSTICA.casos.length === 2, '2 casos na Justiça');
ok(JUSTICA.casos.map((j) => j.processo).join('|') === '0600371-19.2026.6.10.0000|0600385-03.2026.6.10.0000', 'processos RRC');
ok(Object.keys(NIVEL_META).join() === 'forte,disputa,neutro,atencao', '4 níveis do indicador');

const ind = fs.readFileSync('src/lib/indicador.js', 'utf8');
ok(ind.includes('não é crime, condenação ou inelegibilidade'), 'texto impugnação ≠ crime');
ok(ind.includes('não é pesquisa eleitoral'), 'texto não é pesquisa');
const dados = fs.readFileSync('src/data/candidatos.js', 'utf8');
ok(dados.includes('sem apoio individual formal de Flávio'), 'texto vínculo PL-MA');

ok(DIREITA.length === 10, '10 nomes na direita nacional');
ok(
  DIREITA.every((d) => d.nome && d.partido && d.candidatura && typeof d.peso === 'number' && d.redes.length > 0),
  'entradas completas (nome/partido/candidatura/peso/redes)'
);
ok(
  DIREITA.every((d) => d.redes.every((r) => /^https:\/\/(www\.)?(instagram\.com|x\.com|facebook\.com)\//.test(r.url) || /^https:\/\/[a-z0-9.-]+\.[a-z]+\//.test(r.url))),
  'só URLs https verificáveis'
);
ok(!JSON.stringify(DIREITA).includes('Jair Bolsonaro'), 'sem candidatura inventada (Jair inelegível fora)');

const { INDICADOS } = await import('../src/data/indicados.js');
ok(INDICADOS.length === 5, '5 indicados');
ok(
  JSON.stringify(INDICADOS.map((c) => `${c.numero}/${c.cargo}`)) ===
    JSON.stringify(['22/Presidente', '28/Governador', '222/Senador', '300/Senador', '2210/Deputada Federal']),
  'chapa de indicados intacta (22, 28, 222, 300, 2210)'
);
ok(INDICADOS.find((c) => c.numero === '28').status.includes('Confira a situação no TSE'), 'card do 28 sem menção processual');

const { GOVERNADORES } = await import('../src/data/governadores.js');
ok(GOVERNADORES.length === 8, '8 candidatos ao governo');
ok(
  JSON.stringify(GOVERNADORES.map((g) => g.numero).sort((a, b) => a - b)) ===
    JSON.stringify(['13', '14', '15', '16', '21', '28', '29', '55']),
  'números dos 8 ao governo'
);
ok(GOVERNADORES.every((g) => g.nome && g.partido && g.vice && g.resumo), 'governadores completos');

if (erros) { console.error(`\n${erros} trava(s) violadas — build bloqueado`); process.exit(1); }
console.log('\nTrava-dados: tudo intacto');
