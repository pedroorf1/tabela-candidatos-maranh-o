import { useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CANDIDATOS, CORTE, TURNO1 } from '../data/candidatos.js';
import { indicador } from '../lib/indicador.js';
import Selo from '../components/Selo.jsx';
import Share from '../components/Share.jsx';

export function Ficha() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const tituloRef = useRef(null);
  const c = CANDIDATOS.find((x) => x.numero === numero);
  if (!c) return <Navigate to="/candidatos" replace />;
  const ind = indicador(c);

  const voltar = () => navigate('/candidatos');
  const verPesquisas = () => navigate('/pesquisas');

  return (
    <article className="detalhe pagina" aria-label={`Ficha de ${c.nome}`}>
      <button className="btn" onClick={voltar}>← Voltar para a lista</button>
      <h2 tabIndex={-1} ref={tituloRef}>{c.nome} · {c.numero}</h2>
      <p className="meta">{c.cargo} · {c.partido}-{c.uf} · {c.abrangencia}</p>
      <p><Selo ind={ind} /></p>
      <p>{ind.motivo}</p>
      <div className="secao"><h2>Situação e histórico</h2>
        <p><strong>Situação:</strong> {c.situacao}{c.impugnacao ? ` + impugnação ${c.impugnacao.processo} (${c.impugnacao.status})` : ''}</p>
        <p><strong>Histórico:</strong> {c.historico}</p>
        <p><strong>Vínculo com Flávio (22):</strong> {c.vinculoLabel}</p>
        {c.impugnacao && (<p className="perigo"><strong>⚖️ O que a impugnação significa:</strong> é uma contestação do registro de candidatura, aguardando julgamento. Não equivale a crime eleitoral, condenação ou inelegibilidade.</p>)}
      </div>
      {c.numero === '222' && (
        <div className="secao"><h2>Pesquisas reais (Senado MA)</h2>
          <p className="meta">Cidônio: 1% a 2,3% nas 4 pesquisas estaduais com registro no TSE.</p>
          <button className="btn" onClick={verPesquisas}>Ver as 4 pesquisas</button>
        </div>
      )}
      <div className="secao"><h2>Conferir na fonte oficial</h2>
        <p className="meta">Dados de {CORTE}. Situações podem mudar até {TURNO1}.</p>
        <p>
          <a className="btn" target="_blank" rel="noopener noreferrer" href="https://sig.tse.jus.br/ords/dwapr/f?p=1002:20">TSE — Candidaturas</a>{' '}
          <a className="btn" target="_blank" rel="noopener noreferrer" href="https://guardiao.tre-ma.jus.br/painel-rcand/">TRE-MA — Painel RCand</a>
        </p>
      </div>
      <div className="share-sticky"><Share candidato={c} /></div>
    </article>
  );
}
