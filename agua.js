/*
  agua.js — fundo de água (cáusticas) nos cartões do hub.

  Adaptado do "Caustics Background" do Kokonut UI (MIT, kokonutui.com),
  sem React: procura os elementos com [data-agua], põe um <canvas> WebGL2
  atrás do conteúdo e desenha a rede de luz de um fundo de piscina.
  Passar o ponteiro deixa ondas; o título faz sombra no fundo.

  Cores vêm do CSS do elemento: --agua-fundo e --agua-luz. Para um efeito
  mais leve: --agua-opacidade (0 = fundo transparente, só a luz aparece) e
  --agua-intensidade (0 a 1, força da luz).
  Sem WebGL2, o elemento fica com o fundo do CSS.
*/
(function () {
  // ondas vivas ao mesmo tempo; a nova substitui a mais antiga
  var ONDAS = 10;
  // distância entre as células de luz, em px (cartão pequeno, célula pequena)
  var CELULA = 70;
  // onde a sombra cai, a partir do que a projeta, em px
  var SOMBRA_X = 4;
  var SOMBRA_Y = 8;
  var SOMBRA_DESFOQUE = 3;
  // ponteiro mais rápido que isto (px/ms) deixa rastro
  var RASTRO_VELOCIDADE = 0.2;
  var RASTRO_INTERVALO = 70;
  // padrões de --agua-opacidade (fundo da água) e --agua-intensidade (luz)
  var OPACIDADE = 0.9;
  var INTENSIDADE = 1;

  var VERTEX = '#version 300 es\n' +
    'in vec2 aPos;\n' +
    'out vec2 vUv;\n' +
    'void main() {\n' +
    '  vUv = aPos * 0.5 + 0.5;\n' +
    '  gl_Position = vec4(aPos, 0.0, 1.0);\n' +
    '}';

  var FRAGMENT = '#version 300 es\n' +
    'precision highp float;\n' +
    'in vec2 vUv;\n' +
    'out vec4 o;\n' +
    'uniform vec2 uRes;\n' +
    'uniform float uTime;\n' +
    'uniform vec4 uOndas[' + ONDAS + '];\n' +
    'uniform sampler2D uMascara;\n' +
    'uniform vec3 uAgua;\n' +
    'uniform vec3 uLuz;\n' +
    'uniform vec2 uSombra;\n' +
    'uniform float uOpacidade;\n' +
    'uniform float uIntensidade;\n' +
    'const float TAU = 6.28318530718;\n' +
    'vec2 hash(vec2 p) {\n' +
    '  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));\n' +
    '  return fract(sin(p) * 43758.5453);\n' +
    '}\n' +
    // a rede de luz: as bordas entre células que se movem
    'float caustica(vec2 p, float t) {\n' +
    '  vec2 q = p;\n' +
    '  p += 0.34 * vec2(sin(p.y * 1.3 + t * 0.9), cos(p.x * 1.1 - t * 0.7));\n' +
    '  p += 0.12 * vec2(sin(p.y * 3.1 - t), cos(p.x * 2.7 + t * 1.2));\n' +
    '  vec2 n = floor(p);\n' +
    '  vec2 f = fract(p);\n' +
    '  float f1 = 8.0;\n' +
    '  float f2 = 8.0;\n' +
    '  for (int j = -1; j <= 1; j++) {\n' +
    '    for (int i = -1; i <= 1; i++) {\n' +
    '      vec2 g = vec2(float(i), float(j));\n' +
    '      vec2 c = 0.5 + 0.42 * sin(t + TAU * hash(n + g));\n' +
    '      vec2 r = g + c - f;\n' +
    '      float d = dot(r, r);\n' +
    '      if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }\n' +
    '    }\n' +
    '  }\n' +
    '  float borda = sqrt(f2) - sqrt(f1);\n' +
    '  float linha = pow(1.0 - smoothstep(0.0, 0.14, borda), 2.0);\n' +
    '  float halo = 1.0 - smoothstep(0.0, 0.32, borda);\n' +
    '  float brilho = 0.6 + 0.4 * sin(q.x * 0.55 + t * 0.6) * cos(q.y * 0.45 - t * 0.5);\n' +
    '  return (linha * 0.85 + halo * 0.18) * brilho;\n' +
    '}\n' +
    'void main() {\n' +
    '  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;\n' +
    '  vec2 desvio = vec2(0.0);\n' +
    '  float foco = 0.0;\n' +
    '  for (int k = 0; k < ' + ONDAS + '; k++) {\n' +
    '    vec4 r = uOndas[k];\n' +
    '    float idade = uTime - r.z;\n' +
    '    if (r.w <= 0.0 || idade < 0.0 || idade > 3.0) { continue; }\n' +
    '    vec2 d = px - r.xy;\n' +
    '    float dist = length(d);\n' +
    '    float x = dist - idade * 140.0;\n' +
    '    float env = r.w * exp(-idade * 1.1) * exp(-x * x / 900.0) / (1.0 + dist * 0.004);\n' +
    '    desvio += (d / max(dist, 1.0)) * sin(x * 0.14) * env * 12.0;\n' +
    '    foco += cos(x * 0.14) * env;\n' +
    '  }\n' +
    '  vec2 uv = (px + desvio) / ' + CELULA + '.0;\n' +
    '  float t = uTime * 0.5;\n' +
    '  float c = caustica(uv, t);\n' +
    // uma rede mais fina e fraca por baixo dá profundidade
    '  c = max(c, caustica(uv * 1.9 + 7.3, t * 0.8 + 3.0) * 0.22);\n' +
    '  c = clamp(c * (1.0 + foco * 1.2) + foco * 0.4, 0.0, 1.0);\n' +
    // o que flutua bloqueia a luz; a água entorta a sombra como entorta a luz
    '  vec2 balanco = vec2(sin(uTime * 0.7), cos(uTime * 0.55)) * 1.5;\n' +
    '  vec2 s = (px - uSombra - desvio * 1.4 - balanco) / uRes;\n' +
    '  float sombra = texture(uMascara, s).r;\n' +
    '  float luz = c * (1.0 - sombra * 0.9) * uIntensidade;\n' +
    '  vec3 fundo = uAgua * (1.0 - sombra * 0.08);\n' +
    '  vec3 cor = mix(fundo, uLuz, luz);\n' +
    '  float a = mix(uOpacidade, 1.0, luz);\n' +
    '  o = vec4(cor * a, a);\n' +
    '}';

  function compilar(gl, tipo, fonte) {
    var shader = gl.createShader(tipo);
    if (!shader) return null;
    gl.shaderSource(shader, fonte);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  // lê qualquer cor CSS pintando-a num pixel
  function paraRgb(cor, sonda) {
    sonda.clearRect(0, 0, 1, 1);
    sonda.fillStyle = cor;
    sonda.fillRect(0, 0, 1, 1);
    var d = sonda.getImageData(0, 0, 1, 1).data;
    return [d[0] / 255, d[1] / 255, d[2] / 255];
  }

  function criarAgua(gl) {
    var vertex = compilar(gl, gl.VERTEX_SHADER, VERTEX);
    var fragment = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    var programa = gl.createProgram();
    if (!(vertex && fragment && programa)) return null;
    gl.attachShader(programa, vertex);
    gl.attachShader(programa, fragment);
    gl.bindAttribLocation(programa, 0, 'aPos');
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return null;

    function u(nome) { return gl.getUniformLocation(programa, nome); }
    var un = {
      res: u('uRes'), time: u('uTime'), ondas: u('uOndas'), mascara: u('uMascara'),
      agua: u('uAgua'), luz: u('uLuz'), sombra: u('uSombra'), opacidade: u('uOpacidade'),
      intensidade: u('uIntensidade')
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    var mascara = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, mascara);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 1, 1, 0, gl.RED, gl.UNSIGNED_BYTE, new Uint8Array([0]));

    gl.useProgram(programa);
    gl.uniform1i(un.mascara, 0);
    gl.uniform2f(un.sombra, SOMBRA_X, SOMBRA_Y);

    return {
      tamanho: function (w, h, cssW, cssH) {
        gl.viewport(0, 0, w, h);
        gl.uniform2f(un.res, cssW, cssH);
      },
      mascara: function (origem) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, mascara);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, origem);
      },
      cores: function (agua, luz) {
        gl.uniform3f(un.agua, agua[0], agua[1], agua[2]);
        gl.uniform3f(un.luz, luz[0], luz[1], luz[2]);
      },
      forca: function (opacidade, intensidade) {
        gl.uniform1f(un.opacidade, opacidade);
        gl.uniform1f(un.intensidade, intensidade);
      },
      ondas: function (dados) { gl.uniform4fv(un.ondas, dados); },
      desenhar: function (tempo) {
        gl.uniform1f(un.time, tempo);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    };
  }

  // pinta numa máscara desfocada tudo que flutua ([data-sombra]), nas coordenadas do cartão
  function desenharMascara(tela, raiz) {
    var rect = raiz.getBoundingClientRect();
    tela.width = Math.max(1, Math.round(rect.width));
    tela.height = Math.max(1, Math.round(rect.height));
    var ctx = tela.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, tela.width, tela.height);
    ctx.filter = 'blur(' + SOMBRA_DESFOQUE + 'px)';
    ctx.fillStyle = 'white';
    raiz.querySelectorAll('[data-sombra]').forEach(function (el) {
      var caixa = el.getBoundingClientRect();
      var estilo = getComputedStyle(el);
      ctx.font = estilo.fontWeight + ' ' + estilo.fontSize + ' ' + estilo.fontFamily;
      ctx.textBaseline = 'alphabetic';
      var m = ctx.measureText(el.textContent || '');
      var base = caixa.top - rect.top + (caixa.height + m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2;
      ctx.fillText(el.textContent || '', caixa.left - rect.left, base);
    });
  }

  // cada palavra do título vira um <span data-sombra>, para a sombra acompanhar a quebra de linha
  function separarPalavras(el) {
    var palavras = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    palavras.forEach(function (p, i) {
      var s = document.createElement('span');
      s.setAttribute('data-sombra', '');
      s.textContent = p;
      el.appendChild(s);
      if (i < palavras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }

  function numero(estilo, nome, padrao) {
    var v = parseFloat(estilo.getPropertyValue(nome));
    return isNaN(v) ? padrao : v;
  }

  function iniciar(raiz) {
    var tela = document.createElement('canvas');
    tela.className = 'agua-tela';
    tela.setAttribute('aria-hidden', 'true');
    raiz.insertBefore(tela, raiz.firstChild);

    var gl = tela.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    var sonda = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    var agua = gl ? criarAgua(gl) : null;
    if (!(sonda && agua)) {
      tela.remove();
      return;
    }

    raiz.querySelectorAll('[data-agua-titulo]').forEach(separarPalavras);

    var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var telaMascara = document.createElement('canvas');
    var ondas = new Float32Array(ONDAS * 4);
    var nascimento = performance.now();
    function relogio() { return (performance.now() - nascimento) / 1000; }
    var proxima = 0;
    var raf = 0;
    var visivel = true;
    var largura = 0;
    var altura = 0;
    var mao = { x: 0, y: 0, t: 0, rastro: 0 };

    function gota(x, y, forca) {
      ondas.set([x, y, relogio(), forca], proxima * 4);
      proxima = (proxima + 1) % ONDAS;
      agua.ondas(ondas);
    }

    var estilo = getComputedStyle(raiz);
    agua.cores(
      paraRgb(estilo.getPropertyValue('--agua-fundo').trim() || '#DBEFF6', sonda),
      paraRgb(estilo.getPropertyValue('--agua-luz').trim() || '#FFFFFF', sonda)
    );
    agua.forca(numero(estilo, '--agua-opacidade', OPACIDADE), numero(estilo, '--agua-intensidade', INTENSIDADE));
    agua.ondas(ondas);

    function montar() {
      var rect = raiz.getBoundingClientRect();
      largura = rect.width;
      altura = rect.height;
      if (largura < 2 || altura < 2) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      tela.width = Math.round(largura * dpr);
      tela.height = Math.round(altura * dpr);
      agua.tamanho(tela.width, tela.height, largura, altura);
      desenharMascara(telaMascara, raiz);
      agua.mascara(telaMascara);
      agua.desenhar(semMovimento ? 8 : relogio());
    }

    function quadro() {
      raf = 0;
      if (!visivel) return;
      // painel escondido com opacidade 0 (ex.: ajuda fechada): não desenha, só espera
      var aparente = !raiz.checkVisibility || raiz.checkVisibility({ opacityProperty: true, visibilityProperty: true });
      if (aparente) agua.desenhar(relogio());
      raf = requestAnimationFrame(quadro);
    }
    function comecar() {
      if (!raf && visivel && !semMovimento) raf = requestAnimationFrame(quadro);
    }

    montar();
    raiz.classList.add('agua-ativa');
    comecar();

    // uma gota ao abrir, para mostrar que a água responde
    setTimeout(function () {
      if (!semMovimento) gota(largura * 0.7, altura * 0.3, 1.0);
    }, 700);

    // a fonte web pode chegar depois da primeira máscara
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(montar);
    new ResizeObserver(montar).observe(raiz);

    var naTela = true;
    new IntersectionObserver(function (entradas) {
      naTela = entradas[0].isIntersecting;
      visivel = naTela && document.visibilityState === 'visible';
      comecar();
    }).observe(raiz);
    document.addEventListener('visibilitychange', function () {
      visivel = naTela && document.visibilityState === 'visible';
      comecar();
    });

    if (semMovimento) return;

    function local(e) {
      var rect = raiz.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    raiz.addEventListener('pointerenter', function (e) {
      var p = local(e);
      gota(p.x, p.y, 0.6);
    });
    raiz.addEventListener('pointermove', function (e) {
      var p = local(e);
      var agora = e.timeStamp;
      var dt = Math.max(1, agora - mao.t);
      var velocidade = Math.hypot(p.x - mao.x, p.y - mao.y) / dt;
      if (mao.t && velocidade > RASTRO_VELOCIDADE && agora - mao.rastro > RASTRO_INTERVALO) {
        gota(p.x, p.y, Math.min(0.45, velocidade * 0.3));
        mao.rastro = agora;
      }
      mao.x = p.x;
      mao.y = p.y;
      mao.t = agora;
    });
    raiz.addEventListener('pointerleave', function () { mao.t = 0; });
    raiz.addEventListener('pointerdown', function (e) {
      var p = local(e);
      gota(p.x, p.y, 1.3);
    });
  }

  function tudo() { document.querySelectorAll('[data-agua]').forEach(iniciar); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tudo);
  else tudo();
})();
