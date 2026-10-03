// Banner com foto real da bandeira (public/faixa-bandeira.png):
// a img sempre pega 100% da largura; o que passar na altura fica
// escondido dentro do painel (overflow hidden). Texto segue em HTML.
export default function Faixa() {
  return (
    <div className="faixa">
      <img className="faixa-img" src="/faixa-bandeira.jpg" alt="" aria-hidden="true" />
      <div className="faixa-txt">
        <h1>Maranhão candidatos e suas possibilidades de eleição</h1>
        <p>PL Maranhão 2026 · deputado federal, deputado estadual e senador · corte 03/10/2026 · 1º turno 04/10/2026</p>
        <span className="badge">41 candidatos</span>
      </div>
    </div>
  );
}
