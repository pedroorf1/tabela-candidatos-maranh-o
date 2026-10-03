import { useState } from 'react';
import { indicador } from '../lib/indicador.js';

export function urlCandidato(c) {
  return `${window.location.origin}/candidato/${encodeURIComponent(c.numero)}`;
}

export function textoCandidato(c) {
  const ind = indicador(c);
  return `${c.nome} (${c.numero} – ${c.cargo}, PL-MA) — Maranhão candidatos e suas possibilidades de eleição: ${ind.rotulo}. ${ind.motivo}`;
}

export default function Share({ candidato }) {
  const [copiado, setCopiado] = useState(false);
  const compartilhar = async () => {
    const url = candidato ? urlCandidato(candidato) : window.location.href;
    const text = candidato ? textoCandidato(candidato) : 'Maranhão candidatos e suas possibilidades de eleição: 41 candidatos do PL, pesquisas do Senado e Justiça Eleitoral. Veja:';
    if (navigator.share) {
      try { await navigator.share({ title: document.title, text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
    catch { window.prompt('Copie o link para compartilhar:', `${text} ${url}`); }
  };
  const url = candidato ? urlCandidato(candidato) : (typeof window !== 'undefined' ? window.location.href : '');
  const text = candidato ? textoCandidato(candidato) : 'Maranhão candidatos e suas possibilidades de eleição';
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return (
    <div className="share-row" role="group" aria-label="Compartilhar">
      <button className="btn primary" onClick={compartilhar} aria-live="polite">{copiado ? 'Link copiado ✓' : 'Compartilhar'}</button>
      <a className="btn" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${t}%20${u}`} aria-label="Compartilhar no WhatsApp">WhatsApp</a>
      <a className="btn" target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${t}&url=${u}`} aria-label="Compartilhar no X">X</a>
      <a className="btn" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} aria-label="Compartilhar no Facebook">Facebook</a>
      <a className="btn" target="_blank" rel="noopener noreferrer" href={`https://t.me/share/url?url=${u}&text=${t}`} aria-label="Compartilhar no Telegram">Telegram</a>
    </div>
  );
}

