# Deploy do DSM na Hostinger — dynamicslidemaker.com.br

## O que foi ajustado

1. **Formulário "Solicitar Acesso" corrigido** (`src/components/sections/CallToAction.tsx`): antes era
   falso (só simulava envio com `setTimeout`, nenhum lead chegava a lugar nenhum). Agora envia de
   verdade via [FormSubmit](https://formsubmit.co) para `contato@dynamicslidemaker.com.br`.
   **Ação necessária:** na primeira submissão real do formulário, o FormSubmit manda um e-mail de
   confirmação para essa caixa — é preciso clicar no link para ativar o recebimento. Se essa caixa
   ainda não existe no Hostinger, crie-a antes (hPanel → E-mails).
2. **Roteamento de SPA** (`public/.htaccess`): o site usa React Router; sem essa regra, qualquer
   URL que não seja a raiz retorna 404 do servidor em vez do app. Também força HTTPS e o domínio
   canônico `www.dynamicslidemaker.com.br`.
3. **SEO/meta tags** (`index.html`, `public/robots.txt`, `public/sitemap.xml`): canonical, Open
   Graph, Twitter Card e sitemap apontando para o domínio final.
4. **Servidor Node opcional** (`server.js`): só é necessário se você hospedar via app Node.js da
   Hostinger em vez de hospedagem estática comum.

## Como publicar (hospedagem estática — caminho mais simples)

A maioria dos planos Hostinger serve o site como arquivos estáticos (Apache/LiteSpeed), mesmo em
planos "Business"/"Cloud". Este é o caminho recomendado para este projeto, que não tem backend.

1. `npm install`
2. `npm run build` → gera a pasta `dist/`
3. No hPanel da Hostinger, abra **File Manager** (ou use FTP) e entre em `public_html` do domínio
   `dynamicslidemaker.com.br`.
4. Apague o conteúdo padrão (`default.php` etc.) e envie **todo o conteúdo de `dist/`** (incluindo
   o `.htaccess`, que fica oculto — confirme que ele foi enviado).
5. Confirme em hPanel → SSL que o certificado está ativo (Hostinger emite automaticamente) — o
   `.htaccess` já força HTTPS.
6. Acesse `https://www.dynamicslidemaker.com.br` e teste o formulário de solicitação de acesso.

## Como publicar (hospedagem Node.js/VPS)

Só use este caminho se o painel exigir um app Node em execução contínua.

1. Envie o projeto inteiro (sem `node_modules`, sem `dist/`, sem o `.zip` de backup) para o
   servidor.
2. `npm install`
3. `npm run build`
4. Configure o app Node no hPanel com **arquivo de inicialização** `server.js` (ele já lê a porta
   de `process.env.PORT`).
5. Inicie/reinicie o app pelo painel.

## Itens que não bloqueiam o deploy, mas vale revisar depois

- **Imagens de placeholder**: `Problem.tsx` e `CallToAction.tsx` usam imagens de um serviço de
  mock (`img.usecurling.com`) em vez de imagens reais da marca. Funcionam, mas não são
  profissionais para produção.
- **Script `skip.js`** em `index.html`: veio da plataforma que gerou o projeto (Skip/goskip.dev) e
  está marcado como "não remover". Mantive como está — se quiser confirmar se ele ainda é
  necessário fora da plataforma Skip, vale testar removendo em um ambiente de staging.
- **Bundle JS** (`~768 KB` antes da compressão): o Vite avisou que o chunk principal está grande.
  Não impede o funcionamento, mas dá para melhorar com `import()` dinâmico depois.
- **Dois gerenciadores de pacote** (`bun.lockb` e `pnpm-lock.yaml` coexistindo): não atrapalha o
  build, mas o ideal é manter só um no futuro.
