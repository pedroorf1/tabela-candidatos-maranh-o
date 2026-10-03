// Fonte canônica: planilha XLSX (aba "Candidatos PL-MA", corte 03/10/2026).
// NENHUM dado do HTML-QWEN foi reaproveitado (percentuais/chances inventadas banidas).
// Regras: só Cidônio (222) tem vínculo formal Flávio; só 2225/2266 têm impugnação;
// histórico verificado só p/ Cidônio, Cláudio Cunha, Josimar, Detinha. Demais = "não consolidado".

export const CORTE = '03/10/2026';
export const TURNO1 = '04/10/2026';

const FED = (nome, numero, extra = {}) => ({
  nome, numero: String(numero), cargo: 'Deputado Federal',
  partido: 'PL', uf: 'MA', situacao: 'Deferido', ...extra,
});
const EST = (nome, numero, extra = {}) => ({
  nome, numero: String(numero), cargo: 'Deputado Estadual',
  partido: 'PL', uf: 'MA', situacao: 'Deferido', ...extra,
});

export const CANDIDATOS = [
  // ---- SENADOR (único com apoio formal Flávio 22) ----
  {
    nome: 'Cidônio Gonçalves', numero: '222', cargo: 'Senador', partido: 'PL', uf: 'MA',
    vinculoFlavio: 'apoiado', vinculoLabel: 'Apoiado oficialmente por Flávio Bolsonaro (22)',
    situacao: 'Deferido',
    historico: '2024: candidato a prefeito de Açailândia — não eleito (18.794 votos, 30,8%). Primeira disputa ao Senado.',
    vitoriasVerificadas: 0, reeleicao: false,
    impugnacao: null,
    abrangencia: 'Estadual (base: Açailândia)',
    fontes: ['TSE/Minha Colinha', 'TRE-MA painel RCand', 'MeuVoto/TSE 2024'],
  },
  // ---- DEPUTADO FEDERAL (18) ----
  FED('Dr. Orlando', 2200, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Flavia Berthier', 2201, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Mariana Carvalho', 2210, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Nonato Sampaio', 2211, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Luciano Galego', 2212, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Prof. Eva Educadores Coletivo', 2220, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Fabiana Vilar', 2222, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Mary do Mojó', 2223, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Henrique Junior', 2225, {
    historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.',
    impugnacao: { processo: 'RRC 0600371-19.2026.6.10.0000', tipo: 'Impugnação de RRC', status: 'Aguardando julgamento do recurso interno' },
  }),
  FED('Francisco Mello', 2226, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Silvio Antônio', 2228, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Aldir Junior', 2233, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Aníbal Lins', 2240, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Paulo Marinho Jr', 2255, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Margarida', 2266, {
    historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.',
    impugnacao: { processo: 'RRC 0600385-03.2026.6.10.0000', tipo: 'Impugnação de RRC', status: 'Aguardando julgamento do recurso interno' },
  }),
  FED('Rosângela Vidal', 2277, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Wolmer Araújo', 2288, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  FED('Eduardo Andrade', 2299, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  // ---- DEPUTADO ESTADUAL (22) ----
  EST('Segundo', 22000, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Filipe Arnon', 22022, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Ulisses Gonçalves', 22100, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Priscila Caraça', 22111, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Júlio Filho', 22122, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Aluízio Santos', 22123, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Reneclei de Sousa', 22192, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Maranhão de Pea', 22217, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Beatriz Vieira', 22220, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Josimar', 22222, { historico: 'Com mandatos anteriores no Legislativo. O número exato pode ser conferido nominalmente no TSE.', vitoriasVerificadas: 'várias', reeleicao: true }),
  EST('Leane Lago', 22233, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Diego Polako', 22244, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Detinha', 22333, { historico: 'Com mandatos anteriores no município e no estado. O número exato pode ser conferido nominalmente no TSE.', vitoriasVerificadas: 'várias', reeleicao: true }),
  EST('Gama', 22344, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Solange Almeida', 22345, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Dr. Fábio Hernandez', 22400, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Regilda Santos', 22444, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Enfermeira Eliziane', 22500, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Fabiana Ramada', 22522, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Cláudio Cunha', 22555, { historico: 'Deputado estadual em mandato — candidato à reeleição.', vitoriasVerificadas: 1, reeleicao: true }),
  EST('Enos Costa Ferreira', 22789, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
  EST('Edson Araújo', 22888, { historico: 'Histórico ainda não reunido nesta versão. Isso não quer dizer que não tenha mandato ou experiência.' }),
].map((c) => ({
  vinculoFlavio: 'alinhado',
  vinculoLabel: 'PL-MA (22) — sem apoio individual formal de Flávio localizado',
  impugnacao: null,
  vitoriasVerificadas: c.vitoriasVerificadas ?? null,
  reeleicao: c.reeleicao ?? false,
  abrangencia: 'Estadual — Maranhão',
  fontes: ['TSE/Minha Colinha', 'TRE-MA painel RCand'],
  ...c,
}));

// Capacidade de busca na web: links oficiais (app funciona offline; este mapa permite
// plugar um fetch opcional no futuro sem quebrar os dados locais).
export async function buscarAtualizacaoWeb(_timeoutMs = 6000) {
  // Placeholder intencional: retorna indisponível offline, mantendo os dados locais.
  // Para ativar, aponte para endpoints públicos (ex.: dadosabertos TSE) com validação manual.
  return { disponivel: false, motivo: 'Modo offline com dados organizados do corte 03/10/2026. Confira as fontes oficiais na aba Sobre.' };
}
