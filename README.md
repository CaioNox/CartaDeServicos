# Guia Prático da Carta de Serviços — Ouvidoria da ANTAQ

Guia interativo, em **HTML**, que orienta as unidades da **ANTAQ** (Agência Nacional de
Transportes Aquaviários) na revisão e atualização da **Carta de Serviços ao Usuário**.

O mesmo conteúdo sai em três formatos, a partir dos mesmos arquivos:

- **apresentação navegável** 16:9 (`guia/index.html`);
- **versão A4** para imprimir ou salvar em PDF (`guia/relatorio.html`);
- arquivo **.pptx**, gerado no próprio navegador a partir da versão A4.

Não há back-end nem etapa de build: o repositório **é** o site. O desenho e a arquitetura
são os mesmos dos relatórios da Ouvidoria ([`relatorio-antaq`](https://github.com/CaioNox/relatorio-antaq)).

---

## O que tem no guia

| Capítulo | Conteúdo |
|---|---|
| Abertura | Capa, o guia em 1 minuto, ficha técnica e como usar, sumário clicável, apresentação, a base no Guia da CGU, reconhecimento da CGU |
| 1 · Entendendo a Carta | O que é e onde publicar · conteúdo obrigatório (Lei 13.460, art. 7º; Decreto 9.094, art. 11) · teste **"é serviço de atendimento?"** (Portaria SGD/MGI 1.083/2025) |
| 2 · Papéis | Quem faz cada etapa, segundo o Guia da CGU · deveres da unidade gestora e da Ouvidoria |
| 3 · Passo a passo | As 11 etapas do Guia da CGU aplicadas à ANTAQ · prazos fixados em norma · ficha padrão do serviço · **formulário de atualização** que gera o texto para o SEI |
| 4 · Qualidade | **Checklist de 16 itens** (pré-marcado a partir do diagnóstico) · linguagem simples com nomes reais · erros comuns nas Cartas |
| 5 · Monitoramento | **Diagnóstico** da Carta da ANTAQ · indicadores e metas fixadas em norma · de onde vêm as melhorias |
| 6 · Apêndice | Normas · inventário dos 33 serviços · glossário e links · contatos |

### Bases

- *Cartas de Serviços: Guia Orientativo ao SisOuv* — CGU, dez/2025 (estrutura e passo a passo).
- Lei nº 13.460/2017, Decreto nº 9.094/2017, Portaria Normativa CGU nº 116/2024,
  Lei nº 14.129/2021, Portaria SGD/MGI nº 1.083/2025, Lei nº 15.263/2025 (linguagem simples),
  Lei nº 10.048/2000 com a redação da Lei nº 14.626/2023 (prioridades).
- Boas práticas do *Guia Prático da Carta de Serviços* da Anvisa (2026): canal único de
  atualização, confirmação anual "sem alteração" e ficha padrão.

### Regra dos dados

Só entra no guia dado com base em lei, decreto, portaria ou fato publicado, com a fonte
citada na tela. Nada de mês, prazo, meta ou número sem norma ou documento que o comprove.
A lista das fontes, onde foram conferidas e em que data está em [`FONTES.md`](FONTES.md).

### O que ainda precisa de confirmação

Itens marcados na tela com o selo tracejado **`.a-validar`**:

- ato e data de aprovação do guia (`slide-ficha.html`);
- unidade gestora de 5 serviços cuja página no Portal não cita a unidade (`unidadeCitada: false`
  em `guia/dados/servicos.js`).

Os números do diagnóstico vêm de `guia/dados/servicos.js` — retrato da Carta publicada no
Portal gov.br em **15/10/2026**, conferido de novo, serviço a serviço, em **19/10/2026**.

---

## Estrutura

```
.
├── index.html               hub (mesmo padrão do relatorio-antaq)
├── Imagens/                 logos do hub
├── vendor/                  fontes e ícones locais (nada vem de servidor de terceiros)
├── guia/
│   ├── deck.js              MANIFESTO ÚNICO: ordem das telas, capítulos e anexos do PDF
│   ├── index.html           visualizador (apresentação)
│   ├── relatorio.html       versão A4 / PDF / PPTX
│   ├── guia.css · guia.js   moldura e comportamento comuns das telas
│   ├── capa-bloco.css       capas de capítulo
│   ├── base.css · a11y.*    tokens de marca e acessibilidade (iguais aos relatórios)
│   ├── vida.js              animação dos números
│   ├── dados/servicos.js    inventário da Carta da ANTAQ (fonte do diagnóstico)
│   ├── slide-*.html         uma tela por arquivo
│   └── capa-*.html          capas de capítulo
├── scripts/
│   ├── validar.mjs          verificação estática (manifesto, caminhos, acessibilidade)
│   ├── testar-telas.mjs     teste no navegador (Playwright)
│   └── servir.mjs           servidor local
└── .github/workflows/
    ├── verificar.yml        a cada push/PR: validação + teste das telas
    ├── publicar.yml         push na main: valida e publica no GitHub Pages
    └── links.yml            toda segunda-feira: confere os links externos
```

## Como editar

**Mudar o texto de uma tela** — edite o `slide-*.html` correspondente. Cada tela abre
sozinha no navegador, útil para conferir.

**Inserir, mover ou remover uma tela** — edite só o array `files` do capítulo em
`guia/deck.js`. Contador, sumário de pontos, PDF e PPTX se ajustam sozinhos.
Atualize também, à mão, o sumário (`slide-sumario.html`) e a lista de tópicos da capa.

**Criar uma tela nova** — copie uma tela de layout parecido (ela já traz cabeçalho,
rodapé e os scripts comuns), troque o conteúdo e registre o arquivo no `deck.js`.

**Tela interativa** (etapas, cartões que abrem) — registre uma entrada em `anexos` no
`deck.js`, para o conteúdo escondido aparecer no PDF. O `validar.mjs` acusa se faltar.

**Atualizar o diagnóstico** — gere de novo o PDF da Carta no Portal gov.br, confira
serviço a serviço e atualize `guia/dados/servicos.js` (inclusive a data em `coleta`).
Diagnóstico, inventário, checklist, formulário e indicadores recalculam sozinhos.

**Atalho para uma tela** — `guia/index.html?tela=slide-formulario` abre direto nela.

## Rodar e verificar localmente

Os slides usam iframes e `fetch`, então sirva por HTTP (não abra por `file://`):

```bash
npm run servir            # http://localhost:8000  (Node, sem instalar nada)
npm run validar           # verificação estática
npm install && npx playwright install chromium
npm run testar            # abre cada tela no Chromium; capturas em saida-testes/
```

## Publicação

Todo `push` na `main` roda **Publicar no GitHub Pages**: primeiro a verificação estática,
depois o deploy (`actions/upload-pages-artifact` + `actions/deploy-pages`). Na primeira vez,
ative em *Settings → Pages → Source: GitHub Actions*.

O site usa só caminhos relativos e funciona em qualquer subcaminho
(`usuario.github.io/guia-carta-servicos-antaq/`) ou domínio próprio.

## Convenções

- **Caminhos diferenciam maiúsculas** (o Pages roda em Linux): a pasta é `Imagens/`.
- **Sem verde** na paleta — use os tokens de `base.css`.
- **Conteúdo final no HTML estático**; JavaScript só acrescenta comportamento.
- **Sem dependência de terceiros** em tempo de execução: fontes e ícones em `vendor/`.
- Nada sai do navegador: o formulário só gera texto para copiar no SEI.
- Nomes de arquivos, classes e funções em **português**, como nos relatórios.
