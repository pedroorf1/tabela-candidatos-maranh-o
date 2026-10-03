import { useMemo, useState } from 'react';
import { GOVERNADORES } from '../data/governadores.js';
import Share from '../components/Share.jsx';

const normaliza = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function Governador() {
  const [termo, setTermo] = useState('');
  const [partido, setPartido] = useState('');
  const q = normaliza(termo.trim());

  const partidos = useMemo(() => [...new Set(GOVERNADORES.map((g) => g.partido))].sort(), []);
  const lista = useMemo(() => {
    const r = GOVERNADORES.filter((g) => {
      if (partido && g.partido !== partido) return false;
      if (q) {
        const alvos = [g.nome, g.numero, g.partido, g.vice];
        if (!alvos.some((v) => normaliza(v).includes(q))) return false;
      }
      return true;
    });
    return [...r].sort((a, b) => a.numero.localeCompare(b.numero, undefined, { numeric: true }));
  }, [q, partido]);

  return (
    <section aria-label="Candidatos a governador do Maranhão" className="pagina">
      <h2>Governador · Maranhão 2026</h2>
      <p className="meta">
        Os 8 candidatos ao governo do estado (dados G1/O Globo, set/2026). Segundo turno em 25/10/2026
        se ninguém passar de 50% dos votos válidos. Situação de cada candidatura: confira no TSE.
      </p>
      <label className="rotulo-busca" htmlFor="busca-gov">Buscar candidato</label>
      <div className="busca">
        <input id="busca-gov" type="search" aria-label="Buscar por nome, partido ou número" placeholder="Nome, partido ou número… ex.: Braide, PT ou 28" value={termo} onChange={(e) => setTermo(e.target.value)} />
        {(termo || partido) && <button className="btn" onClick={() => { setTermo(''); setPartido(''); }}>Limpar</button>}
      </div>
      <div className="filtros">
        <select aria-label="Filtrar por partido" value={partido} onChange={(e) => setPartido(e.target.value)}>
          <option value="">Todos os partidos</option>
          {partidos.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <p className="contador" aria-live="polite">{lista.length} de {GOVERNADORES.length} candidatos</p>
      {lista.length === 0 ? (
        <div className="empty"><p>Nenhum candidato com esse filtro.</p><button className="btn primary" onClick={() => { setTermo(''); setPartido(''); }}>Mostrar todos</button></div>
      ) : (
        <div className="grade-cards">
          {lista.map((g) => {
            const ini = g.nome.split(' ').filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
            return (
              <article className="card-cand" key={g.numero}>
                <h3><span className="inicial" aria-hidden="true">{ini}</span>{g.nome}</h3>
                <div className="meta">Governador · nº <strong>{g.numero}</strong> · {g.partido}-MA</div>
                <p className="meta" style={{ margin: '.4rem 0 0' }}>{g.resumo}</p>
                <div className="meta">Vice: <strong>{g.vice}</strong></div>
                <div className="share-row">
                  <a className="btn small" target="_blank" rel="noopener noreferrer" href="https://sig.tse.jus.br/ords/dwapr/f?p=1002:20" aria-label={`Conferir ${g.nome} no TSE (abre em nova aba)`}>
                    Conferir no TSE ↗
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="secao">
        <h2>Compartilhe</h2>
        <p className="meta">Envie a lista de candidatos ao governo para eleitores do Maranhão.</p>
        <Share />
      </div>
    </section>
  );
}
