import { useEffect, useState } from 'react';

// Selo discreto de visitas (canto inferior direito).
// Conta 1x por sessão (sessionStorage) e só aparece se o contador responder;
// offline ou sem configuração, some silenciosamente sem quebrar o app.
export default function Visitas() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    let vivo = true;
    let primeira = true;
    try {
      if (sessionStorage.getItem('ma22-visitou')) primeira = false;
      else sessionStorage.setItem('ma22-visitou', '1');
    } catch { primeira = true; }
    (async () => {
      try {
        const pagina = window.location.pathname + window.location.search;
        const url = primeira ? `/api/contador?pagina=${encodeURIComponent(pagina)}` : '/api/contador';
        const r = await fetch(url, { method: primeira ? 'POST' : 'GET' });
        if (!r.ok) return;
        const j = await r.json();
        if (vivo && typeof j.total === 'number') setTotal(j.total);
      } catch { /* sem rede / sem token: esconde o selo */ }
    })();
    return () => { vivo = false; };
  }, []);

  if (total === null) return null;
  return (
    <div className="visitas" title="Visitas registradas neste site">
      👁 {total.toLocaleString('pt-BR')} visitas
    </div>
  );
}
