import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CANDIDATOS } from '../data/candidatos.js';
import Share from '../components/Share.jsx';
import { useApp } from '../store.js';

export function Inicio() {
  const navigate = useNavigate();
  const setUltimo = useApp((s) => s.setUltimo);
  const stats = useMemo(
    () => ({
      total: CANDIDATOS.length,
      deferidos: CANDIDATOS.filter((c) => !c.impugnacao).length,
      justica: CANDIDATOS.filter((c) => c.impugnacao).length,
    }),
    []
  );
  const abrir = (numero) => {
    setUltimo(numero);
    navigate(`/candidato/${numero}`);
  };
  return (
    <section aria-label="Visão geral" className="pagina">
      <div className="hero" role="list">
        <div className="card" role="listitem" style={{ '--i': 0 }}><div className="n">{stats.total}</div><div className="l">candidatos do PL no Maranhão</div></div>
        <div className="card" role="listitem" style={{ '--i': 1 }}><div className="n">{stats.deferidos}</div><div className="l">deferidos, sem pendência localizada</div></div>
        <div className="card" role="listitem" style={{ '--i': 2 }}><div className="n">{stats.justica}</div><div className="l">com impugnação em análise (não é crime)</div></div>
      </div>
      <div className="cta-row">
        <Link className="btn primary" to="/candidatos">Ver candidatos</Link>
        <Link className="btn" to="/pesquisas">Ver pesquisas do Senado</Link>
      </div>
      <div className="aviso">
        <strong>Como ler as possibilidades:</strong> usamos um indicador organizacional transparente
        (<strong>Base forte</strong> · <strong>Em disputa</strong> · <strong>Em disputa · apoio formal</strong> · <strong>Atenção na Justiça</strong>).
        Não é pesquisa eleitoral e não há percentual de deputado — pesquisas reais existem só para o Senado (página Pesquisas).
      </div>
      <div className="secao">
        <h2>Quem tem apoio formal de Flávio Bolsonaro (22)?</h2>
        <p><strong>Cidônio Gonçalves (222, Senado)</strong> — único apoio formal localizado e documentado para o Maranhão. Os demais são PL-MA sem apoio individual documentado.</p>
        <button className="btn" onClick={() => abrir('222')}>Abrir ficha de Cidônio Gonçalves</button>
      </div>
      <div className="secao">
        <h2>Compartilhe</h2>
        <p className="meta">Envie para eleitores do Maranhão no WhatsApp, X, Facebook ou Telegram.</p>
        <Share />
      </div>
    </section>
  );
}
