# Alerta de Loot Landing Page

Landing page estática para converter visitantes em inscritos nos canais do Alerta de Loot.

## Arquivos principais

- `index.html`: estrutura da página, SEO, Open Graph e placeholders dos links.
- `styles.css`: visual responsivo, tema gamer/tech e layout mobile-first.
- `script.js`: tracking básico de clique, ocultação de botões vazios e preservação de UTMs.
- `assets/`: imagens usadas pela landing.
- `og-image.png`: imagem de compartilhamento usada no Open Graph.

## Onde trocar os links

Abra `index.html` e procure pelo comentário:

```html
<!-- Troque os placeholders abaixo pelos links reais. Se não quiser exibir um canal, deixe href e data-url vazios. -->
```

Substitua os placeholders pelos links reais:

- `WHATSAPP_GROUP_URL`
- `TELEGRAM_URL`
- `FACEBOOK_URL`
- `X_URL`

Importante: troque tanto o `href` quanto o `data-url` do botão.

Exemplo:

```html
<a
  class="cta-button cta-button--whatsapp"
  href="https://chat.whatsapp.com/seu-grupo"
  data-url="https://chat.whatsapp.com/seu-grupo"
  data-channel="WhatsApp"
>
```

Para esconder um canal, deixe `href=""` e `data-url=""`.

## Como testar localmente

O projeto não precisa de backend.

1. Abra a pasta do projeto.
2. Dê dois cliques em `index.html`.
3. Para testar UTMs, abra a página com parâmetros na URL, por exemplo:

```text
index.html?utm_source=meta&utm_campaign=teste1
```

Ao clicar nos botões, o navegador deve manter os parâmetros UTM nos links reais e registrar o clique no console.

## Como subir na Vercel

1. Crie um novo projeto na Vercel.
2. Importe o repositório ou envie apenas esta pasta `landing`.
3. Use configuração de projeto estático, sem framework.
4. Se importar o repositório inteiro, configure `Root Directory` como `landing`.
5. Deixe o build command vazio.
6. Deixe o output directory vazio ou use `.` se a Vercel pedir.
7. Publique.

## Como subir na Netlify

1. Crie um novo site na Netlify.
2. Envie apenas esta pasta `landing` ou conecte o repositório.
3. Use configuração sem framework.
4. Se conectar o repositório inteiro, use `landing` como base directory.
5. Deixe o build command vazio.
6. Use `.` como publish directory dentro de `landing`.
7. Publique.

## Como subir na Cloudflare Pages

1. Crie um novo projeto no Cloudflare Pages.
2. Conecte o repositório ou faça upload direto da pasta `landing`.
3. Use configuração sem framework.
4. Se conectar o repositório inteiro, use `landing` como root directory.
5. Deixe o build command vazio.
6. Use `.` como output directory dentro de `landing`.
7. Publique.
