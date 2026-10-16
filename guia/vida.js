/* vida.js — melhorias aditivas de movimento para os slides do Relatório da Ouvidoria ANTAQ.
 *
 * Não remove, não substitui e não altera nenhum estilo existente.
 * O estado final de qualquer elemento é idêntico ao que já estava no HTML.
 *
 * Uso:  <script src="vida.js" defer></script>   (depois de a11y.js)
 *
 * API:  Vida.finalizar()  — força todos os números para o valor final.
 *                           Chame antes de html2canvas / exportação PPTX.
 *       Vida.contar(el)   — inicia a contagem num elemento específico.
 */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Configuração
   * ------------------------------------------------------------------ */

  var ALVOS = '.kpi-num, .metric-value, .lb-num, .hero-num, .m-val, [data-vida]';
  var DURACAO = 1600;

  /* Escalonamento entre os números do mesmo slide, para entrarem em
     cascata em vez de subirem todos travados no mesmo frame. */
  var ATRASO = 90;

  /* Elementos que rodam animação em loop ganham promoção de camada.
     Puramente de performance — o resultado visual é idêntico. */
  var GPU = '.ocean, .wave, .wave-1, .wave-2, .wave-3, .nav-wave, .qr-ring';

  var CSS =
    /* algarismos de largura fixa, do inicio ao fim: se isto valesse so
       durante a contagem, o numero mudaria de espacamento ao parar */
    '.vida-num{font-variant-numeric:tabular-nums;' +
    'font-feature-settings:"tnum" 1}' +
    '.vida-gpu{will-change:transform;backface-visibility:hidden}' +
    '.vida-p{display:inline-block;opacity:0;transform:translateY(.34em);' +
    'animation:vidaPalavra .52s cubic-bezier(.2,.7,.3,1) both;' +
    'animation-delay:calc(var(--vp,0) * 58ms)}' +
    '@keyframes vidaPalavra{to{opacity:1;transform:none}}' +
    '.vida-parado .vida-p{opacity:1!important;transform:none!important;' +
    'animation:none!important}';

  var pendentes = [];

  /* ------------------------------------------------------------------ *
   * Utilidades
   * ------------------------------------------------------------------ */

  function reduzido() {
    return global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function injetarCSS() {
    if (document.getElementById('vidaCSS')) return;
    var s = document.createElement('style');
    s.id = 'vidaCSS';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* Interpreta número no formato pt-BR: "10.233" -> 10233 ; "13,9" -> 13.9
     Devolve null quando o conteúdo não é um número puro. */
  function interpretar(txt) {
    var t = (txt || '').trim();
    if (!t) return null;

    /* Descarta ordinais ("01", "02"), datas ("05/2018") e texto misto. */
    if (/^0\d/.test(t)) return null;
    if (/[\/\-–—a-zA-ZÀ-ÿ]/.test(t)) return null;
    if (!/\d/.test(t)) return null;

    var casas = 0;
    var virgula = t.lastIndexOf(',');
    if (virgula !== -1) casas = t.length - virgula - 1;

    var puro = t.replace(/\./g, '').replace(',', '.');
    var valor = parseFloat(puro);
    if (isNaN(valor)) return null;

    return { valor: valor, casas: casas, milhar: t.indexOf('.') !== -1 };
  }

  function formatar(n, casas, milhar) {
    return n.toLocaleString('pt-BR', {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas,
      useGrouping: milhar
    });
  }

  /* ------------------------------------------------------------------ *
   * Contagem
   * ------------------------------------------------------------------ */

  function contar(el, atraso) {
    if (el.dataset.vidaFeito) return false;

    var info = interpretar(el.textContent);
    if (info === null) { el.dataset.vidaFeito = '1'; return false; }

    var original = el.textContent;
    el.dataset.vidaFeito = '1';
    el.dataset.vidaFinal = original;

    /* Leitores de tela recebem só o valor final, uma vez. */
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', original.trim());

    if (reduzido()) return false;

    /* aria-hidden vale só enquanto o número corre; ao terminar ele sai, senão
       o valor final ficaria invisível para o leitor de tela. */
    el.setAttribute('aria-hidden', 'true');

    /* O elemento ainda mostra o valor final: e a hora de medir. A largura
       fica reservada e os algarismos passam a ter largura fixa, entao o
       numero nao muda de espacamento nem sai do lugar enquanto sobe —
       o estado durante a contagem e o estado final sao identicos. */
    if (global.getComputedStyle && getComputedStyle(el).display === 'inline') {
      el.style.display = 'inline-block';
    }
    var largura = el.getBoundingClientRect().width;
    if (largura) el.style.minWidth = largura.toFixed(2) + 'px';

    el.classList.add('vida-num', 'vida-contando');
    el.textContent = formatar(0, info.casas, info.milhar);

    var t0 = null;
    var espera = atraso || 0;
    var reg = { el: el, texto: original };
    pendentes.push(reg);

    function passo(t) {
      if (reg.cancelado) return;
      if (t0 === null) t0 = t;
      var p = Math.min(Math.max((t - t0 - espera) / DURACAO, 0), 1);
      var e = 1 - Math.pow(1 - p, 5);            /* easeOutQuint */
      el.textContent = formatar(info.valor * e, info.casas, info.milhar);
      if (p < 1) {
        requestAnimationFrame(passo);
      } else {
        el.textContent = original;               /* volta ao HTML original */
        el.classList.remove('vida-contando');
        el.removeAttribute('aria-hidden');
        reg.cancelado = true;
      }
    }
    requestAnimationFrame(passo);
    return true;
  }

  /* Força tudo para o estado final. Necessário antes de capturar imagem. */
  function finalizar() {
    pendentes.forEach(function (reg) {
      if (reg.cancelado) return;
      reg.cancelado = true;
      reg.el.textContent = reg.texto;
      reg.el.classList.remove('vida-contando');
      reg.el.removeAttribute('aria-hidden');
    });
    pendentes.length = 0;
    document.documentElement.classList.add('vida-parado');
  }

  /* ------------------------------------------------------------------ *
   * Título palavra a palavra
   * ------------------------------------------------------------------ *
   * O título do slide sobe uma palavra de cada vez, em vez de aparecer
   * inteiro de uma vez. O texto não muda: cada palavra vira um <span>,
   * e a acessibilidade continua lendo a mesma frase.
   * ------------------------------------------------------------------ */

  var TITULO = '.text-3xl.font-montserrat';
  var MAX_PALAVRAS = 12;

  function revelarTitulo() {
    if (reduzido()) return;

    var el = document.querySelector(TITULO);
    if (!el || el.dataset.vidaTitulo) return;

    /* só mexe em título de texto puro: com <br>, <b> ou ícone dentro,
       dividir em palavras mudaria a marcação — nesses casos, não faz nada. */
    if (el.children.length) return;

    var texto = el.textContent.replace(/\s+/g, ' ').trim();
    var palavras = texto.split(' ');
    if (!texto || palavras.length > MAX_PALAVRAS) return;

    el.dataset.vidaTitulo = '1';
    el.setAttribute('aria-label', texto);
    el.textContent = '';

    palavras.forEach(function (palavra, i) {
      var span = document.createElement('span');
      span.className = 'vida-p';
      span.style.setProperty('--vp', i);
      span.textContent = palavra;
      el.appendChild(span);
      if (i < palavras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  /* ------------------------------------------------------------------ *
   * Performance — sem efeito visual
   * ------------------------------------------------------------------ */

  function promoverCamadas() {
    var vistos = {};
    document.querySelectorAll(GPU).forEach(function (el) {
      el.classList.add('vida-gpu');
    });
    /* Qualquer elemento com animação em loop também entra. */
    document.querySelectorAll('[class]').forEach(function (el) {
      var chave = el.className;
      if (typeof chave !== 'string' || vistos[chave] === false) return;
      var cs = getComputedStyle(el);
      if (cs.animationIterationCount.indexOf('infinite') !== -1) {
        el.classList.add('vida-gpu');
        vistos[chave] = true;
      } else {
        vistos[chave] = false;
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Inicialização
   * ------------------------------------------------------------------ */

  function iniciar() {
    injetarCSS();
    promoverCamadas();
    revelarTitulo();
    var n = 0;
    document.querySelectorAll(ALVOS).forEach(function (el) {
      if (contar(el, n * ATRASO)) n++;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

  /* A captura para PPTX e a impressão precisam do valor final. */
  global.addEventListener('beforeprint', finalizar);
  global.addEventListener('message', function (e) {
    if (e.data && e.data.tipo === 'vida:finalizar') finalizar();
  });

  global.Vida = {
    contar: contar, finalizar: finalizar, interpretar: interpretar,
    revelarTitulo: revelarTitulo
  };
})(window);
