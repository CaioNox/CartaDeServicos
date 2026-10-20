/* =====================================================================
   vida.js — contagem animada dos números em destaque (.indicador-valor).

   Ao abrir a tela, cada número sobe de 0 até o valor escrito no HTML.
   O valor final é sempre o do HTML: o script só anima o caminho até ele.
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

  /* Algarismos de largura fixa do início ao fim: assim o número não muda
     de largura ao parar. */
  var CSS = '.vida-num{font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1}';

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

  /* Leva todos os números ao valor final. Necessário antes de capturar a tela. */
  function finalizar() {
    emAndamento.forEach(function (registro) {
      if (!registro.encerrado) encerrar(registro);
    });
    emAndamento.length = 0;
  }

  function iniciar() {
    injetarCSS();
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

  global.Vida = { contar: contar, finalizar: finalizar, interpretar: interpretar };
})(window);
