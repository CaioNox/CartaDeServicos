#!/usr/bin/env node
/* =====================================================================
   scripts/testar-telas.mjs — teste de tela no navegador (Playwright).

     npm install          # uma vez (instala o Playwright)
     npx playwright install chromium
     npm run testar       # ou: node scripts/testar-telas.mjs

   Sobe um servidor estático local, abre cada tela do deck.js em 1920×1080
   e falha se houver: erro de JavaScript, arquivo que não carrega, ou
   conteúdo saindo da tela (overflow). Também confere o visualizador
   (etapas internas) e a versão A4. Salva uma captura de cada tela em
   saida-testes/ (o CI publica como artefato).
   ===================================================================== */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PASTA = 'guia';
const SAIDA = path.join(RAIZ, 'saida-testes');
fs.mkdirSync(SAIDA, { recursive: true });

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain',
};
const servidor = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let arq = path.join(RAIZ, url);
  if (!arq.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(arq) && fs.statSync(arq).isDirectory()) arq = path.join(arq, 'index.html');
  if (!fs.existsSync(arq)) { res.writeHead(404).end('404'); return; }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arq).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(arq).pipe(res);
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const BASE = `http://127.0.0.1:${servidor.address().port}/`;

const ctx = { window: {}, console, fetch: () => Promise.resolve({ ok: true }) };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ, PASTA, 'deck.js'), 'utf8'), ctx);
const telas = ctx.window.RELATORIO.paraApresentacao().map((s) => s.file);

const falhas = [];
const browser = await chromium.launch();
const pagina = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })).newPage();
let atual = '';
pagina.on('pageerror', (e) => falhas.push(`${atual}: erro de JavaScript: ${e.message}`));
pagina.on('requestfailed', (r) => falhas.push(`${atual}: não carregou ${r.url()}`));
pagina.on('response', (r) => { if (r.status() >= 400) falhas.push(`${atual}: HTTP ${r.status()} em ${r.url()}`); });

for (const f of telas) {
  atual = f;
  await pagina.goto(BASE + PASTA + '/' + f, { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(300);
  const fora = await pagina.evaluate(() => {
    const out = [];
    const rodape = document.querySelector('.pagina-rodape');
    const limite = rodape ? rodape.getBoundingClientRect().top : window.innerHeight;
    document.querySelectorAll('.pagina-conteudo *').forEach((el) => {
      if (el.closest('[hidden], .etapa-foco:not(.ativa)')) return;
      const r = el.getBoundingClientRect();
      if (r.width && (r.bottom > limite + 1 || r.right > window.innerWidth + 1)) {
        out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`);
      }
    });
    const c = document.querySelector('.pagina-conteudo');
    return { n: out.length, ex: out.slice(0, 3), rolagem: c ? c.scrollHeight - c.clientHeight : 0 };
  });
  if (fora.n || fora.rolagem > 2) falhas.push(`${f}: conteúdo sai da tela (${fora.ex.join(', ') || 'rolagem ' + fora.rolagem + 'px'})`);
  await pagina.screenshot({ path: path.join(SAIDA, f.replace('.html', '.png')) });
}

/* visualizador: as setas percorrem as etapas internas antes de trocar de tela */
const comEtapas = telas.find((f) => fs.readFileSync(path.join(RAIZ, PASTA, f), 'utf8').includes('passo-btn'));
if (comEtapas) {
  atual = 'index.html';
  await pagina.goto(BASE + PASTA + '/index.html?tela=' + comEtapas.replace('.html', ''), { waitUntil: 'networkidle' });
  await pagina.keyboard.press('Escape');
  await pagina.waitForTimeout(600);
  const antes = await pagina.textContent('#pageInfo');
  await pagina.keyboard.press('ArrowRight');
  await pagina.waitForTimeout(500);
  const depois = await pagina.textContent('#pageInfo');
  if (antes !== depois) falhas.push(`visualizador: em ${comEtapas}, a seta trocou de tela em vez de avançar a etapa (${antes} → ${depois})`);
}

/* versão A4: uma página por tela + anexos */
atual = 'relatorio.html';
await pagina.goto(BASE + PASTA + '/relatorio.html', { waitUntil: 'networkidle' });
await pagina.waitForTimeout(1500);
const paginasA4 = await pagina.locator('.page').count();
if (paginasA4 < ctx.window.RELATORIO.paraRelatorio().length) falhas.push(`relatorio.html: ${paginasA4} páginas para ${ctx.window.RELATORIO.paraRelatorio().length} telas`);

await browser.close();
servidor.close();

const resumo = `${telas.length} telas testadas · ${paginasA4} páginas A4 · ${falhas.length} falha(s)`;
console.log(resumo);
falhas.forEach((f) => console.log('FALHA  ' + f));
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Teste das telas\n\n${resumo}\n\n${falhas.map((f) => '- ❌ ' + f).join('\n')}\n`);
}
process.exit(falhas.length ? 1 : 0);
