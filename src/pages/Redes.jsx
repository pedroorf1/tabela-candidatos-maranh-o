import { useMemo, useState } from 'react';
import { DIREITA, CORTE_REDES, ordenados, totalSeguidores, formataSeguidores } from '../data/direita.js';

const normaliza = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const ROTULO_REDE = { instagram: 'Instagram', x: 'X', facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok' };

function Foto({ nome, usuario }) {
  const [falhou, setFalhou] = useState(false);
  const ini = nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  return (
    <span className="foto" aria-hidden="true">
      <span className="foto-ini">{ini}</span>
      {!falhou && (
        <img
          src={`https://unavatar.io/instagram/${encodeURIComponent(usuario)}`}
          alt="" loading="lazy" referrerPolicy="no-referrer"
          onError={() => setFalhou(true)}
        />
      )}
    </span>
  );
}

export function Redes() {
  const [termo, setTermo] = useState('');
  const [partido, setPartido] = useState('');
  const [candidatura, setCandidatura] = useState('');
  const q = normaliza(termo.trim());

  const partidos = useMemo(() => [...new Set(DIREITA.map((d) => d.partido))].sort(), []);
  const candidaturas = useMemo(() => [...new Set(DIREITA.map((d) => d.candidatura))], []);

  const lista = useMemo(() => {
    const r = DIREITA.filter((d) => {
      if (partido && d.partido !== partido) return false;
      if (candidatura && d.candidatura !== candidatura) return false;
      if (q) {
        const alvos = [d.nome, d.partido, d.uf, d.numero, d.candidatura, d.cargo, ...d.redes.map((x) => x.usuario)];
        if (!alvos.some((v) => normaliza(String(v || '')).includes(q))) return false;
      }
      return true;
    });
    return ordenados(r);
  }, [q, partido, candidatura]);

  return (
    <section aria-label="Candidatos de direita nas redes" className="pagina">
      <h2>Direita nas redes 🇧🇷</h2>
      <p className="meta">
        Candidatos e pré-candidatos de direita de todo o Brasil em 2026, ordenados por importância do cargo
        e depois por relevância nas redes. Toque em <strong>Seguir</strong> para adicionar o candidato à sua própria rede.
        Seguidores aproximados de {CORTE_REDES}; perfis verificados em fontes públicas.
      </p>
      <label className="rotulo-busca" htmlFor="busca-redes">Buscar</label>
      <div className="busca">
        <input id="busca-redes" type="search" aria-label="Buscar por nome, partido ou candidatura" placeholder="Nome, partido, nº ou candidatura… ex.: senado, PL" value={termo} onChange={(e) => setTermo(e.target.value)} />
        {(termo || partido || candidatura) && <button className="btn" onClick={() => { setTermo(''); setPartido(''); setCandidatura(''); }}>Limpar</button>}
      </div>
      <div className="filtros">
        <select aria-label="Filtrar por partido" value={partido} onChange={(e) => setPartido(e.target.value)}>
          <option value="">Todos os partidos</option>
          {partidos.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select aria-label="Filtrar por candidatura" value={candidatura} onChange={(e) => setCandidatura(e.target.value)}>
          <option value="">Todas as candidaturas</option>
          {candidaturas.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <p className="contador" aria-live="polite">{lista.length} de {DIREITA.length} nomes</p>
      {lista.length === 0 ? (
        <div className="empty"><p>Nenhum nome com esse filtro.</p><button className="btn primary" onClick={() => { setTermo(''); setPartido(''); setCandidatura(''); }}>Mostrar todos</button></div>
      ) : (
        <div className="grade-cards">
          {lista.map((d) => {
            const total = totalSeguidores(d);
            const fotoRede = d.redes.find((r) => r.rede === 'instagram') || d.redes[0];
            return (
              <article className="card-cand" key={d.nome}>
                <h3><Foto nome={d.nome} usuario={fotoRede.usuario} />{d.nome}</h3>
                <div className="meta">
                  {d.partido}{d.uf ? ` · ${d.uf}` : ''}{d.numero ? ` · nº ${d.numero}` : ''} — {d.candidatura} · {d.cargo}
                </div>
                <div className="meta">👥 {formataSeguidores(total)} nas redes</div>
                <div className="share-row" role="group" aria-label={`Seguir ${d.nome}`}>
                  {d.redes.map((r) => (
                    <a key={r.rede} className="btn small" target="_blank" rel="noopener noreferrer"
                      href={r.url} aria-label={`Seguir ${d.nome} no ${ROTULO_REDE[r.rede] || r.rede} (abre em nova aba)`}>
                      Seguir no {ROTULO_REDE[r.rede] || r.rede}
                    </a>
                  ))}
                  {d.site && (
                    <a className="btn small" target="_blank" rel="noopener noreferrer" href={d.site} aria-label={`Site oficial de ${d.nome} (abre em nova aba)`}>
                      Site oficial
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <div className="aviso">
        <strong>Transparência:</strong> lista inicial com 10 nomes verificados (corte {CORTE_REDES}).
        Jair Bolsonaro não consta por estar inelegível (sem candidatura em 2026). Nomes sem candidatura
        confirmada aparecem como “A confirmar”. Foto via serviço público de avatares; perfis abrem na rede oficial.
      </div>
    </section>
  );
}
