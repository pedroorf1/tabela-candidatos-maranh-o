import { NIVEL_META } from '../lib/indicador.js';

// Selo do indicador: ícone + texto (nunca só cor).
export default function Selo({ ind }) {
  const meta = NIVEL_META[ind.nivel] || {};
  return (
    <span className={`tag ${ind.nivel}`} aria-label={`Possibilidade: ${ind.rotulo}`}>
      <span aria-hidden="true">{meta.icone}</span> {ind.rotulo}
    </span>
  );
}
