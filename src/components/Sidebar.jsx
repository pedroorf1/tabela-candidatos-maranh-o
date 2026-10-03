import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiBarChart2, FiAtSign, FiInfo, FiSettings, FiExternalLink, FiMenu } from 'react-icons/fi';
import { useApp } from '../store.js';

export const NAV = [
  { to: '/', rotulo: 'Início', Icone: FiHome, fim: true },
  { to: '/candidatos', rotulo: 'Candidatos', Icone: FiUsers },
  { to: '/pesquisas', rotulo: 'Pesquisas', Icone: FiBarChart2 },
  { to: '/redes', rotulo: 'Nas Redes', Icone: FiAtSign },
  { to: '/config', rotulo: 'Configurações', Icone: FiSettings },
];

// Sobre mora na parte final do menu (depois dos órgãos oficiais)
export const SOBRE = { to: '/sobre', rotulo: 'Sobre', Icone: FiInfo };

// Órgãos oficiais (links externos, abrem em nova aba)
export const ORGAOS = [
  { nome: 'TSE — Eleições 2026', url: 'https://www.tse.jus.br/eleicoes/eleicoes-2026' },
  { nome: 'TRE-MA — Eleições 2026', url: 'https://www.tre-ma.jus.br/eleicoes/eleicoes-2026' },
  { nome: 'STF — Portal', url: 'https://portal.stf.jus.br/' },
  { nome: 'STJ — Portal', url: 'https://www.stj.jus.br/' },
];

function ItemNav({ to, fim, rotulo, Icone, aoNavegar, refEl }) {
  return (
    <NavLink to={to} end={fim} ref={refEl} onClick={aoNavegar}>
      <Icone aria-hidden="true" /> {rotulo}
    </NavLink>
  );
}

export function ListaNav({ aoNavegar, refPrimeiro }) {
  return (
    <ul>
      {NAV.map((n, i) => (
        <li key={n.to}>
          <ItemNav to={n.to} fim={n.fim} rotulo={n.rotulo} Icone={n.Icone} aoNavegar={aoNavegar} refEl={i === 0 ? refPrimeiro : undefined} />
        </li>
      ))}
    </ul>
  );
}

export function Orgaos() {
  return (
    <div className="orgaos">
      <p className="orgaos-titulo">Órgãos oficiais</p>
      <ul>
        {ORGAOS.map((o) => (
          <li key={o.nome}>
            <a href={o.url} target="_blank" rel="noopener noreferrer" aria-label={`${o.nome} (abre em nova aba)`}>
              {o.nome} <FiExternalLink aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SobreFinal({ aoNavegar }) {
  return (
    <nav aria-label="Sobre e ajuda">
      <ul>
        <li>
          <ItemNav to={SOBRE.to} rotulo={SOBRE.rotulo} Icone={SOBRE.Icone} aoNavegar={aoNavegar} />
        </li>
      </ul>
    </nav>
  );
}

// Sidebar fixa (desktop)
export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Menu lateral">
      <Marca />
      <nav aria-label="Navegação principal">
        <ListaNav />
      </nav>
      <Orgaos />
      <SobreFinal />
      <div className="sidebar-rodape">
        <p className="meta">Dados TSE/TRE-MA · corte 03/10/2026</p>
      </div>
    </aside>
  );
}

// Barra superior (só mobile): hamburger + marca
export function Topbar({ aoMenu, refMenu }) {
  return (
    <div className="topbar">
      <button ref={refMenu} className="btn hamb" onClick={aoMenu} aria-expanded="false" aria-controls="drawer" aria-label="Abrir menu">
        <FiMenu aria-hidden="true" />
      </button>
      <Marca />
    </div>
  );
}

export function Marca() {
  return (
    <div className="marca">
      <span className="marca-num" aria-hidden="true">22</span>
      <span className="marca-txt">Maranhão <strong>2026</strong><small>Painel cidadão</small></span>
    </div>
  );
}
