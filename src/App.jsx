import { useEffect, useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { CANDIDATOS, CORTE } from './data/candidatos.js';
import { Sidebar, Topbar, ListaNav, Orgaos, SobreFinal } from './components/Sidebar.jsx';
import Faixa from './components/Faixa.jsx';
import Indicados from './components/Indicados.jsx';
import Visitas from './components/Visitas.jsx';
import { Inicio } from './pages/Inicio.jsx';
import { Candidatos } from './pages/Candidatos.jsx';
import { Ficha } from './pages/Ficha.jsx';
import { Pesquisas } from './pages/Pesquisas.jsx';
import { Redes } from './pages/Redes.jsx';
import { Config } from './pages/Config.jsx';
import { Sobre } from './pages/Sobre.jsx';

const TITULO_BASE = 'Maranhão Candidatos e Suas Possibilidades de Eleição | PL MA 2026';
const TITULOS = {
  '/': TITULO_BASE,
  '/candidatos': 'Candidatos do PL · Maranhão 2026 | Possibilidades de Eleição',
  '/pesquisas': 'Pesquisas do Senado (MA) | Possibilidades de Eleição',
  '/redes': 'Direita nas Redes | Possibilidades de Eleição',
  '/config': 'Configurações | Possibilidades de Eleição',
  '/sobre': 'Metodologia e Fontes | Possibilidades de Eleição',
};

// Compatibilidade: links antigos ?candidato=NNN -> /candidato/NNN
function Raiz() {
  const [params] = useSearchParams();
  const n = params.get('candidato');
  if (!n) return <Inicio />;
  const c = CANDIDATOS.find((x) => x.numero === n);
  if (c) return <Navigate to={`/candidato/${c.numero}`} replace />;
  return <Navigate to="/candidatos" replace />;
}

function RotaFicha() {
  const loc = useLocation();
  useEffect(() => {
    const m = loc.pathname.match(/^\/candidato\/(.+)$/);
    if (m) document.title = `Ficha ${m[1]} | Possibilidades de Eleição`;
  }, [loc.pathname]);
  return <Ficha />;
}

function Moldura() {
  const loc = useLocation();
  const [drawer, setDrawer] = useState(false);
  const refMenu = useRef(null);

  // Troca de página: topo + título + foco no conteúdo
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = TITULOS[loc.pathname] || TITULO_BASE;
    requestAnimationFrame(() => document.getElementById('conteudo')?.focus({ preventScroll: true }));
  }, [loc.pathname]);

  useEffect(() => {
    setDrawer(false);
  }, [loc.pathname]);

  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <Topbar aoMenu={() => setDrawer(true)} refMenu={refMenu} />
      <div className="shell" inert={drawer || undefined}>
        <Sidebar />
        <div className="coluna">
          <Faixa />
          <Indicados />
          <main id="conteudo" className="wrap" tabIndex={-1}>
            <Outlet />
          </main>
          <footer className="site">
            <p>Dados organizados nesta página (corte {CORTE}) a partir do TSE e do TRE-MA · sem login · grátis · funciona offline. As possibilidades indicadas são estimativas organizacionais, não são pesquisa eleitoral.</p>
            <p>Confira sempre: <a href="https://sig.tse.jus.br/ords/dwapr/f?p=1002:20">TSE</a> · <a href="https://guardiao.tre-ma.jus.br/painel-rcand/">TRE-MA</a></p>
          </footer>
        </div>
      </div>
      {drawer && (
        <DrawerManual aberto refMenu={refMenu} aoFechar={() => { setDrawer(false); refMenu.current?.focus({ preventScroll: true }); }} />
      )}
      <Visitas />
    </>
  );
}

// Drawer com navegação do Router (sem recarregar)
function DrawerManual({ aberto, aoFechar }) {
  const primeiro = useRef(null);
  useEffect(() => {
    if (!aberto) return;
    primeiro.current?.focus({ preventScroll: true });
    const tecla = (e) => {
      if (e.key === 'Escape') aoFechar();
      if (e.key === 'Tab') {
        const els = [...document.querySelectorAll('#drawer a, #drawer button')].filter((el) => el.offsetParent !== null);
        if (!els.length) return;
        const i = els.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { els[els.length - 1].focus(); e.preventDefault(); }
        else if (!e.shiftKey && i === els.length - 1) { els[0].focus(); e.preventDefault(); }
      }
    };
    document.addEventListener('keydown', tecla);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = '';
    };
  }, [aberto, aoFechar]);
  if (!aberto) return null;
  return (
    <>
      <div className="backdrop" onClick={aoFechar} aria-hidden="true" />
      <div id="drawer" className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="drawer-topo">
          <strong>Menu</strong>
          <button className="btn small" onClick={aoFechar} aria-label="Fechar menu"><FiX aria-hidden="true" /></button>
        </div>
        <DrawerNav primeiro={primeiro} aoNavegar={aoFechar} />
      </div>
    </>
  );
}

function DrawerNav({ primeiro, aoNavegar }) {
  return (
    <>
      <nav aria-label="Navegação principal">
        <ListaNav aoNavegar={aoNavegar} refPrimeiro={primeiro} />
      </nav>
      <Orgaos />
      <SobreFinal aoNavegar={aoNavegar} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Moldura />}>
          <Route path="/" element={<Raiz />} />
          <Route path="/candidatos" element={<Candidatos />} />
          <Route path="/candidato/:numero" element={<RotaFicha />} />
          <Route path="/pesquisas" element={<Pesquisas />} />
          <Route path="/redes" element={<Redes />} />
          <Route path="/config" element={<Config />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<Navigate to="/candidatos" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
