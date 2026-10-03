// Contador de visitas com "banco de dados" em arquivo .txt (Vercel Blob).
// O arquivo visitas.txt guarda SÓ acumulados (nunca cresce sem fim):
//
//   TOTAL=1234
//   São Luís|Maranhão|BR=57
//   Imperatriz|Maranhão|BR=12
//
// Cada lugar tem 1 linha: visitas novas do mesmo lugar apenas SOMAM.
// Por privacidade (LGPD) NÃO guardamos IP, hora nem página — só o total e o
// acumulado por cidade/região/país. A origem vem dos headers gratuitos da
// Vercel, sem API externa.
import { head, put } from '@vercel/blob';

const ARQUIVO = 'visitas.txt';
const MAX_LOCAIS = 500; // teto de segurança: descarta os menores se passar disso

const limpo = (v) => decodeURIComponent(v || '').replace(/[\r\n|=]/g, '').trim().slice(0, 80) || 'N/D';

async function lerTexto(token) {
  try {
    const meta = await head(ARQUIVO, { token });
    // O put sobrescreve mantendo a MESMA url: sem o carimbo abaixo o CDN
    // entrega conteúdo antigo e o selo chega a exibir um total menor.
    const r = await fetch(`${meta.url}?v=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null; // arquivo ainda não existe: começa do zero
  }
}

export function parse(conteudo) {
  let total = 0;
  const locais = new Map(); // "cidade|regiao|pais" -> visitas
  if (conteudo) {
    for (const linha of conteudo.split('\n')) {
      const l = linha.trim();
      if (!l) continue;
      if (l.startsWith('TOTAL=')) {
        total = parseInt(l.replace('TOTAL=', ''), 10) || 0;
      } else {
        const i = l.lastIndexOf('=');
        if (i > 0) locais.set(l.slice(0, i), parseInt(l.slice(i + 1), 10) || 0);
      }
    }
  }
  return { total, locais };
}

export function serialize(total, locais) {
  const top = [...locais.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_LOCAIS);
  return `TOTAL=${total}\n${top.map(([k, v]) => `${k}=${v}`).join('\n')}\n`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return res.status(500).json({ erro: 'Contador não configurado (falta BLOB_READ_WRITE_TOKEN).' });
  }
  try {
    const { total, locais } = parse(await lerTexto(token));

    if (req.method === 'POST') {
      // Soma +1 no total e +1 no acumulado do lugar de origem
      const chave = `${limpo(req.headers['x-vercel-ip-city'])}|${limpo(req.headers['x-vercel-ip-country-region'])}|${limpo(req.headers['x-vercel-ip-country'])}`;
      const novoTotal = total + 1;
      locais.set(chave, (locais.get(chave) || 0) + 1);
      await put(ARQUIVO, serialize(novoTotal, locais), {
        access: 'public',
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: 'text/plain; charset=utf-8',
        token,
      });
      const [cidade, regiao, pais] = chave.split('|');
      return res.status(200).json({ total: novoTotal, cidade, regiao, pais });
    }

    return res.status(200).json({ total });
  } catch {
    return res.status(500).json({ erro: 'Falha no contador.' });
  }
}
