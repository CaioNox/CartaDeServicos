/* =====================================================================
   ilustracao.js — ilustrações vetoriais desenhadas por código, seguindo
   o Padrão Digital de Governo (Design System gov.br), Fundamentos
   visuais › Ilustração: https://www.gov.br/ds/fundamentos-visuais/ilustracao

   O que o padrão pede e onde está aqui:
     - Anatomia: elementos de fundo, luz e sombra e spot (objetos) são
       obrigatórios; textura e padronagem são opcionais (usamos as duas).
     - Luz e sombra: só camadas brancas e pretas em "soft-light", com a
       opacidade em degraus de 10% -> funções luz() e sombra().
     - Cor: no máximo 5 cores principais, na proporção 60/30/10 -> paleta(),
       lida de base.css (sem verde, regra de marca da ANTAQ).
     - Personagens: diversidade de tom de pele e cabelo (cores adicionais
       permitidas pelo padrão), sem rosto, evitando estereótipos -> perfil().
     - Variantes de tamanho: figura pequena é simplificada ao essencial;
       os detalhes ficam para as figuras grandes -> nível de detalhe 0/1/2.
     - Fundo: formas simples e geométricas -> criarBolha().
     - Textura: área granulada -> texturaGranulada(). Padronagem: anéis e
       pontos, simples e geométricos.
     - Acessibilidade: o SVG é decorativo e leva aria-hidden="true"; todo o
       conteúdo da tela continua no texto HTML.

   Capa: a multidão ocupa toda a área livre da página e desce para a
   esquerda contornando o texto da tela. O contorno não é desenhado à mão:
   ele é calculado a partir da posição real do texto (data-desviar), então
   o desvio acompanha o título mesmo que a fonte ou o tamanho mudem.

   Também segue outros fundamentos do DS: Movimento (tokens de duração e
   easing; todo movimento automático termina antes de 5 s, como o DS pede
   para dispensar o botão de pausa), Elevação (sombras das camadas 2 e 3),
   Superfície (cantos e opacidades), Espaçamento (escala de 8px) e
   Iconografia (Font Awesome nos balões).

   Movimento: as pessoas aparecem fileira por fileira, da frente para trás,
   como uma faixa que passa (cada fileira inteira de uma vez); os balões
   de fala surgem um depois do outro e ficam. Depois
   disso a cena para: só o ponteiro anima — quem está sob ele se levanta
   e sobe de camada (estado hover).
   Com "reduzir movimento" ligado no sistema, a cena é desenhada já no
   estado final, parada. Antes da captura do PDF/PPTX (Vida.finalizar põe
   .vida-parado no <html>) e na impressão, ela congela no estado final.

   Uso:  <div data-ilustracao="capa" data-desviar=".titulo, .subtitulo"></div>
         <script src="ilustracao.js" defer></script>
   Elementos com [data-entra] (texto da tela) repetem a animação de
   entrada do CSS quando a tela volta a ficar em cena no visualizador.

   API: Ilustracao.congelar()   estado final, sem movimento.
        Ilustracao.reiniciar()  recomeça a entrada.
   ===================================================================== */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const TAU = Math.PI * 2;
  const SEMENTE = 2026;             /* mesma semente = mesmo desenho em toda captura */
  const FINAL = 99;                 /* segundos: entrada já concluída */

  /* Elevação (Fundamentos › Elevação): sombra preta a 16% (--surface-opacity-xs),
     desfoque 6px (--surface-blur-lg), deslocamento Y conforme a camada. */
  const ELEVACAO = { 1: 1, 2: 3, 3: 6, 4: 9 };
  /* Iconografia: o DS adota o Font Awesome (já em vendor/). */
  const FONTE_ICONES = '"Font Awesome 6 Free"';
  const ICONES = { fala: '\uf4ad', estrela: '\uf005', navio: '\uf21a' };

  /* ---------- 1. regras do padrão gov.br ---------- */

  /* 5 cores, 60/30/10: marinho domina (fundo da capa), azul é a
     secundária (bolha, roupas do fundo), dourado é o destaque. */
  function paleta() {
    const css = getComputedStyle(document.documentElement);
    const ler = (nome, reserva) => css.getPropertyValue(nome).trim() || reserva;
    return {
      dominante: ler('--brand-primary', '#103050'),
      secundaria: ler('--brand-secondary', '#0070C0'),
      apoio: ler('--accent', '#0090C0'),
      destaque: ler('--dourado', '#F2A900'),
      papel: '#FFFFFF',
    };
  }

  /* Opacidade de luz e sombra em degraus de 10%. */
  const degrau = (op) => Math.min(0.9, Math.max(0.1, Math.round(op * 10) / 10));

  function mesclar(elemento, preenchimento, op) {
    elemento.setAttribute('fill', preenchimento);
    elemento.setAttribute('opacity', degrau(op));
    elemento.style.mixBlendMode = 'soft-light';
    return elemento;
  }
  const luz = (elemento, op) => mesclar(elemento, '#FFFFFF', op);
  const sombra = (elemento, op) => mesclar(elemento, '#000000', op);

  /* Desempenho: quando a camada de luz ou sombra cai inteira sobre uma cor
     sólida, o resultado do soft-light é uma cor só. Ela é calculada aqui,
     com a mesma fórmula do navegador (W3C Compositing, "soft-light"), e
     pintada direto: o pixel é o mesmo, sem o custo da mesclagem. */
  const rgb = (hex) => {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  };
  const hex = (c) => '#' + c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('');
  function canalSoftLight(cb, cs) {
    if (cs <= 0.5) return cb - (1 - 2 * cs) * cb * (1 - cb);
    const d = cb <= 0.25 ? ((16 * cb - 12) * cb + 4) * cb : Math.sqrt(cb);
    return cb + (2 * cs - 1) * (d - cb);
  }
  const memoria = new Map();
  function misturado(base, cor, op) {
    const chave = base + cor + op;
    if (!memoria.has(chave)) {
      const a = degrau(op), b = rgb(base), c = rgb(cor);
      memoria.set(chave, hex(b.map((cb, i) => (1 - a) * cb + a * canalSoftLight(cb, c[i]))));
    }
    return memoria.get(chave);
  }
  const sombreado = (base, op) => misturado(base, '#000000', op);
  const iluminado = (base, op) => misturado(base, '#FFFFFF', op);

  /* ---------- 2. utilitários ---------- */

  function no(tag, atributos, pai) {
    const n = document.createElementNS(NS, tag);
    Object.keys(atributos || {}).forEach((k) => n.setAttribute(k, atributos[k]));
    if (pai) pai.appendChild(n);
    return n;
  }

  /* Escreve o atributo só quando o valor muda: depois que a cena para,
     nenhuma pessoa é tocada de novo. */
  function definir(el, nome, valor) {
    const chave = '_v_' + nome;
    if (el[chave] !== valor) { el[chave] = valor; el.setAttribute(nome, valor); }
  }

  /* gerador pseudoaleatório com semente (mulberry32) */
  function aleatorio(semente) {
    let s = semente >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const r1 = (n) => Math.round(n * 10) / 10;
  const limitar = (x) => Math.min(1, Math.max(0, x));
  const fase = (t, inicio, duracao) => limitar((t - inicio) / duracao);
  const suave = (a, b, x) => { const k = limitar((x - a) / (b - a)); return k * k * (3 - 2 * k); };

  /* Movimento: os tokens do DS gov.br (Fundamentos › Movimento).
     Curvas cubic-bezier resolvidas por bisseção; durações em segundos. */
  function curvaBezier(x1, y1, x2, y2) {
    const ax = 3 * x1 - 3 * x2 + 1, bx = 3 * x2 - 6 * x1, cx = 3 * x1;
    const ay = 3 * y1 - 3 * y2 + 1, by = 3 * y2 - 6 * y1, cy = 3 * y1;
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let a = 0, b = 1, t = x;
      for (let i = 0; i < 18; i++) {
        t = (a + b) / 2;
        if (((ax * t + bx) * t + cx) * t < x) a = t; else b = t;
      }
      return ((ay * t + by) * t + cy) * t;
    };
  }
  const EASING = {
    ease: curvaBezier(0.25, 0.1, 0.25, 1),         /* --animation-ease */
    easeIn: curvaBezier(0.42, 0, 1, 1),            /* --animation-ease-in */
    easeOut: curvaBezier(0, 0, 0.58, 1),           /* --animation-ease-out */
    easeInOut: curvaBezier(0.42, 0, 0.58, 1),      /* --animation-ease-in-out */
  };
  const DURACAO = {
    muitoRapido: 0.1, rapido: 0.3, moderado: 0.5, lento: 0.8, muitoLento: 1,  /* --duration-* */
  };
  /* O DS pede pausa para movimento automático com mais de 5 s: aqui todo o
     movimento automático termina antes disso; depois, só o ponteiro anima. */
  const FIM_AUTOMATICO = 3.2;

  /* Curva fechada e suave passando por todos os pontos (Catmull-Rom). */
  function caminhoFechado(p) {
    const n = p.length;
    let d = 'M' + r1(p[0][0]) + ' ' + r1(p[0][1]);
    for (let i = 0; i < n; i++) {
      const p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      d += 'C' + r1(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + r1(p1[1] + (p2[1] - p0[1]) / 6) +
        ' ' + r1(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + r1(p2[1] - (p3[1] - p1[1]) / 6) +
        ' ' + r1(p2[0]) + ' ' + r1(p2[1]);
    }
    return d + 'Z';
  }

  /* Bolha orgânica: raios sorteados uma vez, cada um oscila devagar. */
  function criarBolha(rnd, pontos, irregular, respiro) {
    const nos = [];
    for (let i = 0; i < pontos; i++) {
      nos.push({
        ang: (i / pontos) * TAU + (rnd() - 0.5) * 0.4,
        raio: 1 + (rnd() * 2 - 1) * irregular,
        fase: rnd() * TAU,
        vel: 0.05 + rnd() * 0.06,              /* voltas por segundo */
      });
    }
    return function (cx, cy, raio, t) {
      return caminhoFechado(nos.map((n) => {
        const r = raio * (n.raio + respiro * Math.sin(t * n.vel * TAU + n.fase));
        return [cx + Math.cos(n.ang) * r, cy + Math.sin(n.ang) * r];
      }));
    };
  }

  function estrela(cx, cy, rExt, rInt, pontas) {
    const p = [];
    for (let i = 0; i < pontas * 2; i++) {
      const r = i % 2 ? rInt : rExt, a = -Math.PI / 2 + (i * Math.PI) / pontas;
      p.push(r1(cx + Math.cos(a) * r) + ' ' + r1(cy + Math.sin(a) * r));
    }
    return 'M' + p.join('L') + 'Z';
  }

  /* Granulado: pontos pretos e brancos, gerados uma vez num <canvas>. */
  function texturaGranulada(rnd, lado, densidade) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = lado;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    const img = ctx.createImageData(lado, lado);
    for (let i = 0; i < img.data.length; i += 4) {
      if (rnd() > densidade) continue;
      const v = rnd() < 0.5 ? 0 : 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 50 + Math.floor(rnd() * 110);
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL('image/png');
  }

  /* ---------- 3. o contorno da multidão ----------
     Para cada x, a altura mínima que a multidão pode alcançar: abaixo do
     texto (com folga) e, fora dele, quase até o alto da tela. A exigência do texto é alargada (dilatação) e suavizada
     (desfoque), o que dá a curva arredondada do desvio. */

  const PASSO_CONTORNO = 4;

  function calcularContorno(obstaculos, L, A, opcoes) {
    const n = Math.ceil(L / PASSO_CONTORNO) + 1;
    const folgaX = opcoes.folgaX, folgaY = opcoes.folgaY;

    /* 1. exigência direta do texto; à esquerda da margem do texto, ninguém */
    const margemEsquerda = obstaculos.length ? obstaculos.reduce((m, r) => Math.min(m, r.x0), L) : 0;
    const exigido = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = i * PASSO_CONTORNO;
      if (x < margemEsquerda) { exigido[i] = A + 200; continue; }
      obstaculos.forEach((r) => {
        if (x >= r.x0 - folgaX && x <= r.x1 + folgaX) exigido[i] = Math.max(exigido[i], r.y1 + folgaY);
      });
    }

    /* 2. dilatação: cada exigência vale também para os vizinhos */
    const raio = Math.round(opcoes.alargar / PASSO_CONTORNO);
    const dilatado = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let m = 0;
      for (let j = Math.max(0, i - raio); j <= Math.min(n - 1, i + raio); j++) m = Math.max(m, exigido[j]);
      dilatado[i] = m;
    }

    /* 3. desfoque (3 médias móveis ≈ gaussiana) */
    let suavizado = dilatado;
    const janela = Math.round(opcoes.suavizar / PASSO_CONTORNO);
    for (let passada = 0; passada < 3; passada++) {
      const saidaArr = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        let s = 0, c = 0;
        for (let j = Math.max(0, i - janela); j <= Math.min(n - 1, i + janela); j++) { s += suavizado[j]; c++; }
        saidaArr[i] = s / c;
      }
      suavizado = saidaArr;
    }

    /* 4. topo da multidão: alto à direita do texto, descendo até ele */
    const bordaTexto = obstaculos.reduce((m, r) => Math.max(m, r.x1), 0);
    const contorno = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = i * PASSO_CONTORNO;
      const topo = opcoes.topo + (opcoes.junto - opcoes.topo) * (1 - suave(bordaTexto, bordaTexto + opcoes.rampa, x));
      contorno[i] = Math.min(A + 200, Math.max(topo, suavizado[i]) + opcoes.ondulacao * Math.sin(x / 64));
    }

    const ler = (arr) => function (x) {
      const k = Math.min(n - 1, Math.max(0, x / PASSO_CONTORNO));
      const i = Math.floor(k), j = Math.min(n - 1, i + 1);
      return arr[i] + (arr[j] - arr[i]) * (k - i);
    };
    return ler(contorno);
  }

  /* Caixas do texto, em coordenadas do SVG, sem a animação de entrada. */
  function medirObstaculos(seletor, svg) {
    if (!seletor) return [];
    const ctm = svg.getScreenCTM();
    if (!ctm) return [];
    const inversa = ctm.inverse();
    const paraSvg = (x, y) => {
      const p = svg.createSVGPoint();
      p.x = x; p.y = y;
      return p.matrixTransform(inversa);
    };
    return Array.prototype.map.call(document.querySelectorAll(seletor), (el) => {
      let r;
      if (el.tagName === 'IMG') r = el.getBoundingClientRect();
      else {
        const faixa = document.createRange();
        faixa.selectNodeContents(el);
        r = faixa.getBoundingClientRect();
      }
      const transformacao = getComputedStyle(el).transform;
      let dx = 0, dy = 0;
      if (transformacao && transformacao !== 'none' && global.DOMMatrixReadOnly) {
        const m = new DOMMatrixReadOnly(transformacao);
        dx = m.m41; dy = m.m42;
      }
      const a = paraSvg(r.left - dx, r.top - dy), b = paraSvg(r.right - dx, r.bottom - dy);
      return { x0: a.x, y0: a.y, x1: b.x, y1: b.y };
    }).filter((r) => r.x1 > r.x0 && r.y1 > r.y0);
  }

  /* ---------- 4. pessoas ----------
     Bustos sem rosto, como nas ilustrações de público do governo. A roupa
     usa só as 5 cores da paleta; pele e cabelo são as "cores adicionais"
     que o padrão reserva para a diversidade (categorias de cor/raça do IBGE:
     brancos, pardos, pretos, amarelos e indígenas). */

  const PELES = ['#F6DCC6', '#EBC09E', '#D6A077', '#B67D54', '#8D5B3B', '#5F3C27'];
  const CABELOS = [
    ['#17171C', 34], ['#2E1D14', 22], ['#5A3A24', 14], ['#8C5E34', 7],
    ['#C9A266', 6], ['#8F959C', 10], ['#DADDE0', 7],
  ];
  const PENTEADOS = [['curto', 26], ['lateral', 16], ['longo', 22], ['crespo', 12], ['coque', 10], ['careca', 8]];

  function sortear(rnd, lista) {
    if (typeof lista[0] !== 'object') return lista[Math.floor(rnd() * lista.length)];
    const total = lista.reduce((s, it) => s + it[1], 0);
    let x = rnd() * total;
    for (const it of lista) { x -= it[1]; if (x <= 0) return it[0]; }
    return lista[lista.length - 1][0];
  }

  /* Sorteia o perfil de uma pessoa. "prof" vai de 0 (fundo) a 1 (frente):
     no fundo as roupas são frias e se fundem com a bolha; na frente entram
     o branco e o dourado. Uniformes (capacete, quepe) só nas da frente,
     onde o detalhe aparece. */
  function perfil(rnd, cor, prof) {
    const frente = prof > 0.45;
    const roupa = sortear(rnd, [
      ['camisa', 24], ['terno', 20], ['camiseta', 26], ['blusa', 18],
      ['colete', frente ? 3 : 0], ['farda', frente ? 4 : 0],
    ]);
    const tons = [
      [cor.dominante, 3 - prof * 1.4], [cor.secundaria, 4 - prof * 2], [cor.apoio, 3 - prof],
      [cor.papel, 0.8 + prof * 2.4], [cor.destaque, 0.25 + prof * 0.45],
    ];
    const p = {
      roupa: roupa,
      pele: sortear(rnd, PELES),
      cabelo: sortear(rnd, CABELOS),
      penteado: sortear(rnd, PENTEADOS),
      largura: 0.92 + rnd() * 0.18,
      oculos: rnd() < 0.22,
      cracha: rnd() < 0.35,
      brinco: rnd() < 0.35,
      gravata: null,
      chapeu: null,
      tom: sortear(rnd, [[null, 6], ['luz', 2], ['sombra', 2]]),
    };
    if (roupa === 'terno') p.corRoupa = sortear(rnd, [[cor.dominante, 2], [cor.secundaria, 1]]);
    else if (roupa === 'colete') { p.corRoupa = cor.destaque; p.chapeu = 'capacete'; }
    else if (roupa === 'farda') { p.corRoupa = sortear(rnd, [cor.dominante, cor.papel]); p.chapeu = 'quepe'; }
    else if (roupa === 'camisa') p.corRoupa = sortear(rnd, [[cor.papel, 3], [cor.apoio, 1]]);
    else p.corRoupa = sortear(rnd, tons);
    if ((roupa === 'camisa' && rnd() < 0.55) || (roupa === 'terno' && rnd() < 0.85)) {
      p.gravata = sortear(rnd, [cor.destaque, cor.secundaria, cor.dominante].filter((c) => c !== p.corRoupa));
    }
    if (p.chapeu && (p.penteado === 'crespo' || p.penteado === 'coque')) p.penteado = 'curto';
    return p;
  }

  const FRENTE_CABELO = {
    curto: 'M-27 -150C-30 -182 -14 -190 0 -190C16 -190 30 -182 27 -150C25 -164 14 -172 0 -172C-14 -172 -24 -166 -27 -150Z',
    lateral: 'M-27 -146C-31 -184 -10 -192 4 -190C22 -188 32 -176 27 -146C24 -160 22 -168 12 -170C2 -166 -14 -168 -27 -146Z',
    longo: 'M-28 -138C-35 -184 -12 -193 0 -193C14 -193 35 -184 28 -138C26 -160 18 -172 0 -174C-18 -172 -26 -160 -28 -138Z',
    crespo: 'M-29 -150C-33 -186 -14 -194 0 -194C16 -194 33 -186 29 -150C26 -166 14 -174 0 -174C-14 -174 -26 -166 -29 -150Z',
    coque: 'M-27 -152C-29 -182 -14 -188 0 -188C16 -188 29 -182 27 -152C24 -166 14 -171 0 -171C-14 -171 -24 -166 -27 -152Z',
    careca: 'M-27 -144C-28 -158 -25 -164 -21 -167L-23 -146ZM27 -144C28 -158 25 -164 21 -167L23 -146Z',
  };

  /* Desenha a pessoa com a base do busto em (0, 0); altura total ~192.
     detalhe: 0 = variante pequena (só o essencial), 1 = normal,
     2 = variante grande (crachá, bolso, botões, brinco, reflexos). */
  function desenharPessoa(g, p, cor, detalhe, recortes) {
    const w = p.largura;
    const ombro = (lado) => r1(lado * 62 * w);
    const tronco = 'M' + ombro(-1) + ' 0L' + ombro(-1) + ' -58C' + ombro(-1) + ' -92 ' + r1(-42 * w) + ' -104 -18 -107' +
      'L18 -107C' + r1(42 * w) + ' -104 ' + ombro(1) + ' -92 ' + ombro(1) + ' -58L' + ombro(1) + ' 0Z';
    const ladoDaSombra = 'M14 -107L18 -107C' + r1(42 * w) + ' -104 ' + ombro(1) + ' -92 ' + ombro(1) + ' -58L' + ombro(1) + ' 0L14 0Z';
    const chapeu = detalhe > 0 ? p.chapeu : null;

    /* cabelo que fica atrás da cabeça */
    if (p.penteado === 'longo') no('path', { d: 'M-33 -152C-38 -198 38 -198 33 -152L37 -102C20 -95 -20 -95 -37 -102Z', fill: p.cabelo }, g);
    if (p.penteado === 'crespo') no('circle', { cx: 0, cy: -160, r: 43, fill: p.cabelo }, g);
    if (p.penteado === 'coque') no('circle', { cx: 0, cy: -192, r: 15, fill: p.cabelo }, g);

    /* pescoço */
    no('rect', { x: -11, y: -126, width: 22, height: 28, fill: p.pele }, g);
    no('rect', { x: -11, y: -126, width: 22, height: 12, fill: sombreado(p.pele, 0.4) }, g);

    /* roupa (o tom de luz ou sombra já vem calculado na cor do tronco) */
    const corTronco = p.tom ? misturado(p.corRoupa, p.tom === 'luz' ? '#FFFFFF' : '#000000', 0.2) : p.corRoupa;
    no('path', { d: tronco, fill: corTronco }, g);
    if (p.roupa === 'camiseta' || p.roupa === 'colete') no('path', { d: 'M-18 -107C-12 -93 12 -93 18 -107Z', fill: p.pele }, g);
    if (p.roupa === 'blusa') no('path', { d: 'M-19 -107L0 -80L19 -107Z', fill: p.pele }, g);
    if (p.roupa === 'terno') {
      no('path', { d: 'M-20 -107L0 -48L20 -107Z', fill: cor.papel }, g);
      if (detalhe > 0) {
        no('path', { d: 'M-20 -107L0 -48L-12 -60L-28 -92Z', fill: sombreado(corTronco, 0.4) }, g);
        no('path', { d: 'M20 -107L0 -48L12 -60L28 -92Z', fill: sombreado(corTronco, 0.4) }, g);
      }
    }
    if (p.roupa === 'camisa' && detalhe > 0) {
      no('path', { d: 'M-18 -107L0 -94L-9 -83Z', fill: sombreado(corTronco, 0.3) }, g);
      no('path', { d: 'M18 -107L0 -94L9 -83Z', fill: sombreado(corTronco, 0.3) }, g);
    }
    if (p.roupa === 'colete' && detalhe > 0) {
      no('rect', { x: ombro(-1), y: -62, width: r1(124 * w), height: 9, fill: iluminado(corTronco, 0.7) }, g);
      no('rect', { x: ombro(-1), y: -40, width: r1(124 * w), height: 9, fill: iluminado(corTronco, 0.7) }, g);
    }
    if (p.roupa === 'farda') {
      no('path', { d: 'M-16 -107L0 -92L16 -107Z', fill: p.corRoupa === cor.papel ? cor.dominante : cor.papel }, g);
      if (detalhe > 0) {
        no('rect', { x: r1(-56 * w), y: -100, width: 22, height: 8, rx: 3, fill: cor.destaque }, g);
        no('rect', { x: r1(56 * w) - 22, y: -100, width: 22, height: 8, rx: 3, fill: cor.destaque }, g);
        no('circle', { cx: 0, cy: -70, r: 3.5, fill: cor.destaque }, g);
        no('circle', { cx: 0, cy: -48, r: 3.5, fill: cor.destaque }, g);
      }
    }
    if (p.gravata && detalhe > 0) {
      const fim = p.roupa === 'terno' ? -56 : -34;
      no('path', { d: 'M-5 -95L5 -95L7 ' + (fim + 8) + 'L0 ' + fim + 'L-7 ' + (fim + 8) + 'Z', fill: p.gravata }, g);
      no('path', { d: 'M-6 -102L6 -102L4 -94L-4 -94Z', fill: p.gravata }, g);
    }

    /* variante grande: bolso, botões, crachá */
    if (detalhe > 1) {
      if (p.roupa === 'camisa') {
        no('rect', { x: r1(-44 * w), y: -72, width: 20, height: 18, rx: 2, fill: sombreado(corTronco, 0.2) }, g);
        if (!p.gravata) [-82, -62, -42].forEach((y) => no('circle', { cx: 0, cy: y, r: 2.4, fill: sombreado(corTronco, 0.4) }, g));
      }
      if (p.cracha && (p.roupa === 'camisa' || p.roupa === 'camiseta' || p.roupa === 'blusa') && !p.gravata) {
        no('path', { d: 'M-14 -104L-6 -58M14 -104L6 -58', fill: 'none', stroke: cor.secundaria, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
        no('rect', { x: -12, y: -60, width: 24, height: 30, rx: 3, fill: cor.papel }, g);
        no('rect', { x: -12, y: -60, width: 24, height: 9, rx: 3, fill: cor.secundaria }, g);
        no('rect', { x: -7, y: -45, width: 14, height: 3, fill: sombreado(cor.papel, 0.5) }, g);
        no('rect', { x: -7, y: -39, width: 10, height: 3, fill: sombreado(cor.papel, 0.3) }, g);
      }
    }
    sombra(no('path', { d: ladoDaSombra }, g), 0.2);

    /* cabeça (sem rosto) */
    no('ellipse', { cx: -26, cy: -150, rx: 5, ry: 8, fill: p.pele }, g);
    no('ellipse', { cx: 26, cy: -150, rx: 5, ry: 8, fill: p.pele }, g);
    no('ellipse', { cx: 0, cy: -152, rx: 26, ry: 32, fill: p.pele }, g);
    /* sombra do rosto: recortada à cabeça e à orelha, onde tudo é pele */
    no('path', {
      d: 'M8 -183C24 -178 30 -160 26 -140C22 -126 12 -120 0 -120C14 -130 20 -150 8 -183Z',
      fill: sombreado(p.pele, 0.2), 'clip-path': 'url(#' + recortes.rosto + ')',
    }, g);

    /* cabelo da frente */
    no('path', { d: FRENTE_CABELO[p.penteado], fill: p.cabelo }, g);
    if (detalhe > 0) {
      /* brilho do cabelo: sobre o cabelo é cor sólida; na cabeça raspada
         ele cai em pele e fundo, então continua mesclado */
      const brilho = no('path', { d: 'M-18 -184C-10 -189 4 -190 12 -187C2 -184 -8 -182 -18 -178Z' }, g);
      if (p.penteado === 'careca') {
        brilho.setAttribute('fill', iluminado(p.pele, 0.2));
        brilho.setAttribute('clip-path', 'url(#' + recortes.rosto + ')');
      } else brilho.setAttribute('fill', iluminado(p.cabelo, 0.2));
    }
    if (detalhe > 1 && p.brinco && (p.penteado === 'longo' || p.penteado === 'coque' || p.penteado === 'crespo')) {
      no('circle', { cx: -26, cy: -139, r: 3.2, fill: cor.destaque }, g);
      no('circle', { cx: 26, cy: -139, r: 3.2, fill: cor.destaque }, g);
    }

    if (p.oculos && detalhe > 0) {
      const armacao = { fill: 'none', stroke: cor.dominante, 'stroke-width': 2.6 };
      no('rect', Object.assign({ x: -21, y: -158, width: 17, height: 12, rx: 5 }, armacao), g);
      no('rect', Object.assign({ x: 4, y: -158, width: 17, height: 12, rx: 5 }, armacao), g);
      no('path', Object.assign({ d: 'M-4 -153L4 -153' }, armacao), g);
    }
    if (chapeu === 'capacete') {
      no('path', { d: 'M-30 -165C-30 -202 30 -202 30 -165Z', fill: cor.destaque }, g);
      no('rect', { x: -35, y: -169, width: 70, height: 7, rx: 3.5, fill: cor.destaque }, g);
      no('path', {
        d: 'M-20 -188C-12 -196 4 -198 12 -194C0 -192 -10 -188 -16 -180Z',
        fill: iluminado(cor.destaque, 0.5), 'clip-path': 'url(#' + recortes.capacete + ')',
      }, g);
    }
    if (chapeu === 'quepe') {
      no('path', { d: 'M-31 -176C-34 -200 34 -200 31 -176Z', fill: cor.papel }, g);
      no('rect', { x: -27, y: -180, width: 54, height: 9, fill: cor.dominante }, g);
      no('path', { d: 'M-26 -172C-10 -165 10 -165 26 -172L27 -175L-27 -175Z', fill: cor.dominante }, g);
      no('circle', { cx: 0, cy: -184, r: 4, fill: cor.destaque }, g);
    }
  }

  /* Ícone do Font Awesome desenhado num <canvas> e guardado como imagem:
     assim ele sai igual no PDF e no PPTX, que não carregam a fonte. */
  function imagemIcone(codigo, cor, lado) {
    if (!document.fonts || !document.fonts.check('900 ' + lado + 'px ' + FONTE_ICONES, codigo)) return '';
    const escala = 3, tam = lado * escala;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = tam;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.font = '900 ' + Math.round(tam * 0.86) + 'px ' + FONTE_ICONES;
    ctx.fillStyle = cor;
    const m = ctx.measureText(codigo);
    const largura = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
    const altura = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    ctx.fillText(codigo, (tam - largura) / 2 + m.actualBoundingBoxLeft, (tam - altura) / 2 + m.actualBoundingBoxAscent);
    return canvas.toDataURL('image/png');
  }

  /* Balão de fala: a voz do usuário que chega à Ouvidoria. Superfície
     branca com cantos de 16px (--surface-rounder-lg) na camada 2. */
  function desenharBalao(g, cor, sinal, filtro) {
    const corpo = no('g', { filter: 'url(#' + filtro + ')' }, g);
    no('path', { d: 'M8 -16L-2 6L28 -14Z', fill: cor.papel }, corpo);
    no('rect', { x: 0, y: -64, width: 76, height: 54, rx: 16, fill: cor.papel }, corpo);
    const corIcone = { fala: cor.secundaria, estrela: cor.destaque, navio: cor.dominante }[sinal];
    const icone = imagemIcone(ICONES[sinal], corIcone, 30);
    if (icone) no('image', { href: icone, x: 23, y: -52, width: 30, height: 30 }, g);
    else if (sinal === 'estrela') no('path', { d: estrela(38, -37, 15, 6.5, 5), fill: cor.destaque }, g);
    else [0, 1, 2].forEach((i) => no('circle', { cx: 22 + i * 16, cy: -37, r: 6, fill: corIcone }, g));
  }

  /* ---------- 5. cenas ---------- */

  const cenas = {};

  /* Capa: o público da Carta de Serviços. A multidão ocupa toda a área
     livre da tela e contorna o texto; atrás dela, a bolha azul granulada,
     o sol de anéis e a padronagem de pontos. */
  cenas.capa = function (svg, cor, rnd, id, contexto) {
    const L = contexto.largura, A = contexto.altura;
    /* a multidão ocupa a parte de baixo; as fileiras de trás sobem até 72%
       da altura, em degraus, como a arquibancada de um estádio */
    const TOPO = Math.round(A * 0.72);
    const obstaculos = contexto.obstaculos;
    const contorno = calcularContorno(obstaculos, L, A, {
      /* folgas na escala de espaçamento do DS (múltiplos de 8px) */
      folgaX: 24, folgaY: 32, alargar: 16, suavizar: 16,
      topo: TOPO, junto: TOPO, rampa: 1, ondulacao: 5,
    });

    /* Desempenho: cada camada é um <svg> próprio, do tamanho do que
       contém: o hover e a entrada redesenham só a fileira que muda, nunca
       a multidão inteira. Cada camada leva os próprios <defs>, para sair
       inteira também na captura do PPTX. */
    const camadas = [];
    function camada(prof, caixa) {
      const c = contexto.novaCamada(caixa);
      camadas.push({ el: c.svg, prof: prof });
      return c;
    }
    function filtroElevacao(defs, nome, camadaDs) {
      const f = no('filter', { id: id(nome), x: '-40%', y: '-40%', width: '180%', height: '200%' }, defs);
      no('feDropShadow', { dx: 0, dy: ELEVACAO[camadaDs], stdDeviation: 3, 'flood-color': '#000000', 'flood-opacity': 0.16 }, f);
      return id(nome);
    }

    /* textura primeiro: a ordem dos sorteios define o desenho */
    const textura = texturaGranulada(rnd, 200, 0.45);

    /* elementos de fundo */
    /* Formas de fundo na página inteira (Fundamentos › Ilustração, elementos
       de fundo; Superfície, cantos arredondados e pílula). Atrás da bolha:
       placas, pílulas, um círculo e grades de pontos por cima delas. */
    const TELA = { x: 0, y: 0, w: L, h: A };
    const marinhoClaro = iluminado(cor.dominante, 0.3);
    const cFundo = camada(0.1, TELA);
    const pontos = no('pattern', { id: id('pontos'), width: 28, height: 28, patternUnits: 'userSpaceOnUse' }, cFundo.defs);
    no('circle', { cx: 14, cy: 14, r: 2.8, fill: cor.papel }, pontos);
    function placa(x, y, w, h, raio, preenchimento, comSombra) {
      no('rect', { x: x, y: y, width: w, height: h, rx: raio, fill: preenchimento }, cFundo.svg);
      if (comSombra) {
        no('rect', { x: x + w / 2, y: y, width: w / 2, height: h, fill: sombreado(preenchimento, 0.2) }, cFundo.svg)
          .setAttribute('clip-path', 'inset(0 0 0 0 round 0 ' + raio + 'px ' + raio + 'px 0)');
      }
    }
    placa(-40, -80, 300, 560, 56, cor.apoio, true);
    placa(1034, 176, 204, 400, 40, cor.apoio, true);
    placa(170, 680, 540, 150, 75, cor.secundaria, false);
    placa(1250, 610, 580, 170, 85, marinhoClaro, false);
    no('circle', { cx: 830, cy: 330, r: 150, fill: cor.secundaria }, cFundo.svg);
    no('path', { d: 'M980 330A150 150 0 0 1 680 330Z', fill: sombreado(cor.secundaria, 0.2) }, cFundo.svg);
    [[40, 360, 560, 280], [1004, 64, 420, 336], [1290, 560, 560, 260], [560, 40, 280, 140]].forEach((r) => {
      no('rect', { x: r[0], y: r[1], width: r[2], height: r[3], fill: 'url(#' + id('pontos') + ')', opacity: 0.22 }, cFundo.svg);
    });

    const cBolha = camada(0.2, { x: 1180, y: -170, w: 840, h: 840 });
    const grao = no('pattern', { id: id('grao'), width: 200, height: 200, patternUnits: 'userSpaceOnUse' }, cBolha.defs);
    if (textura) no('image', { href: textura, width: 200, height: 200 }, grao);
    const recorte = no('path', {}, no('clipPath', { id: id('recorte') }, cBolha.defs));
    const bolha = criarBolha(rnd, 7, 0.06, 0.03);
    const fundoBolha = no('path', { fill: cor.secundaria }, cBolha.svg);
    const dentro = no('g', { 'clip-path': 'url(#' + id('recorte') + ')' }, cBolha.svg);
    sombra(no('circle', { cx: 1820, cy: 560, r: 380 }, dentro), 0.3);
    luz(no('circle', { cx: 1380, cy: 90, r: 240 }, dentro), 0.2);
    if (textura) mesclar(no('rect', { width: L, height: A }, dentro), 'url(#' + id('grao') + ')', 0.7);

    const cSol = camada(0.3, { x: 1726, y: 54, w: 128, h: 128 });
    const aneis = no('pattern', { id: id('aneis'), width: 26, height: 26, patternUnits: 'userSpaceOnUse' }, cSol.defs);
    no('circle', { cx: 13, cy: 13, r: 6, fill: 'none', stroke: '#000', 'stroke-width': 3.5 }, aneis);
    const sol = no('g', {}, cSol.svg);
    no('circle', { r: 58, fill: cor.destaque }, sol);
    mesclar(no('circle', { r: 58 }, sol), 'url(#' + id('aneis') + ')', 0.2);
    sombra(no('path', { d: 'M58 0A58 58 0 0 1 -41 41A58 58 0 0 0 58 0Z' }, sol), 0.3);

    /* na frente da bolha: círculo listrado, linha curva com pontas
       redondas, uma bolha menor e pequenos ícones geométricos (estilo
       abstrato da Ilustração do DS) */
    const rndDetalhes = aleatorio(SEMENTE + 1);
    const cDetalhes = camada(0.35, TELA);
    const listras = no('pattern', {
      id: id('listras'), width: 18, height: 18, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)',
    }, cDetalhes.defs);
    no('rect', { width: 6, height: 18, fill: cor.papel }, listras);
    [[1262, 214, 92], [560, 130, 80], [1770, 760, 70], [960, 560, 56]].forEach((c, k) => {
      no('circle', { cx: c[0], cy: c[1], r: c[2] }, no('clipPath', { id: id('listrado-' + k) }, cDetalhes.defs));
      no('rect', {
        x: c[0] - c[2], y: c[1] - c[2], width: 2 * c[2], height: 2 * c[2], fill: 'url(#' + id('listras') + ')',
        opacity: 0.85, 'clip-path': 'url(#' + id('listrado-' + k) + ')',
      }, cDetalhes.svg);
    });
    const bolhaMenor = criarBolha(rndDetalhes, 6, 0.12, 0);
    no('path', { d: bolhaMenor(1872, 412, 64, 0), fill: cor.apoio }, cDetalhes.svg);
    no('path', { d: bolhaMenor(96, 640, 52, 0), fill: cor.apoio }, cDetalhes.svg);
    const traco = { fill: 'none', stroke: cor.apoio, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    [['M1012 548C1062 452 984 358 1072 284S1146 150 1214 120', [1012, 548], [1214, 120]],
      ['M40 860C260 760 300 610 520 570S860 470 960 390', [40, 860], [960, 390]],
      ['M1380 860C1460 780 1600 840 1680 760S1820 640 1900 660', [1380, 860], [1900, 660]]].forEach((l) => {
      no('path', Object.assign({ d: l[0] }, traco), cDetalhes.svg);
      no('circle', { cx: l[1][0], cy: l[1][1], r: 6, fill: cor.apoio }, cDetalhes.svg);
      no('circle', { cx: l[2][0], cy: l[2][1], r: 6, fill: cor.apoio }, cDetalhes.svg);
    });
    const icone = Object.assign({}, traco, { stroke: cor.papel, opacity: 0.6 });
    const asterisco = (x, y) => no('path', Object.assign({ d: 'M' + x + ' ' + (y - 14) + 'L' + x + ' ' + (y + 14) + 'M' + (x - 12) + ' ' + (y - 7) + 'L' + (x + 12) + ' ' + (y + 7) + 'M' + (x - 12) + ' ' + (y + 7) + 'L' + (x + 12) + ' ' + (y - 7) }, icone), cDetalhes.svg);
    const hexagono = (x, y) => {
      const v = [0, 1, 2, 3, 4, 5].map((k) => { const a = Math.PI / 6 + k * Math.PI / 3; return r1(x + 15 * Math.cos(a)) + ' ' + r1(y + 15 * Math.sin(a)); });
      no('path', Object.assign({ d: 'M' + v.join('L') + 'Z' }, icone), cDetalhes.svg);
    };
    const mira = (x, y) => {
      no('circle', Object.assign({ cx: x, cy: y, r: 10 }, icone), cDetalhes.svg);
      no('path', Object.assign({ d: 'M' + x + ' ' + (y - 16) + 'L' + x + ' ' + (y + 16) + 'M' + (x - 16) + ' ' + y + 'L' + (x + 16) + ' ' + y }, icone), cDetalhes.svg);
    };
    const cruz = (x, y) => no('path', Object.assign({ d: 'M' + x + ' ' + (y - 14) + 'L' + x + ' ' + (y + 14) + 'M' + (x - 14) + ' ' + y + 'L' + (x + 14) + ' ' + y }, traco, { stroke: cor.destaque, 'stroke-width': 4 }), cDetalhes.svg);
    asterisco(1076, 94); asterisco(910, 92); asterisco(1540, 540);
    hexagono(1446, 392); hexagono(690, 640);
    mira(1660, 330); mira(130, 300); mira(1200, 780);
    cruz(1882, 210); cruz(330, 560); cruz(1110, 650);

    /* a multidão: fileiras de trás (pequenas, no alto) para a frente
       (grandes, embaixo); só entra quem cabe abaixo do contorno */
    /* a escala cresce de cima (fundo) para baixo (frente); a primeira
       fileira começa logo abaixo do topo da multidão */
    const S0 = 0.5, S1 = 0.88, YS0 = TOPO + 100, Y1 = 1140;
    const escalaEm = (y) => S0 + (S1 - S0) * limitar((y - YS0) / (Y1 - YS0));
    let Y0 = TOPO;
    while (Y0 - 198 * escalaEm(Y0) < TOPO) Y0 += 2;
    const cabe = (x, y, s) => {
      const cabeca = y - 198 * s, ombros = y - 104 * s;
      return cabeca >= contorno(x - 34 * s) && cabeca >= contorno(x + 34 * s) &&
        ombros >= contorno(x - 64 * s) && ombros >= contorno(x + 64 * s);
    };

    /* 1. lugares de cada fileira */
    const filas = [];
    let f = 0;
    for (let y = Y0; y <= Y1; y += 52 * escalaEm(y), f++) {
      const s = escalaEm(y), prof = (s - S0) / (S1 - S0);
      const fila = { y: y, s: s, prof: prof, detalhe: s < 0.78 ? 0 : s < 1.0 ? 1 : 2, lugares: [] };
      const passo = 76 * s;
      for (let x = L + passo * (0.4 + (f % 2) * 0.5); x > -passo; x -= passo * (0.88 + rnd() * 0.24)) {
        const sp = s * (0.94 + rnd() * 0.12);
        const xp = x + (rnd() - 0.5) * passo * 0.16;
        const yp = y + (rnd() - 0.5) * 10 * s;
        const pf = perfil(rnd, cor, prof);
        if (cabe(xp, yp, sp)) fila.lugares.push({ x: xp, y: yp, s: sp, perfil: pf, chegadaExtra: rnd() * 0.15 });
      }
      filas.push(fila);
    }

    /* 2. a base reta do busto não pode aparecer: quem está atrás fica um
       pouco à direita do primeiro da fileira da frente, que cobre a base
       (o ombro da frente é ~6% mais largo; 8·s de folga bastam). Depois a
       ponta da fileira é completada até encostar nesse limite, para a
       multidão chegar o mais perto possível do texto. */
    const maisAEsquerda = (lugares) => lugares.reduce((m, l) => Math.min(m, l.x), Infinity);
    for (let i = filas.length - 2; i >= 0; i--) {
      const fila = filas[i], frente = filas[i + 1].lugares;
      if (!frente.length) continue;
      const limite = maisAEsquerda(frente) + 8 * fila.s;
      fila.lugares = fila.lugares.filter((l) => l.x >= limite);
      const passo = 76 * fila.s;
      let primeiro = maisAEsquerda(fila.lugares);
      if (primeiro === Infinity) continue;
      while (primeiro - limite > passo * 0.3) {
        const x = Math.max(limite + rnd() * passo * 0.1, primeiro - passo * (0.88 + rnd() * 0.24));
        const sp = fila.s * (0.94 + rnd() * 0.12);
        const yp = fila.y + (rnd() - 0.5) * 10 * fila.s;
        const pf = perfil(rnd, cor, fila.prof);
        if (!cabe(x, yp, sp)) break;
        fila.lugares.push({ x: x, y: yp, s: sp, perfil: pf, chegadaExtra: rnd() * 0.15 });
        primeiro = x;
      }
    }

    /* 3. desenho: uma camada por fileira, do tamanho da fileira (com folga
       para a descida da entrada e para o destaque do hover) */
    const pessoas = [];
    filas.forEach((fila, i) => {
      if (!fila.lugares.length) return;
      const x0 = fila.lugares.reduce((m, l) => Math.min(m, l.x - 74 * l.s), Infinity);
      const x1 = fila.lugares.reduce((m, l) => Math.max(m, l.x + 74 * l.s), -Infinity);
      const y0 = fila.lugares.reduce((m, l) => Math.min(m, l.y - 272 * l.s), Infinity);
      const y1 = fila.lugares.reduce((m, l) => Math.max(m, l.y + 12), -Infinity);
      /* a caixa da camada não pode encostar no texto: se encostar, o
         navegador compõe o texto à parte e muda o antisserrilhado dele */
      let xi = x0;
      obstaculos.forEach((r) => { if (r.y1 > y0 && r.y0 < y1 && r.x1 > xi && r.x0 < xi) xi = r.x1 + 1; });
      const c = camada(0.4 + fila.prof * 0.9, { x: Math.floor(xi), y: Math.floor(y0), w: Math.ceil(x1 - xi), h: Math.ceil(y1 - y0) });
      /* profundidade: as fileiras do fundo recuam para o marinho da capa
         (equivale a uma camada preta de 30%, 20% ou 10%, conforme a distância) */
      const recuo = fila.prof < 0.15 ? 0.3 : fila.prof < 0.32 ? 0.2 : fila.prof < 0.5 ? 0.1 : 0;
      let grupo = c.svg;
      if (recuo) {
        const f = no('filter', { id: id('recuo-' + i), 'color-interpolation-filters': 'sRGB' }, c.defs);
        const ct = no('feComponentTransfer', {}, f);
        ['feFuncR', 'feFuncG', 'feFuncB'].forEach((canal) => no(canal, { type: 'linear', slope: 1 - recuo }, ct));
        grupo = no('g', { filter: 'url(#' + id('recuo-' + i) + ')' }, c.svg);
      }
      const filtro = filtroElevacao(c.defs, 'elevacao3-' + i, 3);
      /* recortes usados pelas camadas de luz e sombra que passariam do contorno */
      const recortes = { rosto: id('rosto-' + i), capacete: id('capacete-' + i) };
      const rosto = no('clipPath', { id: recortes.rosto }, c.defs);
      no('ellipse', { cx: 0, cy: -152, rx: 26, ry: 32 }, rosto);
      no('ellipse', { cx: 26, cy: -150, rx: 5, ry: 8 }, rosto);
      no('path', { d: 'M-30 -165C-30 -202 30 -202 30 -165Z' }, no('clipPath', { id: recortes.capacete }, c.defs));
      fila.lugares.forEach((l) => {
        const pg = no('g', {}, grupo);
        desenharPessoa(pg, l.perfil, cor, fila.detalhe, recortes);
        /* u: ordem de chegada pela fileira, como uma faixa que passa da
           frente (0) para trás (1); a fileira inteira aparece junta */
        const u = 1 - fila.prof;
        pessoas.push({
          g: pg, x: l.x, y: l.y, s: l.s, prof: fila.prof, u: u,
          chegada: 0.2 + u * 1.2,
          destaque: 0, elevada: false, filtro: filtro,
        });
      });
    });

    /* balões: a multidão "fala" — manifestação, avaliação e o setor aquaviário */
    const SINAIS = ['fala', 'estrela', 'navio'];
    /* donos espalhados pela largura da multidão (quantis em x) */
    const candidatas = pessoas.filter((p) => p.prof > 0.2 && p.prof < 0.75 && p.x > 1120 && p.x < L - 140)
      .sort((a, b) => a.x - b.x);
    const donos = candidatas.length ? SINAIS.map((sinal, i) =>
      candidatas[Math.floor((0.15 + (0.7 * i) / (SINAIS.length - 1)) * (candidatas.length - 1))]) : [];
    const caixaBaloes = donos.reduce((c, d) => {
      const e = 0.8 + d.s * 0.5, x = d.x + 16 * d.s, y = d.y - 198 * d.s;
      return { x0: Math.min(c.x0, x - 10 * e), y0: Math.min(c.y0, y - 90 * e), x1: Math.max(c.x1, x + 100 * e), y1: Math.max(c.y1, y + 20 * e) };
    }, { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
    let baloes = [];
    if (donos.length) {
      const cBaloes = camada(1.4, {
        x: Math.floor(caixaBaloes.x0), y: Math.floor(caixaBaloes.y0),
        w: Math.ceil(caixaBaloes.x1 - caixaBaloes.x0), h: Math.ceil(caixaBaloes.y1 - caixaBaloes.y0),
      });
      const filtroBalao = filtroElevacao(cBaloes.defs, 'elevacao2', 2);
      baloes = SINAIS.map((sinal, i) => {
        const g = no('g', {}, cBaloes.svg);
        desenharBalao(g, cor, sinal, filtroBalao);
        return { g: g, dono: donos[i] };
      });
    }

    function noSvg(cx, cy) {
      const m = svg.getScreenCTM();
      if (!m) return null;
      const pt = svg.createSVGPoint();
      pt.x = cx; pt.y = cy;
      return pt.matrixTransform(m.inverse());
    }

    /* te: segundos desde o começo da entrada; dt: segundos desde o último
       quadro. Devolve true enquanto ainda houver algo em movimento. */
    function desenhar(te, dt, ponteiro, parado) {
      let ativo = te < FIM_AUTOMATICO;

      /* fundo: fade in e fill (escala + fade), como no DS */
      definir(cFundo.svg, 'opacity', EASING.easeOut(fase(te, 0.2, DURACAO.moderado)).toFixed(3));
      definir(cDetalhes.svg, 'opacity', EASING.easeOut(fase(te, 0.6, DURACAO.lento)).toFixed(3));
      const kBolha = EASING.easeOut(fase(te, 0, DURACAO.muitoLento));
      const contornoBolha = bolha(1600, 250, 380 * (0.9 + 0.1 * kBolha), 0);
      definir(fundoBolha, 'd', contornoBolha);
      definir(recorte, 'd', contornoBolha);
      definir(cBolha.svg, 'opacity', kBolha.toFixed(3));
      const kSol = EASING.easeOut(fase(te, 0.3, DURACAO.lento));
      definir(sol, 'transform', 'translate(1790 118) scale(' + (0.6 + 0.4 * kSol).toFixed(3) + ')');
      definir(sol, 'opacity', kSol.toFixed(3));

      /* quem está sob o ponteiro: a pessoa mais à frente que o contém */
      let sob = null;
      const pt = ponteiro.dentro && !parado ? noSvg(ponteiro.cx, ponteiro.cy) : null;
      if (pt) {
        for (let i = pessoas.length - 1; i >= 0; i--) {
          const p = pessoas[i];
          if (Math.abs(pt.x - p.x) < 48 * p.s && pt.y < p.y && pt.y > p.y - 198 * p.s) { sob = p; break; }
        }
      }

      /* estado hover: sobe para a camada 3 em "rápido" (0,3 s) */
      const passoHover = 1 - Math.exp(-dt / (DURACAO.rapido / 3));
      pessoas.forEach((p) => {
        const k = EASING.easeOut(fase(te, p.chegada, DURACAO.moderado));
        const queda = (1 - k) * -48 * p.s;                 /* slide: desce para o lugar */
        const alvo = p === sob ? 1 : 0;
        p.destaque += (alvo - p.destaque) * passoHover;
        if (Math.abs(alvo - p.destaque) > 0.004) ativo = true; else p.destaque = alvo;
        const elevar = p.destaque > 0.02;
        if (elevar !== p.elevada) {
          p.elevada = elevar;
          if (elevar) p.g.setAttribute('filter', 'url(#' + p.filtro + ')');
          else p.g.removeAttribute('filter');
        }
        const y = p.y + queda - p.destaque * 12 * p.s;
        const s = p.s * (1 + p.destaque * 0.05);
        definir(p.g, 'transform', 'translate(' + r1(p.x) + ' ' + r1(y) + ') scale(' + s.toFixed(3) + ')');
        definir(p.g, 'opacity', limitar(k * 3).toFixed(3));
      });

      /* balões: fill (escala + fade) em "moderado", um depois do outro, e ficam */
      baloes.forEach((b, i) => {
        const k = parado ? 1 : EASING.easeOut(fase(te, 1.9 + i * 0.25, DURACAO.moderado));
        const d = b.dono;
        definir(b.g, 'transform', 'translate(' + r1(d.x + 16 * d.s) + ' ' + r1(d.y - 198 * d.s - d.destaque * 12 * d.s) + ') scale(' + (k * (0.8 + d.s * 0.5)).toFixed(3) + ')');
        definir(b.g, 'opacity', k.toFixed(3));
      });
      return ativo;
    }

    return { desenhar: desenhar };
  };
  cenas.capa.caixa = [1920, 1080];

  /* Capas de capítulo: as formas de fundo do DS na página inteira, em
     esquema MONOCROMÁTICO (Ilustração › Cor): todas as formas são tons da
     cor do capítulo, obtidos com luz e sombra soft-light em degraus de 10%.
     Padronagens e ícones usam a cor do texto do capítulo; o destaque usa a
     cor do filete (dourado, ou marinho na capa amarela). A textura
     (granulado e pontos) é uniforme na página inteira, com degradê leve. */
  cenas.capitulo = function (svg, cor, rnd, id, contexto) {
    const L = contexto.largura, A = contexto.altura;
    const ler = (nome, reserva) => contexto.estilo.getPropertyValue(nome).trim() || reserva;
    const base = ler('--capitulo-cor', cor.dominante);
    const tinta = ler('--capitulo-texto', cor.papel);
    const filete = ler('--capitulo-filete', cor.destaque);
    const tom = {
      claro: iluminado(base, 0.3), claro2: iluminado(base, 0.5),
      escuro: sombreado(base, 0.3), escuro2: sombreado(base, 0.5),
    };
    const TELA = { x: 0, y: 0, w: L, h: A };
    const camada = (caixa) => contexto.novaCamada(caixa);

    const textura = texturaGranulada(rnd, 200, 0.45);

    /* atrás: placas, pílula, círculo e grades de pontos */
    const cFundo = camada(TELA);
    const placa = (x, y, w, h, raio, preenchimento, comSombra) => {
      no('rect', { x: x, y: y, width: w, height: h, rx: raio, fill: preenchimento }, cFundo.svg);
      if (comSombra) {
        no('rect', { x: x + w / 2, y: y, width: w / 2, height: h, fill: sombreado(preenchimento, 0.2) }, cFundo.svg)
          .setAttribute('clip-path', 'inset(0 0 0 0 round 0 ' + raio + 'px ' + raio + 'px 0)');
      }
    };
    placa(1170, 110, 260, 560, 56, tom.claro, true);
    placa(1060, 760, 540, 170, 85, tom.escuro, false);
    placa(-60, -90, 320, 420, 56, tom.escuro, false);
    no('circle', { cx: 1530, cy: 830, r: 170, fill: tom.claro }, cFundo.svg);
    no('path', { d: 'M1700 830A170 170 0 0 1 1360 830Z', fill: sombreado(tom.claro, 0.2) }, cFundo.svg);

    /* a bolha grande, granulada, com luz e sombra */
    const cBolha = camada(TELA);
    const recorte = no('path', {}, no('clipPath', { id: id('recorte') }, cBolha.defs));
    const bolha = criarBolha(rnd, 7, 0.06, 0.03);
    const fundoBolha = no('path', { fill: tom.escuro }, cBolha.svg);
    const dentro = no('g', { 'clip-path': 'url(#' + id('recorte') + ')' }, cBolha.svg);
    sombra(no('circle', { cx: 1900, cy: 620, r: 380 }, dentro), 0.3);
    luz(no('circle', { cx: 1440, cy: 60, r: 260 }, dentro), 0.2);

    /* na frente: círculos listrados, bolhas menores, linhas e ícones */
    const cDetalhes = camada(TELA);
    const listras = no('pattern', {
      id: id('listras'), width: 18, height: 18, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)',
    }, cDetalhes.defs);
    no('rect', { width: 6, height: 18, fill: tinta }, listras);
    [[1330, 250, 90], [1820, 920, 80], [720, 990, 70], [470, 120, 66]].forEach((c, k) => {
      no('circle', { cx: c[0], cy: c[1], r: c[2] }, no('clipPath', { id: id('listrado-' + k) }, cDetalhes.defs));
      no('rect', {
        x: c[0] - c[2], y: c[1] - c[2], width: 2 * c[2], height: 2 * c[2], fill: 'url(#' + id('listras') + ')',
        opacity: 0.7, 'clip-path': 'url(#' + id('listrado-' + k) + ')',
      }, cDetalhes.svg);
    });
    const bolhaMenor = criarBolha(aleatorio(SEMENTE + 1), 6, 0.12, 0);
    no('path', { d: bolhaMenor(1880, 600, 60, 0), fill: tom.claro2 }, cDetalhes.svg);
    no('path', { d: bolhaMenor(110, 900, 52, 0), fill: tom.claro }, cDetalhes.svg);
    const traco = { fill: 'none', stroke: tom.claro2, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    [['M1100 990C1200 870 1300 910 1420 810S1620 650 1760 670', [1100, 990], [1760, 670]],
      ['M1240 70C1320 150 1420 110 1520 190S1700 260 1790 230', [1240, 70], [1790, 230]]].forEach((l) => {
      no('path', Object.assign({ d: l[0] }, traco), cDetalhes.svg);
      no('circle', { cx: l[1][0], cy: l[1][1], r: 6, fill: tom.claro2 }, cDetalhes.svg);
      no('circle', { cx: l[2][0], cy: l[2][1], r: 6, fill: tom.claro2 }, cDetalhes.svg);
    });
    const icone = Object.assign({}, traco, { stroke: tinta, opacity: 0.55 });
    const g = cDetalhes.svg;
    const asterisco = (x, y) => no('path', Object.assign({ d: 'M' + x + ' ' + (y - 14) + 'L' + x + ' ' + (y + 14) + 'M' + (x - 12) + ' ' + (y - 7) + 'L' + (x + 12) + ' ' + (y + 7) + 'M' + (x - 12) + ' ' + (y + 7) + 'L' + (x + 12) + ' ' + (y - 7) }, icone), g);
    const hexagono = (x, y) => {
      const v = [0, 1, 2, 3, 4, 5].map((k) => { const a = Math.PI / 6 + k * Math.PI / 3; return r1(x + 15 * Math.cos(a)) + ' ' + r1(y + 15 * Math.sin(a)); });
      no('path', Object.assign({ d: 'M' + v.join('L') + 'Z' }, icone), g);
    };
    const mira = (x, y) => {
      no('circle', Object.assign({ cx: x, cy: y, r: 10 }, icone), g);
      no('path', Object.assign({ d: 'M' + x + ' ' + (y - 16) + 'L' + x + ' ' + (y + 16) + 'M' + (x - 16) + ' ' + y + 'L' + (x + 16) + ' ' + y }, icone), g);
    };
    const cruz = (x, y) => no('path', Object.assign({ d: 'M' + x + ' ' + (y - 14) + 'L' + x + ' ' + (y + 14) + 'M' + (x - 14) + ' ' + y + 'L' + (x + 14) + ' ' + y }, traco, { stroke: filete, 'stroke-width': 4 }), g);
    asterisco(1150, 430); asterisco(1880, 80); asterisco(640, 60);
    hexagono(1610, 520); hexagono(940, 1010);
    mira(1380, 640); mira(1760, 990);
    cruz(1090, 300); cruz(1900, 420);

    /* textura da capa inteira: granulado e pontos espaçados por igual em
       toda a página, sob um degradê leve (mais presente no alto à direita,
       mais suave embaixo à esquerda). Fica por cima das formas e por baixo
       do texto. */
    const cTextura = camada(TELA);
    const degrade = no('linearGradient', { id: id('degrade'), x1: 1, y1: 0, x2: 0, y2: 1 }, cTextura.defs);
    no('stop', { offset: 0, 'stop-color': '#FFFFFF', 'stop-opacity': 1 }, degrade);
    no('stop', { offset: 1, 'stop-color': '#FFFFFF', 'stop-opacity': 0.35 }, degrade);
    const mascara = no('mask', { id: id('mascara'), maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: L, height: A }, cTextura.defs);
    no('rect', { width: L, height: A, fill: 'url(#' + id('degrade') + ')' }, mascara);
    const pontos = no('pattern', { id: id('pontos'), width: 34, height: 34, patternUnits: 'userSpaceOnUse' }, cTextura.defs);
    no('circle', { cx: 17, cy: 17, r: 2.2, fill: tinta }, pontos);
    const grao = no('pattern', { id: id('grao'), width: 200, height: 200, patternUnits: 'userSpaceOnUse' }, cTextura.defs);
    if (textura) no('image', { href: textura, width: 200, height: 200 }, grao);
    const texturas = no('g', { mask: 'url(#' + id('mascara') + ')' }, cTextura.svg);
    no('rect', { width: L, height: A, fill: 'url(#' + id('pontos') + ')', opacity: 0.16 }, texturas);
    if (textura) no('rect', { width: L, height: A, fill: 'url(#' + id('grao') + ')', opacity: 0.45 }, texturas);

    function desenhar(te) {
      definir(cTextura.svg, 'opacity', EASING.easeOut(fase(te, 0.2, DURACAO.lento)).toFixed(3));
      definir(cFundo.svg, 'opacity', EASING.easeOut(fase(te, 0.1, DURACAO.moderado)).toFixed(3));
      const kBolha = EASING.easeOut(fase(te, 0, DURACAO.muitoLento));
      const contornoBolha = bolha(1640, 300, 380 * (0.9 + 0.1 * kBolha), 0);
      definir(fundoBolha, 'd', contornoBolha);
      definir(recorte, 'd', contornoBolha);
      definir(cBolha.svg, 'opacity', kBolha.toFixed(3));
      definir(cDetalhes.svg, 'opacity', EASING.easeOut(fase(te, 0.4, DURACAO.lento)).toFixed(3));
      return te < FIM_AUTOMATICO;
    }
    return { desenhar: desenhar };
  };
  cenas.capitulo.caixa = [1920, 1080];

  /* ---------- 6. montagem, movimento e congelamento ---------- */

  const instancias = [];
  let quadroId = 0;
  let inicio = 0;
  let parado = false;
  const ponteiro = { cx: 0, cy: 0, dentro: false };

  function movimentoReduzido() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function montar(alvo) {
    const nome = alvo.dataset.ilustracao;
    const cena = cenas[nome];
    if (!cena || alvo.dataset.ilustracaoPronta) return;
    alvo.dataset.ilustracaoPronta = '1';
    alvo.setAttribute('aria-hidden', 'true');
    const L = cena.caixa[0], A = cena.caixa[1];
    const svg = no('svg', {
      viewBox: '0 0 ' + L + ' ' + A, width: '100%', height: '100%',
      preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true', focusable: 'false',
    });
    alvo.appendChild(svg);
    const id = (s) => 'ilu-' + nome + '-' + instancias.length + '-' + s;
    const pct = (v, total) => (100 * v / total).toFixed(4) + '%';
    const contexto = {
      largura: L, altura: A, obstaculos: medirObstaculos(alvo.dataset.desviar, svg),
      /* estilo calculado do lugar da ilustração: cores do capítulo etc. */
      estilo: getComputedStyle(alvo),
      /* pixels de CSS por unidade do desenho (1 na tela de 1920×1080) */
      escala: () => (alvo.clientWidth || L) / L,
      novaCamada: (c) => {
        const camadaSvg = no('svg', {
          viewBox: c.x + ' ' + c.y + ' ' + c.w + ' ' + c.h, preserveAspectRatio: 'none',
          'aria-hidden': 'true', focusable: 'false', overflow: 'visible',
        });
        camadaSvg.setAttribute('style', 'position:absolute;left:' + pct(c.x, L) + ';top:' + pct(c.y, A) +
          ';width:' + pct(c.w, L) + ';height:' + pct(c.h, A) + ';overflow:visible');
        alvo.appendChild(camadaSvg);
        return { svg: camadaSvg, defs: no('defs', {}, camadaSvg) };
      },
    };
    instancias.push(cena(svg, paleta(), aleatorio(SEMENTE), id, contexto));
  }

  function desenharTodas(te, dt) {
    let ativo = false;
    instancias.forEach((c) => { if (c.desenhar(te, dt, ponteiro, parado)) ativo = true; });
    return ativo;
  }

  let ultimo = 0;
  function quadro(agora) {
    quadroId = 0;
    if (!inicio) inicio = agora;
    const dt = ultimo ? Math.min(0.1, (agora - ultimo) / 1000) : 1 / 60;
    ultimo = agora;
    const ativo = desenharTodas((agora - inicio) / 1000, dt);
    if (ativo && !parado) quadroId = requestAnimationFrame(quadro);
    else ultimo = 0;
  }

  function pedirQuadro() {
    if (!quadroId && !parado && instancias.length) quadroId = requestAnimationFrame(quadro);
  }

  function pausar() {
    cancelAnimationFrame(quadroId);
    quadroId = 0;
  }

  function congelar() {
    pausar();
    parado = true;
    ponteiro.dentro = false;
    desenharTodas(FINAL, 1);
  }

  /* repete a animação de entrada do CSS no texto marcado com [data-entra] */
  function reiniciarTexto() {
    document.querySelectorAll('[data-entra]').forEach((el) => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  }

  function reiniciar() {
    if (parado || movimentoReduzido() || !instancias.length) return;
    pausar();
    inicio = 0;
    ultimo = 0;
    reiniciarTexto();
    pedirQuadro();
  }

  function comecar() {
    if (!instancias.length) return;
    if (parado || movimentoReduzido() || document.documentElement.classList.contains('vida-parado')) {
      congelar();
      return;
    }
    desenharTodas(0, 1 / 60);
    pedirQuadro();
  }

  /* Vidro ajustado ao texto: <div data-vidro-cobre="seletores">.
     Com data-vidro-margem="N", o vidro vira uma caixa em volta do texto
     com N px de folga igual nos quatro lados. Sem ela, só a largura é
     ajustada (5% maior que a borda direita do texto mais largo).
     A medida desconta a animação de entrada do texto. */
  function caixaDoTexto(el) {
    let r;
    if (el.tagName === 'IMG') r = el.getBoundingClientRect();
    else { const faixa = document.createRange(); faixa.selectNodeContents(el); r = faixa.getBoundingClientRect(); }
    const t = getComputedStyle(el).transform;
    const m = t && t !== 'none' && global.DOMMatrixReadOnly ? new DOMMatrixReadOnly(t) : { m41: 0, m42: 0 };
    return { x0: r.left - m.m41, y0: r.top - m.m42, x1: r.right - m.m41, y1: r.bottom - m.m42 };
  }

  function ajustarVidros() {
    document.querySelectorAll('[data-vidro-cobre]').forEach((vidro) => {
      const caixas = Array.prototype.map.call(document.querySelectorAll(vidro.dataset.vidroCobre), caixaDoTexto);
      if (!caixas.length) return;
      const pai = vidro.offsetParent ? vidro.offsetParent.getBoundingClientRect() : { left: 0, top: 0 };
      const x0 = Math.min.apply(null, caixas.map((c) => c.x0)) - pai.left;
      const y0 = Math.min.apply(null, caixas.map((c) => c.y0)) - pai.top;
      const x1 = Math.max.apply(null, caixas.map((c) => c.x1)) - pai.left;
      const y1 = Math.max.apply(null, caixas.map((c) => c.y1)) - pai.top;
      if (vidro.dataset.vidroMargem !== undefined) {
        const m = Number(vidro.dataset.vidroMargem) || 0;
        Object.assign(vidro.style, {
          left: Math.floor(x0 - m) + 'px', top: Math.floor(y0 - m) + 'px',
          width: Math.ceil(x1 - x0 + 2 * m) + 'px', height: Math.ceil(y1 - y0 + 2 * m) + 'px',
          right: 'auto', bottom: 'auto',
        });
      } else {
        vidro.style.width = Math.ceil(x1 * 1.05) + 'px';
      }
    });
  }

  function iniciar() {
    const alvos = document.querySelectorAll('[data-ilustracao]');
    if (!alvos.length) return;

    document.addEventListener('pointermove', (e) => {
      ponteiro.cx = e.clientX;
      ponteiro.cy = e.clientY;
      ponteiro.dentro = true;
      pedirQuadro();
    });
    document.documentElement.addEventListener('pointerleave', () => {
      ponteiro.dentro = false;
      pedirQuadro();
    });

    /* no visualizador: recomeça quando a tela entra, pausa quando sai */
    global.addEventListener('message', (e) => {
      const tipo = e.data && e.data.type;
      if (tipo === 'deck-ativo') reiniciar();
      else if (tipo === 'deck-inativo' && !parado) pausar();
    });

    /* PDF, PPTX e impressão: estado final (vida.js marca o <html>) */
    new MutationObserver(() => {
      if (!parado && document.documentElement.classList.contains('vida-parado')) congelar();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    global.addEventListener('beforeprint', congelar);

    /* o contorno depende do tamanho real do texto e os balões usam os
       ícones do Font Awesome: espera as fontes */
    const fontes = document.fonts && document.fonts.ready
      ? Promise.all([
        document.fonts.ready,
        document.fonts.load('900 30px ' + FONTE_ICONES, Object.keys(ICONES).map((k) => ICONES[k]).join('')).catch(() => null),
      ])
      : Promise.resolve();
    fontes.then(() => {
      ajustarVidros();
      alvos.forEach(montar);
      comecar();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  global.Ilustracao = { congelar: congelar, reiniciar: reiniciar, cenas: cenas };
})(window);
