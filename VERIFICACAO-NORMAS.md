# Verificação das normas citadas no Guia Prático da Carta de Serviços

Conferência feita em 19/10/2026, branch `dados-com-base-legal`. Cada dispositivo citado nas 33 telas
(`guia/*.html`, inclusive textos montados por JavaScript e os cartões de "Normas") foi localizado no
**texto vigente** da norma e comparado com o que o guia afirma. Depois, as normas foram comparadas
entre si, tema a tema.

> As seções 1 a 3 tratam da versão 1 (`guia/`, 33 telas). A **seção 4** trata da versão 2.0
> (`guia-carta-servicos/`, 36 telas), conferida em 20/10/2026, com o texto literal de cada dispositivo.

## Resumo

- **61 dispositivos distintos** citados em 209 ocorrências; **61 localizados** no texto oficial.
- **60 conferem** (alguns com observação) · **1 com problema** (citação que não corresponde ao texto).
- **1 lacuna normativa**: o Decreto 9.094, art. 11, §4º (atos públicos de liberação) não aparece no guia.
- **23 links** de normas e documentos respondem normalmente (o link do X/Twitter no hub não pôde ser testado automaticamente).

## Fontes e método

| Norma | Texto usado |
|---|---|
| Lei 13.460/2017, Decreto 9.094/2017, Decreto 9.492/2018, Lei 14.129/2021, Lei 15.263/2025, Lei 10.048/2000, Lei 14.626/2023, Decreto 8.539/2015, Decreto 12.198/2024, Lei 13.874/2019, Constituição | planalto.gov.br, **só a redação vigente**: o texto riscado (revogado ou alterado) foi descartado |
| Portaria Normativa CGU 116/2024 | Diário Oficial da União (in.gov.br) |
| Portaria SGD/MGI 1.083/2025 | texto publicado no DOU de 17/02/2025, conferido em cópia oficial da UFRRJ |
| Guia Orientativo da CGU (dez/2025) | PDF oficial (Base de Conhecimento da CGU) |
| Guia de Edição de Serviços do gov.br | página oficial (campos Nome, Custos, Legislação e Tempo) |

Hierarquia usada para resolver divergências: Constituição > leis > decretos > portarias. Os dois guias
(CGU e Edição gov.br) são orientação, não norma.

## 1. Cada dispositivo citado × texto oficial

| Norma | Dispositivo | Telas | Texto oficial vigente (trecho) | Resultado |
|---|---|---|---|---|
| Constituição Federal | art. 37, §3º, I | o-que-e | I - as reclamações relativas à prestação dos serviços públicos em geral, asseguradas a manutenção de serviços de atendimento ao usuário e a avaliação periódica, externa e interna, da qualidade dos serviços; | ✅ Confere com o que o guia afirma. |
| Decreto 8.539/2015 | art. 4 | um-minuto | Art. 4º Para o atendimento ao disposto neste Decreto, os órgãos e as entidades da administração pública federal direta, autárquica e fundacional utilizarão sistemas informatizados para a gestão e o trâmite de processos administrativos eletrônicos. Parágrafo único. Os sistemas a que se refere o caput deverão utilizar, preferencia… | ✅ obs. O decreto obriga o uso de processo eletrônico, mas não cita o nome "SEI"; que o sistema da ANTAQ é o SEI é um fato (site da ANTAQ). |
| Decreto 9.094/2017 | art. 11 | conteudo-minimo, normas | Art. 11. Os órgãos e as entidades do Poder Executivo federal que prestam atendimento aos usuários dos serviços públicos, direta ou indiretamente, deverão elaborar e divulgar Carta de Serviços ao Usuário, no âmbito de sua esfera de competência. º § 1º A Carta de Serviços ao Usuário tem por objetivo informar aos usuários: I - os s… | ✅ Confere com o que o guia afirma. |
| Decreto 9.094/2017 | art. 11, §3º, VI | checklist, ficha-servico | VI - as etapas, presentes e futuras, esperadas para a realização dos serviços, incluídas a estimativas de prazos; | ✅ Confere com o que o guia afirma. |
| Decreto 9.094/2017 | art. 11, §3º, XI | checklist, ficha-servico | XI - os procedimentos para atendimento quando o sistema informatizado se encontrar indisponível; e | ✅ Confere com o que o guia afirma. |
| Decreto 9.094/2017 | art. 11, §3º | conteudo-minimo | § 3º Além das informações referidas no § 2º, a Carta de Serviços ao Usuário deverá, para detalhar o padrão de qualidade do atendimento, estabelecer: I - os usuários que farão jus à prioridade no atendimento; II - o tempo de espera para o atendimento; III - o prazo para a realização dos serviços; IV - os mecanismos de comunicação… | ✅ Confere com o que o guia afirma. |
| Decreto 9.094/2017 | art. 13 | insumos | Art. 13. Os usuários dos serviços públicos poderão apresentar Solicitação de Simplificação aos órgãos e às entidades do Poder Executivo federal, por meio de formulário próprio denominado Simplifique!, sempre que vislumbrarem oportunidade de simplificação ou melhoria do serviço público. º § 1º A Solicitação de Simplificação dever… | ✅ Confere com o que o guia afirma. |
| Decreto 9.094/2017 | art. 18, I | o-que-e | I - no portal único gov.br; e | ✅ Confere com o que o guia afirma. |
| Decreto 9.094/2017 | art. 18, II | etapas, o-que-e | II - nos locais de atendimento, por meio de extração das informações do portal único gov.br, em formato impresso. | ✅ Confere com o que o guia afirma. |
| Decreto 9.094/2017 | art. 18 | normas | Art. 18. A Carta de Serviços ao Usuário, a forma de acesso, as orientações de uso e as informações do formulário Simplifique! deverão ser objeto de permanente divulgação aos usuários dos serviços públicos, e mantidos visíveis e acessíveis ao público: I - no portal único gov.br; e II - nos locais de atendimento, por meio de extra… | ✅ obs. O art. 18 também manda divulgar, junto com a Carta, as informações do formulário Simplifique!; o guia não menciona essa parte. |
| Decreto 9.094/2017 | art. 18-A, caput | um-minuto | Art. 18-A. Fica vedado aos órgãos e às entidades da administração pública federal solicitar ao usuário do serviço público requisitos, documentos, informações e procedimentos cuja exigibilidade não esteja informada no portal único gov.br. | ✅ Confere com o que o guia afirma. |
| Decreto 9.094/2017 | art. 18-A | checklist, etapas, ficha-servico, normas, o-que-e | Art. 18-A. Fica vedado aos órgãos e às entidades da administração pública federal solicitar ao usuário do serviço público requisitos, documentos, informações e procedimentos cuja exigibilidade não esteja informada no portal único gov.br. § 2º A criação ou a alteração do rol de requisitos, documentos, informações e procedimentos … | ✅ Confere com o que o guia afirma. |
| Decreto 9.094/2017 | art. 18-A, §2º | calendario, etapas, indicadores, um-minuto | § 2º A criação ou a alteração do rol de requisitos, documentos, informações e procedimentos do serviço público será precedida de publicação no portal único gov.br. | ✅ Confere com o que o guia afirma. |
| Decreto 9.492/2018 | art. 5, IV | deveres, normas | IV - acompanhar a implementação da Carta de Serviços ao Usuário, de que trata o art. 7º da Lei nº 13.460, de 2017 , de acordo com os procedimentos adotados pelo Decreto nº 9.094, de 17 de julho de 2017 . | ✅ Confere com o que o guia afirma. |
| Decreto 9.492/2018 | art. 10, V | deveres | V - processar as informações obtidas por meio das manifestações recebidas e das pesquisas de satisfação realizadas com a finalidade de avaliar os serviços públicos prestados, em especial sobre o cumprimento dos compromissos e dos padrões de qualidade de atendimento da Carta de Serviços ao Usuário, de que trata o art. 7º da Lei n… | ✅ Confere com o que o guia afirma. |
| Decreto 9.492/2018 | art. 24-C | insumos | Art. 24-C. Sem prejuízo de outros meios de participação dos usuários no acompanhamento da prestação e na avaliação dos serviços públicos, cada órgão ou entidade a que se refere o art. 2º criará um ou mais conselhos de usuários de serviços públicos, os quais não poderão exceder a quantidade de serviços previstos na Carta de Servi… | ✅ Confere com o que o guia afirma. |
| Lei 10.048/2000 (red. Lei 14.626/2023) | art. 1 | checklist, diagnostico, erros, ficha-servico, indicadores, normas | Art. 1º As pessoas com deficiência, as pessoas com transtorno do espectro autista, as pessoas idosas com idade igual ou superior a 60 (sessenta) anos, as gestantes, as lactantes, as pessoas com criança de colo, os obesos, as pessoas com mobilidade reduzida e os doadores de sangue terão atendimento prioritário, nos termos desta L… | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 5, XI | etapas | XI - eliminação de formalidades e de exigências cujo custo econômico ou social seja superior ao risco envolvido; | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 5, XIV | checklist, etapas, ficha-servico | XIV - utilização de linguagem simples e compreensível, evitando o uso de siglas, jargões e estrangeirismos; e | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 6, VI, "e" | checklist, ficha-servico | e) valor das taxas e tarifas cobradas pela prestação dos serviços, contendo informações para a compreensão exata da extensão do serviço prestado. | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7 | conteudo-minimo, um-minuto | Art. 7º Os órgãos e entidades abrangidos por esta Lei divulgarão Carta de Serviços ao Usuário. § 1º A Carta de Serviços ao Usuário tem por objetivo informar o usuário sobre os serviços prestados pelo órgão ou entidade, as formas de acesso a esses serviços e seus compromissos e padrões de qualidade de atendimento ao público. § 2º… | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §2º, I | checklist, ficha-servico | I - serviços oferecidos; | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §2º, II | ficha-servico | II - requisitos, documentos, formas e informações necessárias para acessar o serviço; | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §2º, III | ficha-servico | III - principais etapas para processamento do serviço; | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §2º, IV | checklist, diagnostico, erros, ficha-servico, formulario, indicadores | IV - previsão do prazo máximo para a prestação do serviço; | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §2º, V | checklist, ficha-servico | V - forma de prestação do serviço; e | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §2º, VI | checklist, diagnostico, erros, ficha-servico, indicadores | VI - locais e formas para o usuário apresentar eventual manifestação sobre a prestação do serviço. | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §2º | conteudo-minimo, erros, normas | § 2º A Carta de Serviços ao Usuário deverá trazer informações claras e precisas em relação a cada um dos serviços prestados, apresentando, no mínimo, informações relacionadas a: I - serviços oferecidos; II - requisitos, documentos, formas e informações necessárias para acessar o serviço; III - principais etapas para processament… | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §3º, I | ficha-servico | I - prioridades de atendimento; | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §3º, V | checklist, ficha-servico | V - mecanismos de consulta, por parte dos usuários, acerca do andamento do serviço solicitado e de eventual manifestação. | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §3º | conteudo-minimo, normas | § 3º Além das informações descritas no § 2º, a Carta de Serviços ao Usuário deverá detalhar os compromissos e padrões de qualidade do atendimento relativos, no mínimo, aos seguintes aspectos: I - prioridades de atendimento; II - previsão de tempo de espera para atendimento; III - mecanismos de comunicação com os usuários; IV - p… | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 7, §4º | etapas, normas, o-que-e, papeis | § 4º A Carta de Serviços ao Usuário será objeto de atualização periódica e de permanente divulgação mediante publicação em sítio eletrônico do órgão ou entidade na internet. | ✅ obs. A lei exige publicação no site. "Um link para o Portal basta" é orientação do Guia CGU (item 3.9), não da lei; o guia cita os dois. |
| Lei 13.460/2017 | art. 13, I | deveres | I - promover a participação do usuário na administração pública, em cooperação com outras entidades de defesa do usuário; | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 13, IV | deveres | IV - auxiliar na prevenção e correção dos atos e procedimentos incompatíveis com os princípios estabelecidos nesta Lei; | ⚠️ O texto do inciso IV ("auxiliar na prevenção e correção dos atos incompatíveis") não diz "monitorar o cumprimento da Carta". O Guia CGU (item 2.2) cita o mesmo inciso, mas o dispositivo que corresponde é o art. 13, II ("acompanhar a prestação dos serviços, visando a garantir a sua efetividade"). Sugestão: trocar para art. 13, II, em slide-deveres. |
| Lei 13.460/2017 | art. 13 | normas | Art. 13. As ouvidorias terão como atribuições precípuas, sem prejuízo de outras estabelecidas em regulamento específico: I - promover a participação do usuário na administração pública, em cooperação com outras entidades de defesa do usuário; II - acompanhar a prestação dos serviços, visando a garantir a sua efetividade; III - p… | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 14, II | deveres, insumos | II - elaborar, anualmente, relatório de gestão, que deverá consolidar as informações mencionadas no inciso I, e, com base nelas, apontar falhas e sugerir melhorias na prestação de serviços públicos. | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 14 | normas | Art. 14. Com vistas à realização de seus objetivos, as ouvidorias deverão: I - receber, analisar e responder, por meio de mecanismos proativos e reativos, as manifestações encaminhadas por usuários de serviços públicos; e II - elaborar, anualmente, relatório de gestão, que deverá consolidar as informações mencionadas no inciso I… | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 23 | checklist, normas | Art. 23. Os órgãos e entidades públicos abrangidos por esta Lei deverão avaliar os serviços prestados, nos seguintes aspectos: I - satisfação do usuário com o serviço prestado; II - qualidade do atendimento prestado ao usuário; III - cumprimento dos compromissos e prazos definidos para a prestação dos serviços; IV - quantidade d… | ✅ Confere com o que o guia afirma. |
| Lei 13.460/2017 | art. 23, §1º | calendario | § 1º A avaliação será realizada por pesquisa de satisfação feita, no mínimo, a cada um ano, ou por qualquer outro meio que garanta significância estatística aos resultados. | ✅ Confere com o que o guia afirma. |
| Lei 14.129/2021 | art. 3 | normas | Art. 3º São princípios e diretrizes do Governo Digital e da eficiência pública: I - a desburocratização, a modernização, o fortalecimento e a simplificação da relação do poder público com a sociedade, mediante serviços digitais, acessíveis inclusive por dispositivos móveis; II - a disponibilização em plataforma única do acesso à… | ✅ Confere com o que o guia afirma. |
| Lei 14.129/2021 | art. 18, II | o-que-e | II - as Cartas de Serviços ao Usuário, de que trata a Lei nº 13.460, de 26 de junho de 2017; e | ✅ Confere com o que o guia afirma. |
| Lei 14.129/2021 | art. 18 | normas | Art. 18. São componentes essenciais para a prestação digital dos serviços públicos na administração pública: I - a Base Nacional de Serviços Públicos; II - as Cartas de Serviços ao Usuário, de que trata a Lei nº 13.460, de 26 de junho de 2017; e III - as Plataformas de Governo Digital. Subseção II Da Base Nacional de Serviços Pú… | ✅ Confere com o que o guia afirma. |
| Lei 14.129/2021 | art. 27, II | normas, o-que-e | II - atendimento nos termos da respectiva Carta de Serviços ao Usuário; | ✅ Confere com o que o guia afirma. |
| Lei 15.263/2025 | art. 5, VIII | checklist, diagnostico, erros, ficha-servico, linguagem | VIII - redigir o nome completo antes das siglas; | ✅ Confere com o que o guia afirma. |
| Lei 15.263/2025 | art. 5, XVIII | insumos | XVIII - testar com o público-alvo se a mensagem está compreensível. | ✅ Confere com o que o guia afirma. |
| Lei 15.263/2025 | art. 5 | checklist, ficha-servico, normas | Art. 5º A administração pública obedecerá às técnicas de linguagem simples na redação de textos dirigidos ao cidadão, tais como: I - redigir frases em ordem direta; II - redigir frases curtas; III - desenvolver uma ideia por parágrafo; IV - usar palavras comuns, de fácil compreensão; V - usar sinônimos de termos técnicos e de ja… | ✅ Confere com o que o guia afirma. |
| Portaria SGD/MGI 1.083/2025 | art. 2, IV | ficha-servico | IV - etapa: cada momento do processo padrão de um serviço em que o usuário precisa realizar uma ação ou receber uma informação; | ✅ Confere com o que o guia afirma. |
| Portaria SGD/MGI 1.083/2025 | art. 2, V | normas | V - unidade gestora: órgão ou entidade responsável pela oferta de um serviço público ao usuário; | ✅ obs. A Portaria chama de "unidade gestora" o órgão ou entidade. O Guia CGU e este guia usam o termo para a área interna que presta o serviço. Convém explicar isso no glossário. |
| Portaria SGD/MGI 1.083/2025 | art. 3, II | ficha-servico | II-suficiência: o serviço engloba todas as etapas necessárias para identificação, compreensão, solicitação, acompanhamento e recebimento de resposta definitiva sobre a demanda apresentada pelo usuário; | ✅ Confere com o que o guia afirma. |
| Portaria SGD/MGI 1.083/2025 | art. 3 | checklist, e-servico, etapas, normas | Art. 3º São características dos serviços públicos: I - interação: o serviço envolve contato entre a unidade gestora e o usuário, por meio de canais digitais ou presenciais; II-suficiência: o serviço engloba todas as etapas necessárias para identificação, compreensão, solicitação, acompanhamento e recebimento de resposta definiti… | ✅ Confere com o que o guia afirma. |
| Portaria SGD/MGI 1.083/2025 | art. 6, II | calendario, checklist, deveres, etapas, normas, papeis, um-minuto | II - manter atualizadas no portal único gov.br as informações sobre os serviços públicos prestados; | ✅ Confere com o que o guia afirma. |
| Portaria SGD/MGI 1.083/2025 | art. 6, IV | calendario, checklist, indicadores | IV - monitorar e avaliar de forma contínua os resultados das avaliações de satisfação dos usuários; | ✅ Confere com o que o guia afirma. |
| Portaria Normativa CGU 116/2024 | art. 7, VII | apresentacao, deveres, etapas, normas, papeis, um-minuto | VII - zelar pela adequação, atualidade e qualidade das informações constantes nas Cartas de Serviços dos órgãos e entidades a que estejam vinculadas; | ✅ Confere com o que o guia afirma. |
| Portaria Normativa CGU 116/2024 | art. 56 | glossario, normas | Art. 56. A metodologia de trabalho das unidades setoriais do SisOuv poderá incorporar ações de ouvidoria ativa com a finalidade de prestar orientações, receber manifestações, coletar dados, realizar pesquisas, avaliar serviços e engajar usuários nos canais de participação e controle social. Parágrafo único. Constituem ações de o… | ✅ Confere com o que o guia afirma. |
| Portaria Normativa CGU 116/2024 | art. 60, caput | calendario | Art. 60. As unidades setoriais do SisOuv deverão elaborar relatórios de gestão, nos termos dos arts. 14, II, e 15 da Lei nº 13.460, de 2017, com periodicidade mínima anual, a ser publicado no sítio eletrônico do órgão ou entidade até o primeiro dia do mês de abril de cada ano, abrangendo informações referentes ao ano anterior. | ✅ Confere com o que o guia afirma. |
| Portaria Normativa CGU 116/2024 | art. 60 | etapas, normas | Art. 60. As unidades setoriais do SisOuv deverão elaborar relatórios de gestão, nos termos dos arts. 14, II, e 15 da Lei nº 13.460, de 2017, com periodicidade mínima anual, a ser publicado no sítio eletrônico do órgão ou entidade até o primeiro dia do mês de abril de cada ano, abrangendo informações referentes ao ano anterior. §… | ✅ Confere com o que o guia afirma. |
| Portaria Normativa CGU 116/2024 | art. 60, §1º, VII | calendario, normas | VII - informações acerca da atualização da Carta de Serviços do órgão ou entidade a que a unidade setorial de ouvidoria está vinculada. | ✅ Confere com o que o guia afirma. |
| Portaria Normativa CGU 116/2024 | art. 65 | apresentacao, deveres, normas, um-minuto | Art. 65. As unidades do SisOuv atuarão em coordenação com as demais unidades dos órgãos e entidades a que estejam vinculadas na elaboração e atualização da Carta de Serviços ao Usuário. § 1º As atividades de elaboração e atualização da Carta de Serviços ao Usuário compreendem, dentre outros processos: I - a identificação e a def… | ✅ Confere com o que o guia afirma. |
| Portaria Normativa CGU 116/2024 | art. 65, §1º, VII | calendario, um-minuto | VII - a atualização contínua das informações que compõem a Carta de Serviços ao Usuário, sempre que necessário. | ✅ Confere com o que o guia afirma. |
| Portaria Normativa CGU 116/2024 | art. 65, §2º | calendario, checklist, deveres, etapas, formulario, indicadores, normas, papeis, um-minuto | § 2º A despeito de sua atualização contínua, as informações que compõem a Carta de Serviços ao Usuário deverão ser objeto de revisão anual, mediante consulta pelas unidades do SisOuv às unidades gestoras de serviços dos órgãos e entidades a que estejam vinculadas. | ✅ Confere com o que o guia afirma. |
| Portaria Normativa CGU 116/2024 | art. 65, §3º | etapas, papeis | § 3º Além da publicação dos serviços públicos no portal único "gov.br", as unidades do SisOuv poderão adotar outras formas de publicidade, divulgação ou disseminação da Carta de Serviços ao Usuário, considerando os perfis e as necessidades de seus usuários. | ✅ Confere com o que o guia afirma. |

**Guia Orientativo da CGU** (citado em 20 telas): itens 1, 2, 2.1, 2.2, 3 e 3.1 a 3.11 conferidos no PDF;
o conteúdo de cada item corresponde ao que o guia atribui a ele (etapas, quem faz, deveres, linguagem
simples no item 3.6, documento formal no item 3.3). "Guia CGU (2025), p. 6" corresponde à tabela de
conteúdo da Carta, na página 6. ⚠️ O próprio Guia CGU cita "Lei 13.460, art. 13, IV" no item 2.2, com o
mesmo problema apontado acima.

**Guia de Edição gov.br** (4 telas): campo Nome ("iniciar com verbo no infinitivo"), Custos, Legislação e
tempo de cada etapa conferidos na página oficial em 19/10/2026. ✅

## 2. Comparação entre as normas

### 2.1 Conteúdo obrigatório: Lei 13.460, art. 7º × Decreto 9.094, art. 11

| Tema | Lei 13.460, art. 7º | Decreto 9.094, art. 11 | Bate? |
|---|---|---|---|
| Serviço oferecido | §2º, I | §2º, I | ✅ |
| Requisitos e documentos | §2º, II ("requisitos, documentos, formas e informações") | §2º, II ("requisitos e documentos") | ✅ a lei é mais ampla |
| Etapas | §2º, III | §2º, III; e §3º, VI (etapas com estimativa de prazo) | ✅ o decreto detalha |
| Prazo | §2º, IV: **previsão do prazo máximo** | §2º, IV: "prazo para a prestação"; §3º, III: "prazo para a realização" | ✅ a lei prevalece: o guia exige prazo máximo |
| Forma de prestação | §2º, V | §2º, V; e VII (locais e formas de acessar) | ✅ |
| Onde se manifestar | §2º, VI | §3º, V (receber e responder sugestões e reclamações) | ✅ |
| Comunicação com o usuário | §3º, III | §2º, VI; §3º, IV | ✅ |
| Prioridades | §3º, I | §3º, I | ✅ |
| Tempo de espera | §3º, II | §3º, II | ✅ |
| Consulta ao andamento | §3º, V | §3º, VII | ✅ |
| Tratamento, sinalização, acessibilidade, limpeza e conforto | — | §3º, VIII a X | ✅ só no decreto; o guia inclui |
| Sistema fora do ar | — | §3º, XI | ✅ só no decreto; o guia inclui |
| **Atos públicos de liberação** | — | **§4º** (incluído pelo Decreto 10.178/2019) | ❗ **lacuna no guia** (ver 3.1) |

### 2.2 Onde publicar
Lei 13.460, art. 7º, §4º (site do órgão, atualização periódica) + Decreto 9.094, art. 18, I e II (Portal gov.br
e versão impressa nos locais de atendimento) + Lei 14.129, art. 18, II, e art. 24, I, "a" (Carta como
componente da prestação digital; manter atualizada). **Complementares, sem conflito.**

### 2.3 Atualização
Lei 13.460, art. 7º, §4º fala em "atualização periódica" sem fixar prazo. A Portaria CGU 116/2024 fixa:
atualização contínua (art. 65, §1º, VII) e **revisão anual** com consulta às unidades gestoras (art. 65, §2º).
A Portaria SGD/MGI 1.083/2025, art. 6º, II, põe o dever de manter o Portal atualizado na unidade gestora.
O Decreto 9.094, art. 18-A, §2º, exige publicar **antes** de exigir requisito novo. **Coerentes; a portaria
detalha o que a lei deixou aberto.**

### 2.4 Papel da Ouvidoria
Lei 13.460, arts. 13 e 14 + Decreto 9.492, art. 5º, IV (acompanhar a Carta) e art. 10, V (processar
manifestações e pesquisas para avaliar os compromissos da Carta) + Portaria CGU 116/2024, art. 7º, VII
(zelar pela Carta), art. 56 (ouvidoria ativa) e art. 65 (atuação coordenada). **Coerentes.** Único ponto: o
art. 13, IV, citado para "monitorar", não corresponde; o certo é o art. 13, II.

### 2.5 Relatório de gestão
Lei 13.460, art. 14, II (anual) e art. 15 (conteúdo mínimo; enviado à autoridade máxima e publicado na
internet) + Portaria CGU 116/2024, art. 60 (publicado **até 1º de abril**; §1º, VII: informações sobre a
atualização da Carta). **Coerentes; a portaria fixa a data.**

### 2.6 Avaliação dos serviços
Lei 13.460, art. 23 (§1º: pesquisa **no mínimo anual**) + Decreto 9.094, art. 20 (ferramenta de pesquisa do
gov.br) + Portaria SGD/MGI 1.083/2025, art. 6º, IV (monitorar **de forma contínua**) + Decreto 9.492, art. 10, V.
**Coerentes:** a lei fixa o mínimo e a portaria pede acompanhamento contínuo.

### 2.7 Prioridades de atendimento
Lei 10.048, art. 1º (redação da Lei 14.626/2023) inclui pessoas com TEA, com mobilidade reduzida e doadores de
sangue. ⚠️ A **Lei 13.460, art. 5º, III**, ainda traz a lista antiga (pessoas com deficiência, idosos,
gestantes, lactantes e acompanhadas por crianças de colo). **Divergência entre as leis:** a Lei 10.048 é a
específica e a mais recente; o guia usa corretamente a Lei 10.048.

### 2.8 Linguagem simples
Lei 13.460, art. 5º, XIV (evitar siglas, jargões e estrangeirismos) + Lei 15.263/2025, art. 5º (técnicas:
nome completo antes da sigla, frases curtas, testar com o público). **Coerentes; a Lei 15.263 detalha.**

### 2.9 Definições
- **Serviço público:** Lei 13.460, art. 2º, II, e Portaria 1.083, art. 2º, II, têm **o mesmo texto**. ✅
- **Unidade gestora:** Portaria 1.083, art. 2º, V = órgão ou entidade; Guia CGU, item 2 = área interna. ⚠️ Uso diferente do mesmo termo; o guia segue o Guia CGU sem avisar.
- **Características do serviço:** Portaria 1.083, art. 3º, I a V (interação, suficiência, personalização, processo padrão, foco em usuários externos) = as 5 do guia. ✅

### 2.10 Conselhos de usuários
Lei 13.460, art. 18 + Decreto 9.492, arts. 24-C e 24-D (incluídos pelo Decreto 10.228/2020; o número de
conselhos não pode passar o de serviços da Carta). **Coerentes.**

## 3. Problemas e recomendações

1. **❗ Lacuna: atos públicos de liberação (Decreto 9.094, art. 11, §4º).** Pela Lei 13.874/2019, art. 1º, §6º,
   autorização, registro, cadastro e licença são atos públicos de liberação; vários serviços da ANTAQ
   ("Obter autorização…", "Registrar…") podem se enquadrar. Para eles a Carta deve trazer também: lista de
   documentos, taxas e normas; fluxo com fases, prazos, autoridade e recursos; nível de risco; regras de
   aprovação tácita; e **tempo médio de tramitação** (§4º, V). Isso pede ajuste na mensagem "média não vale":
   o prazo máximo continua obrigatório (Lei 13.460), mas nesses serviços o tempo médio **também** é exigido.
   Recomendação: incluir no conteúdo obrigatório, na ficha e no checklist, e as unidades confirmarem quais
   serviços são atos públicos de liberação.
2. **⚠️ slide-deveres:** trocar "Lei 13.460, art. 13, IV" por "art. 13, II" em "Monitorar o cumprimento do que
   a Carta promete" (manter Decreto 9.492, art. 10, V).
3. **Observações, sem erro:** explicar no glossário os dois sentidos de "unidade gestora"; mencionar que o
   art. 18 do Decreto 9.094 inclui a divulgação do Simplifique!; deixar claro que "link basta" é orientação do
   Guia CGU; registrar que "SEI" é o sistema da ANTAQ, não um nome dado pelo decreto.

## 4. Versão 2.0 (`guia-carta-servicos/`, 36 telas) — conferência de 20/10/2026

### Método

- Cada citação de norma nas telas foi localizada no texto oficial e comparada com o que a tela afirma.
- A coluna "Texto oficial vigente" traz o **texto literal**, copiado da fonte, com a mesma pontuação e
  acentuação. Só a redação vigente: o texto riscado (revogado ou alterado) foi descartado. As notas
  editoriais do Planalto, como "(Redação dada pelo Decreto nº …)", "(Incluído pela Lei nº …)" e
  "Vigência", não fazem parte do texto da norma e foram retiradas. Quando a citação é de um inciso,
  vem também a frase de abertura do artigo ou do parágrafo, para dar o sentido.
- Fontes: planalto.gov.br (Constituição; Leis 13.460, 13.848, 10.233, 14.129, 15.263, 10.048;
  Decretos 9.094, 9.492, 8.539, 12.198), in.gov.br (Portaria Normativa CGU 116/2024), cópia oficial da
  Portaria SGD/MGI 1.083/2025 (UFRRJ, a mesma da seção 1) e o site da ANTAQ, página "Legislação
  correlata" da Ouvidoria (Portaria nº 235/2019-DG e Portaria nº 3/2025/OUV, em PDF assinado no SEI).
- Na Portaria nº 235/2019-DG, o PDF perde a ligadura "ti" na extração ("Ins tuir"); o texto abaixo
  restaura a palavra como aparece no documento ("Instituir").
- A Portaria/DG/ANTAQ nº 385/2021 não está publicada no site; o que a tela 34 diz dela vem do art. 3º
  da Portaria nº 3/2025/OUV, que a descreve.

### Resumo

- **56 dispositivos** conferidos, em 16 normas e atos.
- **48 conferem** · **1 citação errada** (Lei 13.848, art. 22, usada para a Diretoria Colegiada) ·
  **6 textos de tela com sentido diferente do da norma** · **1 preâmbulo** mostrado só como referência.
  Todos foram corrigidos nas telas (coluna "Resultado").
- **Dados sem norma retirados** (regra 6 do `AGENTS.md`):
  - tela 15: "30 dias para responder à consulta anual (proposta deste guia)". Virou o prazo legal de 30 dias
    para a decisão final ao usuário (Lei 13.460, art. 16);
  - tela 21: os 12 meses do calendário e os mesmos "30 dias". Ficaram as quatro fases, a revisão anual
    (Portaria CGU 116, art. 65, § 2º) e o 1º de abril (art. 60);
  - telas 19 e 20: o mês de cada etapa. Ficou o registro de cada uma;
  - tela 24: "atualize em até 30 dias (meta interna do guia)". Virou "sempre que necessário"
    (Portaria CGU 116, art. 65, § 1º, VII);
  - tela 30: as metas sem norma (≥ 4,5, ≥ 80%, ≤ 30 dias e 100% para nomes no padrão) passaram a
    "Não fixada". Ficaram as metas com base legal;
  - tela 5 (antiga, depois substituída): "com mês, responsável e registro no SEI" passou a "com responsável e registro no SEI".
- **Normas da seção 1 que entraram na v2.0:** Constituição, art. 37, § 3º, I, e Decreto 8.539/2015, art. 4º
  (tela 33 e tela 2).
- **Continua aberta** a lacuna do Decreto 9.094, art. 11, § 4º (atos públicos de liberação; ver seção 3).
  A v2.0 também não trata dela.

### Cada dispositivo citado × texto oficial

| Norma | Dispositivo | Telas | Texto oficial vigente (literal) | Resultado |
|---|---|---|---|---|
| Constituição Federal | art. 37, § 3º, I | 08, 33 | § 3º A lei disciplinará as formas de participação do usuário na administração pública direta e indireta, regulando especialmente:<br>I - as reclamações relativas à prestação dos serviços públicos em geral, asseguradas a manutenção de serviços de atendimento ao usuário e a avaliação periódica, externa e interna, da qualidade dos serviços; | ✅ Confere com o que a tela afirma. |
| Lei 13.460/2017 | art. 5º, XIV | 27 | XIV - utilização de linguagem simples e compreensível, evitando o uso de siglas, jargões e estrangeirismos; e | ✅ Confere com o que a tela afirma. |
| Lei 13.460/2017 | art. 6º, VI, "e" | 10, 22, 26 | VI - obtenção de informações precisas e de fácil acesso nos locais de prestação do serviço, assim como sua disponibilização na internet, especialmente sobre:<br>e) valor das taxas e tarifas cobradas pela prestação dos serviços, contendo informações para a compreensão exata da extensão do serviço prestado. | ✅ Confere com o que a tela afirma. |
| Lei 13.460/2017 | art. 7º, caput | 02 | Art. 7º Os órgãos e entidades abrangidos por esta Lei divulgarão Carta de Serviços ao Usuário. | ✅ Confere com o que a tela afirma. |
| Lei 13.460/2017 | art. 7º, § 2º (I a VI) | 10, 22, 26, 30 | § 2º A Carta de Serviços ao Usuário deverá trazer informações claras e precisas em relação a cada um dos serviços prestados, apresentando, no mínimo, informações relacionadas a:<br>I - serviços oferecidos;<br>II - requisitos, documentos, formas e informações necessárias para acessar o serviço;<br>III - principais etapas para processamento do serviço;<br>IV - previsão do prazo máximo para a prestação do serviço;<br>V - forma de prestação do serviço; e<br>VI - locais e formas para o usuário apresentar eventual manifestação sobre a prestação do serviço. | ✅ Confere. Telas 22 e 26 citam cada inciso: I (o que é), II (quem pode usar), III (etapas), IV (prazo máximo), V (forma de prestação/canais), VI (onde se manifestar). |
| Lei 13.460/2017 | art. 7º, § 3º (I a V) | 10, 22, 26 | § 3º Além das informações descritas no § 2º, a Carta de Serviços ao Usuário deverá detalhar os compromissos e padrões de qualidade do atendimento relativos, no mínimo, aos seguintes aspectos:<br>I - prioridades de atendimento;<br>II - previsão de tempo de espera para atendimento;<br>III - mecanismos de comunicação com os usuários;<br>IV - procedimentos para receber e responder as manifestações dos usuários; e<br>V - mecanismos de consulta, por parte dos usuários, acerca do andamento do serviço solicitado e de eventual manifestação. | ✅ Confere com o que a tela afirma. |
| Lei 13.460/2017 | art. 7º, § 4º | 08, 14, 20 | § 4º A Carta de Serviços ao Usuário será objeto de atualização periódica e de permanente divulgação mediante publicação em sítio eletrônico do órgão ou entidade na internet. | ✅ Confere com o que a tela afirma. |
| Lei 13.460/2017 | art. 13, II | 16 | Art. 13. As ouvidorias terão como atribuições precípuas, sem prejuízo de outras estabelecidas em regulamento específico:<br>II - acompanhar a prestação dos serviços, visando a garantir a sua efetividade; | ✅ Confere. (A v1 citava o inciso IV; a v2 já usa o II, como recomendado na seção 3.) |
| Lei 13.460/2017 | art. 14, II | 16, 30 | Art. 14. Com vistas à realização de seus objetivos, as ouvidorias deverão:<br>II - elaborar, anualmente, relatório de gestão, que deverá consolidar as informações mencionadas no inciso I, e, com base nelas, apontar falhas e sugerir melhorias na prestação de serviços públicos. | ✅ Confere com o que a tela afirma. |
| Lei 13.460/2017 | art. 16, caput | 15, 31, 33 | Art. 16. A ouvidoria encaminhará a decisão administrativa final ao usuário, observado o prazo de trinta dias, prorrogável de forma justificada uma única vez, por igual período. | ✅ Confere. Tela 15: o 3º prazo (30 dias), que era "proposta deste guia" para a consulta anual, passou a ser este prazo legal de resposta ao usuário. |
| Lei 13.460/2017 | art. 16, parágrafo único | 15, 16 | Parágrafo único. Observado o prazo previsto no caput, a ouvidoria poderá solicitar informações e esclarecimentos diretamente a agentes públicos do órgão ou entidade a que se vincula, e as solicitações devem ser respondidas no prazo de vinte dias, prorrogável de forma justificada uma única vez, por igual período. | ✅ Confere ("20 dias, prorrogáveis uma vez"). Obs.: o prazo está no contexto das manifestações (art. 16, caput). |
| Lei 13.460/2017 | art. 18, parágrafo único | 14 | Art. 18. Sem prejuízo de outras formas previstas na legislação, a participação dos usuários no acompanhamento da prestação e na avaliação dos serviços públicos será feita por meio de conselhos de usuários.<br>Parágrafo único. Os conselhos de usuários são órgãos consultivos dotados das seguintes atribuições:<br>I - acompanhar a prestação dos serviços;<br>II - participar na avaliação dos serviços;<br>III - propor melhorias na prestação dos serviços;<br>IV - contribuir na definição de diretrizes para o adequado atendimento ao usuário; e<br>V - acompanhar e avaliar a atuação do ouvidor. | ⚠️ Corrigido. A tela dizia "Avalia os serviços e testa a clareza dos textos"; "testar a clareza" não está no artigo. Agora: "Acompanha a prestação, participa da avaliação dos serviços e propõe melhorias" (incisos I a III). |
| Lei 13.460/2017 | art. 23 | 26, 30, 33 | Art. 23. Os órgãos e entidades públicos abrangidos por esta Lei deverão avaliar os serviços prestados, nos seguintes aspectos:<br>I - satisfação do usuário com o serviço prestado;<br>II - qualidade do atendimento prestado ao usuário;<br>III - cumprimento dos compromissos e prazos definidos para a prestação dos serviços;<br>IV - quantidade de manifestações de usuários; e<br>V - medidas adotadas pela administração pública para melhoria e aperfeiçoamento da prestação do serviço. | ✅ Confere com o que a tela afirma. |
| Decreto 9.094/2017 | art. 11, § 3º | 10 | § 3º Além das informações referidas no § 2º, a Carta de Serviços ao Usuário deverá, para detalhar o padrão de qualidade do atendimento, estabelecer: | ✅ Confere com o que a tela afirma. |
| Decreto 9.094/2017 | art. 11, § 3º, VI | 26 | VI - as etapas, presentes e futuras, esperadas para a realização dos serviços, incluídas a estimativas de prazos; | ✅ Confere. A tela 26 citava só "§ 3º" para "Tempo de cada etapa informado"; agora cita o inciso VI. |
| Decreto 9.094/2017 | art. 11, § 3º, XI | 26 | XI - os procedimentos para atendimento quando o sistema informatizado se encontrar indisponível; e | ✅ Confere com o que a tela afirma. |
| Decreto 9.094/2017 | art. 13, caput e § 1º | 31, 33 | Art. 13. Os usuários dos serviços públicos poderão apresentar Solicitação de Simplificação aos órgãos e às entidades do Poder Executivo federal, por meio de formulário próprio denominado Simplifique!, sempre que vislumbrarem oportunidade de simplificação ou melhoria do serviço público.<br>§ 1º A Solicitação de Simplificação deverá ser apresentada, preferencialmente, por meio eletrônico, em canal único oferecido pela Ouvidoria-Geral da União da Controladoria-Geral da União. | ✅ Confere com o que a tela afirma. |
| Decreto 9.094/2017 | art. 18, I e II | 08, 20, 33 | Art. 18. A Carta de Serviços ao Usuário, a forma de acesso, as orientações de uso e as informações do formulário Simplifique! deverão ser objeto de permanente divulgação aos usuários dos serviços públicos, e mantidos visíveis e acessíveis ao público:<br>I - no portal único gov.br; e<br>II - nos locais de atendimento, por meio de extração das informações do portal único gov.br, em formato impresso. | ✅ Confere com o que a tela afirma. |
| Decreto 9.094/2017 | art. 18-A, caput | 02, 08, 19, 22, 26 | Art. 18-A. Fica vedado aos órgãos e às entidades da administração pública federal solicitar ao usuário do serviço público requisitos, documentos, informações e procedimentos cuja exigibilidade não esteja informada no portal único gov.br. | ✅ Confere com o que a tela afirma. |
| Decreto 9.094/2017 | art. 18-A, § 2º | 02, 16, 24, 30 | § 2º A criação ou a alteração do rol de requisitos, documentos, informações e procedimentos do serviço público será precedida de publicação no portal único gov.br. | ✅ Confere com o que a tela afirma. |
| Decreto 9.094/2017 | art. 20, caput | 26 | Art. 20. Os órgãos e as entidades do Poder Executivo federal utilizarão ferramenta de pesquisa de satisfação dos usuários dos seus serviços, disponível no endereço eletrônico www.gov.br/governodigital e os dados obtidos subsidiarão a reorientação e o ajuste da prestação dos serviços. | ✅ Confere. Obs.: a redação vigente (Decreto 10.332/2020) fala da ferramenta em gov.br/governodigital. |
| Decreto 9.492/2018 | art. 5º, IV | 16, 33 | Art. 5º São objetivos do Sistema de Ouvidoria do Poder Executivo federal:<br>IV - acompanhar a implementação da Carta de Serviços ao Usuário, de que trata o art. 7º da Lei nº 13.460, de 2017, de acordo com os procedimentos adotados pelo Decreto nº 9.094, de 17 de julho de 2017. | ✅ Confere com o que a tela afirma. |
| Decreto 9.492/2018 | art. 10, V | 16, 33 | Art. 10. Compete às unidades setoriais do Sistema de Ouvidoria do Poder Executivo federal:<br>V - processar as informações obtidas por meio das manifestações recebidas e das pesquisas de satisfação realizadas com a finalidade de avaliar os serviços públicos prestados, em especial sobre o cumprimento dos compromissos e dos padrões de qualidade de atendimento da Carta de Serviços ao Usuário, de que trata o art. 7º da Lei nº 13.460, de 2017; e | ✅ Confere com o que a tela afirma. |
| Decreto 8.539/2015 | art. 4º | 02, 33 | Art. 4º Para o atendimento ao disposto neste Decreto, os órgãos e as entidades da administração pública federal direta, autárquica e fundacional utilizarão sistemas informatizados para a gestão e o trâmite de processos administrativos eletrônicos. | ✅ obs. Incluído nas telas 2 e 33 ("Onde registrar: SEI"). O decreto não cita o nome "SEI"; que o sistema da ANTAQ é o SEI é fato publicado. |
| Portaria Normativa CGU 116/2024 | art. 7º, VII | 02, 13, 14, 16, 33 | Art. 7º São atividades de ouvidoria, sem prejuízo de outras que lhes sejam atribuídas por norma específica:<br>VII - zelar pela adequação, atualidade e qualidade das informações constantes nas Cartas de Serviços dos órgãos e entidades a que estejam vinculadas; | ✅ Confere com o que a tela afirma. |
| Portaria Normativa CGU 116/2024 | art. 56 | 30, 33 | Art. 56. A metodologia de trabalho das unidades setoriais do SisOuv poderá incorporar ações de ouvidoria ativa com a finalidade de prestar orientações, receber manifestações, coletar dados, realizar pesquisas, avaliar serviços e engajar usuários nos canais de participação e controle social. | ✅ Confere com o que a tela afirma. |
| Portaria Normativa CGU 116/2024 | art. 60, caput | 20, 21, 33 | Art. 60. As unidades setoriais do SisOuv deverão elaborar relatórios de gestão, nos termos dos arts. 14, II, e 15 da Lei nº 13.460, de 2017, com periodicidade mínima anual, a ser publicado no sítio eletrônico do órgão ou entidade até o primeiro dia do mês de abril de cada ano, abrangendo informações referentes ao ano anterior. | ✅ Confere com o que a tela afirma. |
| Portaria Normativa CGU 116/2024 | art. 60, § 1º, VII | 04, 16, 21, 31 | § 1º O relatório anual de gestão deverá conter, ao menos:<br>VII - informações acerca da atualização da Carta de Serviços do órgão ou entidade a que a unidade setorial de ouvidoria está vinculada. | ✅ Confere com o que a tela afirma. |
| Portaria Normativa CGU 116/2024 | art. 65, caput | 02, 13, 14, 16, 20 | Art. 65. As unidades do SisOuv atuarão em coordenação com as demais unidades dos órgãos e entidades a que estejam vinculadas na elaboração e atualização da Carta de Serviços ao Usuário. | ✅ Confere com o que a tela afirma. |
| Portaria Normativa CGU 116/2024 | art. 65, § 1º, VII | 09, 24 | VII - a atualização contínua das informações que compõem a Carta de Serviços ao Usuário, sempre que necessário. | ✅ Confere. Tela 24: "atualize em até 30 dias (meta interna do guia)" saiu; agora "atualize sempre que necessário", com esta base. |
| Portaria Normativa CGU 116/2024 | art. 65, § 2º | 02, 04, 09, 16, 21, 26, 30, 33 | § 2º A despeito de sua atualização contínua, as informações que compõem a Carta de Serviços ao Usuário deverão ser objeto de revisão anual, mediante consulta pelas unidades do SisOuv às unidades gestoras de serviços dos órgãos e entidades a que estejam vinculadas. | ✅ Confere com o que a tela afirma. |
| Portaria Normativa CGU 116/2024 | art. 80 | 34 | Art. 80. Fica revogada a Portaria CGU nº 581, de 9 de março de 2021. | ✅ Confere ("Portaria CGU 581/2021, revogada"). |
| Lei 13.848/2019 | art. 22, § 1º, I | 16, 33 | § 1º São atribuições do ouvidor:<br>I - zelar pela qualidade e pela tempestividade dos serviços prestados pela agência; | ✅ Confere com o que a tela afirma. |
| Lei 13.848/2019 | art. 22, §§ 4º e 6º | 31, 33 | § 4º Os relatórios do ouvidor deverão ser encaminhados ao conselho diretor ou à diretoria colegiada da agência reguladora, que poderá se manifestar no prazo de 20 (vinte) dias úteis.<br>§ 6º Transcorrido o prazo para manifestação do conselho diretor ou da diretoria colegiada, o ouvidor deverá encaminhar o relatório e, se houver, a respectiva manifestação ao titular do ministério a que a agência estiver vinculada, à Câmara dos Deputados, ao Senado Federal e ao Tribunal de Contas da União, bem como divulgá-los no sítio da agência na internet. | ✅ Confere com o que a tela afirma. |
| Lei 13.848/2019 | art. 22 (Diretoria Colegiada) | 14 | Art. 22. Haverá, em cada agência reguladora, 1 (um) ouvidor, que atuará sem subordinação hierárquica e exercerá suas atribuições sem acumulação com outras funções. | ❌ Corrigido. A tela citava o art. 22 para a Diretoria Colegiada ("patrocina o ciclo, valida inclusões e exclusões"), mas o artigo trata do ouvidor. Base trocada para "Guia CGU, itens 3.2, 3.3 e 3.7". |
| Lei 14.129/2021 | art. 3º, XVIII | 33 | Art. 3º São princípios e diretrizes do Governo Digital e da eficiência pública:<br>XVIII - o cumprimento de compromissos e de padrões de qualidade divulgados na Carta de Serviços ao Usuário; | ✅ Confere com o que a tela afirma. |
| Lei 14.129/2021 | art. 18, II | 08, 33 | Art. 18. São componentes essenciais para a prestação digital dos serviços públicos na administração pública:<br>II - as Cartas de Serviços ao Usuário, de que trata a Lei nº 13.460, de 26 de junho de 2017; e | ✅ Confere com o que a tela afirma. |
| Lei 14.129/2021 | art. 24, I, "a" | 08, 33 | Art. 24. Os órgãos e as entidades responsáveis pela prestação digital de serviços públicos deverão, no âmbito de suas competências:<br>I - manter atualizadas:<br>a) as Cartas de Serviços ao Usuário, a Base Nacional de Serviços Públicos e as Plataformas de Governo Digital; | ✅ Confere com o que a tela afirma. |
| Lei 14.129/2021 | art. 27, II | 08, 09, 33 | Art. 27. São garantidos os seguintes direitos aos usuários da prestação digital de serviços públicos, além daqueles constantes das Leis nºs 13.460, de 26 de junho de 2017, e 13.709, de 14 de agosto de 2018 (Lei Geral de Proteção de Dados Pessoais):<br>II - atendimento nos termos da respectiva Carta de Serviços ao Usuário; | ✅ Confere com o que a tela afirma. |
| Portaria SGD/MGI 1.083/2025 | art. 3º | 11, 26, 33 | Art. 3º São características dos serviços públicos:<br>I - interação: o serviço envolve contato entre a unidade gestora e o usuário, por meio de canais digitais ou presenciais;<br>II-suficiência: o serviço engloba todas as etapas necessárias para identificação, compreensão, solicitação, acompanhamento e recebimento de resposta definitiva sobre a demanda apresentada pelo usuário;<br>III - personalização: o serviço é prestado a cada usuário de forma individualizada;<br>IV - processo padrão: o serviço dispõe de sequência definida de etapas que devem ser seguidas para atendimento do usuário; e<br>V - foco em usuários externos: o serviço se destina principalmente a usuários de fora do órgão ou entidade da administração pública. | ✅ Confere. "Individual" (tela 11) = "personalização"; "Externo" = "foco em usuários externos". |
| Portaria SGD/MGI 1.083/2025 | art. 6º, II | 13, 14, 16, 26, 33 | Art. 6º Às unidades gestoras dos serviços compete:<br>II - manter atualizadas no portal único gov.br as informações sobre os serviços públicos prestados; | ✅ Confere com o que a tela afirma. |
| Lei 15.263/2025 | art. 5º, caput | 27, 33 | Art. 5º A administração pública obedecerá às técnicas de linguagem simples na redação de textos dirigidos ao cidadão, tais como: | ✅ Confere com o que a tela afirma. |
| Lei 15.263/2025 | art. 5º, VIII | 22, 26 | VIII - redigir o nome completo antes das siglas; | ✅ Confere. Telas 22 e 26 citavam só "Lei 15.263/2025" para "sem sigla solta"; agora citam o inciso VIII. "Verbo no infinitivo" vem do Guia de Edição do gov.br (campo Nome), também citado na tela 22. |
| Lei 10.048/2000 (red. Lei 14.626/2023) | art. 1º | 10, 26, 33 | Art. 1º As pessoas com deficiência, as pessoas com transtorno do espectro autista, as pessoas idosas com idade igual ou superior a 60 (sessenta) anos, as gestantes, as lactantes, as pessoas com criança de colo, os obesos, as pessoas com mobilidade reduzida e os doadores de sangue terão atendimento prioritário, nos termos desta Lei. | ✅ Confere com o que a tela afirma. |
| Decreto 12.198/2024 | ementa | 33 | Institui a Estratégia Federal de Governo Digital para o período de 2024 a 2027 e a Infraestrutura Nacional de Dados, no âmbito dos órgãos e das entidades da administração pública federal direta, autárquica e fundacional. | ✅ Confere com o que a tela afirma. |
| Lei 10.233/2001 | art. 21, caput | 34 | Art. 21. Ficam instituídas a Agência Nacional de Transportes Terrestres - ANTT e a Agência Nacional de Transportes Aquaviários - ANTAQ, entidades integrantes da administração federal indireta, submetidas ao regime autárquico especial e vinculadas, respectivamente, ao Ministério dos Transportes e à Secretaria de Portos da Presidência da República, nos termos desta Lei. | ⚠️ Corrigido. A tela dizia "Cria a ANTAQ e prevê sua Ouvidoria (art. 52)"; quem institui a ANTAQ é o art. 21. Agora cita os arts. 21 e 52. |
| Lei 10.233/2001 | art. 52 | 34 | Art. 52. A ANTT e a Antaq terão como órgãos de deliberação máxima as Diretorias Colegiadas e terão em suas estruturas organizacionais uma Procuradoria, uma Ouvidoria e uma Corregedoria. | ✅ Confere com o que a tela afirma. |
| Portaria nº 235/2019-DG/ANTAQ | art. 1º | 34 | Art. 1º Instituir a Ouvidoria da ANTAQ como canal único de recebimento de todas as manifestações de que trata o art. 10 da Lei nº 13.460, de 2017. | ✅ Confere com o que a tela afirma. |
| Portaria nº 235/2019-DG/ANTAQ | considerandos | 34 | Considerando o art. 37 do Regimento Interno desta Agência, que estabelece as competências da Ouvidoria; | ✅ Confere: "Regimento Interno, art. 37: competências da Ouvidoria". Qual resolução aprova o Regimento vigente segue em "Pontos a confirmar" na tela 34. |
| Portaria nº 3/2025/OUV/ANTAQ | preâmbulo | 34 | A OUVIDORA SUBSTITUTA DA AGÊNCIA NACIONAL DE TRANSPORTES AQUAVIÁRIOS - ANTAQ, no uso das atribuições que lhe conferem os artigos 37 e 38, e no inc. V, art. 5º, do Regimento Interno, aprovado pela Resolução 3.585-Antaq, de 18 de agosto de 2014, alterada pela Resolução nº 77-Antaq, de 09 de junho de 2022, em conformidade com o disposto na Lei nº 13.460, de 2017, e no Decreto nº 9.492, de 2018; | ℹ️ Mostra a resolução do Regimento citada pela própria portaria (ver "Pontos a confirmar", tela 34). |
| Portaria nº 3/2025/OUV/ANTAQ | art. 3º | 34 | Art. 3º A estrutura organizacional da Ouvidoria da Antaq foi alterada pela PORTARIA/DG/ANTAQ Nº 385, de 30 de novembro de 2021, passando a ter a seguinte subdivisão: Coordenadoria de Apoio ao Cidadão (CAC); e Coordenadoria de Transparência e Acesso à Informação (CTA), as quais passaram a ser denominadas Seção de Apoio ao Cidadão (SAC) e Seção de Transparência e Acesso à Informação (STAI). | ⚠️ Corrigido. A tela dizia "Portaria 385/2021: estrutura SAC e STAI"; a 385 criou CAC e CTA, depois renomeadas SAC e STAI. Texto ajustado. |
| Portaria nº 3/2025/OUV/ANTAQ | art. 4º, V e VI | 14, 34 | Art. 4º Compete à Seção de Apoio ao Cidadão (SAC):<br>V - Acompanhar a elaboração, implementação e a atualização da Carta de Serviços ao Usuário em coordenação com os gestores competentes de cada área responsável;<br>VI - Processar as informações obtidas por meio das manifestações recebidas e das pesquisas de satisfação realizadas com a finalidade de avaliar os serviços públicos prestados, em especial sobre o cumprimento dos compromissos e dos padrões de qualidade de atendimento da Carta de Serviços ao Usuário; | ⚠️ Corrigido na tela 14. Ela atribuía à SAC, com base no "art. 4º, V a VII", tarefas que a portaria não traz ("abre o processo SEI do ciclo e envia a consulta anual"). Agora reproduz os incisos V e VI. Tela 34 já conferia. |
| Portaria nº 3/2025/OUV/ANTAQ | art. 5º, III | 14 | Art. 5º Compete à Seção de Transparência e Acesso à Informação (STAI):<br>III - Acompanhar as informações publicadas no sítio eletrônico da ANTAQ, visando garantir a integridade, autenticidade e atualidade; | ⚠️ Corrigido. A tela dizia "Confere a coerência entre a Carta, o site da ANTAQ e a seção de Acesso à Informação"; agora: "Acompanha as informações publicadas no site da ANTAQ, para garantir integridade, autenticidade e atualidade". |
| Portaria nº 3/2025/OUV/ANTAQ | art. 14, I | 31, 34 | Art. 14. Todas as manifestações recebidas pela Ouvidoria, independentemente do canal utilizado, receberão tratamento criterioso, devendo serem analisadas e respondidas diretamente pela própria Ouvidoria, quando cabível, ou encaminhadas às UORGs responsáveis, quando necessário, para a devida instrução.<br>I - O prazo para resposta ao demandante é de 30 (trinta) dias, contados da data de seu recebimento, prorrogável por igual período mediante justificativa expressa, conforme determina o art. 18 do Decreto nº 9.492, de 5 de setembro de 2018; | ✅ Confere com o que a tela afirma. |
| Portaria nº 3/2025/OUV/ANTAQ | art. 21, caput e II | 15, 31, 34 | Art. 21. A Ouvidoria encaminhará as demandas às UORGs em até 2 (dois) dias úteis, a contar da data do registro da manifestação, por meio do da Plataforma Fala.BR.<br>II - O prazo para resposta da UORG à Ouvidoria é de 20 (vinte) dias corridos, contado da data de recebimento das demandas na Unidade, devendo a CAC monitorar o prazo dessa resposta. | ✅ Confere. Tela 34 passou a dizer "20 dias corridos", como no inciso II. |
| Portaria nº 3/2025/OUV/ANTAQ | arts. 38 e 39 | 14, 34 | Art. 38. Os conselhos de usuários de serviços públicos são órgãos consultivos, cujas competências estão definidas no art. 24-D do Decreto nº 9.492, de 2018, e que são compostos exclusivamente por usuários voluntários, que participarão como respondentes nas consultas produzidas e encaminhadas pelas unidades setoriais do SisOuv.<br>Art. 39. Em conformidade com a Portaria CGU nº 581/2021, a coleta sistematizada de informações acerca da qualidade de todos os serviços prestados no órgão ou entidade, na forma definida em Guia Metodológico específico pelo órgão central do SisOuv, será realizada com periodicidade mínima quadrienal, por meio de consultas a serem encaminhadas aos conselheiros pela unidade do SisOuv responsável pela supervisão da execução do serviço público a ser avaliado.<br>Parágrafo Único A Ouvidoria da ANTAQ estabelece que o planejamento quadrienal de consulta ao conselho de usuários relaciona todos os serviços da Agência, os quais serão objeto de chamamento anualmente, considerando viabilizar a avaliação de todos os serviços da organização ano a ano, conforme estabelecem os §§ 2º e 3º do Art. 59 da Portaria CGU nº 581/2021,com a redação alterada pela Portaria CGU n° 3.126/2021, e conforme disponibilizado no artefato SEI nº 50300.006969/2025-44. | ⚠️ Ajustado. A tela 34 dizia "Consulta anual ao Conselho de Usuários"; o art. 39 fixa periodicidade mínima quadrienal e o parágrafo único, chamamento anual dos serviços. Agora: "planejamento quadrienal, com chamamento anual dos serviços". |

**Alterações de 20/10/2026, depois da conferência:** a tela "As 11 etapas do Guia da CGU" foi incluída e
depois excluída; a antiga tela 5 ("A base: o Guia Orientativo da CGU") foi substituída por "Objetivo", que
reúne os objetivos (antes na tela 4) e as duas mensagens centrais da CGU, agora com a fonte: Guia CGU,
itens 2.2 ("a Ouvidoria não é a única responsável") e 2.1 ("O gestor é responsável por garantir a
veracidade"). As telas seguintes voltaram à numeração anterior. ✅

**Guia Orientativo da CGU** (telas 5, 14, 18 a 20, 22, 26 e 33): os itens citados (2, 3, 3.1 a 3.11, pág. 5)
são os mesmos conferidos na seção 1.

