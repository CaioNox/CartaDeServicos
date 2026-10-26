/* =====================================================================
   deck.js — manifesto do Guia Prático da Carta de Serviços, versão 2.0.

   Define a ordem das telas e os capítulos. É a única lista de telas do
   projeto: o visualizador (index.html), a versão A4 (relatorio.html) e a
   verificação (scripts/validar.mjs) leem daqui.

   Convenção: slide-NN.html é a página NN do guia. Para incluir uma tela,
   crie o arquivo e acrescente o nome em `files` do capítulo certo.

   Um item de `files` pode ser:
     'slide-NN.html'                              entra nas duas saídas
     { file: 'slide-NN.html', relatorio: false }  só na apresentação
     { file: 'slide-NN.html', apresentacao: false } só na versão A4
   ===================================================================== */

window.RELATORIO = {
  meta: {
    titulo: 'Guia Prático da Carta de Serviços · Ouvidoria ANTAQ',
    rodapeAnexo: 'Guia Prático da Carta de Serviços · Ouvidoria ANTAQ',
    arquivoPptx: 'Guia-Carta-de-Servicos-ANTAQ-v2.0.pptx',
  },

  blocos: [
    {
      block: 'Abertura', short: 'Abertura', tint: 0.35,
      files: ['slide-01.html', 'slide-02.html', 'slide-03.html', 'slide-04.html', 'slide-05.html'],
    },
    {
      block: 'Antes de começar', short: 'Antes de começar', tint: 0.4,
      files: ['slide-06.html'],
    },
    {
      block: '01 · Entendendo a Carta', short: 'Entendendo a Carta', tint: 1,
      files: ['slide-07.html', 'slide-08.html', 'slide-09.html', 'slide-10.html', 'slide-11.html'],
    },
    {
      block: '02 · Papéis e responsabilidades', short: 'Papéis', tint: 0.85,
      files: ['slide-12.html', 'slide-13.html', 'slide-14.html', 'slide-15.html', 'slide-16.html'],
    },
    {
      block: '03 · Passo a passo', short: 'Passo a passo', tint: 0.7,
      files: ['slide-17.html', 'slide-21.html',
        'slide-22.html', 'slide-23.html', 'slide-24.html'],
    },
    {
      block: '04 · Qualidade da informação', short: 'Qualidade', tint: 0.55,
      files: ['slide-25.html', 'slide-26.html', 'slide-27.html'],
    },
    {
      block: '05 · Monitoramento', short: 'Monitoramento', tint: 0.45,
      files: ['slide-28.html', 'slide-29.html', 'slide-30.html', 'slide-31.html'],
    },
    {
      block: '06 · Apêndice', short: 'Apêndice', tint: 0.3,
      files: ['slide-32.html', 'slide-33.html', 'slide-34.html', 'slide-35.html', 'slide-36.html'],
    },
  ],

  /* Telas com conteúdo escondido (abas, cartões que abrem) precisam de uma
     entrada aqui para o conteúdo sair no PDF. Nenhuma tela da v2.0 esconde
     conteúdo. */
  anexos: {},

  /* ajustes de captura por tela na exportação para PPTX (nenhum necessário) */
  capturaPptx: {},
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
