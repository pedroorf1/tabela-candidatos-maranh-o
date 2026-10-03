import { JUSTICA, FONTES } from '../data/eleitoral.js';
import Share from '../components/Share.jsx';

export function Sobre() {
  return (
    <section aria-label="Sobre, metodologia e fontes" className="pagina">
      <h2>Metodologia (fórmula aberta)</h2>
      <div className="secao">
        <p><strong>Regra do indicador:</strong> (1) com impugnação → “Atenção na Justiça”; (2) senador 222 → “Em disputa · apoio formal” + pesquisas reais; (3) reeleição/mandato verificado (Cláudio Cunha, Josimar, Detinha) → “Base forte”; (4) demais deferidos → “Em disputa” (sem dados suficientes). Sem percentual, sem ranking, ordenação padrão por cargo+número.</p>
        <p><strong>Limites:</strong> histórico ainda não reunido para 37 dos 41 (isso não quer dizer que não tenham mandato ou experiência); apoio formal de Flávio só para o 222; 1º turno em 04/10/2026 — tudo pode mudar.</p>
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
  );
}
