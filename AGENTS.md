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
6. **Dados não se inventam.** Números da Carta vêm de `guia/dados/servicos.js`.
   Informação ainda não confirmada leva `<span class="a-validar">…</span>`.
7. **Base legal citada com artigo** (ex.: "Lei nº 13.460/2017, art. 7º, §2º, IV").
   Na dúvida sobre uma norma, não afirme — marque para validação.
8. **Português do Brasil** em textos, nomes de arquivos, classes e funções.
9. **Acessibilidade:** `lang="pt-BR"`, `<title>`, `alt` em imagens, foco visível,
   tudo operável por teclado, respeitar `prefers-reduced-motion`.

## Antes de entregar

```bash
npm run validar     # obrigatório — o CI bloqueia a publicação se falhar
npm run testar      # recomendado — erros de JS e conteúdo saindo da tela
```
