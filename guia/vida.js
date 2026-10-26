/* =====================================================================
   vida.js — movimento das telas (trazido do Relatório da Ouvidoria).

   Ao abrir a tela:
     - cada número em destaque (.indicador-valor) sobe de 0 até o valor do HTML;
     - o título (.pagina-titulo) entra uma palavra de cada vez;
     - os cartões de cada .grade entram em cascata, um depois do outro.
   O estado final é sempre o do HTML: o script só anima o caminho até ele.
   Com "reduzir movimento" ligado no sistema, nada é animado.

   API (usada por relatorio.html antes de gerar o PDF e o PPTX):
     Vida.finalizar()  mostra o valor final de todos os números na hora.
     Vida.contar(el)   anima um elemento específico.
   ===================================================================== */
(function (global) {
  'use strict';

  /* Elementos animados. data-vida permite animar um número fora dos indicadores. */
  var ALVOS = '.indicador-valor, [data-vida]';
  var DURACAO_MS = 1600;
  /* intervalo entre um número e o próximo da mesma tela, para entrarem em cascata */
  var ATRASO_MS = 90;

  /* Título palavra a palavra: só em título de texto puro e curto. */
  var TITULO = '.pagina-titulo';
  var MAX_PALAVRAS = 12;

  /* Cartões em cascata: filhos diretos das grades. */
  var CASCATA = '.grade';
  var CASCATA_ATRASO_MS = 90;

  /* Algarismos de largura fixa do início ao fim: assim o número não muda
     de largura ao parar. As entradas usam fill-mode "backwards": ao terminar,
     o elemento volta a obedecer só ao CSS da tela. ".vida-parado" (posto por
     finalizar) desliga tudo para a captura do PDF e do PPTX. */
  var CSS =
    '.vida-num{font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1}' +
    '.vida-p{display:inline-block;animation:vidaSobe .52s cubic-bezier(.2,.7,.3,1) backwards;' +
    'animation-delay:calc(var(--vp,0) * 58ms)}' +
    '.vida-cascata{animation:vidaSobe .5s cubic-bezier(.2,.7,.3,1) backwards;' +
    'animation-delay:calc(150ms + var(--vc,0) * ' + CASCATA_ATRASO_MS + 'ms)}' +
    '@keyframes vidaSobe{from{opacity:0;transform:translateY(.4em)}to{opacity:1;transform:none}}' +
    '.vida-parado .vida-p,.vida-parado .vida-cascata,.vida-parado .pagina-conteudo' +
    '{animation:none!important;opacity:1!important;transform:none!important}';

  var emAndamento = [];

  function movimentoReduzido() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function injetarCSS() {
    if (document.getElementById('vidaCSS')) return;
    var estilo = document.createElement('style');
    estilo.id = 'vidaCSS';
    estilo.textContent = CSS;
    document.head.appendChild(estilo);
  }

  /* Lê um número escrito em pt-BR: "10.233" -> 10233; "13,9" -> 13.9.
     Devolve null se o texto não for só um número (ex.: "01", "05/2018"). */
  function interpretar(texto) {
    var t = (texto || '').trim();
    if (!t || !/\d/.test(t)) return null;
    if (/^0\d/.test(t)) return null;                  /* ordinal: "01", "02" */
    if (/[\/\-–—a-zA-ZÀ-ÿ]/.test(t)) return null;     /* data ou texto misto */

    var virgula = t.lastIndexOf(',');
    var casas = virgula === -1 ? 0 : t.length - virgula - 1;
    var valor = parseFloat(t.replace(/\./g, '').replace(',', '.'));
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

  /* Anima um número. Devolve true se a animação começou. */
  function contar(el, atrasoMs) {
    if (el.dataset.vidaFeito) return false;
    el.dataset.vidaFeito = '1';

    var numero = interpretar(el.textContent);
    if (numero === null) return false;

    var original = el.textContent;

    /* leitor de tela recebe só o valor final, uma vez */
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', original.trim());
    if (movimentoReduzido()) return false;

    /* oculto do leitor de tela só enquanto o número corre */
    el.setAttribute('aria-hidden', 'true');

    /* Reserva a largura do valor final para o número não empurrar o
       texto ao lado enquanto sobe. */
    if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
    var largura = el.getBoundingClientRect().width;
    if (largura) el.style.minWidth = largura.toFixed(2) + 'px';

    el.classList.add('vida-num');
    el.textContent = formatar(0, numero.casas, numero.milhar);

    var registro = { el: el, texto: original, encerrado: false };
    emAndamento.push(registro);
    var inicio = null;

    function quadro(agora) {
      if (registro.encerrado) return;
      if (inicio === null) inicio = agora;
      var progresso = Math.min(Math.max((agora - inicio - (atrasoMs || 0)) / DURACAO_MS, 0), 1);
      var suavizado = 1 - Math.pow(1 - progresso, 5);   /* desacelera no fim */
      el.textContent = formatar(numero.valor * suavizado, numero.casas, numero.milhar);
      if (progresso < 1) requestAnimationFrame(quadro);
      else encerrar(registro);
    }
    requestAnimationFrame(quadro);
    return true;
  }

  function encerrar(registro) {
    registro.encerrado = true;
    registro.el.textContent = registro.texto;
    registro.el.removeAttribute('aria-hidden');
  }

  /* Leva tudo ao estado final. Necessário antes de capturar a tela. */
  function finalizar() {
    emAndamento.forEach(function (registro) {
      if (!registro.encerrado) encerrar(registro);
    });
    emAndamento.length = 0;
    document.documentElement.classList.add('vida-parado');
  }

  /* O título sobe uma palavra de cada vez. O texto não muda: cada palavra
     vira um <span> e o leitor de tela continua lendo a frase inteira. */
  function revelarTitulo() {
    if (movimentoReduzido()) return;
    var el = document.querySelector(TITULO);
    if (!el || el.dataset.vidaTitulo || el.children.length) return;

    var texto = el.textContent.replace(/\s+/g, ' ').trim();
    var palavras = texto.split(' ');
    if (!texto || palavras.length > MAX_PALAVRAS) return;

    el.dataset.vidaTitulo = '1';
    el.setAttribute('aria-label', texto);
    el.textContent = '';
    palavras.forEach(function (palavra, i) {
      var span = document.createElement('span');
      span.className = 'vida-p';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--vp', i);
      span.textContent = palavra;
      el.appendChild(span);
      if (i < palavras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  /* Os cartões de cada grade entram um depois do outro. */
  function cascata() {
    if (movimentoReduzido()) return;
    document.querySelectorAll(CASCATA).forEach(function (grade) {
      Array.prototype.forEach.call(grade.children, function (filho, i) {
        filho.classList.add('vida-cascata');
        filho.style.setProperty('--vc', i);
      });
    });
  }

  function iniciar() {
    injetarCSS();
    revelarTitulo();
    cascata();
    var animados = 0;
    document.querySelectorAll(ALVOS).forEach(function (el) {
      if (contar(el, animados * ATRASO_MS)) animados++;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  /* impressão e exportação precisam do valor final */
  global.addEventListener('beforeprint', finalizar);
  global.addEventListener('message', function (e) {
    if (e.data && e.data.tipo === 'vida:finalizar') finalizar();
  });

  global.Vida = { contar: contar, finalizar: finalizar, interpretar: interpretar, revelarTitulo: revelarTitulo };
})(window);
