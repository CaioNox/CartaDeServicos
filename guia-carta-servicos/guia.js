/* =====================================================================
   guia.js — comportamento comum das telas do guia (carregado com defer).

   1. Teclado: as teclas de navegação (setas, Page Up/Down, Home, End,
      espaço e F) são repassadas ao visualizador (index.html), que troca
      de tela. É o único listener que envia "slide-nav": um segundo
      listener faria cada tecla avançar duas telas.
   2. Atalhos: um elemento com data-ir="slide-NN.html" abre aquela tela.
      Dentro do visualizador, o pedido vai por postMessage; aberta
      sozinha, a tela navega direto para o arquivo.

   Sem JavaScript, todo o conteúdo continua visível.
   ===================================================================== */
(function () {
  'use strict';

  var TECLAS_DE_NAVEGACAO = ['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'f', 'F'];
  var dentroDoVisualizador = window.parent !== window;

  function avisarVisualizador(mensagem) {
    if (dentroDoVisualizador) window.parent.postMessage(mensagem, '*');
  }

  /* ---------- 2. atalhos para outras telas ---------- */

  function abrirTela(arquivo) {
    if (!arquivo) return;
    if (dentroDoVisualizador) avisarVisualizador({ type: 'slide-goto-file', file: arquivo });
    else window.location.href = arquivo;
  }

  document.querySelectorAll('[data-ir]').forEach(function (el) {
    var nativo = el.tagName === 'BUTTON' || el.tagName === 'A';

    /* Um <section> ou <div> clicável precisa receber foco e responder
       a Enter e espaço, como um link. */
    if (!nativo) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'link');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirTela(el.dataset.ir);
        }
      });
    }

    el.addEventListener('click', function (e) {
      /* no <a>, o href serve de reserva sem JavaScript */
      if (el.tagName === 'A') e.preventDefault();
      abrirTela(el.dataset.ir);
    });
  });

  /* ---------- 1. teclado ---------- */

  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented) return;

    var alvo = e.target;
    var tag = alvo && alvo.tagName;

    /* em campos de formulário, as teclas pertencem ao campo */
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (alvo && alvo.isContentEditable)) return;

    /* espaço em botões, links e caixas de seleção aciona o próprio elemento */
    if (e.key === ' ' && alvo && alvo.closest && alvo.closest('button, a, [data-ir], label')) return;

    if (TECLAS_DE_NAVEGACAO.indexOf(e.key) === -1) return;
    e.preventDefault();
    avisarVisualizador({ type: 'slide-nav', key: e.key });
  });
})();
