// Indicados para votar no Maranhão (indicação editorial deste painel —
// NÃO é pesquisa eleitoral nem dado do TSE; cada dado factual abaixo foi
// verificado: Gazeta/ND Mais/O Globo (Roberto Rocha PRTB 28), planilha
// PL-MA (Mariana 2210), TSE via Valor (Lahesio NOVO 300), CNN/G1
// (Flávio PL 22 à Presidência), Minha Colinha/TRE-MA (Cidônio 222).
export const INDICADOS = [
  {
    numero: '22', nome: 'Flávio Bolsonaro', cargo: 'Presidente', partido: 'PL', uf: 'BR',
    status: 'Deferido', destino: '/redes', destinoRotulo: 'Ver nas redes',
    foto: '/fotos/flavio-bolsonaro.jpg', credito: 'Foto: Agência Senado',
  },
  {
    numero: '28', nome: 'Roberto Rocha', cargo: 'Governador', partido: 'PRTB', uf: 'MA',
    status: 'Confira a situação no TSE',
    detalhe: 'Vice: Pastor Josias',
    destino: 'https://sig.tse.jus.br/ords/dwapr/f?p=1002:20', destinoRotulo: 'Conferir no TSE', externo: true,
    foto: '/fotos/roberto-rocha.jpg', credito: 'Foto: TSE',
  },
  {
    numero: '222', nome: 'Cidônio Gonçalves', cargo: 'Senador', partido: 'PL', uf: 'MA',
    status: 'Deferido', destino: '/candidato/222', destinoRotulo: 'Abrir ficha',
    foto: '/fotos/cidonio-goncalves.jpg', credito: 'Foto: TSE',
  },
  {
    numero: '300', nome: 'Lahesio Bonfim', cargo: 'Senador', partido: 'NOVO', uf: 'MA',
    status: 'Deferido', destino: '/pesquisas', destinoRotulo: 'Ver pesquisas',
    foto: '/fotos/lahesio-bonfim.jpg', credito: 'Foto: TSE',
  },
  {
    numero: '2210', nome: 'Mariana Carvalho', cargo: 'Deputada Federal', partido: 'PL', uf: 'MA',
    status: 'Deferida', destino: '/candidato/2210', destinoRotulo: 'Abrir ficha',
    foto: '/fotos/mariana-carvalho.jpg', credito: 'Foto: TSE',
  },
];
