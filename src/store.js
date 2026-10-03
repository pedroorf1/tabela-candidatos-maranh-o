import { create } from 'zustand';

// Estado global (zustand). Sem persist middleware de propósito:
// tema e fonte nascem DO DOM (script anti-FOUC do <head> + localStorage
// síncrono), sem reidratação assíncrona e sem flash. Busca e filtros são
// transientes — deep-link nunca abre com lista filtrada.
const root = () => document.documentElement;

export const useApp = create((set) => ({
  tema: root().getAttribute('data-theme') || 'light',
  alternarTema: () =>
    set((s) => {
      const t = s.tema === 'light' ? 'dark' : 'light';
      root().setAttribute('data-theme', t);
      try {
        localStorage.setItem('ma22-theme', t);
      } catch {}
      return { tema: t };
    }),

  // Filtros da página Candidatos (transientes)
  busca: '',
  cargo: '',
  filtroInd: '',
  preset: 'todos',
  ordem: 'cargo',
  setFiltro: (patch) => set(patch),
  limparBusca: () => set({ busca: '', cargo: '', filtroInd: '', preset: 'todos' }),

  // Último candidato aberto (para devolver o foco ao voltar da ficha)
  ultimoNum: null,
  setUltimo: (ultimoNum) => set({ ultimoNum }),
}));
