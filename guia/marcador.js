/* =====================================================================
   marcador.js — marcações "feitas à mão" em frases da tela (carregado
   com defer). Adaptado do Marker Text do KokonutUI (MIT,
   https://kokonutui.com), reescrito em JavaScript puro.

   Uso no HTML: envolva a frase num elemento com data-marca.
     <mark class="marca" data-marca="marca-texto">…</mark>   fundo de marca-texto
     <span class="marca" data-marca="sublinhado">…</span>    traço embaixo
     <span class="marca" data-marca="circulo">…</span>       círculo em volta
     <span class="marca" data-marca="caixa">…</span>         retângulo em volta
     <s class="marca" data-marca="riscado">…</s>             risco no meio
   Opcionais: data-cor="#hex" e data-espessura="3" (px).

   Ao abrir a tela, as marcas são desenhadas uma depois da outra, na ordem
   de leitura. O texto não muda: o traço é um SVG decorativo (aria-hidden)
   posto atrás (marca-texto) ou na frente do texto. Com "reduzir movimento"
   ligado, as marcas aparecem prontas. Sem JavaScript, o texto fica igual.

   API (relatorio.html já cobre: Vida.finalizar põe .vida-parado no <html>,
   e esta tela reage a essa classe):
     Marcador.finalizar()  mostra todas as marcas prontas, sem animação.
   ===================================================================== */
(function (global) {
  'use strict';

  var SELETOR = '[data-marca]';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  /* Cores da paleta institucional (base.css). Em fundo escuro (texto
     claro), todas as marcas usam o dourado para continuarem visíveis. */
  var COR_PADRAO = {
    'marca-texto': '#F2A900',
    sublinhado: '#0090C0',
    circulo: '#0070C0',
    caixa: '#103050',
    riscado: '#0070C0'
  };
  var COR_FUNDO_ESCURO = '#F2A900';

  /* Espera a tela entrar (troca do visualizador e cascata do vida.js). */
  var ATRASO_INICIAL_MS = 1000;
  /* Pausa entre uma marca e a próxima. */
  var INTERVALO_MS = 140;
  /* Velocidade da caneta, em px por ms; a duração fica entre um mínimo e
     um máximo, como a mão que desacelera nos traços longos. */
  var VELOCIDADE_CANETA = 0.9;
  var VELOCIDADE_MARCA_TEXTO = 1.15;
  var MIN_MS = 260;
  var MAX_MS = 820;
  /* Caneta levantada entre duas linhas da mesma marca. */
  var PAUSA_LINHA_MS = 60;
  var CURVA_CANETA = 'cubic-bezier(0.45, 0.05, 0.25, 1)';
  /* As camadas são caixas de 1px que transbordam: a máscara precisa de área explícita. */
  var AREA_MASCARA = 20000;

  var marcas = [];
  var raizes = [];
  var desenhado = false;
  var finalizado = false;
  var contador = 0;
  var cronometro = 0;

  function movimentoReduzido() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- geometria do traço ---------- */

  /* Ruído determinístico: redesenhar dá a mesma tremida. */
  function aleatorio(semente) {
    var n = semente;
    return function () {
      n += 1;
      var x = Math.sin(n * 12.9898 + semente * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
  }

  function resumo(texto) {
    var h = 7;
    for (var i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) % 1000003;
    return h;
  }

  function r1(n) { return Math.round(n * 10) / 10; }

  function polilinha(pontos) {
    return pontos.map(function (p, i) {
      return (i === 0 ? 'M' : 'L') + r1(p[0]) + ' ' + r1(p[1]);
    }).join('');
  }

  function comprimento(pontos) {
    var total = 0;
    for (var i = 1; i < pontos.length; i++) {
      total += Math.hypot(pontos[i][0] - pontos[i - 1][0], pontos[i][1] - pontos[i - 1][1]);
    }
    return total;
  }

  /* O traço como forma preenchida: a linha central deslocada meia largura
     para cada lado, com pontas redondas. Ao contrário do stroke do SVG, a
     largura varia ao longo do caminho — é isso que parece tinta. */
  function contorno(pontos, larguras) {
    var esq = [];
    var dir = [];
    var ultimo = pontos.length - 1;
    for (var i = 0; i <= ultimo; i++) {
      var ant = pontos[Math.max(0, i - 1)];
      var prox = pontos[Math.min(ultimo, i + 1)];
      var dx = prox[0] - ant[0];
      var dy = prox[1] - ant[1];
      var len = Math.hypot(dx, dy) || 1;
      var meia = larguras[i] / 2;
      var nx = (-dy / len) * meia;
      var ny = (dx / len) * meia;
      esq.push([pontos[i][0] + nx, pontos[i][1] + ny]);
      dir.push([pontos[i][0] - nx, pontos[i][1] - ny]);
    }
    var pontaFim = r1(larguras[ultimo] / 2);
    var pontaIni = r1(larguras[0] / 2);
    var volta = dir.reverse();
    return polilinha(esq) +
      'A' + pontaFim + ' ' + pontaFim + ' 0 0 0 ' + r1(volta[0][0]) + ' ' + r1(volta[0][1]) +
      polilinha(volta).replace('M', 'L') +
      'A' + pontaIni + ' ' + pontaIni + ' 0 0 0 ' + r1(esq[0][0]) + ' ' + r1(esq[0][1]) + 'Z';
  }

  /* Pressão ao longo do traço: a caneta pousa, aperta e levanta. */
  function pressao(t, base) {
    var pousa = Math.min(1, t / 0.1);
    var levanta = Math.min(1, (1 - t) / 0.18);
    return base * (0.45 + 0.55 * Math.sin((pousa * Math.PI) / 2)) * (0.55 + 0.45 * levanta);
  }

  /* Onda lenta e irregular para bordas que devem parecer feitas à mão. */
  function tremida(rand, amp) {
    var p1 = rand() * Math.PI * 2;
    var p2 = rand() * Math.PI * 2;
    var f1 = 1 + rand() * 1.5;
    var f2 = 3 + rand() * 3;
    return function (t) {
      return amp * (0.7 * Math.sin(t * f1 * Math.PI + p1) + 0.3 * Math.sin(t * f2 * Math.PI + p2));
    };
  }

  function amostrar(qtd, em) {
    var pontos = [];
    for (var i = 0; i <= qtd; i++) pontos.push(em(i / qtd));
    return pontos;
  }

  function tracoCaneta(pontos, largura, cor) {
    var larguras = pontos.map(function (_, i) { return pressao(i / (pontos.length - 1), largura); });
    return {
      forma: contorno(pontos, larguras),
      caneta: polilinha(pontos),
      larguraCaneta: largura * 4,
      comprimento: comprimento(pontos),
      cor: cor,
      atras: false,
      opacidade: 1
    };
  }

  function tracosMarcaTexto(linhas, rand, cor) {
    return linhas.map(function (linha) {
      var h = linha.bottom - linha.top;
      var cima = tremida(rand, 0.9);
      var baixo = tremida(rand, 0.9);
      /* a ponta chanfrada deixa as pontas inclinadas, e o traço sai um
         pouco do nível ao longo da linha */
      var chanfro = h * 0.2;
      var inclinacao = (rand() - 0.5) * Math.min(3, h * 0.08);
      var x0 = linha.left - 3 - rand() * 2;
      var x1 = linha.right + 3 + rand() * 3;
      var y0 = linha.top + h * 0.08;
      var y1 = linha.bottom - h * 0.02;
      var passos = Math.max(6, Math.round((x1 - x0) / 14));
      function borda(y, onda, dx) {
        return amostrar(passos, function (t) {
          return [x0 + dx + (x1 - x0) * t, y + onda(t) + inclinacao * (t - 0.5)];
        });
      }
      var superior = borda(y0, cima, chanfro * 0.5);
      var inferior = borda(y1, baixo, -chanfro * 0.5).reverse();
      var meio = (y0 + y1) / 2;
      var caneta = [[x0 - chanfro, meio], [x1 + chanfro, meio + inclinacao * 0.5]];
      return {
        forma: polilinha(superior) + polilinha(inferior).replace('M', 'L') + 'Z',
        caneta: polilinha(caneta),
        larguraCaneta: h * 1.8,
        comprimento: comprimento(caneta),
        cor: cor,
        atras: true,
        opacidade: 0.42
      };
    });
  }

  function tracosLinha(linhas, rand, largura, cor, riscado) {
    return linhas.map(function (linha) {
      var h = linha.bottom - linha.top;
      var arco = (rand() - 0.5) * 3;
      var inclinacao = (rand() - 0.5) * (riscado ? 4 : 2.4);
      var onda = tremida(rand, 0.5);
      var x0 = linha.left - 2 - rand() * 3;
      var x1 = linha.right + 2 + rand() * 4;
      var y = riscado ? linha.top + h * 0.56 : linha.bottom + Math.max(1, h * 0.04);
      var passos = Math.max(8, Math.round((x1 - x0) / 6));
      var pontos = amostrar(passos, function (t) {
        return [x0 + (x1 - x0) * t, y + Math.sin(t * Math.PI) * arco + inclinacao * (t - 0.5) + onda(t)];
      });
      return tracoCaneta(pontos, largura, cor);
    });
  }

  function tracoCirculo(caixa, rand, largura, cor) {
    var cx = (caixa.left + caixa.right) / 2;
    var cy = (caixa.top + caixa.bottom) / 2;
    /* folga para os cantos do texto ficarem dentro da elipse, mesmo em
       frase longa (com +8px só, a elipse cortava as pontas) */
    var rx = ((caixa.right - caixa.left) / 2) * 1.18 + 10;
    var ry = ((caixa.bottom - caixa.top) / 2) * 1.9 + 4;
    /* inclinação de até 3°, mas sem erguer as pontas mais de 4px */
    var giroMax = Math.min((3 * Math.PI) / 180, Math.asin(Math.min(1, 4 / rx)));
    var giro = (rand() - 0.5) * 2 * giroMax;
    var inicio = -Math.PI * (0.62 + rand() * 0.12);
    /* a mão nunca fecha o laço exato: passa do começo e se afasta, e as
       duas pontas se cruzam em vez de se encontrarem */
    var volta = Math.PI * 2 + 0.45 + rand() * 0.2;
    var deriva = 0.05 + rand() * 0.04;
    var onda = tremida(rand, 0.025);
    var passos = Math.max(48, Math.round((rx + ry) / 3));
    var pontos = amostrar(passos, function (t) {
      var a = inicio + volta * t;
      var cresce = 1 - deriva / 2 + deriva * t + onda(t);
      var x = Math.cos(a) * rx * cresce;
      var y = Math.sin(a) * ry * cresce;
      return [cx + x * Math.cos(giro) - y * Math.sin(giro), cy + x * Math.sin(giro) + y * Math.cos(giro)];
    });
    return tracoCaneta(pontos, largura, cor);
  }

  /* Um traço contínuo pelos quatro lados, levemente curvos, passando do
     primeiro canto no fim. */
  function tracoCaixa(caixa, rand, largura, cor) {
    var padX = 5;
    var padY = 3;
    var cantos = [
      [caixa.left - padX - rand() * 2, caixa.top - padY + (rand() - 0.5) * 2],
      [caixa.right + padX + rand() * 2, caixa.top - padY + (rand() - 0.5) * 2],
      [caixa.right + padX + (rand() - 0.5) * 2, caixa.bottom + padY + rand() * 2],
      [caixa.left - padX + (rand() - 0.5) * 2, caixa.bottom + padY + rand() * 2]
    ];
    var pontos = [];
    for (var lado = 0; lado < 4; lado++) {
      var a = cantos[lado];
      var b = cantos[(lado + 1) % 4];
      var arco = (rand() - 0.5) * 3;
      var len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      var nx = -(b[1] - a[1]) / len;
      var ny = (b[0] - a[0]) / len;
      var passos = Math.max(6, Math.round(len / 8));
      for (var s = lado === 0 ? 0 : 1; s <= passos; s++) {
        var t = s / passos;
        var ergue = Math.sin(t * Math.PI) * arco;
        pontos.push([a[0] + (b[0] - a[0]) * t + nx * ergue, a[1] + (b[1] - a[1]) * t + ny * ergue]);
      }
    }
    var p0 = cantos[0];
    var p1 = cantos[1];
    var passa = 14 / Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    pontos.push([p0[0] + (p1[0] - p0[0]) * passa, p0[1] + (p1[1] - p0[1]) * passa + 1.5]);
    return tracoCaneta(pontos, largura, cor);
  }

  function tracosPara(marca, linhas, semente) {
    var rand = aleatorio(semente);
    var tipo = marca.tipo;
    var alturaLinha = linhas[0].bottom - linhas[0].top;
    var largura = marca.espessura || Math.min(4.5, Math.max(1.6, alturaLinha * 0.085));
    var cor = marca.cor;

    if (tipo === 'marca-texto') return tracosMarcaTexto(linhas, rand, cor);
    if (tipo === 'sublinhado' || tipo === 'riscado') return tracosLinha(linhas, rand, largura, cor, tipo === 'riscado');
    /* frase em mais de uma linha: um só círculo ou caixa em volta de todas */
    var tudo = linhas.reduce(function (u, l) {
      return {
        left: Math.min(u.left, l.left), top: Math.min(u.top, l.top),
        right: Math.max(u.right, l.right), bottom: Math.max(u.bottom, l.bottom)
      };
    });
    return [tipo === 'circulo' ? tracoCirculo(tudo, rand, largura, cor) : tracoCaixa(tudo, rand, largura, cor)];
  }

  /* O navegador devolve um retângulo por pedaço inline (ex.: o <b> dentro
     da frase). Junta os que estão na mesma linha. */
  function juntarLinhas(rects) {
    var linhas = [];
    rects.forEach(function (r) {
      var mesma = linhas.filter(function (l) {
        var sobre = Math.min(l.bottom, r.bottom) - Math.max(l.top, r.top);
        return sobre > 0.5 * Math.min(l.bottom - l.top, r.bottom - r.top);
      })[0];
      if (!mesma) { linhas.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom }); return; }
      mesma.left = Math.min(mesma.left, r.left);
      mesma.right = Math.max(mesma.right, r.right);
      mesma.top = Math.min(mesma.top, r.top);
      mesma.bottom = Math.max(mesma.bottom, r.bottom);
    });
    return linhas;
  }

  /* ---------- montagem ---------- */

  /* Bloco que recebe as camadas: o primeiro ancestral que não é inline. */
  function raizDe(el) {
    var r = el.parentElement;
    while (r && r !== document.body && getComputedStyle(r).display.indexOf('inline') === 0) r = r.parentElement;
    return r || document.body;
  }

  /* Texto claro indica fundo escuro (ex.: .destaque). */
  function fundoEscuro(el) {
    var m = getComputedStyle(el).color.match(/\d+(\.\d+)?/g);
    if (!m) return false;
    var lum = (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
    return lum > 0.6;
  }

  function coletar() {
    Array.prototype.forEach.call(document.querySelectorAll(SELETOR), function (el) {
      var tipo = el.dataset.marca;
      if (!COR_PADRAO[tipo]) return;
      var raiz = raizDe(el);
      if (raizes.indexOf(raiz) === -1) {
        raizes.push(raiz);
        raiz.classList.add('marca-raiz');
        if (getComputedStyle(raiz).position === 'static') raiz.classList.add('marca-raiz--relativa');
      }
      marcas.push({
        el: el,
        raiz: raiz,
        tipo: tipo,
        cor: el.dataset.cor || (fundoEscuro(el) ? COR_FUNDO_ESCURO : COR_PADRAO[tipo]),
        espessura: parseFloat(el.dataset.espessura) || 0
      });
    });
  }

  function svg(nome, attrs) {
    var n = document.createElementNS(SVG_NS, nome);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  function camada(raiz, atras) {
    var c = svg('svg', { 'aria-hidden': 'true', focusable: 'false', width: '1', height: '1' });
    c.setAttribute('class', 'marca-camada ' + (atras ? 'marca-camada--atras' : 'marca-camada--frente'));
    if (atras) raiz.insertBefore(c, raiz.firstChild);
    else raiz.appendChild(c);
    return c;
  }

  function limpar() {
    document.querySelectorAll('.marca-camada').forEach(function (c) { c.remove(); });
  }

  /* Mede as frases e cria os traços. `animar` falso: já aparecem prontos. */
  function montar(animar) {
    limpar();
    var camadas = new Map();
    var relogio = 0;
    var tracos = [];

    marcas.forEach(function (marca, indice) {
      var origem = marca.raiz.getBoundingClientRect();
      var linhas = juntarLinhas(Array.prototype.filter.call(marca.el.getClientRects(), function (r) { return r.width > 1; })
        .map(function (r) {
          return {
            left: r.left - origem.left,
            top: r.top - origem.top,
            right: r.right - origem.left,
            bottom: r.bottom - origem.top
          };
        }));
      if (!linhas.length) return;

      if (!camadas.has(marca.raiz)) camadas.set(marca.raiz, { atras: camada(marca.raiz, true), frente: camada(marca.raiz, false) });
      var destino = camadas.get(marca.raiz);
      var velocidade = marca.tipo === 'marca-texto' ? VELOCIDADE_MARCA_TEXTO : VELOCIDADE_CANETA;
      var feitos = tracosPara(marca, linhas, resumo((marca.el.textContent || '') + indice));

      feitos.forEach(function (t, i) {
        var duracao = Math.min(MAX_MS, Math.max(MIN_MS, t.comprimento / velocidade));
        var g = svg('g', {});
        var tinta = svg('path', { d: t.forma, fill: t.cor, 'fill-opacity': t.opacidade });
        if (animar) {
          var id = 'marca-' + (++contador);
          var mascara = svg('mask', {
            id: id, maskUnits: 'userSpaceOnUse',
            x: -AREA_MASCARA / 2, y: -AREA_MASCARA / 2, width: AREA_MASCARA, height: AREA_MASCARA
          });
          var caneta = svg('path', {
            d: t.caneta, fill: 'none', stroke: 'white',
            'stroke-linecap': t.atras ? 'butt' : 'round', 'stroke-linejoin': 'round',
            'stroke-width': t.larguraCaneta
          });
          caneta.style.strokeDasharray = t.comprimento + 1;
          caneta.style.strokeDashoffset = t.comprimento + 1;
          mascara.appendChild(caneta);
          g.appendChild(mascara);
          tinta.setAttribute('mask', 'url(#' + id + ')');
          tracos.push({ caneta: caneta, tinta: tinta, duracao: duracao, atraso: relogio });
        }
        g.appendChild(tinta);
        (t.atras ? destino.atras : destino.frente).appendChild(g);
        relogio += duracao + (i < feitos.length - 1 ? PAUSA_LINHA_MS : 0);
      });
      relogio += INTERVALO_MS;
    });

    if (!animar) return;
    /* liga a transição no quadro seguinte ao estado escondido já pintado */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        tracos.forEach(function (t) {
          t.caneta.style.transition = 'stroke-dashoffset ' + t.duracao + 'ms ' + CURVA_CANETA + ' ' + t.atraso + 'ms';
          t.caneta.style.strokeDashoffset = '0';
        });
        cronometro = global.setTimeout(function () {
          /* terminado o desenho, a máscara sai: a captura do PDF/PPTX fica simples */
          tracos.forEach(function (t) { t.tinta.removeAttribute('mask'); });
        }, relogio + 100);
      });
    });
  }

  function desenhar() {
    if (desenhado || finalizado) return;
    desenhado = true;
    montar(!movimentoReduzido());
  }

  /* Leva todas as marcas ao estado final. Necessário antes de capturar a tela. */
  function finalizar() {
    if (!marcas.length) return;
    finalizado = true;
    global.clearTimeout(cronometro);
    montar(false);
  }

  function iniciar() {
    coletar();
    if (!marcas.length) return;

    var fontes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontes.then(function () {
      if (movimentoReduzido()) desenhar();
      else global.setTimeout(desenhar, ATRASO_INICIAL_MS);
    });

    /* se o bloco mudar de tamanho depois do desenho, refaz já pronto */
    if (global.ResizeObserver) {
      var obs = new ResizeObserver(function () {
        if (desenhado || finalizado) finalizar();
      });
      raizes.forEach(function (r) { obs.observe(r); });
    }

    /* relatorio.html congela a tela com Vida.finalizar(), que põe .vida-parado */
    new MutationObserver(function () {
      if (document.documentElement.classList.contains('vida-parado') && !finalizado) finalizar();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  global.addEventListener('beforeprint', finalizar);
  global.addEventListener('message', function (e) {
    if (e.data && e.data.tipo === 'vida:finalizar') finalizar();
  });

  global.Marcador = { finalizar: finalizar };
})(window);
