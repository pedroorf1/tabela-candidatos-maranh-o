// Curadoria nacional: candidatos/pré-candidatos de direita em 2026 + perfis oficiais.
// REGRAS DESTA LISTA (para não virar desinformação):
// - Todo handle/URL foi verificado em fontes públicas (out/2026). Sem chute.
// - Seguidores = nº do Instagram na data do corte (out/2026), aproximado (≈).
//   Sem nº verificado => null (entra depois no desempate, sem inventar).
// - Ordenação: PESO do cargo (importância política) primeiro; soma de
//   seguidores nas redes só desempatade dentro do mesmo peso.
// - Jair Bolsonaro fora: inelegível (sem candidatura em 2026).
// - Fotos: via unavatar.io com fallback para iniciais (hotlink direto do
//   Instagram expira e exige login — quebra no app).
export const CORTE_REDES = 'out/2026';

export const PESO_CARGO = { 'Presidência': 100, 'Senado': 80, 'Governo': 70, 'Câmara Federal': 60, 'A confirmar': 50 };

const IG = (usuario, seguidores = null) => ({
  rede: 'instagram', usuario, url: `https://www.instagram.com/${usuario}/`, seguidores,
});

export const DIREITA = [
  {
    nome: 'Flávio Bolsonaro', cargo: 'Senador (RJ)', partido: 'PL', uf: 'RJ', numero: '22',
    candidatura: 'Presidência', peso: 100,
    redes: [IG('flaviobolsonaro')],
    site: 'https://flaviobolsonaro.com.br/',
    fonte: 'CNN/G1/Gazeta (candidato PL à Presidência, nº 22); IG @flaviobolsonaro',
  },
  {
    nome: 'Romeu Zema', cargo: 'Governador (MG)', partido: 'NOVO', uf: 'MG', numero: '30',
    candidatura: 'Presidência', peso: 100,
    redes: [
      IG('romeuzemaoficial', 4000000),
      { rede: 'facebook', usuario: 'RomeuZemaOficial', url: 'https://www.facebook.com/RomeuZemaOficial', seguidores: null },
    ],
    site: null,
    fonte: 'Convenção do Novo + bio do IG (candidato à Presidência, 30)',
  },
  {
    nome: 'Michelle Bolsonaro', cargo: 'Ex-primeira-dama', partido: 'PL', uf: null, numero: '222',
    candidatura: 'Senado', peso: 80,
    redes: [IG('michellebolsonaro', 8300000)],
    site: null,
    fonte: 'Bio do IG (Senadora - 222) + HubPolítico (candidata ao Senado pelo PL)',
  },
  {
    nome: 'Carlos Bolsonaro', cargo: 'Vereador (RJ)', partido: 'PL', uf: 'SC', numero: '222',
    candidatura: 'Senado', peso: 80,
    redes: [IG('carlosbolsonaro', 4000000)],
    site: null,
    fonte: 'Bio do IG (candidato ao Senado por SC - 222) + Gazeta do Povo',
  },
  {
    nome: 'Gustavo Gayer', cargo: 'Deputado Federal (GO)', partido: 'PL', uf: 'GO', numero: '222',
    candidatura: 'Senado', peso: 80,
    redes: [IG('gustavo.gayer', 3100000)],
    site: 'https://gustavogayer.com.br/',
    fonte: 'Site oficial (Gayer 222 Senador) + Mais Goiás (3,1M no IG)',
  },
  {
    nome: 'Cleitinho Azevedo', cargo: 'Senador (MG)', partido: 'Republicanos', uf: 'MG', numero: null,
    candidatura: 'Governo', peso: 70,
    redes: [IG('cleitinhoazevedo', 4500000)],
    site: null,
    fonte: 'Bio do IG (candidato a governador de MG) + Zeeng (Republicanos)',
  },
  {
    nome: 'Tarcísio de Freitas', cargo: 'Governador (SP)', partido: 'Republicanos', uf: 'SP', numero: '10',
    candidatura: 'Governo', peso: 70,
    redes: [IG('tarcisiogdf', 6000000)],
    site: null,
    fonte: 'Bio do IG (governador SP, reeleição) + Wikipédia (Republicanos)',
  },
  {
    nome: 'Nikolas Ferreira', cargo: 'Deputado Federal (MG)', partido: 'PL', uf: 'MG', numero: '2222',
    candidatura: 'Câmara Federal', peso: 60,
    redes: [IG('nikolasferreiradm', 22000000)],
    site: null,
    fonte: 'Bio do IG (cand. Dep. Federal MG - 2222) + Gazeta do Povo (22M)',
  },
  {
    nome: 'Damares Alves', cargo: 'Senadora (DF)', partido: 'Republicanos', uf: 'DF', numero: null,
    candidatura: 'A confirmar', peso: 50,
    redes: [
      IG('damaresalvesoficial', 4000000),
      { rede: 'x', usuario: 'DamaresAlves', url: 'https://x.com/DamaresAlves', seguidores: 2600000 },
    ],
    site: null,
    fonte: 'Agência Senado (Republicanos-DF) + IG/X oficiais',
  },
  {
    nome: 'Ratinho Junior', cargo: 'Governador (PR)', partido: 'PSD', uf: 'PR', numero: null,
    candidatura: 'A confirmar', peso: 50,
    redes: [IG('ratinho_junior', 1000000)],
    site: null,
    fonte: 'Bio do IG (governador do Paraná) + Wikipédia (PSD)',
  },
];

export function totalSeguidores(e) {
  const vals = e.redes.map((r) => r.seguidores).filter((v) => typeof v === 'number');
  return vals.length ? vals.reduce((a, b) => a + b, 0) : null;
}

export function ordenados(lista) {
  return [...lista].sort((a, b) => b.peso - a.peso || (totalSeguidores(b) ?? -1) - (totalSeguidores(a) ?? -1));
}

export function formataSeguidores(n) {
  if (n === null) return '—';
  if (n >= 1000000) return `≈${String(n / 1000000).replace('.', ',').replace(/,0$/, '')}M`;
  if (n >= 1000) return `≈${Math.round(n / 1000)} mil`;
  return `≈${n}`;
}
