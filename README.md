# MusicWork 🎵

## 🔄 Onde paramos (última atualização: 07/08/2026)

**Última sessão:** Fechamos os 4 itens da lista represada que dependiam só de configuração e código médio — banco de dev separado, cold start resolvido, verificação de email e limpeza de fotos órfãs no Cloudinary. Todos testados em produção.

**O que foi feito:**

- ✅ **Banco de desenvolvimento separado** — criada uma branch `development` no Neon (cópia isolada dos dados de produção, mesmo projeto). `.env` local agora aponta pra essa branch; produção (Render) continua na branch `production`, intacta.
- ✅ **Cold start resolvido** — monitor no UptimeRobot batendo em `https://api.musicwork.com.br/health` a cada 5 minutos, mantendo o Render acordado.
- ✅ **Verificação real de email no cadastro** — `isEmailVerified`, `emailVerificationToken`, `emailVerificationExpires` no `User`; email de confirmação disparado automaticamente no cadastro; botão "Reenviar confirmação" em Configurações; tela `/verify-email` nova. Mesmo padrão já usado na recuperação de senha (token com expiração, endpoint dedicado).
- ✅ **Limpeza de fotos órfãs no Cloudinary** — `avatarPublicId`/`coverPublicId` salvos no `User`; ao trocar avatar ou capa, a foto antiga é apagada do Cloudinary automaticamente. Só vale pra trocas feitas a partir de agora (fotos antigas trocadas antes continuam órfãs, sem como recuperar o `public_id` delas retroativamente).

**5 bugs encontrados e corrigidos no caminho da verificação de email** (documentados em detalhe nas Convenções de código):

1. `EmailService` não conferia o campo `error` que o SDK do Resend retorna (ele não lança exceção em erro de API) — um envio podia falhar silenciosamente e ainda reportar sucesso.
2. `RESEND_API_KEY` do `.env` local estava inválida (era a chave antiga, de antes da rotação de segurança).
3. `FRONTEND_VERIFY_URL`/`FRONTEND_RESET_URL` ausentes no `.env` local — o link do email apontava pra produção mesmo testando localmente, causando erro de "token não encontrado" (o token só existia na branch `development`, não na de produção).
4. `VerifyEmail.tsx` mostrava a mensagem genérica do axios ("Request failed with status code 400") em vez do motivo real vindo do backend.
5. `Settings.tsx` não recarregava o perfil ao entrar na tela — o status "email confirmado" ficava desatualizado por causa do cache em `localStorage`.

**Incidente de segurança no caminho:** durante a depuração, um `.env` completo foi colado no chat, expondo `RESEND_API_KEY`, `JWT_SECRET`, a senha do banco (`DB_PASS`) e as credenciais do Cloudinary. Os 4 segredos foram rotacionados (Render e local atualizados). Depois, ao configurar o banco de dev, ficou evidente que só uma chave do Resend não é suficiente pros dois ambientes — resolvido com **chaves separadas**: `musicwork-production-v3` (Render) e `musicwork-local-dev` (só local).

**Decisão registrada:** "Editar email" (Fase 3) não vai ser construído como tela por enquanto — casos raros de troca de email são resolvidos manualmente via chat de suporte (`UPDATE` direto no banco), já que é um recurso pouco usado e o custo de fazer com segurança (confirmação por link, checagem de duplicidade, etc.) não compensa agora.

**Status:** Os 4 itens testados e commitados. Backend e frontend compilando sem erros.

**Próximo passo sugerido:** Só restam os itens de "código difícil" (Login com Google, carrossel de mídia) e "infraestrutura + trade-offs" (WebSocket, push notifications, Play Store) — ver Roadmap abaixo.

---

Plataforma para músicos se conectarem, compartilharem posts e trocarem serviços musicais.

**🌐 Produção:**

- Frontend: https://musicwork.com.br (também: https://music-work.vercel.app)
- Backend: https://api.musicwork.com.br (também: https://musicwork.onrender.com)

## Stack

- **Frontend:** React + TypeScript + Vite + Material UI
- **Backend:** Node.js + Express + TypeScript + Sequelize + PostgreSQL
- **Auth:** JWT + bcrypt
- **Banco produção:** Neon PostgreSQL (São Paulo) — branch `production`
- **Banco desenvolvimento:** Neon PostgreSQL, branch `development` (cópia isolada de `production`, mesmo projeto)
- **Uploads:** Cloudinary (imagens e vídeos persistentes, com limpeza de órfãos ao trocar avatar/capa)
- **Deploy:** Render (backend) + Vercel (frontend)
- **Monitoramento:** UptimeRobot (ping a cada 5 min em `/health`, evita cold start)
- **Toasts:** notistack
- **Compressão de imagem:** browser-image-compression
- **DNS:** Cloudflare (musicwork.com.br) — inclui Email Routing (suporte@ e contato@ → Gmail)
- **Email sistema (envio):** Resend — funcionando em produção desde ago/2026, com chaves de API separadas por ambiente

## Estrutura

musicwork/
├── backend/
│ └── src/
│ ├── @types/ (express.d.ts — tipa req.userId no Request do Express)
│ ├── config/ (cloudinary.ts; auth.ts — valida JWT_SECRET no boot)
│ ├── controllers/ (AuthController, UserController, PostController, UploadController, LikeController, CommentLikeController, WorkController, FollowController, CommentController, NotificationController, ShowController, ConversationController)
│ ├── middlewares/ (authMiddleware, uploadMiddleware)
│ ├── models/ (User, Post, Like, CommentLike, Work, Follow, Comment, Notification, Show, Conversation, Message)
│ ├── routes/ (authRoutes, userRoutes, postRoutes, uploadRoutes, likeRoutes, commentLikeRoutes, workRoutes, followRoutes, commentRoutes, notificationRoutes, showRoutes, conversationRoutes)
│ ├── services/ (AuthService, UserService, PostService, WorkService, FollowService, CommentService, NotificationService, ShowService, ConversationService, EmailService)
│ └── server.ts
└── frontend/
└── src/
├── components/ (Layout, NavBar, SideBar, BottomNav, PostCard, NewPost, ShowCard, ShowDialog, Logo; profile/ — SocialLinks, AudioPlayer, ProfessorChip, ProfileChips, ProfileDetailsCard compartilhados entre Profile/PublicProfile/Search)
├── constants/ (musicOptions.ts — instrumentos e gêneros; countries.ts — países e bandeira; youtube.ts — helper de embed de vídeo em posts)
├── contexts/ (AuthContext)
├── pages/ (Login, Register, Feed, Profile, PublicProfile, Search, Work, Agenda, Messages, Chat, Settings, ForgotPassword, ResetPassword, VerifyEmail)
├── routes/ (App.Routes, PrivateRoute)
└── services/ (api.ts — organizado em seções: auth/conta, perfil/uploads, notificações, posts, shows, chat)

## O que já foi feito

### Chat (mensagens diretas) ✅

- ✅ Conversas 1-para-1 entre qualquer músico (sem restrição de seguir/ser seguido)
- ✅ Mensagens com texto, foto ou vídeo (mesma trava de "só uma mídia por vez" dos posts)
- ✅ Lista de conversas (`/mensagens`) com prévia da última mensagem, horário e badge de não lidas
- ✅ Tela de chat aberta (`/mensagens/:id`) com histórico completo, balões enviados/recebidos
- ✅ Botão "Mensagem" no perfil público de outros músicos, ao lado do "Seguir"
- ✅ Ícone de chat no navbar com badge de não lidas (ao lado do sino de notificações)
- ✅ Atualização por polling (mensagens a cada 4s dentro do chat aberto, contador de não lidas a cada 10s) — mesmo padrão das notificações
- ✅ Botões de anexar mídia travados durante o envio, evitando clique duplo/estado inconsistente
- ✅ **Chat de suporte** — conta fixa `MusicWork Suporte` (`isSupport`), acessível via botão em Configurações, sempre fixada no topo da lista de Mensagens com badge "oficial"
- ✅ Usado também como canal pra pedidos raros que não têm tela própria (ex: troca de email — ver Fase 3)

### Base ✅

- ✅ Autenticação completa (login, cadastro, JWT, logout)
- ✅ Feed com posts reais do banco
- ✅ Criar e deletar posts
- ✅ Foto de perfil e foto de capa (via Cloudinary, com limpeza de foto antiga ao trocar)
- ✅ Avatar em todo lugar (navbar, feed, newpost)
- ✅ Perfil do músico com edição (nome, instrumento, cidade, bio, gênero)
- ✅ Layout responsivo desktop e mobile, incluindo reordenação de seções do perfil no mobile (botão "Editar perfil" logo abaixo do nome, card de detalhes por último)
- ✅ Proteção de rotas
- ✅ Navbar de busca funcional

### Conta e segurança ✅

- ✅ Página de Configurações (`/configuracoes`), acessível pelo menu do avatar
- ✅ Alterar senha (exige senha atual, com confirmação e olho de mostrar/ocultar em cada campo)
- ✅ Email exibido como somente leitura (troca de email não terá tela própria — decisão consciente, ver Fase 3)
- ✅ Botão "Fale com o suporte" — abre/cria a conversa com a conta fixa de suporte
- ✅ Recuperação de senha ("Esqueci minha senha") — testada de ponta a ponta em produção, envio de email via Resend funcionando
- ✅ Verificação real de email no cadastro — email de confirmação automático, botão de reenviar, status exibido em Configurações

### Busca avançada ✅

- ✅ Busca de músicos por nome, instrumento, cidade e gênero
- ✅ Busca ignora acentos e maiúsculas (Postgres unaccent)
- ✅ Filtros avançados (instrumento, gênero, cidade, país, professor)
- ✅ Limpar filtros
- ✅ Busca combinada (texto + filtros, todos os filtros se combinam com E lógico)
- ✅ Clicar no resultado abre o perfil público do músico
- ✅ Conta de suporte (`isSupport`) nunca aparece nos resultados

### Work (marketplace) ✅

- ✅ Criar, editar e deletar works
- ✅ Categorias de serviço (Show, Aula, Gravação, Foto/Vídeo, Banda, Equipamento)
- ✅ Subcategoria de modalidade para Aula (Presencial, Online, Grupo, Individual)
- ✅ Localização flexível (Presencial + cidade, Online, País)
- ✅ Filtros por categoria e cidade
- ✅ Contato direto (WhatsApp ou email)
- ✅ Tipo Ofereço / Procuro
- ✅ Clicar no autor do work abre o perfil dele
- ✅ Works da conta de suporte (`isSupport`) nunca aparecem na listagem

### Feed e posts ✅

- ✅ Posts com texto, foto **ou** vídeo (nunca as duas mídias juntas — decisão de escopo, ver Convenções abaixo)
- ✅ Upload de foto (comprimida) ou vídeo (até 50MB) direto ao criar o post
- ✅ Aviso claro se tentar anexar foto e vídeo ao mesmo tempo
- ✅ Fixar um post no topo do próprio perfil (ícone de pin) — fixar um novo desfixa o anterior automaticamente, só 1 por vez
- ✅ Post fixado exibido com destaque visual (borda roxa + selo "Post fixado") no perfil próprio e no perfil público de quem visita
- ✅ Curtir e comentar funcionam normalmente em posts com mídia, incluindo o fixado
- ✅ Vídeo do YouTube embutido automaticamente quando o post tem um link no texto
- ✅ Criar post direto da página de perfil, além do Feed
- ✅ Lista completa de posts (não só o fixado) aparece também no perfil público de outros músicos

### Social ✅

- ✅ Curtir e descurtir posts
- ✅ Contador de curtidas em tempo real
- ✅ Comentários nos posts (criar, listar, deletar)
- ✅ Responder comentários (threading, 1 nível de profundidade)
- ✅ Curtir e descurtir comentários e respostas
- ✅ Contador de comentários real no feed (inclui respostas)
- ✅ Seguir músicos (persistido no banco)
- ✅ Contadores reais de seguidores/seguindo, tanto no perfil público quanto no próprio perfil
- ✅ Notificações (seguir, curtir post, comentar, responder, curtir comentário) com sino no navbar, badge de não lidas e marcação automática ao abrir

### Perfil ✅

- ✅ Página de perfil público de outros usuários (/musico/:id)
- ✅ Links sociais no perfil (Instagram, YouTube, Spotify, Facebook, TikTok)
- ✅ Profissão secundária como campo livre
- ✅ Instrumento principal + instrumentos secundários (múltiplos instrumentos por músico, selecionáveis via busca com chips removíveis)
- ✅ Novos instrumentos na lista (Trombone, Sanfona, Triângulo, Zabumba, Técnico de som, Ukulele)
- ✅ Gênero principal + gêneros secundários (múltiplos gêneros por músico, mesmo padrão dos instrumentos), incluindo opção "Todos os estilos"
- ✅ Nacionalidade no perfil, exibida com bandeira via emoji Unicode
- ✅ Música do perfil — upload de áudio próprio (`profileAudioUrl`, via Cloudinary), player customizado em loop, trocável a qualquer momento (substituiu o embed do Spotify)
- ✅ Campo "Professor" (`isProfessor`) — chip "🎓 Professor" no cabeçalho do perfil quando marcado
- ✅ Chips do cabeçalho e card de detalhes reorganizados sem duplicação de informação (`ProfileChips` + `ProfileDetailsCard`)
- ✅ Contador de Posts/Seguidores/Seguindo sem duplicação, igual no perfil próprio e público

### Deploy e Infraestrutura ✅

- ✅ Banco de dados na nuvem (Neon PostgreSQL — São Paulo), branch `production`
- ✅ Banco de desenvolvimento separado (branch `development` do mesmo projeto Neon)
- ✅ Deploy do backend (Render)
- ✅ Deploy do frontend (Vercel)
- ✅ Domínio próprio registrado: musicwork.com.br (Registro.br, expira 30/06/2027)
- ✅ DNS gerenciado pelo Cloudflare
- ✅ Frontend no domínio próprio: https://musicwork.com.br
- ✅ Backend no domínio próprio: https://api.musicwork.com.br
- ✅ CORS configurado para todos os domínios
- ✅ Cloudflare Email Routing configurado (`suporte@` e `contato@musicwork.com.br` → Gmail)
- ✅ Resend configurado e funcionando (domínio verificado, chaves de API separadas por ambiente)
- ✅ Monitor UptimeRobot (`/health` a cada 5 min) evitando cold start do Render

### Melhorias de login/cadastro ✅

- ✅ Mostrar/ocultar senha (olhinho)
- ✅ Validação de formato de email
- ✅ Validação de senha mínima (6 caracteres) no cadastro
- ✅ Bloqueio dos campos durante o loading + spinner no botão
- ✅ Recuperação de senha implementada e **funcionando em produção** (backend `/forgot-password` e `/reset-password` + telas no frontend + envio de email via Resend)
- ✅ Verificação real de email no cadastro, com email automático e reenvio manual

### Uploads robustos ✅

- ✅ Cloudinary (fotos e vídeos persistem entre deploys)
- ✅ Compressão de imagem no frontend (foto do celular ~1MB)
- ✅ Limite de 10MB (imagem) e 50MB (vídeo) + tratamento de erro
- ✅ Toasts de sucesso/erro no upload
- ✅ Upload funciona no mobile
- ✅ Helper getImageUrl (compatível com fotos antigas e novas do Cloudinary, e com vídeos)
- ✅ Limpeza automática de foto antiga ao trocar avatar/capa (evita acúmulo de arquivos órfãos)

### Calendário de shows ✅

- ✅ Página "Agenda" (menu lateral e navbar mobile), listando shows futuros de todos os músicos
- ✅ Filtros por cidade, gênero musical e data
- ✅ Criar show com título, data, horário, cidade, gênero, local (opcional) e descrição (opcional)
- ✅ Flyer de divulgação opcional (upload de imagem via Cloudinary)
- ✅ Modal de detalhes ao clicar no show, com flyer em tamanho grande e lightbox (clique para ampliar sem cortar a imagem)
- ✅ Só o dono do show pode editar/deletar (botão de deletar no card e dentro do modal)
- ✅ Seção "Próximos shows" no perfil próprio (com botão de adicionar) e no perfil público (somente visualização) de cada músico
- ✅ Shows passados somem automaticamente das listagens (Agenda e perfil só mostram futuros)

---

## Próximos passos — ROADMAP

### ✅ Resend — resolvido (ago/2026)

- ✅ Implementar recuperação de senha (backend: /forgot-password e /reset-password)
- ✅ Implementar telas de recuperação de senha no frontend
- ✅ Registros DNS do Resend no Cloudflare (TXT DKIM, MX SPF)
- ✅ Bug interno do Resend corrigido (identidade do domínio, região AWS) — confirmado com teste real
- ✅ Configurar Cloudflare Email Routing (`suporte@` e `contato@musicwork.com.br` → Gmail)
- ✅ API key no Resend criada e configurada no Render (`RESEND_API_KEY`) — chaves separadas por ambiente (produção no Render, outra só local)

**Testado e funcionando em produção:** fluxo completo de recuperação de senha e de verificação de email, do disparo até a confirmação.

### Fase 2.5 — Social avançado ✅ CONCLUÍDA

- ✅ Notificações (seguir, curtir, comentar, responder, curtir comentário)
- ✅ Responder comentários (threading)
- ✅ Curtir comentários

### Chat (mensagens diretas) ✅ CONCLUÍDO — não estava no roadmap original

- ✅ Conversas e mensagens (texto, foto, vídeo)
- ✅ Sem restrição de quem pode iniciar conversa (decisão consciente, ver Convenções abaixo)
- ✅ Chat de suporte com conta fixa (ver backlog do professor, ponto 8)

### Fase 3 — Conta e segurança ✅ CONCLUÍDA (com 1 decisão de escopo)

- ✅ Alterar senha (Configurações da conta)
- ✅ Recuperação de senha (backend + frontend + envio de email via Resend) — testado de ponta a ponta em produção
- ✅ Verificação real de email no cadastro — testado de ponta a ponta em produção
- ❌ **Editar email — decisão consciente de não construir** (ago/2026): recurso raro de ser usado; casos que aparecerem são resolvidos manualmente via chat de suporte (`UPDATE` direto no banco). O endpoint `/account/email` continua existindo no backend, só não é exposto no frontend.
- [ ] Login com Google (OAuth) — não iniciado

### Fase 4 — Features grandes (parcialmente concluída)

- ✅ Múltiplos instrumentos no perfil
- ✅ Vídeo/áudio de apresentação no perfil — evoluiu para posts com foto ou vídeo + sistema de fixar post no perfil
- ✅ Calendário de shows

### Fase 5 — Real-time e notificações (planejado, não iniciado)

- [ ] WebSocket (Socket.IO) para notificações instantâneas _dentro do app aberto_, substituindo o polling atual de 30s
- [ ] Lógica de reconexão no frontend (o backend no Render free hiberna por inatividade, então a conexão persistente vai cair) — parcialmente mitigado pelo monitor do UptimeRobot, mas ainda vale ter reconexão própria
- [ ] **Push notifications** (Web Push API) — notificações que chegam mesmo com o app fechado (curtida, comentário, mensagem, seguir), diferente do WebSocket (que só funciona com o app aberto). Precisa de: Service Worker, chaves VAPID, backend disparando por evento, e pedido de permissão na UI. No iPhone só funciona com o PWA instalado na tela inicial (não funciona no Safari comum).

**Decisão registrada (jul/2026):** optamos por adiar o WebSocket. Hoje as notificações funcionam por polling (frontend consulta `/notifications/unread-count` a cada 30s), o que não é real-time de verdade mas resolve bem pra um projeto com poucos usuários. WebSocket não vai exigir refazer nada do que já existe — é uma camada adicional em cima do que já temos (o REST continua servindo a lista de notificações, o socket só avisa "tem algo novo"). Faz mais sentido implementar quando: (a) já tivermos uma base de usuários ativa que justifique, e (b) migrarmos pra um plano/host que não hiberne, pra não ter reconexão toda hora. WebSocket e push notifications resolvem problemas parecidos ("saber que aconteceu algo sem abrir o app"), então faz sentido avaliar os dois juntos quando chegar a hora.

### Fase 6 — Ideias futuras (não iniciado)

- [ ] Carrossel de múltiplas fotos/vídeos por post (hoje é limitado a 1 mídia por post — decisão de escopo consciente, ver Convenções abaixo)

### Fase 7 — Publicação em loja (investigado, não concretizado)

- [ ] Empacotar o PWA pra Google Play Store — já foi investigado o caminho (Bubblewrap/TWA ou PWABuilder), mas nunca finalizado
- [ ] Criar conta no Google Play Console (taxa única de $25)
- [ ] Política de privacidade publicada (exigência da loja)
- [ ] Ícones e screenshots no formato exigido pela loja
- [ ] Passar pelo processo de revisão do Google (pode levar dias, às vezes pede ajustes)

**Nota:** a parte técnica de empacotar o PWA é mecânica; a maior fricção está fora do código (conta, política de privacidade, revisão do Google). App iOS/App Store não está nem cogitado ainda.

### 📋 Feedback do professor Fábio (jul/2026) — backlog de sugestões — ✅ CONCLUÍDO

- ✅ Múltiplos gêneros musicais no perfil (mesmo padrão dos instrumentos secundários)
- ✅ Facebook e TikTok como links sociais (mesmo padrão de Instagram/YouTube/Spotify)
- ✅ Adicionar "Ukulele" à lista de instrumentos — unificada a lista duplicada em `constants/musicOptions.ts`
- ✅ Revisar duplicação de informações no perfil — resolvido em duas rodadas: primeiro tirou o Gênero repetido do card de detalhes (trocado por Nacionalidade), depois eliminou a última duplicação (Instrumento/Cidade também saíram do card), reorganizou os chips (Professor em destaque primeiro) e uniu estatísticas + redes sociais na mesma linha. Ver "Feedback do professor Fábio (ago/2026)" abaixo.
- ✅ Player de música no perfil — decisão inicial foi embed do Spotify via `favoriteSongUrl`, depois substituído por upload de áudio próprio (`profileAudioUrl`) — ver segunda rodada abaixo.
- ✅ Filtro de "Professor" na busca — decisão: Opção B, campo explícito `isProfessor` no perfil (mantém Busca e Work independentes)
- ✅ Nacionalidade no perfil, com bandeira (emoji Unicode, sem precisar de imagem)
- ✅ Chat de suporte — reaproveitou o sistema de chat já existente, com conta fixa `isSupport` (ver segunda rodada abaixo)

### 📋 Feedback do professor Fábio (revisão ago/2026) — segunda rodada — ✅ CONCLUÍDO

- ✅ Renomear checkbox "Só professores" → "Buscar professores" na busca
- ✅ Vídeo do YouTube embutido nos posts (antes só aparecia o link em texto)
- ✅ Criar post direto da página de perfil (antes só dava pra postar pelo Feed)
- ✅ Player de música do perfil trocado de embed do Spotify pra upload de áudio próprio (decisão: o link do artista já cobria a divulgação; o player devia tocar áudio de verdade, não outro link)
- ✅ Reorganização dos chips e do card de detalhes do perfil (ponto 4, ver Convenções de código para os detalhes das decisões descartadas no caminho — toggle "+N mais", card só com Profissão)
- ✅ Chat de suporte — conta fixa `MusicWork Suporte`, botão em Configurações, badge "oficial" fixado no topo das Mensagens

**Backlog do professor Fábio 100% concluído — as duas rodadas.** Próximos passos do projeto agora dependem só do roadmap próprio (Login com Google, WebSocket, push notifications, carrossel de mídia, Play Store) ou de novo feedback dele.

---

## Como rodar localmente

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## Portas locais

- Backend: http://localhost:3333
- Frontend: http://localhost:5173

## Variáveis de ambiente

### Backend (.env)

PORT=3333
JWT_SECRET=sua_chave # obrigatória — o servidor não sobe sem ela (config/auth.ts)
NODE_ENV=production # sim, "production" mesmo em dev — ver Convenções de código (database.ts)
FRONTEND_URL=http://localhost:5173,http://localhost:4173,https://musicwork.com.br,https://www.musicwork.com.br,https://music-work.vercel.app
DATABASE_URL=postgresql://... # LOCAL: aponta pra branch "development" do Neon. PRODUÇÃO (Render): branch "production"
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=... # chave DIFERENTE pra local (ex: musicwork-local-dev) e pra produção (ex: musicwork-production-v3)
EMAIL_FROM=MusicWork contato@musicwork.com.br
FRONTEND_RESET_URL=http://localhost:5173/reset-password # LOCAL — em produção, https://musicwork.com.br/reset-password
FRONTEND_VERIFY_URL=http://localhost:5173/verify-email # LOCAL — em produção, https://musicwork.com.br/verify-email

### Frontend (.env)

VITE_API_URL=http://localhost:3333

### Frontend (.env.production)

VITE_API_URL=https://api.musicwork.com.br

## Convenções de código

- **Tipagem de `req.params`:** controllers novos com parâmetro de rota (`:algo` na URL) devem tipar via generic do Express, ex: `Request<{ commentId: string }>`, em vez de usar `as string` depois de desestruturar. Isso evita erros de build no Render por incompatibilidade de tipo (`string | string[]`). Controllers antigos que já funcionam com `as string` (LikeController, CommentController, FollowController etc.) não precisam ser refatorados — a convenção vale só para código novo.

- **Arquitetura mista (Service vs Model direto) é intencional:** `FollowService`, `CommentService`, `PostService`, `NotificationService`, `UserService` usam camada de service entre controller e model. Já `LikeController` e `CommentLikeController` chamam o Model direto, sem service. Isso não é uma inconsistência esquecida — foi mantido de propósito para não gerar refactor desnecessário em código que já funciona. Não "corrigir" isso sem necessidade real.

- **Checklist para criar uma tabela/model novo:** sempre que adicionar um `Model` novo, os 3 passos abaixo têm que ser feitos juntos no `server.ts`, ou a tabela não existe em runtime:
  1. Importar o model e registrar sua rota (`app.use(...)`)
  2. Declarar as associações (`belongsTo` / `hasMany`) com os models relacionados
  3. Chamar `Model.sync({ alter: true })`

  Esquecer qualquer um desses passos é a causa mais comum de bug tipo "por que essa tabela não existe?" ou "por que essa relação não carrega?". Não usamos `sequelize-cli` / pasta `migrations/` (que existe mas está obsoleta) — o schema é gerenciado só pelo `sync({ alter: true })` direto no server.ts.

- **Autenticação via `request.userId`:** o `authMiddleware` decodifica o JWT e injeta o ID do usuário logado em `request.userId`, tipado por augmentation em `backend/src/@types/express.d.ts`. Todos os controllers que precisam saber quem está logado leem daí. (Até jul/2026 isso ficava em `request.headers["userId"]`; foi migrado para `req.userId` por ser dado de aplicação, não header HTTP — e isso passou a alimentar corretamente o `public_id` dos uploads no `uploadMiddleware`, que já lia `req.userId`.)

- **`database.ts` decide a conexão pelo `NODE_ENV`, não é fixo:** se `NODE_ENV=production`, usa `DATABASE_URL` direto (com SSL configurado). Senão, monta a conexão a partir de `DB_HOST`/`DB_USER`/`DB_PASS`/`DB_NAME`/`DB_PORT` separados (sem SSL). Como o projeto sempre usou Neon (que exige SSL), o `.env` local também usa `NODE_ENV=production` — o nome da variável é enganoso, mas é assim que a conexão SSL funciona local e em produção da mesma forma. Não confundir esse `NODE_ENV=production` com "isso é o banco de produção": o que decide qual banco é o `DATABASE_URL` em si (branch `development` local, `production` no Render), não o `NODE_ENV`.

- **Notificações nunca disparam para si mesmo:** regra centralizada em `NotificationService.create` (`if (recipientId === senderId) return null`). Qualquer novo tipo de notificação que for criado no futuro já herda essa proteção automaticamente, sem precisar reimplementar a checagem em cada lugar que dispara notificação.

- **Threading de comentários tem só 1 nível de profundidade:** uma resposta não pode ser respondida (não existe resposta-de-resposta). É uma escolha de design para manter a UI simples, não uma limitação técnica — se decidir aprofundar no futuro, vai exigir mudança tanto no modelo de dados quanto na renderização em árvore no frontend.

- **Posts suportam no máximo 1 mídia por post (foto OU vídeo, nunca as duas):** decisão de escopo consciente para evitar a complexidade de um carrossel de múltiplas mídias (tabela extra, componente de carrossel, lógica de ordenação). A trava é só no frontend (`NewPost.tsx` avisa e bloqueia se tentar anexar as duas) — o backend tecnicamente aceitaria ambos os campos preenchidos, mas isso nunca acontece na prática. Se decidir implementar carrossel no futuro, ver Fase 6 no roadmap.

- **Post fixado (`isPinned`) substituiu o campo `presentationVideoUrl`:** o campo `presentationVideoUrl` ainda existe na tabela `users` (dormente, sem uso no frontend) — foi mantido por simplicidade em vez de remover a coluna com outro ALTER em produção. A forma atual de destacar conteúdo no perfil é fixar qualquer post (com ou sem mídia) via `PostService.pinPost`.

- **Gênero musical do show é independente do gênero do perfil do músico:** cada show tem seu próprio campo `genre`, não herda do perfil de quem cria. Decisão consciente: permite que um músico toque em um evento de estilo diferente do seu gênero usual sem ficar inconsistente no filtro da Agenda.

- **`api.ts` organizado em seções por assunto:** o arquivo cresceu bastante e foi reagrupado em blocos comentados (Autenticação e conta / Perfil e uploads / Notificações / Posts / Shows e Agenda / Chat), sem alterar nenhum comportamento — só facilita encontrar funções relacionadas ao adicionar código novo.

- **Pasta `backend/dist` no `.gitignore`:** é a saída compilada do TypeScript (gerada automaticamente pelo `npm run build`), não deve ser versionada — o Render compila sozinho no deploy.

- **Chat sem restrição de quem pode conversar:** qualquer músico pode mandar mensagem pra qualquer outro, sem precisar seguir ou ser seguido. Decisão consciente: o MusicWork tem uma pegada de rede profissional (parecido com o Work), onde um contratante pode querer chamar um músico que nunca seguiu. Diferente de redes mais "fechadas" (ex: LinkedIn). Se no futuro isso virar problema de spam, dá pra adicionar uma caixa de "solicitações" separada, sem quebrar o que já existe.

- **Chat usa polling, não WebSocket:** mesma decisão já tomada pras notificações (ver Fase 5). Mensagens dentro do chat aberto atualizam a cada 4 segundos; o contador de não lidas no navbar atualiza a cada 10 segundos.

- **`spotify` (link do artista) e `profileAudioUrl` (música do perfil) são campos diferentes, de propósito:** `spotify` é o link do perfil do artista no Spotify, exibido só como ícone clicável (divulgação). `profileAudioUrl` é um arquivo de áudio (upload próprio via Cloudinary) que toca direto no perfil, em loop — trocável a qualquer momento, sem relação com o link de artista. Não confundir os dois nem tentar unificá-los.

- **`favoriteSongUrl` ficou dormente (ago/2026):** era o campo antigo (link de faixa do Spotify) usado pelo `SpotifyEmbed`, removido a pedido do professor Fábio (redundante com o link de artista já existente). A coluna continua na tabela `users`, sem uso no frontend — mesmo padrão do `presentationVideoUrl`. `SpotifyEmbed.tsx` e `constants/spotify.ts` foram deletados por não terem mais uso; o componente compartilhado agora é `AudioPlayer.tsx` (`components/profile/`), usado por `Profile.tsx` e `PublicProfile.tsx`.

- **Upload de áudio segue o mesmo padrão do `presentationVideoUrl`:** endpoint dedicado (`POST`/`DELETE /upload/profile-audio`), fora do form geral de edição — igual avatar/capa/vídeo de apresentação, não passa pelo `PUT /users`. Cloudinary trata áudio como `resource_type: "video"` (não existe tipo "audio" separado); formatos aceitos: MP3, WAV, M4A, OGG, limite 20MB.

- **Autoplay não é garantido, seja Spotify ou upload próprio:** a limitação é do navegador (bloqueia som automático até a pessoa interagir com o site antes), não da origem do áudio. Trocar de embed pra upload próprio não resolve isso — não é bug se o áudio não tocar sozinho ao abrir o perfil.

- **"Todos os estilos" é uma opção normal dentro da lista `genres`, não um valor especial:** foi cogitado um atalho "selecionar todos os gêneros de uma vez" dentro do campo de "Outros gêneros", mas foi descartado — ficaria conflitando com o "Todos" que já existe no filtro de busca (que ali significa "sem filtro"). Em vez disso, "Todos os estilos" é só mais um item da lista `genres`, pensado pra quem realmente toca de tudo.

- **Filtro de país na busca é exato, não por texto:** ao contrário de `city` (que usa `unaccentLike`, busca parcial ignorando acento/maiúscula), o filtro de `nationality` compara o código do país direto (ex: `"BR"`), igual um dropdown de opção única — não faz sentido busca parcial num código de país.

- **`isProfessor` é campo explícito no perfil, não derivado do Work:** decisão consciente (ponto 6 do backlog do professor) de manter Busca e Work como sistemas independentes. Um músico pode ser professor sem nunca ter criado um Work de categoria "Aula", e vice-versa — são conceitos diferentes (identidade do músico vs. oferta pontual de serviço). Não cruzar as duas tabelas pra derivar esse campo.

- **`ProfileChips` mostra todos os chips sempre, sem toggle de expandir/recolher:** foi testado um "+N mais" que expandia instrumentos/gêneros secundários (ago/2026, ponto 4 do backlog), mas descartado depois de testar na prática — a posição do botão de toggle ficava inconsistente dependendo de quantos chips cabiam por linha (às vezes isolado sozinho numa linha, às vezes no meio da lista, quebrando a leitura). Decisão final: sem lógica de expandir, só `flexWrap` deixando quebrar linha à vontade. Ordem fixa: Professor primeiro (mais ênfase), depois instrumento e gênero principal, depois secundários.

- **`ProfileDetailsCard` não repete nada que já aparece em `ProfileChips`:** o card mostra só Profissão, Cidade e Nacionalidade (por extenso, com bandeira) — Instrumento e Gênero saíram de lá porque já aparecem completos nos chips do cabeçalho. Antes de chegar nessa versão, foi cogitado um card só com Profissão (ficava "sozinho" demais) e também remover o card por completo com Profissão virando chip (misturava categorias diferentes de informação — chips são valores de lista fixa, profissão é texto livre). Se um dia adicionar mais um campo de perfil, checar primeiro se ele já aparece em algum outro lugar da tela antes de repetir aqui.

- **Conta de suporte (`isSupport`) é um usuário normal, só com uma flag:** não é um tipo de conta separado no schema, nem tem tabela própria — é a mesma tabela `users`, com `isSupport: true`. Isso permite reaproveitar 100% o sistema de chat, upload de avatar, etc. sem código novo. `UserService.getSupportAccount()` (backend) e `ConversationService.startSupportConversation(userId)` acham essa conta pelo flag — nunca hardcoded por ID ou email, pra não quebrar se a conta for recriada.

- **Conta de suporte é excluída de Busca e Work no nível do banco, não do frontend:** `UserService.searchUsers` sempre adiciona `{ isSupport: { [Op.not]: true } }` nas condições, e `WorkService.listWorks` filtra pelo mesmo campo no `include` do model `User`. Escondida na query, não com `if` no componente — evita que a conta apareça se algum outro endpoint futuro reusar essas queries sem replicar o filtro.

- **Conversa de suporte é fixada no topo por ordenação, não por posição especial na UI:** `ConversationService.listConversations` ordena o array em JS (`isSupport` primeiro, dentro disso por data da última mensagem) — o frontend (`Messages.tsx`) só renderiza na ordem que já veio do backend, e mostra o badge "oficial" quando `conv.otherUser.isSupport` é `true`. Não hardcodar a conversa de suporte como "sempre primeiro item do array" no frontend — se o backend mudar a ordenação um dia, o frontend não deveria saber ou se importar.

- **`PublicProfile.tsx` busca posts via `/posts/user/:id`, igual `Profile.tsx`:** até ago/2026 essa tela só buscava o post fixado (`getPinnedPost`), nunca a lista completa — bug silencioso que só apareceu quando alguém visitou um perfil com mais de um post. O `PostCard` renderizado ali não recebe `isOwner`, então os botões de deletar/fixar já ficam escondidos automaticamente (prop opcional, `undefined` por padrão).

- **Ao reordenar blocos de JSX (mover um trecho pra outro lugar da página), sempre confirmar que o bloco antigo foi removido, não só que o novo foi inserido:** dois bugs de duplicação (Posts/Seguidores/Seguindo em `Profile.tsx` e `PublicProfile.tsx`) vieram exatamente disso — a edição inseriu o bloco novo no lugar certo, mas o antigo ficou esquecido mais abaixo no arquivo. Depois de qualquer reordenação, um `grep` pelo texto-chave do bloco (ex: `"Seguidores"`) confirmando que só aparece uma vez é mais confiável que só ler o diff.

- **O SDK do Resend não lança exceção em erro de API — ele retorna `{ data, error }`:** o `EmailService.ts` precisa checar `result.error` explicitamente e lançar (`throw`) se existir; sem isso, um envio que falha (rate limit, chave inválida, domínio, etc.) passa como se tivesse dado certo, porque a promise resolve normalmente. Esse foi um bug real que ficou escondido até a verificação de email expor ele (ago/2026) — os dois métodos (`sendPasswordReset` e `sendEmailVerification`) já fazem essa checagem.

- **`AuthContext` guarda o usuário em `localStorage`, não busca no servidor a cada carregamento:** dado que muda no backend por uma ação feita fora da aba atual (ex: confirmar email clicando num link que abre em outra guia) não aparece sozinho na tela até alguém buscar `/profile` de novo. Telas que mostram esse tipo de status mutável (ex: `Settings.tsx` com `isEmailVerified`) devem ter um `useEffect` buscando o perfil fresco ao montar e chamando `updateUser(...)`, em vez de confiar só no `user` do contexto.

- **`FRONTEND_VERIFY_URL`/`FRONTEND_RESET_URL` precisam apontar pro ambiente certo:** se testando local, essas variáveis (no `.env` do backend) devem ser `http://localhost:5173/...`, não o padrão de produção. Como o backend local usa o banco `development` (branch separada), um link de confirmação que aponta pra produção (`musicwork.com.br`) bate num banco diferente de onde o token foi salvo, e a confirmação falha com "token inválido" mesmo o fluxo estando correto.

- **Cloudinary não distingue "public_id" novo de antigo sozinho — isso precisa ser guardado no banco:** `avatarPublicId`/`coverPublicId` em `User` guardam o `public_id` da imagem atual (vem de `req.file.filename`, que a lib `multer-storage-cloudinary` preenche com o `public_id` retornado pelo Cloudinary). Antes de salvar a URL nova, o `UploadController` busca o `public_id` antigo do usuário e chama `cloudinary.uploader.destroy()` nele — a chamada de delete roda sem `await` bloqueante pro response, e falhas nela só são logadas, nunca travam o upload da foto nova. Só limpa fotos trocadas a partir dessa mudança; fotos antigas trocadas antes ficam órfãs pra sempre (sem `public_id` salvo pra recuperar).

- **Chaves de API do Resend são separadas por ambiente (ago/2026):** `musicwork-production-v3` (Render) e uma chave só local (nome livre, ex: `musicwork-local-dev`). Antes disso, tentar sincronizar uma chave só entre os dois ambientes gerava dessincronia toda vez que precisava rotacionar — resolvido tendo uma chave dedicada em cada lugar, sem depender de copiar valor de um ambiente pro outro.

### Convenções vindas da revisão de código (jul/2026)

- **Paginação do Feed e do Work (`limit`/`offset` + "Carregar mais"):** os endpoints `/posts` e `/works` aceitam `limit` (default 20, teto 50) e `offset`. O frontend carrega a primeira página e vai concatenando com o botão "Carregar mais" (que some quando a última página volta incompleta). Serve pra não fazer `findAll` na tabela inteira. Recarregar a lista (após criar/deletar) sempre reseta pra primeira página.

- **Filtros do Work são server-side:** tipo, categoria e cidade vão como query params pro `/works` (cidade usa `Op.iLike` — "contém" ignorando caixa, mas **não** acento). O `Work.tsx` refaz a busca ao mudar filtro, com debounce de 300ms na cidade (texto livre). Antes tudo era filtrado no frontend sobre a lista inteira.

- **Posts de um usuário via `/posts/user/:id`:** o perfil (próprio e público) puxa os posts desse endpoint dedicado, em vez de baixar `/posts` inteiro e filtrar no cliente. O `/posts` (feed) é global e paginado. Filtrar posts por nome de usuário no frontend era bug (quebrava com homônimos/rename) — sempre usar o `userId`.

- **`GET /users/:id` não retorna email:** o perfil de terceiros usa `UserService.findPublicById` (projeção `toPublicProfile`, sem email nem campos sensíveis). Só o `/profile` do próprio usuário autenticado (`findById`) inclui email. Não voltar a reusar o `findById` no endpoint público.

- **Componentes de perfil compartilhados (`frontend/src/components/profile/`):** `SocialLinks` (ícones de rede social), `ProfessorChip`, `ProfileChips` (chips do cabeçalho) e `ProfileDetailsCard` (Profissão/Cidade/Nacionalidade) são usados por `Profile`, `PublicProfile` e (parcialmente) `Search`. Antes esse JSX era copiado entre as telas — ao mexer no visual, mexer no componente, não em cada página. `SpotifyEmbed` existiu brevemente (jul/ago-2026) e foi removido — ver convenção sobre `favoriteSongUrl`/`profileAudioUrl` mais acima.

- **`JWT_SECRET` é obrigatório no boot:** `backend/src/config/auth.ts` valida a env e **aborta o servidor** se ela faltar (com mensagem clara). Não existe mais o fallback `"default_secret"` (que tornava tokens forjáveis). O middleware e o `AuthService` importam `JWT_SECRET` desse módulo, nunca lêem `process.env` direto.

- **Contato do Work trata número internacional:** `toWhatsappNumber` (`Work.tsx`) só prefixa `55` quando o contato parece um número brasileiro local; se já vier com `+` ou 12+ dígitos (código de país incluso), usa como está. Evita link errado de WhatsApp pra músicos de fora.

- **Contagem de não lidas do chat é agregada:** `ConversationService.listConversations` busca todas as contagens de não lidas numa query só (`GROUP BY conversationId`), em vez de um `count` por conversa. A última mensagem por conversa ainda é um `findOne` por conversa — se um dia virar gargalo, dá pra trocar por um `DISTINCT ON`.

- **Outros bugs corrigidos na mesma revisão:** `WorkController.update` chamava `createWork` em vez de `updateWork` (editar um Work criava um duplicado, o `id` da rota era ignorado); chat sem cabeçalho quando só você tinha mandado mensagem (nome/avatar agora vêm de `listConversations`, não das mensagens); chat forçava scroll pro fim a cada polling de 4s (agora só rola quando chega mensagem nova); "Novo work" abria poluído após cancelar uma edição (reset centralizado via `resetForm`/`handleCloseDialog`); compartilhar post gerava link morto pra `/post/:id` (rota que não existe) — agora copia o link do perfil do autor; rotas duplicadas (`app.use` repetido de follow/comment/notification) removidas do `server.ts`; links das telas de auth viraram `RouterLink` (sem full reload); "Mensagens" adicionado ao menu inferior do mobile (6 abas).

## Notas importantes

- **Bancos separados desde ago/2026:** local usa a branch `development` do Neon; produção (Render) usa `production`. As duas compartilham o mesmo role/senha do Postgres — rotacionar a senha do banco afeta as duas branches, atualizar `DATABASE_URL` nos dois lugares.
- **Cold start mitigado:** monitor no UptimeRobot batendo em `/health` a cada 5 minutos — não elimina 100% (o Render ainda pode hibernar em janelas sem cobertura do monitor), mas reduz bastante a frequência.
- **Deploy automático:** push na branch main dispara deploy no Render e Vercel
- **Domínio:** musicwork.com.br gerenciado pelo Cloudflare, registrado no Registro.br até 30/06/2027
- **Email routing (recebimento):** `suporte@musicwork.com.br` e `contato@musicwork.com.br` configurados no Cloudflare Email Routing, encaminhando pro Gmail pessoal. Funciona independente do Resend.
- **Email sistema (envio):** Resend funcionando em produção desde ago/2026 (bug do domínio corrigido do lado deles). Recuperação de senha e verificação de email testadas de ponta a ponta. Chaves de API separadas por ambiente (local vs produção) — ver Convenções de código.
- **Campo `type` da tabela `notifications`:** é `STRING` (não ENUM) de propósito, pra permitir novos tipos de notificação (ex: curtir comentário) sem precisar de migração no banco
- **Notificações:** atualmente via polling (30s), não real-time via WebSocket — decisão consciente, ver Fase 5 no roadmap
- **Busca de músicos:** filtra só pelo instrumento principal, não pelos instrumentos secundários — decisão consciente pra não reescrever a query de busca (que já usa `unaccent`)
- **`JWT_SECRET` obrigatório:** desde a revisão de jul/2026 o backend aborta o boot se a variável não estiver definida (sem fallback `default_secret`) — garantir que ela esteja no Render e no `.env` local. Ver Convenções de código.
- **Feed e Work paginam** (`limit`/`offset`, botão "Carregar mais"); os filtros do Work agora rodam no servidor. Detalhes nas Convenções de código.
- **Conta de suporte (`suporte@musicwork.com.br`, `isSupport: true`):** criada direto no banco (cadastro normal + `UPDATE` no Neon). Sem seed automático nesse projeto — se precisar recriar, ver Convenções de código (seção sobre `isSupport`).
- **Segredos rotacionados em ago/2026** (exposição acidental de um `.env` completo durante debug): `RESEND_API_KEY`, `JWT_SECRET`, senha do banco (Neon), `CLOUDINARY_API_SECRET`. Todos atualizados no Render e local. Nunca colar um `.env` inteiro em chat/ferramenta externa — preferir citar nome da variável e confirmar existência, sem o valor.
- **Play Store:** ainda não publicado, ver Fase 7 no roadmap. O app já é PWA instalável (ícone próprio, monograma "MW"), mas a publicação formal na loja depende de empacotamento (TWA/Bubblewrap) e trâmites fora do código.
- **Limpeza de fotos órfãs do Cloudinary:** ativa desde ago/2026, só vale pra trocas de avatar/capa feitas a partir dessa data — fotos trocadas antes continuam acumuladas no Cloudinary (não há como recuperar o `public_id` delas retroativamente).

# 🛠️ Dívida Técnica & Melhorias Futuras — MusicWork

Itens conhecidos que funcionam no estágio atual mas precisam ser revisitados.
Cada item tem: contexto, quando resolver e como resolver.

---

## 🟡 Média prioridade

### Editar email no frontend

**Contexto:** O backend já suporta troca de email via `/account/email`, mas isso
nunca foi exposto na tela de Configurações.

**Decisão (ago/2026):** não construir essa tela por enquanto. É um recurso raro
de ser usado, e o custo de fazer com segurança (confirmação por link, checagem
de duplicidade, proteção contra sequestro de conta) não compensa pra algo que
provavelmente ninguém vai pedir nos próximos meses. Casos que aparecerem são
resolvidos manualmente: a pessoa manda mensagem pelo chat de suporte, e o
`UPDATE` é feito direto no banco via Neon.

**Reconsiderar se:** virar um pedido frequente — aí sim compensa automatizar.

---

## 🟢 Baixa prioridade / quando der

### Publicar na Google Play Store

**Contexto:** O app já é PWA instalável, mas nunca foi publicado formalmente na loja.
Já foi investigado o caminho técnico (Bubblewrap/TWA, PWABuilder), sem finalizar.

**Como resolver:**

- Empacotar o PWA via TWA (Trusted Web Activity)
- Criar conta no Google Play Console (taxa única de $25)
- Publicar política de privacidade (exigência da loja)
- Preparar ícones/screenshots no formato certo
- Passar pela revisão do Google (pode levar dias, às vezes pede ajustes)

Ver Fase 7 no README para o detalhamento no roadmap principal.

### Push notifications (Web Push API)

**Contexto:** Hoje o app só avisa de coisas novas (curtida, comentário, mensagem)
quando está aberto (polling). Notificação chegando com o app fechado, tipo Instagram,
exige um mecanismo diferente.

**Como resolver:**

- Service Worker novo no frontend
- Chaves VAPID + biblioteca `web-push` no backend
- Backend dispara push nos mesmos eventos que já geram notificação hoje
- Pedido de permissão explícito na UI
- No iPhone só funciona com o PWA instalado na tela inicial (não funciona no Safari comum)

Ver Fase 5 no README — faz sentido avaliar junto com WebSocket, já que resolvem
problemas parecidos.

---

## ✅ Resolvidos

- **Uploads em filesystem efêmero** -> migrado para Cloudinary (jun 2026). Fotos
  agora persistem entre deploys.
- **Recuperação de senha não enviava email de verdade** -> bug do Resend (identidade
  do domínio em região AWS errada) corrigido do lado deles em ago/2026. Fluxo testado
  de ponta a ponta em produção. Ver README, seção "Resend — resolvido".
- **Banco de dev/produção compartilhado** -> resolvido em ago/2026 com uma branch
  `development` separada no Neon (cópia isolada dos dados de produção). Local usa
  `development`, Render continua em `production`. Ver README, Convenções de código.
- **Cold start do backend (~30-50s)** -> resolvido em ago/2026 com monitor do
  UptimeRobot batendo em `/health` a cada 5 minutos. Não elimina 100% em todas as
  janelas, mas reduz bastante a frequência de acontecer.
- **Fotos órfãs no Cloudinary ao trocar avatar/capa** -> resolvido em ago/2026.
  `avatarPublicId`/`coverPublicId` salvos no `User`; `UploadController` apaga a foto
  antiga do Cloudinary ao salvar uma nova. Só vale pra trocas feitas a partir dessa
  data — fotos antigas continuam órfãs (sem `public_id` salvo pra recuperar).
- **Verificação real de email no cadastro** -> resolvido em ago/2026. Mesmo padrão
  da recuperação de senha (token com expiração, endpoint dedicado). 5 bugs
  encontrados e corrigidos no processo de testar — ver README, "Onde paramos" e
  Convenções de código.
- **Editar email no frontend** -> decisão consciente de não construir (ago/2026),
  ver seção acima.

---

_Última atualização: agosto 2026_
