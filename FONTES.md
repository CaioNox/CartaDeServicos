# Fontes dos dados do guia

Todo dado do guia tem de vir de uma das fontes abaixo (regra 6 do `AGENTS.md`).
Conferência completa feita em **19/10/2026**, no texto oficial de cada norma.

## Normas

| Norma | Onde foi conferida | Usada para |
|---|---|---|
| Lei nº 13.460/2017 | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13460.htm | art. 7º (conteúdo mínimo, §§2º a 4º), arts. 13 e 14 (ouvidoria), art. 23 (avaliação, §1º: no mínimo anual) |
| Decreto nº 9.094/2017 | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/decreto/d9094.htm | art. 11, §§2º e 3º (incisos VI e XI); art. 13 (Simplifique!); art. 18, I e II (Portal e versão impressa); art. 18-A e §2º (publicar antes de exigir) |
| Decreto nº 9.492/2018 | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/decreto/d9492.htm | art. 5º, IV; art. 10, V; art. 24-C (conselhos de usuários, incluído pelo Decreto nº 10.228/2020) |
| Portaria Normativa CGU nº 116/2024 | https://www.in.gov.br/en/web/dou/-/portaria-normativa-cgu-n-116-de-18-de-marco-de-2024-549091878 | art. 7º, VII; art. 56 (ouvidoria ativa); art. 60 (relatório de gestão até 1º de abril; §1º, VII); art. 65, §§1º a 3º (revisão anual no §2º) |
| Portaria SGD/MGI nº 1.083/2025 | Texto publicado no DOU de 17/02/2025 (cópia conferida: https://institucional.ufrrj.br/integridade/files/2025/02/Nivel_de_maturidade_Digital_de_servicos_publicos_assinado.pdf) | art. 2º, IV e V; art. 3º (cinco características); art. 6º, II e IV |
| Lei nº 14.129/2021 | https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14129.htm | art. 3º, II, III e XVIII; art. 18; art. 27, II |
| Lei nº 15.263/2025 | https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15263.htm | art. 5º (técnicas de linguagem simples, incisos citados nas telas) |
| Lei nº 10.048/2000 (redação da Lei nº 14.626/2023) | https://www.planalto.gov.br/ccivil_03/leis/l10048.htm | art. 1º (grupos com atendimento prioritário) |

**Não há em norma:** mês para cada etapa do ciclo, prazo de "30 dias" para atualizar o
Portal ou responder à consulta anual, nem metas numéricas de avaliação ou satisfação.
Esses dados estavam na primeira versão e foram retirados.

## Documentos publicados

| Documento | Onde | Usado para |
|---|---|---|
| *Cartas de Serviços: Guia Orientativo ao SisOuv*, CGU, dez/2025 | https://basedeconhecimento.cgu.gov.br/items/39f2fdb6-7d14-4175-ab2c-65d8771407be | itens 2.1 e 2.2 (deveres), itens 3.1 a 3.11 (etapas, quem faz e resultado de cada uma), links para editores |
| Guia de Edição de Serviços do gov.br (campos do questionário) | https://www.gov.br/pt-br/guia-de-edicao-de-servicos-do-gov.br/como-cadastrar-e-alterar-servicos/campos-do-questionario-de-servicos | nome com verbo no infinitivo; campos Custos, Legislação e tempo de cada etapa |
| Carta de Serviços da ANTAQ (PDF do Portal) | https://www.gov.br/pt-br/orgaos/agencia-nacional-de-transportes-aquaviarios/@@download.pdf | `guia/dados/servicos.js`: 33 serviços, prazos, etapas, Ouvidoria, links, avaliações, texto de prioridades. Coleta em 15/10/2026; conferida campo a campo em 19/10/2026, sem diferença |
| Estrutura da ANTAQ ("Quem é quem") | https://www.gov.br/antaq/pt-br/acesso-a-informacao/institucional/quem-e-quem | superintendências e gerências (GOA, GAF e GPO na SOG; GRN e GRP na SRG; GOF na SAF); nome completo da SFC; Ouvidora e telefone (61) 2029-6574 |
| Canais de atendimento da Ouvidoria | https://www.gov.br/antaq/pt-br/canais_atendimento/ouvidoria/canais_de_atendimento | 0800 644 5001; endereço SEPN Quadra 514, Conjunto E; ouvidoria@antaq.gov.br |
| Certificado do Mês da Carta de Serviços | `Agência Nacional de Transportes Aquaviários.pdf` (raiz do repositório) | tela do certificado (Brasília, 06/08/2026) |

## Comparação entre Cartas (tela "Erros comuns nas Cartas")

PDFs gerados pelo Portal gov.br em 19/10/2026 (`https://www.gov.br/pt-br/orgaos/<órgão>/@@download.pdf`),
lidos por script: cada serviço começa na linha "Avaliação:"; prazo = texto após
"Quanto tempo leva?"; Ouvidoria = menção a "ouvidoria" ou "Fala.BR"; prioridades atualizadas =
menção a "autis"; sigla = palavra com duas ou mais maiúsculas no nome, exceto a do próprio órgão.

| Órgão | Serviços | Sem prazo | Só média | Intervalo | Citam Ouvidoria/Fala.BR | Prioridades com TEA | Links sem HTTPS | Nomes com sigla |
|---|---|---|---|---|---|---|---|---|
| Anvisa | 381 | 111 | 154 | 8 | 4 | 0 | 51 (15 para antigo.anvisa.gov.br) | 103 |
| ANP | 130 | 63 | 37 | 7 | 31 | 0 | 1 | 47 |
| Ibama | 89 | 18 | 0 | 16 | 5 | 0 | 0 | 28 |
| ANTT | 57 | 15 | 2 | 5 | 32 | 0 | 1 | 22 |
| ANS | 44 | 6 | 7 | 6 | 2 | 0 | 1 | 10 |
| ANTAQ | 33 | 1 | 11 | 6 | 11 | 0 | 7 (em 4 serviços) | 5 |
| Anatel | 26 | 9 | 1 | 11 | 0 | 0 | 0 | 6 |
| Aneel | 18 | 5 | 1 | 7 | 4 | 14 | 3 | 3 |

## Divergências a resolver pela Ouvidoria

- **Ficha técnica:** a tela traz Maria de Lourdes Gurgel Araújo como chefe da SAC; o "Quem é
  quem" do site da ANTAQ (19/10/2026) traz Vanessa Botelho Rodrigues. Os nomes da equipe
  foram informados pela Ouvidoria e não foram alterados.
- **Unidade gestora de 5 serviços** (n.º 1, 2, 18, 19 e 21 em `servicos.js`): a página do
  serviço no Portal não cita a unidade nem uma gerência dela. A atribuição atual precisa de
  confirmação (`unidadeCitada: false`).
