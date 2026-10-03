import { useMemo } from 'react';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CANDIDATOS } from '../data/candidatos.js';
import Share from '../components/Share.jsx';
import { useApp } from '../store.js';

const VIDEO_URL = 'https://x.com/DanjelBigHouse/status/2106053867708277072';

// Vídeo em destaque: flutua sobre o banner/conteúdo (rolando com a página).
// Usa o embed oficial do X (widgets.js), que dimensiona o card pelo conteúdo:
// sem altura fixa e sem barra de rolagem interna.
function VideoDestaque() {
  const tema = useApp((s) => s.tema);
  const ref = useRef(null);
  const refCaixa = useRef(null);

  // Largura fixa padronizada (340px); o conteúdo escala para caber nos 50vh:
  // sem corte, sem barra interna, sem largura automática.
  const ajustar = () => {
    const caixa = refCaixa.current;
    if (!caixa || window.innerWidth < 1100) {
      if (caixa) caixa.style.transform = '';
      return;
    }
    caixa.style.transform = '';
    const H = caixa.offsetHeight;
    if (!H || H < 50) return;
    const s = Math.min(1, (window.innerHeight * 0.5) / H);
    if (s < 1) {
      caixa.style.transform = `scale(${s})`;
      caixa.style.transformOrigin = 'top center';
    }
  };

  useEffect(() => {
    const t1 = setTimeout(ajustar, 1500);
    const t2 = setTimeout(ajustar, 3500);
    const t3 = setTimeout(ajustar, 6500);
    window.addEventListener('resize', ajustar);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      window.removeEventListener('resize', ajustar);
    };
  }, [tema]);

  useEffect(() => {
    let vivo = true;
    const montar = () => {
      if (!vivo || !ref.current) return;
      ref.current.innerHTML =
        `<blockquote class="twitter-tweet" data-theme="${tema === 'dark' ? 'dark' : 'light'}" data-dnt="true">` +
        `<a href="${VIDEO_URL}">Ver no X</a></blockquote>`;
      const pronto = () => {
        try {
          window.twttr?.widgets?.load(ref.current);
        } catch {}
      };
      if (window.twttr?.widgets) pronto();
      else if (!document.querySelector('script[data-xwidgets]')) {
        const s = document.createElement('script');
        s.src = 'https://platform.twitter.com/widgets.js';
        s.async = true;
        s.dataset.xwidgets = '1';
        s.onload = () => vivo && pronto();
        document.body.appendChild(s);
      } else {
        const iv = setInterval(() => {
          if (!vivo) { clearInterval(iv); return; }
          if (window.twttr?.widgets) { clearInterval(iv); pronto(); }
        }, 300);
        setTimeout(() => clearInterval(iv), 10000);
      }
    };
    montar();
    return () => {
      vivo = false;
    };
  }, [tema]);

  return (
    <aside className="video-destaque" aria-label="Vídeo em destaque">
      <p className="video-rotulo">Em destaque</p>
      <div className="video-moldura"><div ref={refCaixa} className="video-escala"><div ref={ref} /></div></div>
      <a className="btn small" target="_blank" rel="noopener noreferrer" href={VIDEO_URL} aria-label="Assistir ao vídeo no X (abre em nova aba)">
        Assistir no X ↗
      </a>
    </aside>
  );
}

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
      <VideoDestaque />
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
