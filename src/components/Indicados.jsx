import { useState } from 'react';
import { Link } from 'react-router-dom';
import { INDICADOS } from '../data/indicados.js';

function Foto({ nome, foto }) {
  const [falhou, setFalhou] = useState(false);
  const ini = nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  if (!foto || falhou) return <span className="indicado-ini" aria-hidden="true">{ini}</span>;
  return (
    <img className="indicado-foto" src={foto} alt="" aria-hidden="true" loading="lazy"
      onError={() => setFalhou(true)} />
  );
}

// Faixa de indicados: aparece logo abaixo do banner, em TODAS as páginas.
// É indicação editorial do painel (não é pesquisa nem dado oficial).
export default function Indicados() {
  return (
    <section className="indicados" aria-label="Indicados para votar no Maranhão">
      <div className="indicados-topo">
        <h2>Indicados para votar no Maranhão ✓</h2>
        <p className="meta">Indicação deste painel — não é pesquisa eleitoral. Confira sempre a situação no TSE.</p>
      </div>
      <div className="indicados-lista" role="list">
        {INDICADOS.map((c) => (
          <article className="indicado" role="listitem" key={c.numero + c.cargo}>
            <Foto nome={c.nome} foto={c.foto} />
            <span className="indicado-cargo">{c.cargo}</span>
            <h3>{c.nome}</h3>
            <p className="indicado-num">
              <strong>{c.partido} · {c.numero}</strong>
            </p>
            <p className="meta">{c.status}{c.detalhe ? ` · ${c.detalhe}` : ''}</p>
            {c.credito && <p className="indicado-credito">{c.credito}</p>}
            {c.externo ? (
              <a className="btn small" target="_blank" rel="noopener noreferrer" href={c.destino}>
                {c.destinoRotulo} ↗
              </a>
            ) : (
              <Link className="btn small" to={c.destino}>{c.destinoRotulo}</Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
