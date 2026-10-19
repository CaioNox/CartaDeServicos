# Instruções para agentes de IA (Claude Code, Antigravity e outros)

Projeto: **Guia Prático da Carta de Serviços** da Ouvidoria da ANTAQ — site estático em
HTML/CSS/JS puro, publicado no GitHub Pages. Leia o `README.md` antes de mudar algo.

## Regras do projeto

1. **Sem build, sem framework, sem CDN.** HTML, CSS e JavaScript ES2017 puros. Fontes e
   ícones vêm de `vendor/`; não adicione `<script src="https://...">` nem Google Fonts.
2. **Uma tela por arquivo** em `guia/` (`slide-*.html`, `capa-*.html`), tela 1920×1080 com
   `html { font-size: 38px }` vindo de `guia.css`. Reaproveite as classes de `guia.css`
   (`.cartao`, `.grade .g2/.g3`, `.lead`, `.tabela`, `.kpi`, `.base`, `.a-validar`…);
   estilo exclusivo da tela fica no `<style>` dela.
3. **`guia/deck.js` é o manifesto único.** Toda tela nova entra em `blocos[].files`.
   Tela com conteúdo escondido (etapas `.etapa-foco`, cartões `.tile`) precisa de
   entrada em `anexos`, senão o PDF perde conteúdo.
4. **Navegação:** as telas carregam `guia.js` (teclado, atalhos `data-ir`, etapas) e
   `a11y.js`. Não acrescente outro listener que mande `slide-nav` — cada tecla
   avançaria duas telas.
5. **Paleta institucional sem verde** (`base.css`: `--brand-primary #103050`,
   `--brand-secondary #0070C0`, `--accent #0090C0`, `--dourado #F2A900`).
6. **Só entra dado com base legal ou fato publicado. Nunca invente.** Todo prazo, mês,
   número, meta, responsável ou exigência precisa vir de lei, decreto, portaria ou de fato
   já publicado (Carta no Portal gov.br, site da ANTAQ, *Guia Orientativo* da CGU), com a
   fonte citada na tela. Não adicione dado sem essa base e não remova dado que a tenha sem
   motivo legal. Números da Carta vêm de `guia/dados/servicos.js`, conferido contra o PDF
   do Portal. Recomendação interna sem norma não é apresentada como regra: ou sai do guia
   ou leva `<span class="a-validar">…</span>`. Dados fornecidos pela Ouvidoria (ex.: equipe
   na ficha técnica) ficam; divergência com fonte oficial é apontada, não "corrigida".
7. **Base legal citada com artigo** (ex.: "Lei nº 13.460/2017, art. 7º, §2º, IV"),
   conferida no texto oficial (planalto.gov.br, in.gov.br). Na dúvida sobre uma norma,
   não afirme — marque para validação.
8. **Português do Brasil** em textos, nomes de arquivos, classes e funções.
9. **Acessibilidade:** `lang="pt-BR"`, `<title>`, `alt` em imagens, foco visível,
   tudo operável por teclado, respeitar `prefers-reduced-motion`.

## Antes de entregar

```bash
npm run validar     # obrigatório — o CI bloqueia a publicação se falhar
npm run testar      # recomendado — erros de JS e conteúdo saindo da tela
```
