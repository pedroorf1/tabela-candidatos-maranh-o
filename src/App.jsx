import { useEffect, useMemo, useRef, useState } from 'react';
import { CANDIDATOS, CORTE, TURNO1 } from './data/candidatos.js';
import { PESQUISAS_SENADO, PESQUISAS_MUNICIPAIS_NOTA, JUSTICA, FONTES } from './data/eleitoral.js';
import { indicador, NIVEL_META } from './lib/indicador.js';
import Share from './components/Share.jsx';

function Selo({ ind }) {
  const meta = NIVEL_META[ind.nivel] || {};
  return (
    <span className={`tag ${ind.nivel}`} aria-label={`Possibilidade: ${ind.rotulo}`}>
      <span aria-hidden="true">{meta.icone}</span> {ind.rotulo}
    </span>
  );
}

const ABAS = [
  { id: 'inicio', rotulo: 'Início', icone: '🏠' },
  { id: 'candidatos', rotulo: 'Candidatos', icone: '🗳️' },
  { id: 'pesquisas', rotulo: 'Pesquisas', icone: '📊' },
  { id: 'sobre', rotulo: 'Sobre', icone: 'ℹ️' },
];

function useTema() {
  const [tema, setTema] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  const alternar = () => {
    const novo = tema === 'light' ? 'dark' : 'light';
    setTema(novo);
    document.documentElement.setAttribute('data-theme', novo);
    try { localStorage.setItem('ma22-theme', novo); } catch {}
  };
  return [tema, alternar];
}

export default function App() {
  const [tema, alternarTema] = useTema();
  const [aba, setAba] = useState('inicio');
  // Busca vive SÓ na aba Candidatos (revisor 2: isolamento de estado)
  const [busca, setBusca] = useState('');
  const [cargo, setCargo] = useState('');
  const [filtroInd, setFiltroInd] = useState('');
  const [preset, setPreset] = useState('todos');
  const [ordem, setOrdem] = useState('cargo');
  const [detalhe, setDetalhe] = useState(null);
  const tituloRef = useRef(null);
  const ultimoBtn = useRef(null);
  const voltando = useRef(false);

  // Devolve o foco ao botão do candidato APÓS a lista remontar (pós-commit).
  // Tabela e cards coexistem no DOM (um escondido por CSS): mira só o visível.
  useEffect(() => {
    if (!detalhe && voltando.current) {
      voltando.current = false;
      const visivel = (s) => [...document.querySelectorAll(s)].find((el) => el.offsetParent !== null);
      const el = ultimoBtn.current && visivel(`[data-num="${ultimoBtn.current}"]`);
      (el || visivel('.busca input'))?.focus({ preventScroll: true });
    }
  }, [detalhe]);

  // Deep-link ?candidato=NUMERO (query, não hash — lida por bots/share)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('candidato');
    if (p) {
      const c = CANDIDATOS.find((x) => x.numero === p);
      if (c) { setDetalhe(c); setAba('candidatos'); }
    }
    const onPop = () => {
      // Voltar/avançar re-sincroniza o detalhe com a URL (não apenas limpa)
      const q = new URLSearchParams(window.location.search).get('candidato');
      if (q) {
        const c = CANDIDATOS.find((x) => x.numero === q);
        if (c) { setDetalhe(c); setAba('candidatos'); return; }
      }
      setDetalhe(null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const abrirDetalhe = (c) => {
    ultimoBtn.current = c.numero;
    setAba('candidatos'); // a ficha só existe nesta aba (botão da Home caía no vazio)
    setDetalhe(c);
    try { window.history.pushState({}, '', `?candidato=${encodeURIComponent(c.numero)}`); } catch {}
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => tituloRef.current && tituloRef.current.focus());
  };
  const fecharDetalhe = () => {
    setDetalhe(null);
    voltando.current = true;
    try { window.history.pushState({}, '', window.location.pathname); } catch (e) {}
  };

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    let r = CANDIDATOS.filter((c) => {
      if (cargo && c.cargo !== cargo) return false;
      const ind = indicador(c).nivel;
      if (filtroInd && ind !== filtroInd) return false;
      if (preset === 'forte' && !c.reeleicao) return false;
      if (preset === 'novatos' && (c.reeleicao || c.numero === '222' || c.impugnacao)) return false;
      if (preset === 'flavio' && c.vinculoFlavio !== 'apoiado') return false;
      if (preset === 'justica' && !c.impugnacao) return false;
      if (q && !(c.nome.toLowerCase().includes(q) || c.numero.includes(q))) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      if (ordem === 'nome') return a.nome.localeCompare(b.nome, 'pt-BR');
      if (ordem === 'numero') return a.numero.localeCompare(b.numero, undefined, { numeric: true });
      const oc = { Senador: 0, 'Deputado Federal': 1, 'Deputado Estadual': 2 };
      return (oc[a.cargo] - oc[b.cargo]) || a.numero.localeCompare(b.numero, undefined, { numeric: true });
    });
    return r;
  }, [busca, cargo, filtroInd, preset, ordem]);

  const stats = useMemo(() => ({
    total: CANDIDATOS.length,
    deferidos: CANDIDATOS.filter((c) => !c.impugnacao).length,
    justica: CANDIDATOS.filter((c) => c.impugnacao).length,
    forte: CANDIDATOS.filter((c) => c.reeleicao).length,
    fed: CANDIDATOS.filter((c) => c.cargo === 'Deputado Federal').length,
    est: CANDIDATOS.filter((c) => c.cargo === 'Deputado Estadual').length,
  }), []);

  const irAba = (id) => {
    setAba(id); setDetalhe(null);
    // Trocar de aba fecha o detalhe: limpa ?candidato= para refresh não reabrir ficha
    try { window.history.pushState({}, '', window.location.pathname); } catch {}
    window.scrollTo({ top: 0 });
    // Leva o foco ao conteúdo para leitor de tela/teclado não perderem o contexto
    requestAnimationFrame(() => document.getElementById('conteudo')?.focus({ preventScroll: true }));
  };
  const limparBusca = () => { setBusca(''); setCargo(''); setFiltroInd(''); setPreset('todos'); };
  const fonteMais = () => { const h = document.documentElement; h.classList.remove('font-minus'); h.classList.add('font-plus'); };
  const fonteMenos = () => { const h = document.documentElement; h.classList.remove('font-plus'); h.classList.add('font-minus'); };

  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="topo">
        <div className="topo-inner">
          <div>
            <h1>Maranhão candidatos e suas possibilidades de eleição</h1>
            <p>PL Maranhão 2026 · deputado federal, deputado estadual e senador · corte {CORTE} · 1º turno {TURNO1}</p>
            <span className="badge">41 candidatos</span>
            <span className="badge alt">Sem login · grátis · funciona offline</span>
          </div>
          <div className="tools">
            <nav className="desk-nav" role="tablist" aria-label="Navegação principal">
              {ABAS.map((a) => (
                <button key={a.id} role="tab" aria-selected={aba === a.id} onClick={() => irAba(a.id)}>{a.icone} {a.rotulo}</button>
              ))}
            </nav>
            <button className="btn small" onClick={() => alternarTema()} aria-label={tema === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}>
              {tema === 'light' ? '🌙 Escuro' : '☀️ Claro'}
            </button>
            <button className="btn small" onClick={fonteMais} aria-label="Aumentar letra">A+</button>
            <button className="btn small" onClick={fonteMenos} aria-label="Diminuir letra">A−</button>
          </div>
        </div>
      </header>

      <main id="conteudo" className="wrap" tabIndex={-1}>
        {aba === 'inicio' && (
          <section aria-label="Visão geral">
            <div className="hero" role="list">
              <div className="card" role="listitem"><div className="n">{stats.total}</div><div className="l">candidatos do PL no Maranhão</div></div>
              <div className="card" role="listitem"><div className="n">{stats.deferidos}</div><div className="l">deferidos, sem pendência localizada</div></div>
              <div className="card" role="listitem"><div className="n">{stats.justica}</div><div className="l">com impugnação em análise (não é crime)</div></div>
            </div>
            <div className="cta-row">
              <button className="btn primary" onClick={() => irAba('candidatos')}>Ver candidatos</button>
              <button className="btn" onClick={() => irAba('pesquisas')}>Ver pesquisas do Senado</button>
            </div>
            <div className="aviso">
              <strong>Como ler as possibilidades:</strong> usamos um indicador organizacional transparente
              (<strong>Base forte</strong> · <strong>Em disputa</strong> · <strong>Em disputa · apoio formal</strong> · <strong>Atenção na Justiça</strong>).
              Não é pesquisa eleitoral e não há percentual de deputado — pesquisas reais existem só para o Senado (aba Pesquisas).
            </div>
            <div className="secao">
              <h2>Quem tem apoio formal de Flávio Bolsonaro (22)?</h2>
              <p><strong>Cidônio Gonçalves (222, Senado)</strong> — único apoio formal localizado e documentado para o Maranhão. Os demais são PL-MA sem apoio individual documentado.</p>
              <button className="btn" onClick={() => abrirDetalhe(CANDIDATOS[0])}>Abrir ficha de Cidônio Gonçalves</button>
            </div>
            <div className="secao">
              <h2>Compartilhe</h2>
              <p className="meta">Envie para eleitores do Maranhão no WhatsApp, X, Facebook ou Telegram.</p>
              <Share />
            </div>
          </section>
        )}

        {aba === 'candidatos' && !detalhe && (
          <section aria-label="Candidatos">
            <h2 style={{ marginBottom: 0 }}>Candidatos do PL · Maranhão 2026</h2>
            <p className="meta">Busque por nome ou número de urna. Toque em um candidato para ver a ficha completa e compartilhar.</p>
            <label className="rotulo-busca" htmlFor="busca-nome">Buscar candidato</label>
            <div className="busca">
              <input id="busca-nome" type="search" aria-label="Buscar por nome ou número" placeholder="Nome ou número… ex.: Detinha ou 22333" value={busca} onChange={(e) => setBusca(e.target.value)} />
              {(busca || cargo || filtroInd || preset !== 'todos') && <button className="btn" onClick={limparBusca}>Limpar</button>}
            </div>
            <div className="chips" role="group" aria-label="Atalhos">
              {[['todos', 'Todos'], ['forte', 'Base forte'], ['novatos', 'Sem histórico verificado'], ['flavio', 'Apoio Flávio 22'], ['justica', 'Atenção na Justiça']].map(([id, r]) => (
                <button key={id} aria-pressed={preset === id} onClick={() => setPreset(id)}>{r}</button>
              ))}
            </div>
            <div className="filtros">
              <select aria-label="Filtrar por cargo" value={cargo} onChange={(e) => setCargo(e.target.value)}>
                <option value="">Todos os cargos</option>
                <option>Senador</option>
                <option>Deputado Federal</option>
                <option>Deputado Estadual</option>
              </select>
              <select aria-label="Filtrar por indicador" value={filtroInd} onChange={(e) => setFiltroInd(e.target.value)}>
                <option value="">Todos os indicadores</option>
                <option value="forte">Base forte</option>
                <option value="disputa">Em disputa · apoio formal</option>
                <option value="neutro">Em disputa</option>
                <option value="atencao">Atenção na Justiça</option>
              </select>
              <select aria-label="Ordenar" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
                <option value="cargo">Ordenar: cargo + número</option>
                <option value="nome">Ordenar: nome</option>
                <option value="numero">Ordenar: número</option>
              </select>
            </div>
            <p className="contador" aria-live="polite">{lista.length} de {CANDIDATOS.length} encontrados</p>
            {lista.length === 0 ? (
              <div className="empty"><p>Nenhum candidato com esse filtro.</p><button className="btn primary" onClick={limparBusca}>Mostrar todos</button></div>
            ) : (
              <>
                <div className="tabela-wrap">
                  <table className="tabela">
                    <thead><tr><th scope="col">Candidato</th><th scope="col">Cargo · Número</th><th scope="col">Indicador</th><th scope="col">Situação</th></tr></thead>
                    <tbody>
                      {lista.map((c) => { const ind = indicador(c); return (
                        <tr key={c.numero}>
                          <td><button className="btn small" data-num={c.numero} onClick={() => abrirDetalhe(c)}><strong>{c.nome}</strong></button><br /><span className="meta">{c.vinculoLabel}</span></td>
                          <td>{c.cargo}<br /><strong>{c.numero}</strong></td>
                          <td><Selo ind={ind} /></td>
                          <td>{c.impugnacao ? 'Impugnação em análise' : c.situacao}</td>
                        </tr> ); })}
                    </tbody>
                  </table>
                </div>
                <div className="cards">
                  {lista.map((c) => { const ind = indicador(c); const ini = c.nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase(); return (
                    <article className="card-cand" key={c.numero}>
                      <h3><span className="inicial" aria-hidden="true">{ini}</span><button data-num={c.numero} onClick={() => abrirDetalhe(c)}>{c.nome}</button></h3>
                      <div className="meta">{c.cargo} · nº <strong>{c.numero}</strong> · PL-MA</div>
                      <Selo ind={ind} />
                      <div className="meta" style={{ marginTop: '.4rem' }}>{c.impugnacao ? `⚖️ Impugnação em análise (${c.impugnacao.processo})` : `✅ ${c.situacao} · sem pendência localizada`}</div>
                    </article> ); })}
                </div>
              </>
            )}
          </section>
        )}

        {aba === 'candidatos' && detalhe && (
          <article className="detalhe" aria-label={`Ficha de ${detalhe.nome}`}>
            <button className="btn" onClick={fecharDetalhe}>← Voltar para a lista</button>
            <h2 tabIndex={-1} ref={tituloRef}>{detalhe.nome} · {detalhe.numero}</h2>
            <p className="meta">{detalhe.cargo} · {detalhe.partido}-{detalhe.uf} · {detalhe.abrangencia}</p>
            {(() => { const ind = indicador(detalhe); return (<><p><Selo ind={ind} /></p><p>{ind.motivo}</p></>); })()}
            <div className="secao"><h2>Situação e histórico</h2>
              <p><strong>Situação:</strong> {detalhe.situacao}{detalhe.impugnacao ? ` + impugnação ${detalhe.impugnacao.processo} (${detalhe.impugnacao.status})` : ''}</p>
              <p><strong>Histórico:</strong> {detalhe.historico}</p>
              <p><strong>Vínculo com Flávio (22):</strong> {detalhe.vinculoLabel}</p>
              {detalhe.impugnacao && (<p className="perigo"><strong>⚖️ O que a impugnação significa:</strong> é uma contestação do registro de candidatura, aguardando julgamento. Não equivale a crime eleitoral, condenação ou inelegibilidade.</p>)}
            </div>
            {detalhe.numero === '222' && (
              <div className="secao"><h2>Pesquisas reais (Senado MA)</h2>
                <p className="meta">Cidônio: 1% a 2,3% nas 4 pesquisas estaduais com registro no TSE.</p>
                <button className="btn" onClick={() => irAba('pesquisas')}>Ver as 4 pesquisas</button>
              </div>
            )}
            <div className="secao"><h2>Conferir na fonte oficial</h2>
              <p className="meta">Dados de {CORTE}. Situações podem mudar até {TURNO1}.</p>
              <p>
                <a className="btn" target="_blank" rel="noopener noreferrer" href="https://sig.tse.jus.br/ords/dwapr/f?p=1002:20">TSE — Candidaturas</a>{' '}
                <a className="btn" target="_blank" rel="noopener noreferrer" href="https://guardiao.tre-ma.jus.br/painel-rcand/">TRE-MA — Painel RCand</a>
              </p>
            </div>
            <div className="share-sticky"><Share candidato={detalhe} /></div>
          </article>
        )}

        {aba === 'pesquisas' && (
          <section aria-label="Pesquisas do Senado">
            <h2>Pesquisas reais — Senado (MA)</h2>
            <p className="meta">Somente levantamentos estaduais com registro no TSE. Não aplicamos esses percentuais a deputados. Não há pesquisa municipal recente localizada.</p>
            {PESQUISAS_SENADO.map((p) => {
              const max = Math.max(...Object.values(p.resultado));
              return (
                <div className="secao" key={p.registro}>
                  <h2>{p.instituto} · {p.registro}</h2>
                  <p className="meta">{p.periodo} · amostra {p.amostra} · margem {p.margem} · confiança {p.confianca} · fonte: {p.fonte}</p>
                  <div role="img" aria-label={`Intenção de votos ${p.instituto}: Cidônio ${p.resultado['Cidônio Gonçalves']}%`}>
                    {Object.entries(p.resultado).map(([k, v]) => (
                      <div className="bar" key={k}><span>{k}</span><span className="trilho"><span className="ench" style={{ width: `${(v / max) * 100}%`, display: 'block' }} /></span><strong>{String(v).replace('.', ',')}%</strong></div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="aviso"><strong>Por cidade:</strong> {PESQUISAS_MUNICIPAIS_NOTA}</div>
          </section>
        )}

        {aba === 'sobre' && (
          <section aria-label="Sobre, metodologia e fontes">
            <h2>Metodologia (fórmula aberta)</h2>
            <div className="secao">
              <p><strong>Regra do indicador:</strong> (1) com impugnação → “Atenção na Justiça”; (2) senador 222 → “Em disputa · apoio formal” + pesquisas reais; (3) reeleição/mandato verificado (Cláudio Cunha, Josimar, Detinha) → “Base forte”; (4) demais deferidos → “Em disputa” (sem dados suficientes). Sem percentual, sem ranking, ordenação padrão por cargo+número.</p>
              <p><strong>Limites:</strong> histórico ainda não reunido para 37 dos 41 (isso não quer dizer que não tenham mandato ou experiência); apoio formal de Flávio só para o 222; 1º turno em {TURNO1} — tudo pode mudar.</p>
            </div>
            <h2>Justiça Eleitoral</h2>
            <div className="secao"><p>{JUSTICA.resumo}</p>
              <table className="pesq"><thead><tr><th scope="col">Candidato</th><th scope="col">Processo</th><th scope="col">Status</th></tr></thead>
                <tbody>{JUSTICA.casos.map((j) => (<tr key={j.processo}><td>{j.candidato} ({j.numero})</td><td>{j.processo} · {j.tipo}</td><td>{j.status}</td></tr>))}</tbody>
              </table>
            </div>
            <h2>Fontes oficiais</h2>
            <div className="secao"><ul>{FONTES.map((f) => (<li key={f.nome}><a href={f.url} target="_blank" rel="noopener noreferrer">{f.nome}</a> — {f.uso}</li>))}</ul></div>
            <div className="secao seo-text">
              <h2>Maranhão candidatos e suas possibilidades de eleição — guia</h2>
              <p>Este guia sobre Maranhão candidatos e suas possibilidades de eleição reúne os 41 nomes do PL no estado para 2026 — deputado federal, deputado estadual e senador —, explica o indicador de possibilidades (estimativa organizacional, sem percentuais para deputado), mostra as pesquisas registradas para o Senado, a situação de cada candidatura na Justiça Eleitoral e quem tem apoio formal de Flávio Bolsonaro (22), com links para conferir no TSE e no TRE-MA.</p>
            </div>
            <Share />
          </section>
        )}
      </main>

      <nav className="bottom" aria-label="Navegação principal">
        {ABAS.map((a) => (
          <button key={a.id} aria-current={aba === a.id ? 'page' : undefined} onClick={() => irAba(a.id)}>
            <span className="ico" aria-hidden="true">{a.icone}</span>{a.rotulo}
          </button>
        ))}
      </nav>

      <footer className="site">
        <p>Dados organizados nesta página (corte {CORTE}) a partir do TSE e do TRE-MA · sem login · grátis · funciona offline. As possibilidades indicadas são estimativas organizacionais, não são pesquisa eleitoral.</p>
        <p>Confira sempre: <a href="https://sig.tse.jus.br/ords/dwapr/f?p=1002:20">TSE</a> · <a href="https://guardiao.tre-ma.jus.br/painel-rcand/">TRE-MA</a></p>
      </footer>
    </>
  );
}
