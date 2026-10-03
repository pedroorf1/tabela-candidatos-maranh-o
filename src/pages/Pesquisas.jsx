import { useMemo, useState } from 'react';
import { PESQUISAS_SENADO, PESQUISAS_MUNICIPAIS_NOTA, SENADO_URNA } from '../data/eleitoral.js';

const normaliza = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function Pesquisas() {
  const [termo, setTermo] = useState('');
  const q = normaliza(termo.trim());

  const casa = (k) => {
    if (!q) return true;
    const u = SENADO_URNA[k] || {};
    return [k, u.urna, u.partido, u.numero].some((v) => normaliza(String(v || '')).includes(q));
  };

  const secoes = useMemo(
    () =>
      PESQUISAS_SENADO.map((p) => ({
        ...p,
        entradas: Object.entries(p.resultado).filter(([k]) => casa(k)),
      })).filter((p) => p.entradas.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q]
  );
  const totalNomes = Object.keys(SENADO_URNA).length;
  const achados = new Set(secoes.flatMap((p) => p.entradas.map(([k]) => k))).size;
  return (
    <section aria-label="Pesquisas do Senado" className="pagina">
      <h2>Pesquisas reais — Senado (MA)</h2>
      <p className="meta">Somente levantamentos estaduais com registro no TSE. Não aplicamos esses percentuais a deputados. Não há pesquisa municipal recente localizada. Partido e número de urna conferidos na lista do TSE (via Valor Econômico, 22/09/2026).</p>
      <label className="rotulo-busca" htmlFor="busca-pesquisa">Filtrar candidato</label>
      <div className="busca">
        <input id="busca-pesquisa" type="search" aria-label="Filtrar por nome, partido ou número" placeholder="Nome, partido ou número… ex.: rose, PT ou 222" value={termo} onChange={(e) => setTermo(e.target.value)} />
        {termo && <button className="btn" onClick={() => setTermo('')}>Limpar</button>}
      </div>
      <p className="contador" aria-live="polite">{q ? `${achados} de ${totalNomes} candidatos` : `${totalNomes} candidatos nas pesquisas`}</p>
      {secoes.length === 0 ? (
        <div className="empty"><p>Nenhum candidato com esse filtro.</p><button className="btn primary" onClick={() => setTermo('')}>Mostrar todos</button></div>
      ) : null}
      {secoes.map((p) => {
        const max = Math.max(...Object.values(p.resultado));
        return (
          <div className="secao" key={p.registro}>
            <h2>{p.instituto} · {p.registro}</h2>
            <p className="meta">{p.periodo} · amostra {p.amostra} · margem {p.margem} · confiança {p.confianca} · fonte: {p.fonte}</p>
            <div role="img" aria-label={`Intenção de votos ${p.instituto}: PL 222 Cidônio Gonçalves ${p.resultado['Cidônio Gonçalves']}%`}>
              {p.entradas.map(([k, v]) => {
                const u = SENADO_URNA[k] || { urna: k, partido: '', numero: '' };
                return (
                  <div className="bar" key={k}>
                    <span className="bar-nome"><strong>{u.partido}{u.numero ? ` · ${u.numero}` : ''}</strong> — {u.urna}</span>
                    <span className="trilho"><span className="ench" style={{ width: `${(v / max) * 100}%`, display: 'block' }} /></span>
                    <strong>{String(v).replace('.', ',')}%</strong>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="aviso"><strong>Por cidade:</strong> {PESQUISAS_MUNICIPAIS_NOTA}</div>
    </section>
  );
}
