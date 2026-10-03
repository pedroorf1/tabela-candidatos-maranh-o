// Pesquisas REAIS do Senado-MA (aba "Pesquisas Senado MA" do XLSX).
// PROIBIDO: aplicar % de senador em deputado; inventar % municipal.
export const PESQUISAS_SENADO = [
  { instituto: 'Genial/Quaest', registro: 'MA-02558/2026', periodo: '20–23/08/2026', amostra: 900, margem: '3,0 p.p.', confianca: '95%', fonte: 'O Povo / Quaest',
    resultado: { 'Cidônio Gonçalves': 1.0, 'Roseana': 16, 'Weverton': 11, 'Lahesio': 10, 'Eliziane': 9, 'Hilton': 5 } },
  { instituto: 'Quaest/TV Mirante', registro: 'MA-07074/2026', periodo: '21–24/09/2026', amostra: 900, margem: '3,0 p.p.', confianca: '95%', fonte: 'Imirante',
    resultado: { 'Cidônio Gonçalves': 2.0, 'Roseana': 19, 'Fufuca': 15, 'Weverton': 11, 'Lahesio': 12, 'Eliziane': 8, 'Hilton': 4 } },
  { instituto: 'Ranking', registro: 'MA-07878/2026', periodo: '17–21/09/2026', amostra: 1000, margem: '3,1 p.p.', confianca: '95%', fonte: 'Imaranhense',
    resultado: { 'Cidônio Gonçalves': 1.8, 'Roseana': 21.4, 'Fufuca': 18.45, 'Weverton': 12.95, 'Lahesio': 11.55, 'Eliziane': 9.05, 'Hilton': 7.5 } },
  { instituto: 'IP Sensus', registro: 'MA-00523/2026', periodo: '23–27/09/2026', amostra: 1000, margem: '3,1 p.p.', confianca: '95%', fonte: 'Blog Eduardo Ericeira / IP Sensus',
    resultado: { 'Cidônio Gonçalves': 2.3, 'Roseana': 22.1, 'Fufuca': 19.5, 'Weverton': 13.1, 'Lahesio': 11.7, 'Eliziane': 9.2, 'Hilton': 8.1 } },
];

export const PESQUISAS_MUNICIPAIS_NOTA =
  'Não foi localizado, nas fontes consultadas, levantamento municipal recente com percentuais para os candidatos. Por isso não exibimos percentuais por cidade — apenas resultados históricos verificáveis.';

export const JUSTICA = {
  resumo: 'Somente 2 ocorrências localizadas no painel do TRE-MA, ambas impugnações de registro aguardando julgamento. Impugnação NÃO é crime, condenação ou inelegibilidade.',
  casos: [
    { candidato: 'Henrique Junior', numero: '2225', cargo: 'Deputado Federal', processo: '0600371-19.2026.6.10.0000', tipo: 'Impugnação de RRC', status: 'Aguardando julgamento do recurso interno', fonte: 'TRE-MA — Painel de Registro de Candidatura' },
    { candidato: 'Margarida', numero: '2266', cargo: 'Deputado Federal', processo: '0600385-03.2026.6.10.0000', tipo: 'Impugnação de RRC', status: 'Aguardando julgamento do recurso interno', fonte: 'TRE-MA — Painel de Registro de Candidatura' },
  ],
};

export const FONTES = [
  { nome: 'TSE — Candidaturas 2026', url: 'https://sig.tse.jus.br/ords/dwapr/f?p=1002:20', uso: 'Lista e situação das candidaturas' },
  { nome: 'TRE-MA — Painel RCand', url: 'https://guardiao.tre-ma.jus.br/painel-rcand/', uso: 'Situação do registro e impugnações' },
  { nome: 'TRE-MA — Certidões', url: 'https://www.tre-ma.jus.br/servicos-eleitorais/certidoes/certidoes', uso: 'Certidão de crimes eleitorais' },
  { nome: 'TSE — Dados Abertos', url: 'https://dadosabertos.tse.jus.br/', uso: 'Histórico e resultados' },
  { nome: 'Minha Colinha — PL/MA', url: 'https://minhacolinha.com/partido/pl/ma', uso: 'Lista consolidada do PL-MA 2026' },
  { nome: 'Agência Senado — candidatos MA', url: 'https://www12.senado.leg.br/noticias/candidatos-2026/maranhao', uso: 'Dados de candidatos ao Senado' },
  { nome: 'Site oficial Flávio Bolsonaro', url: 'https://www.flaviobolsonaro.com.br/', uso: 'Apoio e documentação de campanha' },
];
