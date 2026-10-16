#!/usr/bin/env node
/* =====================================================================
   scripts/validar.mjs — verificação estática do Guia (roda no CI e local).

     node scripts/validar.mjs

   Confere, sem dependências externas:
     1. Manifesto (guia/deck.js): arquivos existem, sem duplicata, toda tela
        do diretório está no manifesto e toda tela interativa tem anexo
        (senão o PDF perde o conteúdo escondido).
     2. Caminhos relativos (src/href) existem — com diferença entre
        maiúsculas e minúsculas, como no GitHub Pages (Linux).
     3. Telas: lang="pt-BR", <title>, imagens com alt, scripts comuns.
     4. Nada carregado de servidor de terceiros (fontes e ícones são locais).
     5. Regra de marca: sem verde na paleta (aviso).

   Sai com código 1 se houver ERRO; AVISOS não quebram o build.
   ===================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GUIA = path.join(RAIZ, 'guia');
const erros = [];
const avisos = [];
const rel = (p) => path.relative(RAIZ, p).split(path.sep).join('/');

/* ---------- 1. manifesto ---------- */
const ctx = { window: {}, console, fetch: () => Promise.resolve({ ok: true }) };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(GUIA, 'deck.js'), 'utf8'), ctx, { filename: 'deck.js' });
const R = ctx.window.RELATORIO;
if (!R || !Array.isArray(R.blocos)) {
  erros.push('guia/deck.js: window.RELATORIO.blocos não encontrado');
} else {
  const lista = R.paraApresentacao().map((s) => s.file).concat(R.paraRelatorio());
  const vistos = new Set();
  R.paraApresentacao().forEach((s) => {
    if (vistos.has(s.file)) erros.push(`deck.js: tela duplicada na apresentação: ${s.file}`);
    vistos.add(s.file);
  });
  new Set(lista).forEach((f) => {
    if (!fs.existsSync(path.join(GUIA, f))) erros.push(`deck.js: arquivo não existe: guia/${f}`);
  });
  const telas = fs.readdirSync(GUIA).filter((f) => /^(slide|capa)-.*\.html$/.test(f));
  telas.forEach((f) => {
    if (!lista.includes(f)) avisos.push(`guia/${f} existe mas não está no deck.js (não aparece na apresentação nem no PDF)`);
    const html = fs.readFileSync(path.join(GUIA, f), 'utf8');
    const interativa = /etapa-foco|class="tile"/.test(html);
    if (interativa && !(R.anexos && R.anexos[f])) {
      erros.push(`guia/${f}: tela interativa sem entrada em "anexos" do deck.js — o PDF perderia o conteúdo escondido`);
    }
  });
}

/* ---------- 2 a 5. arquivos HTML e CSS ---------- */
function listar(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (['.git', 'node_modules', 'vendor', 'saida-testes'].includes(e.name)) return [];
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listar(p) : [p];
  });
}

/* existência com distinção de maiúsculas, segmento a segmento */
function existeExato(alvo) {
  const partes = path.relative(RAIZ, alvo).split(path.sep);
  let atual = RAIZ;
  for (const parte of partes) {
    if (parte === '..') { atual = path.dirname(atual); continue; }
    if (!fs.existsSync(atual) || !fs.statSync(atual).isDirectory()) return false;
    if (!fs.readdirSync(atual).includes(parte)) return false;
    atual = path.join(atual, parte);
  }
  return true;
}

const EXTERNO = /^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i;
const arquivos = listar(RAIZ);

arquivos.filter((f) => f.endsWith('.html')).forEach((arq) => {
  const html = fs.readFileSync(arq, 'utf8');
  const nome = rel(arq);
  const semScript = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (m) => (/\ssrc=/.test(m.split('>')[0]) ? m.split('>')[0] + '>' : ''));

  /* caminhos relativos */
  for (const m of semScript.matchAll(/\s(?:src|href)="([^"]+)"/gi)) {
    const url = m[1].trim();
    if (!url || EXTERNO.test(url) || url.includes('${')) continue;
    const limpo = decodeURI(url.split('#')[0].split('?')[0]);
    if (!limpo) continue;
    const alvo = path.resolve(path.dirname(arq), limpo);
    if (!existeExato(alvo)) erros.push(`${nome}: caminho não encontrado (atenção a maiúsculas): ${url}`);
  }

  /* recursos de terceiros: o guia funciona sem internet externa */
  for (const m of semScript.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(https?:[^"]+)"/gi)) {
    if (/rel="(?:icon|canonical)"/.test(m[0])) continue;
    erros.push(`${nome}: recurso carregado de fora do repositório: ${m[1]} (use vendor/)`);
  }

  /* acessibilidade básica */
  if (!/<html[^>]*lang="pt-BR"/i.test(html)) erros.push(`${nome}: falta <html lang="pt-BR">`);
  if (!/<title>[^<]+<\/title>/i.test(html)) erros.push(`${nome}: falta <title>`);
  for (const m of semScript.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt="/i.test(m[0])) erros.push(`${nome}: <img> sem alt: ${m[0].slice(0, 80)}`);
  }

  /* telas do guia: scripts comuns */
  if (/guia\/(slide|capa)-/.test(nome)) {
    if (!html.includes('src="a11y.js"')) erros.push(`${nome}: não carrega a11y.js (acessibilidade)`);
    if (!html.includes('src="guia.js"') && !html.includes('slide-nav')) erros.push(`${nome}: sem navegação por teclado (carregue guia.js)`);
    if (html.includes('src="guia.js"') && /addEventListener\(\s*["']keydown[\s\S]{0,200}slide-nav/.test(html)) erros.push(`${nome}: carrega guia.js e tem listener próprio de slide-nav — cada tecla avançaria duas telas`);
  }
});

/* regra de marca: sem verde (aviso) */
function matiz(hex) {
  const n = hex.length === 4 ? hex.slice(1).split('').map((c) => c + c).join('') : hex.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d < 0.12) return { h: null, s: 0 };
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return { h, s: d / (1 - Math.abs(max + min - 1) || 1) };
}
arquivos.filter((f) => /\.(html|css)$/.test(f)).forEach((arq) => {
  const txt = fs.readFileSync(arq, 'utf8');
  for (const m of txt.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)) {
    const { h, s } = matiz(m[0]);
    if (h !== null && h >= 85 && h <= 165 && s > 0.3) avisos.push(`${rel(arq)}: cor ${m[0]} é verde — a regra de marca da ANTAQ pede só a paleta azul de base.css`);
  }
});

/* ---------- relatório ---------- */
const resumo = `Telas no manifesto: ${R ? new Set(R.paraApresentacao().map((s) => s.file)).size : 0} · HTML verificados: ${arquivos.filter((f) => f.endsWith('.html')).length}`;
console.log(resumo);
avisos.forEach((a) => console.log('AVISO  ' + a));
erros.forEach((e) => console.log('ERRO   ' + e));
if (process.env.GITHUB_STEP_SUMMARY) {
  const md = [`### Verificação estática do Guia`, '', resumo, '',
    erros.length ? `**${erros.length} erro(s)**` : '**Nenhum erro.**',
    ...erros.map((e) => `- ❌ ${e}`), ...avisos.map((a) => `- ⚠️ ${a}`)].join('\n');
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
}
console.log(erros.length ? `\n${erros.length} erro(s).` : '\nTudo certo.');
process.exit(erros.length ? 1 : 0);
