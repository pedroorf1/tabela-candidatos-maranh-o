// Lógica melhorada e transparente (pós-revisores 1 e 2).
// - NUNCA gera % para deputado (proibido pelo README do XLSX).
// - Indicador textual em linguagem leiga, com motivo auditável.
// - Ordenação padrão por cargo+número (nunca por "score").

export function indicador(c) {
  if (c.impugnacao) {
    return {
      nivel: 'atencao',
      rotulo: 'Atenção na Justiça',
      motivo: `Impugnação ${c.impugnacao.processo} (${c.impugnacao.status}). É uma contestação do registro — não é crime, condenação ou inelegibilidade.`,
    };
  }
  if (c.numero === '222') {
    return {
      nivel: 'disputa',
      rotulo: 'Em disputa · apoio formal',
      motivo: 'Apoiado oficialmente por Flávio Bolsonaro ao Senado, mas com 1% a 2,3% nas 4 pesquisas estaduais. Primeira disputa ao Senado; em 2024 fez 18.794 votos em Açailândia.',
    };
  }
  if (c.reeleicao) {
    return {
      nivel: 'forte',
      rotulo: 'Base forte',
      motivo: 'Com mandato anterior verificado — candidato à reeleição ou com vitórias confirmadas. Estimativa organizacional, não é pesquisa eleitoral.',
    };
  }
  return {
    nivel: 'neutro',
    rotulo: 'Em disputa',
    motivo: 'Deferido e sem pendência localizada. Histórico individual não consolidado — sem dados suficientes para estimar vantagem. Estimativa organizacional, não é pesquisa eleitoral.',
  };
}

export const NIVEL_META = {
  forte: { cor: 'var(--ok)', icone: '●' },
  disputa: { cor: 'var(--warn)', icone: '◐' },
  neutro: { cor: 'var(--muted)', icone: '○' },
  atencao: { cor: 'var(--danger)', icone: '▲' },
};
