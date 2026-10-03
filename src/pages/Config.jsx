import { useState } from 'react';
import { FiSun, FiMoon, FiTrash2, FiCheck } from 'react-icons/fi';
import { useApp } from '../store.js';

export function Config() {
  const tema = useApp((s) => s.tema);
  const alternarTema = useApp((s) => s.alternarTema);
  const escolher = (t) => {
    if ((t === 'dark') !== (tema === 'dark')) alternarTema();
  };
  const [limpo, setLimpo] = useState(false);
  const apagar = () => {
    try {
      sessionStorage.clear();
    } catch {}
    setLimpo(true);
    setTimeout(() => setLimpo(false), 2500);
  };

  return (
    <section aria-label="Configurações" className="pagina">
      <h2>Configurações</h2>
      <p className="meta">Aparência e dados salvos neste aparelho.</p>

      <div className="vidro">
        <h3><FiSun aria-hidden="true" /> Aparência</h3>
        <p className="meta">Escolha o tema do app. Fica salvo neste aparelho.</p>
        <div className="seg" role="group" aria-label="Tema">
          <button className={tema === 'light' ? 'ativo' : ''} aria-pressed={tema === 'light'} onClick={() => escolher('light')}>
            <FiSun aria-hidden="true" /> Claro
          </button>
          <button className={tema === 'dark' ? 'ativo' : ''} aria-pressed={tema === 'dark'} onClick={() => escolher('dark')}>
            <FiMoon aria-hidden="true" /> Escuro
          </button>
        </div>
      </div>

      <div className="vidro">
        <h3><FiTrash2 aria-hidden="true" /> Privacidade e dados</h3>
        <p className="meta">
          Sem login e sem rastreadores. O contador de visitas registra 1 vez por sessão e guarda
          só o total e o acumulado por cidade (sem IP, sem nome). Nada fica ligado a você.
        </p>
        <button className="btn" onClick={apagar} aria-live="polite">
          {limpo ? <><FiCheck aria-hidden="true" /> Dados apagados ✓</> : <><FiTrash2 aria-hidden="true" /> Apagar dados desta sessão</>}
        </button>
      </div>
    </section>
  );
}
