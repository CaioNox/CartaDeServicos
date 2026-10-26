/* dados/servicos.js — FONTE ÚNICA do inventário da Carta de Serviços da ANTAQ.
 *
 * Retrato da Carta publicada no Portal gov.br, extraído do PDF gerado pelo próprio
 * Portal (https://www.gov.br/pt-br/orgaos/agencia-nacional-de-transportes-aquaviarios/@@download.pdf).
 * Os nomes estão exatamente como aparecem no Portal (inclusive "Antaq"/"ANTAQ" e pontos finais),
 * porque a padronização desses nomes é um dos achados do diagnóstico.
 *
 * Referência dos números da Carta citados nas telas (ex.: slide-02, 33 serviços; slide-04, serviços
 * por superintendência). As telas não carregam este arquivo: o número escrito na tela é conferido
 * contra ele. tipoPrazo, siglas e resumo ficam como apoio para conferências.
 * Para atualizar: gere um novo PDF no Portal, confira serviço a serviço e troque `coleta`.
 * Campos booleanos indicam se a informação aparece na página do serviço:
 *   citaOuvidoria       — menciona Ouvidoria/Fala.BR (Lei 13.460, art. 7º, §2º, VI)
 *   gratuidadeInformada — diz expressamente que o serviço é gratuito
 *   legislacao / documentacao — seção preenchida no Portal
 *   linksHttp           — links sem HTTPS na página
 *   avaliacoes          — votos de satisfação no Painel gov.br
 *   unidadeCitada       — false quando a página do serviço no Portal não cita a unidade
 *                         (nem uma gerência dela); a atribuição precisa ser confirmada
 *   unidadeFonte        — quando unidadeCitada é false: de onde veio a confirmação da unidade
 *                         (e-mail de contato na Carta + competência no Regimento Interno,
 *                         Resolução ANTAQ nº 116/2024). Com ela, o serviço não conta como "a confirmar".
 *
 * Conferência: todos os campos foram conferidos contra o PDF do Portal gerado em
 * 19/10/2026 (mesmos 33 serviços e mesmos valores da coleta de 15/10/2026) e de novo contra o
 * PDF gerado em 26/10/2026, sem diferença. Unidades
 * conferidas pelas gerências citadas em cada serviço e pela estrutura publicada em
 * https://www.gov.br/antaq/pt-br/acesso-a-informacao/institucional/quem-e-quem */
window.CARTA = {
  coleta: '2026-10-15',
  conferencia: '2026-10-26',
  /* serviços cujo texto de prioridades já traz os grupos incluídos na Lei 10.048, art. 1º,
     pela Lei 14.626/2023 (TEA, mobilidade reduzida, doadores de sangue). Em 19/10/2026: nenhum —
     os 33 usam a redação anterior. */
  prioridadesAtualizadas: 0,
  fonte: 'https://www.gov.br/pt-br/orgaos/agencia-nacional-de-transportes-aquaviarios/@@download.pdf',
  unidades: {
    SOG: 'Superintendência de Outorgas',
    SRG: 'Superintendência de Regulação',
    SAF: 'Superintendência de Administração e Finanças',
    SFC: 'Superintendência de Fiscalização e Coordenação das Unidades Regionais'
  },
  servicos: [
    { n:  1, unidade: 'SFC', unidadeCitada: false, unidadeFonte: 'Carta (contato gpf@antaq.gov.br) · Regimento Interno, art. 80 (GPF/SFC)', nome: "Consultar empresas e embarcações para o transporte aquaviário federal de passageiros na navegação interior (Navegue Seguro)", prazo: "Atendimento imediato", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 2, gratuidadeInformada: true, legislacao: false, documentacao: false },
    { n:  2, unidade: 'SFC', unidadeCitada: false, unidadeFonte: 'Carta (contato inventario@antaq.gov.br) · Regimento Interno, art. 84, XII e XIII (SFC)', nome: "Enviar à Antaq o inventário patrimonial e a Lista de Bens Reversíveis dos portos organizados (SisPAT)", prazo: "Até 2 dia(s) útil(eis)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 3, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n:  3, unidade: 'SRG', nome: "Obter análise da Antaq para transferência de titularidade de instalação portuária.", prazo: "Até 90 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 7, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n:  4, unidade: 'SRG', nome: "Obter análise da Antaq quanto à alteração da tabela de preços de instalações portuárias arrendadas ou autorizadas.", prazo: "Em média 95 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 6, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n:  5, unidade: 'SRG', nome: "Obter autorização da Antaq para alteração de tabela de preços dos serviços de transporte aquaviário na navegação interior.", prazo: "Até 35 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: true, linksHttp: 1, etapas: 5, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n:  6, unidade: 'SOG', nome: "Obter autorização da ANTAQ para celebração de contrato de transição", prazo: "Até 60 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 3, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n:  7, unidade: 'SOG', nome: "Obter autorização da Antaq para transporte de passageiros, veículos e cargas na navegação interior de travessia", prazo: "Entre 20 e 40 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: false, documentacao: true },
    { n:  8, unidade: 'SOG', nome: "Obter autorização da Antaq para transporte de passageiros e misto na navegação interior de percurso longitudinal interestadual e internacional", prazo: "Entre 20 e 40 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: false, documentacao: true },
    { n:  9, unidade: 'SOG', nome: "Obter autorização da Antaq para transporte de cargas na navegação interior de percurso longitudinal interestadual e internacional", prazo: "Entre 20 e 40 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: false, documentacao: true },
    { n: 10, unidade: 'SRG', nome: "Obter autorização da Antaq para incorporação/desincorporação de bens da União ao/do acervo patrimonial dos portos organizados.", prazo: "Em média 90 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 7, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 11, unidade: 'SOG', nome: "Obter autorização da Antaq para ampliação da área da instalação portuária privada localizada fora da área de Porto Organizado", prazo: "Em média 120 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 4, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 12, unidade: 'SRG', nome: "Obter autorização da Antaq para antecipação de receitas de autoridades portuárias.", prazo: "Até 30 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 3, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 13, unidade: 'SRG', nome: "Obter autorização da Antaq para revisão/reajuste das tarifas portuárias.", prazo: "Em média 90 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 6, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 14, unidade: 'SRG', nome: "Obter autorização da Antaq para transferência de controle societário de instalação portuária.", prazo: "Até 90 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 6, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 15, unidade: 'SOG', nome: "Obter da Antaq autorização, aditamento ou renúncia para transporte aquaviário na navegação marítima e de apoio, cabotagem e longo curso", prazo: "Entre 20 e 40 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: false, documentacao: true },
    { n: 16, unidade: 'SAF', nome: "Obter declaração da Antaq para fins de credenciamento, validação ou outros atestados", prazo: "Em média 3 dia(s) útil(eis)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 2, gratuidadeInformada: true, legislacao: false, documentacao: false },
    { n: 17, unidade: 'SOG', nome: "Obter outorga de autorização da Antaq para construção e exploração de instalação portuária privada localizada fora da área do Porto Organizado", prazo: "Em média 120 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 9, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 18, unidade: 'SAF', unidadeCitada: false, unidadeFonte: 'Carta (contato gof@antaq.gov.br) · Regimento Interno, art. 46, IV, c (GOF/SAF)', nome: "Obter parcela de Contrato de Concessão/Arrendamento em que a Agência Nacional de Transportes Aquaviários (Antaq) seja interveniente", prazo: "Em média 2 dia(s) útil(eis)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 3, gratuidadeInformada: true, legislacao: false, documentacao: false },
    { n: 19, unidade: 'SAF', unidadeCitada: false, unidadeFonte: 'Carta (contato gof@antaq.gov.br) · Regimento Interno, art. 46, IV, e (GOF/SAF)', nome: "Obter parcelamento de multas emitidas pela Antaq", prazo: "Em média 2 dia(s) útil(eis)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 3, gratuidadeInformada: true, legislacao: false, documentacao: false },
    { n: 20, unidade: 'SOG', nome: "Propor à Antaq recomposição do equilíbrio econômico-financeiro de contratos de Arrendamentos Portuários ou de EVTEA", prazo: "Em média 180 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: false, documentacao: false },
    { n: 21, unidade: 'SAF', unidadeCitada: false, unidadeFonte: 'Carta (contato gof@antaq.gov.br) · Regimento Interno, art. 46, IV, e (GOF/SAF)', nome: "Realizar pagamento de multa e outros débitos junto à ANTAQ", prazo: "Até 5 minuto(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: false, documentacao: false },
    { n: 22, unidade: 'SFC', nome: "Registrar denúncia sobre cobranças de serviços que envolvem o transporte aquaviário de carga em contêineres (ProTEU)", prazo: "Não estimado ainda", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 3, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 23, unidade: 'SOG', nome: "Registrar na Antaq afretamento de embarcação brasileira", prazo: "Entre 20 e 40 dia(s) útil(eis)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 2, etapas: 2, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 24, unidade: 'SOG', nome: "Registrar na Antaq alteração de situação cadastral de empresa brasileira de navegação", prazo: "Até 30 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 25, unidade: 'SOG', nome: "Registrar na Antaq comunicação sobre alteração de frota", prazo: "Até 30 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 2, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 26, unidade: 'SOG', nome: "Registrar na Antaq instalação de apoio ao transporte aquaviário não passível de autorização", prazo: "Em média 80 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 4, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 27, unidade: 'SRG', nome: "Solicitar à Antaq a harmonização de conflito de interesses nos portos e na navegação.", prazo: "Até 90 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: true, linksHttp: 0, etapas: 6, gratuidadeInformada: true, legislacao: true, documentacao: true },
    { n: 28, unidade: 'SOG', nome: "Solicitar à Antaq autorização para operação em caráter emergencial e especial", prazo: "Até 60 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: true, documentacao: false },
    { n: 29, unidade: 'SOG', nome: "Solicitar atualização de dados na Antaq para o Sistema Mercante - AFRMM", prazo: "Até 5 dia(s) útil(eis)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 2, gratuidadeInformada: true, legislacao: true, documentacao: false },
    { n: 30, unidade: 'SOG', nome: "Solicitar autorização e registro na Antaq para afretamento de embarcação estrangeira", prazo: "Até 40 dia(s) útil(eis)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 2, etapas: 2, gratuidadeInformada: true, legislacao: false, documentacao: true },
    { n: 31, unidade: 'SOG', nome: "Solicitar da Antaq análise de tonelagem para inscrição no Registro Especial Brasileiro (REB)", prazo: "Entre 30 e 45 dia(s) útil(eis)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 2, etapas: 1, gratuidadeInformada: true, legislacao: true, documentacao: false },
    { n: 32, unidade: 'SOG', nome: "Solicitar da Antaq análise de Projetos Executivos apresentados no âmbito das Concessões e dos Arrendamentos Portuários", prazo: "Em média 120 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: false, documentacao: false },
    { n: 33, unidade: 'SOG', nome: "Solicitar homologação da Antaq para Acordo Operacional na navegação marítima ou interior", prazo: "Até 60 dia(s) corrido(s)", avaliacoes: 0, citaOuvidoria: false, linksHttp: 0, etapas: 1, gratuidadeInformada: true, legislacao: false, documentacao: false }
  ]
};

(function (C) {
  'use strict';

  /* Classifica o texto de "Quanto tempo leva?" do Portal.
     A Lei 13.460, art. 7º, §2º, IV pede "previsão do PRAZO MÁXIMO". */
  C.tipoPrazo = function (txt) {
    if (/^Não estimado/i.test(txt)) return 'ausente';
    if (/^Até /i.test(txt)) return 'maximo';
    if (/imediato/i.test(txt)) return 'imediato';
    if (/^Entre /i.test(txt)) return 'intervalo';
    if (/^Em média/i.test(txt)) return 'media';
    return 'outro';
  };

  /* Siglas no nome, exceto o nome da própria Agência. Ter sigla não é erro por si:
     a Lei 15.263/2025, art. 5º, VIII, pede o nome completo ANTES da sigla. */
  C.siglas = function (nome) {
    return (nome.match(/\b[A-Za-z]*[A-Z]{2,}[A-Za-z]*\b/g) || []).filter(function (s) { return !/^antaq$/i.test(s); });
  };

  C.resumo = function () {
    var s = C.servicos;
    var r = { total: s.length, porUnidade: {}, prazo: { maximo: 0, imediato: 0, intervalo: 0, media: 0, ausente: 0, outro: 0 },
      semOuvidoria: 0, semLegislacao: 0, semDocumentacao: 0, comHttp: 0, comAvaliacao: 0, comSigla: 0, unidadeAConfirmar: 0 };
    s.forEach(function (x) {
      r.porUnidade[x.unidade] = (r.porUnidade[x.unidade] || 0) + 1;
      r.prazo[C.tipoPrazo(x.prazo)]++;
      if (!x.citaOuvidoria) r.semOuvidoria++;
      if (!x.legislacao) r.semLegislacao++;
      if (!x.documentacao) r.semDocumentacao++;
      if (x.linksHttp > 0) r.comHttp++;
      if (x.avaliacoes > 0) r.comAvaliacao++;
      if (C.siglas(x.nome).length) r.comSigla++;
      if (x.unidadeCitada === false && !x.unidadeFonte) r.unidadeAConfirmar++;
    });
    return r;
  };
})(window.CARTA);
