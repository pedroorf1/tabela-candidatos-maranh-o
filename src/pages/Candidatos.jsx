import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CANDIDATOS } from '../data/candidatos.js';
import { GOVERNADORES } from '../data/governadores.js';
import { indicador } from '../lib/indicador.js';
import Selo from '../components/Selo.jsx';
import { useApp } from '../store.js';

const normaliza = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Base unificada: lista PL-MA + governadores (fora do PL, sem selo nem ficha)
const TODOS = [
  ...CANDIDATOS,
  ...GOVERNADORES.map((g) => ({
    nome: g.nome, numero: g.numero, cargo: 'Governador', partido: g.partido, uf: g.uf,
    vinculoLabel: 'Candidatura majoritária — fora da lista PL-MA',
    situacao: 'Confira no TSE', historico: g.resumo, isGov: true,
  })),
];

export function Candidatos() {
  const navigate = useNavigate();
  const busca = useApp((s) => s.busca);
  const cargo = useApp((s) => s.cargo);
  const filtroInd = useApp((s) => s.filtroInd);
  const preset = useApp((s) => s.preset);
  const ordem = useApp((s) => s.ordem);
  const setFiltro = useApp((s) => s.setFiltro);
  const limparBusca = useApp((s) => s.limparBusca);
  const ultimoNum = useApp((s) => s.ultimoNum);
  const setUltimo = useApp((s) => s.setUltimo);
  const jaFocou = useRef(false);

  // Ao voltar da ficha, devolve o foco ao botão do candidato (só o visível)
  useEffect(() => {
    if (jaFocou.current) return;
    jaFocou.current = true;
    if (!ultimoNum) return;
    const visivel = (s) => [...document.querySelectorAll(s)].find((el) => el.offsetParent !== null);
    (visivel(`[data-num="${ultimoNum}"]`) || visivel('.busca input'))?.focus({ preventScroll: true });
    setUltimo(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const lista = useMemo(() => {
    const q = normaliza(busca.trim());
    const r = TODOS.filter((c) => {
      if (cargo && c.cargo !== cargo) return false;
      if (!c.isGov) {
        const ind = indicador(c).nivel;
        if (filtroInd && ind !== filtroInd) return false;
      } else if (filtroInd) {
        return false; // governadores não têm indicador (fora da lista PL)
      }
      if (preset === 'forte' && !c.reeleicao) return false;
      if (preset === 'novatos' && (c.reeleicao || c.numero === '222' || c.impugnacao)) return false;
      if (preset === 'flavio' && c.vinculoFlavio !== 'apoiado') return false;
      if (preset === 'justica' && !c.impugnacao) return false;
      if (q) {
        const alvos = [c.nome, c.numero, c.partido, c.uf, `${c.partido}-${c.uf}`, `${c.partido} ${c.uf}`, c.cargo];
        if (!alvos.some((v) => normaliza(v).includes(q))) return false;
      }
      return true;
    });
    return [...r].sort((a, b) => {
      if (ordem === 'nome') return a.nome.localeCompare(b.nome, 'pt-BR');
      if (ordem === 'numero') return a.numero.localeCompare(b.numero, undefined, { numeric: true });
      const oc = { Governador: 0, Senador: 1, 'Deputado Federal': 2, 'Deputado Estadual': 3 };
      return (oc[a.cargo] ?? 9) - (oc[b.cargo] ?? 9) || a.numero.localeCompare(b.numero, undefined, { numeric: true });
    });
  }, [busca, cargo, filtroInd, preset, ordem]);

  const abrir = (c) => {
    if (c.isGov) {
      navigate('/governador');
      return;
    }
    setUltimo(c.numero);
    navigate(`/candidato/${c.numero}`);
  };

  return (
    <section aria-label="Candidatos" className="pagina">
      <h2 style={{ marginBottom: 0 }}>Candidatos · Maranhão 2026</h2>
      <p className="meta">Lista PL-MA + Governo do estado. Busque por nome, partido, UF ou número de urna. Toque em um candidato para ver a ficha completa e compartilhar.</p>
      <label className="rotulo-busca" htmlFor="busca-nome">Buscar candidato</label>
      <div className="busca">
        <input id="busca-nome" type="search" aria-label="Buscar por nome, partido, UF ou número" placeholder="Nome, partido, UF ou número… ex.: PL-MA, Detinha ou 22333" value={busca} onChange={(e) => setFiltro({ busca: e.target.value })} />
        {(busca || cargo || filtroInd || preset !== 'todos') && <button className="btn" onClick={limparBusca}>Limpar</button>}
      </div>
      <div className="chips" role="group" aria-label="Atalhos">
        {[['todos', 'Todos'], ['forte', 'Base forte'], ['novatos', 'Sem histórico verificado'], ['flavio', 'Apoio Flávio 22'], ['justica', 'Atenção na Justiça']].map(([id, r]) => (
          <button key={id} aria-pressed={preset === id} onClick={() => setFiltro({ preset: id })}>{r}</button>
        ))}
      </div>
      <div className="filtros">
              <select aria-label="Filtrar por cargo" value={cargo} onChange={(e) => setFiltro({ cargo: e.target.value })}>
                <option value="">Todos os cargos</option>
                <option>Governador</option>
                <option>Senador</option>
                <option>Deputado Federal</option>
                <option>Deputado Estadual</option>
              </select>
        <select aria-label="Filtrar por indicador" value={filtroInd} onChange={(e) => setFiltro({ filtroInd: e.target.value })}>
          <option value="">Todos os indicadores</option>
          <option value="forte">Base forte</option>
          <option value="disputa">Em disputa · apoio formal</option>
          <option value="neutro">Em disputa</option>
          <option value="atencao">Atenção na Justiça</option>
        </select>
        <select aria-label="Ordenar" value={ordem} onChange={(e) => setFiltro({ ordem: e.target.value })}>
          <option value="cargo">Ordenar: cargo + número</option>
          <option value="nome">Ordenar: nome</option>
          <option value="numero">Ordenar: número</option>
        </select>
      </div>
      <p className="contador" aria-live="polite">{lista.length} de {TODOS.length} encontrados</p>
      {lista.length === 0 ? (
        <div className="empty"><p>Nenhum candidato com esse filtro.</p><button className="btn primary" onClick={limparBusca}>Mostrar todos</button></div>
      ) : (
        <>
          <div className="tabela-wrap">
            <table className="tabela">
              <thead><tr><th scope="col">Candidato</th><th scope="col">Cargo · Número</th><th scope="col">Indicador</th><th scope="col">Situação</th></tr></thead>
              <tbody>
                {lista.map((c) => {
                  const ind = c.isGov ? null : indicador(c);
                  return (
                    <tr key={c.numero + c.cargo}>
                      <td><button className="btn small" data-num={c.numero} onClick={() => abrir(c)}><strong>{c.nome}</strong></button><br /><span className="meta">{c.vinculoLabel}</span></td>
                      <td>{c.cargo}<br /><strong>{c.numero}</strong></td>
                      <td>{ind ? <Selo ind={ind} /> : <span className="tag neutro" title="Indicador vale só para a lista PL-MA">Sem indicador</span>}</td>
                      <td>{c.impugnacao ? 'Impugnação em análise' : c.situacao}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="cards">
            {lista.map((c) => {
              const ind = c.isGov ? null : indicador(c);
              const ini = c.nome.split(' ').filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
              return (
                <article className="card-cand" key={c.numero + c.cargo}>
                  <h3><span className="inicial" aria-hidden="true">{ini}</span><button data-num={c.numero} onClick={() => abrir(c)}>{c.nome}</button></h3>
                  <div className="meta">{c.cargo} · nº <strong>{c.numero}</strong> · {c.partido}-{c.uf}</div>
                  {ind ? <Selo ind={ind} /> : <span className="tag neutro" title="Indicador vale só para a lista PL-MA">Sem indicador</span>}
                  <div className="meta" style={{ marginTop: '.4rem' }}>{c.isGov ? '⚖️ Situação: confira no TSE' : (c.impugnacao ? `⚖️ Impugnação em análise (${c.impugnacao.processo})` : `✅ ${c.situacao} · sem pendência localizada`)}</div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
