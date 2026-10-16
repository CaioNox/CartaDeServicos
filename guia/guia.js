/* =====================================================================
   guia.js — comportamento comum das telas do Guia (carregado com defer).

   1. Navegação: repassa ao visualizador (index.html) as teclas ← → etc.,
      como o listener inline dos relatórios.
   2. Atalhos [data-ir="arquivo.html"]: pedem ao visualizador para abrir
      aquela tela (mensagem slide-goto-file, imune a reordenar o deck.js).
   3. Etapas internas (.passo-btn + .etapa-foco): uma etapa por vez; as
      setas e os cliques laterais percorrem as etapas antes de trocar de
      tela (protocolo slide-etapas / deck-key do visualizador).
      API: window.Guia.irPara(n).
   4. Normas (.tile): o clique abre e fecha o detalhe.

   Tudo é aditivo: sem JavaScript o conteúdo aparece inteiro e a versão A4
   (relatorio.html) lê as etapas escondidas pelos `anexos` do deck.js.
   ===================================================================== */
(function () {
  'use strict';

  var TECLAS = ['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'f', 'F'];
  var dentroDoVisualizador = window.parent !== window;

  function avisarPai(msg) {
    if (dentroDoVisualizador) window.parent.postMessage(msg, '*');
  }

  /* ---------- 2. atalhos para outras telas ---------- */
  function abrirTela(file) {
    if (!file) return;
    if (dentroDoVisualizador) avisarPai({ type: 'slide-goto-file', file: file });
    else window.location.href = file;
  }

  document.querySelectorAll('[data-ir]').forEach(function (el) {
    var nativo = el.tagName === 'BUTTON' || el.tagName === 'A';
    if (!nativo) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'link');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirTela(el.dataset.ir); }
      });
    }
    el.addEventListener('click', function (e) {
      if (el.tagName === 'A') e.preventDefault();
      abrirTela(el.dataset.ir);
    });
  });

  /* ---------- 4. normas ---------- */
  document.querySelectorAll('.tile').forEach(function (t) {
    t.setAttribute('aria-expanded', 'false');
    t.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; /* o link "ler a norma" abre sem fechar o cartão */
      var aberto = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', aberto ? 'false' : 'true');
    });
  });

  /* ---------- 3. etapas internas ---------- */
  var focos = Array.prototype.slice.call(document.querySelectorAll('.etapa-foco'));
  var botoes = Array.prototype.slice.call(document.querySelectorAll('.passo-btn'));
  var total = focos.length;
  var etapa = 1;

  function irPara(n, anunciar) {
    if (!total) return;
    etapa = Math.max(1, Math.min(total, n));
    focos.forEach(function (f, i) {
      var ativa = i + 1 === etapa;
      f.classList.toggle('ativa', ativa);
      f.setAttribute('aria-hidden', ativa ? 'false' : 'true');
    });
    botoes.forEach(function (b, i) {
      b.classList.toggle('ativa', i + 1 === etapa);
      b.classList.toggle('feita', i + 1 < etapa);
      b.setAttribute('aria-selected', i + 1 === etapa ? 'true' : 'false');
      b.setAttribute('tabindex', i + 1 === etapa ? '0' : '-1');
    });
    var esq = document.getElementById('setaEsq');
    var dir = document.getElementById('setaDir');
    if (esq) esq.disabled = etapa === 1 && !dentroDoVisualizador;
    if (dir) dir.disabled = etapa === total && !dentroDoVisualizador;
    if (anunciar && window.A11y) {
      var rotulo = focos[etapa - 1].getAttribute('aria-label') || ('Etapa ' + etapa);
      window.A11y.announce(rotulo + ' (' + etapa + ' de ' + total + ')');
    }
  }

  /* O visualizador usa dois iframes e o que saiu de cena pode continuar
     com o foco. Por isso, depois de passar a navegação ao visualizador, o
     slide fica inativo (só repassa teclas) até voltar a cena: o visualizador
     avisa com 'deck-ativo', ou o usuário clica/toca na tela. */
  var ativo = true;

  /* devolve true se a tecla foi consumida pelas etapas */
  function passoInterno(tecla) {
    if (!total || !ativo) return false;
    if (tecla === 'ArrowRight' || tecla === ' ' || tecla === 'PageDown') {
      if (etapa < total) { irPara(etapa + 1, true); return true; }
    } else if (tecla === 'ArrowLeft' || tecla === 'PageUp') {
      if (etapa > 1) { irPara(etapa - 1, true); return true; }
    }
    return false;
  }

  if (total) {
    document.documentElement.classList.add('js');
    var lista = botoes.length ? botoes[0].parentElement : null;
    if (lista && !lista.hasAttribute('role')) lista.setAttribute('role', 'tablist');
    botoes.forEach(function (b, i) {
      b.setAttribute('role', 'tab');
      b.addEventListener('click', function () { irPara(i + 1, true); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'Home') { e.preventDefault(); e.stopPropagation(); irPara(1, true); botoes[0].focus(); }
        if (e.key === 'End') { e.preventDefault(); e.stopPropagation(); irPara(total, true); botoes[total - 1].focus(); }
      });
    });
    focos.forEach(function (f) { f.setAttribute('role', 'tabpanel'); });

    var esq = document.getElementById('setaEsq');
    var dir = document.getElementById('setaDir');
    if (esq) esq.addEventListener('click', function () { ativo = true; sair('ArrowLeft'); });
    if (dir) dir.addEventListener('click', function () { ativo = true; sair('ArrowRight'); });

    /* entrando de ré (#fim) abre na última etapa; #e3 abre na etapa 3 */
    var inicio = 1;
    var m = window.location.hash.match(/^#e(\d+)$/);
    if (window.location.hash === '#fim') inicio = total;
    else if (m) inicio = +m[1];
    irPara(inicio, false);

    avisarPai({ type: 'slide-etapas', total: total });
    window.addEventListener('message', function (e) {
      if (!e.data) return;
      if (e.data.type === 'deck-key') {
        ativo = true;
        sair(e.data.key);
      } else if (e.data.type === 'deck-ativo') {
        ativo = true;
        irPara(e.data.direcao === 'tras' ? total : 1, false);
        avisarPai({ type: 'slide-etapas', total: total });
      } else if (e.data.type === 'deck-inativo') {
        ativo = false;
      }
    });
    window.addEventListener('hashchange', function () {
      ativo = true;
      var h = window.location.hash.match(/^#e(\d+)$/);
      irPara(window.location.hash === '#fim' ? total : (h ? +h[1] : 1), false);
      avisarPai({ type: 'slide-etapas', total: total });
    });
    document.addEventListener('pointerdown', function () { ativo = true; }, true);
  }

  /* tenta andar uma etapa; se não der, entrega a tecla ao visualizador e
     fica inativo até voltar a cena */
  function sair(tecla) {
    if (passoInterno(tecla)) return;
    if (total && ['ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp', 'Home', 'End'].indexOf(tecla) !== -1) ativo = false;
    avisarPai({ type: 'slide-nav', key: tecla });
  }

  window.Guia = { irPara: function (n) { irPara(n, true); }, etapaAtual: function () { return etapa; } };

  /* ---------- 1. teclado ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented) return;
    var alvo = e.target;
    var tag = alvo && alvo.tagName;
    /* dentro de campos de formulário as teclas são do campo, não da apresentação */
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (alvo && alvo.isContentEditable)) return;
    /* espaço e Enter em botões e atalhos acionam o elemento */
    if (e.key === ' ' && alvo && alvo.closest && alvo.closest('button, a, [data-ir], label')) return;
    if (TECLAS.indexOf(e.key) === -1) return;
    e.preventDefault();
    sair(e.key);
  });
})();
