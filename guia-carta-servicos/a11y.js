/* =====================================================================
   a11y.js — apoio a leitores de tela e atalho de teclado.

   Carregado pelas telas e pelos visualizadores (index.html e relatorio.html).

   A11y.announce(texto)  lê o texto em voz alta pelo leitor de tela, sem
                         mover o foco (região aria-live "polite").
   Ctrl+M (ou Cmd+M)     dentro do visualizador, volta ao menu inicial.
   ===================================================================== */
(function (global) {
  'use strict';

  function regiaoDeAnuncio() {
    var el = document.getElementById('a11yLiveRegion');
    if (!el) {
      el = document.createElement('div');
      el.id = 'a11yLiveRegion';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      el.className = 'sr-only';
      document.body.appendChild(el);
    }
    return el;
  }

  function announce(mensagem) {
    var el = regiaoDeAnuncio();
    /* esvaziar e preencher de novo faz o leitor repetir a mesma frase */
    el.textContent = '';
    global.setTimeout(function () { el.textContent = mensagem; }, 50);
  }

  global.A11y = { announce: announce };

  /* A tela roda dentro de um iframe e recebe o teclado; sem isto, o atalho
     só funcionaria com o foco fora da tela. */
  if (global.parent !== global) {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        global.parent.postMessage({ type: 'go-menu' }, '*');
      }
    });
  }
})(window);
