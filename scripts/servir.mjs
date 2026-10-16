#!/usr/bin/env node
/* Servidor estático local, sem dependências:  npm run servir  →  http://localhost:8000
   (os slides usam iframes e fetch, então não abra os arquivos por file://) */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTA = Number(process.env.PORTA || 8000);
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' };

http.createServer((req, res) => {
  let arq = path.join(RAIZ, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!arq.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(arq) && fs.statSync(arq).isDirectory()) arq = path.join(arq, 'index.html');
  if (!fs.existsSync(arq)) { res.writeHead(404).end('Não encontrado'); return; }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arq).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(arq).pipe(res);
}).listen(PORTA, () => console.log(`Guia em http://localhost:${PORTA}/  (Ctrl+C para parar)`));
