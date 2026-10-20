/* deck.js — MANIFESTO ÚNICO do Guia (mesmo formato dos relatórios da Ouvidoria).
 *
 * Ordem das telas, blocos (capítulos) e o que entra em cada saída:
 *   - index.html      → apresentação navegável  (paraApresentacao)
 *   - relatorio.html  → versão A4 / PDF + PPTX  (paraRelatorio)
 *
 * Um item de `files` pode ser 'arquivo.html' (entra nas duas saídas) ou
 * { file, apresentacao: false } / { file, relatorio: false }.
 * Contador, pontos, breadcrumb, PDF e PPTX derivam daqui — nada de número
 * de página escrito à mão nas telas.
 *
 * O CI (scripts/validar.mjs) confere: arquivo existe, não há duplicata,
 * toda tela do diretório está no manifesto e toda tela interativa tem anexo. */

window.RELATORIO = {
  meta: {
    titulo: 'Guia Prático da Carta de Serviços · Ouvidoria ANTAQ',
    rodapeAnexo: 'Guia Prático da Carta de Serviços – Ouvidoria – ANTAQ',
    arquivoPptx: 'Guia-Carta-de-Servicos-ANTAQ.pptx',
  },

  blocos: [
    {
      block: 'Abertura', short: 'Abertura', tint: 0.35,
      files: ['slide-00.html', 'slide-um-minuto.html', 'slide-ficha.html', 'slide-sumario.html', 'slide-apresentacao.html',
        'slide-guia-cgu.html', 'slide-certificado.html'],
    },
    {
      block: 'Capítulo 1 · Entendendo a Carta', short: 'Entendendo a Carta', tint: 1,
      files: ['capa-1.html', 'slide-o-que-e.html', 'slide-conteudo-minimo.html', 'slide-e-servico.html'],
    },
    {
      block: 'Capítulo 2 · Papéis e responsabilidades', short: 'Papéis', tint: 0.85,
      files: ['capa-2.html', 'slide-papeis.html', 'slide-deveres.html'],
    },
    {
      block: 'Capítulo 3 · Passo a passo', short: 'Passo a passo', tint: 0.7,
      files: ['capa-3.html', 'slide-fluxo.html', 'slide-etapas.html', 'slide-calendario.html',
        'slide-ficha-servico.html', 'slide-formulario.html'],
    },
    {
      block: 'Capítulo 4 · Qualidade da informação', short: 'Qualidade', tint: 0.55,
      files: ['capa-4.html', 'slide-checklist.html', 'slide-linguagem.html', 'slide-erros.html'],
    },
    {
      block: 'Capítulo 5 · Monitoramento', short: 'Monitoramento', tint: 0.45,
      files: ['capa-5.html', 'slide-diagnostico.html', 'slide-indicadores.html', 'slide-insumos.html'],
    },
    {
      block: 'Capítulo 6 · Apêndice', short: 'Apêndice', tint: 0.3,
      files: ['capa-6.html', 'slide-normas.html', 'slide-inventario.html', 'slide-glossario.html'],
    },
    {
      block: 'Encerramento', short: 'Encerramento', tint: 0.2,
      files: ['slide-contatos.html'],
    },
  ],

  /* Telas interativas mostram só parte do conteúdo por vez. Para a versão A4
     não perder nada, cada uma declara o seletor dos blocos escondidos e como
     ler cada bloco. `txt(el, sel)` devolve o texto do primeiro `sel` em `el`. */
  anexos: {
    'slide-etapas.html': {
      titulo: 'As 11 etapas na ANTAQ — detalhamento completo', sel: '.etapa-foco',
      ler: (el, txt) => ({
        num: el.dataset.n || '',
        nome: txt(el, '.et-tit'),
        tag: txt(el, '.et-fase'),
        desc: Array.from(el.querySelectorAll('.et-lista li')).map((li) => '• ' + li.textContent.trim()).join(' ') +
          ' — Quem faz: ' + txt(el, '.et-quem') + '. Resultado: ' + txt(el, '.et-prod') +
          '. Prazo em norma: ' + txt(el, '.et-quando') + '. Base: ' + txt(el, '.et-base') + '.'
      })
    },
    'slide-normas.html': {
      titulo: 'Normas de referência', sel: '.tile',
      ler: (el, txt) => ({ num: el.dataset.badge || '', nome: el.dataset.title || '', tag: el.dataset.sub || '', desc: txt(el, '.tile-full') })
    },
    /* a tabela do inventário é montada por JS a partir de dados/servicos.js;
       o anexo lê os mesmos dados (relatorio.html carrega dados/servicos.js) */
    'slide-inventario.html': {
      titulo: 'Inventário dos serviços da Carta da ANTAQ',
      itens: () => window.CARTA.servicos.map((s) => ({
        num: s.unidade + ' ' + s.n,
        nome: s.nome,
        tag: window.CARTA.unidades[s.unidade],
        desc: 'Quanto tempo leva: ' + s.prazo +
          ' · Cita a Ouvidoria: ' + (s.citaOuvidoria ? 'sim' : 'não') +
          ' · Legislação: ' + (s.legislacao ? 'sim' : 'não') +
          ' · Links sem HTTPS: ' + s.linksHttp
      }))
    },
  },

  /* elementos a esconder antes de rasterizar cada tela para o PPTX */
  capturaPptx: {
    'slide-etapas.html': { esconder: '.setas' },
    'slide-inventario.html': { esconder: '.setas' },
  },
};

(function () {
  function normalizar(it) {
    if (typeof it === 'string') return { file: it, apresentacao: true, relatorio: true };
    return { file: it.file, apresentacao: it.apresentacao !== false, relatorio: it.relatorio !== false };
  }

  window.RELATORIO.paraApresentacao = function () {
    const out = [];
    this.blocos.forEach((b, bi) => {
      b.files.forEach((it) => {
        const n = normalizar(it);
        if (n.apresentacao) out.push({ file: n.file, block: b.block, blockShort: b.short, blockIndex: bi, tint: b.tint });
      });
    });
    return out;
  };

  window.RELATORIO.paraRelatorio = function () {
    const out = [];
    this.blocos.forEach((b) => {
      b.files.forEach((it) => {
        const n = normalizar(it);
        if (n.relatorio) out.push(n.file);
      });
    });
    return out;
  };

  window.RELATORIO.checarSanidade = function () {
    const vistos = new Set();
    this.paraApresentacao().forEach((s) => {
      if (vistos.has(s.file)) console.warn('[deck.js] arquivo duplicado na apresentação:', s.file);
      vistos.add(s.file);
    });
    this.paraRelatorio().forEach((file) => {
      fetch(file, { method: 'HEAD' }).then((r) => {
        if (!r.ok) console.warn('[deck.js] arquivo referenciado no relatório não encontrado:', file);
      }).catch(() => console.warn('[deck.js] falha ao checar arquivo:', file));
    });
  };
})();
