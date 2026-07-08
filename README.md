# MusicWork 🎵

Plataforma para músicos se conectarem, compartilharem posts e trocarem serviços musicais.

**🌐 Produção:**

- Frontend: https://musicwork.com.br (também: https://music-work.vercel.app)
- Backend: https://api.musicwork.com.br (também: https://musicwork.onrender.com)

## Stack

- **Frontend:** React + TypeScript + Vite + Material UI
- **Backend:** Node.js + Express + TypeScript + Sequelize + PostgreSQL
- **Auth:** JWT + bcrypt
- **Banco produção:** Neon PostgreSQL (São Paulo)
- **Uploads:** Cloudinary (imagens e vídeos persistentes)
- **Deploy:** Render (backend) + Vercel (frontend)
- **Toasts:** notistack
- **Compressão de imagem:** browser-image-compression
- **DNS:** Cloudflare (musicwork.com.br)
- **Email sistema:** Resend (implementado no código; verificação de domínio pendente — ver Notas importantes)

## Estrutura

musicwork/
├── backend/
│ └── src/
│ ├── config/ (cloudinary.ts)
│ ├── controllers/ (AuthController, UserController, PostController, UploadController, LikeController, CommentLikeController, WorkController, FollowController, CommentController, NotificationController, ShowController)
│ ├── middlewares/ (authMiddleware, uploadMiddleware)
│ ├── models/ (User, Post, Like, CommentLike, Work, Follow, Comment, Notification, Show)
│ ├── routes/ (authRoutes, userRoutes, postRoutes, uploadRoutes, likeRoutes, commentLikeRoutes, workRoutes, followRoutes, commentRoutes, notificationRoutes, showRoutes)
│ ├── services/ (AuthService, UserService, PostService, WorkService, FollowService, CommentService, NotificationService, ShowService, EmailService)
│ └── server.ts
└── frontend/
└── src/
├── components/ (Layout, NavBar, SideBar, BottomNav, PostCard, NewPost, ShowCard, ShowDialog, Logo)
├── contexts/ (AuthContext)
├── pages/ (Login, Register, Feed, Profile, PublicProfile, Search, Work, Agenda, Settings, ForgotPassword, ResetPassword)
├── routes/ (App.Routes, PrivateRoute)
└── services/ (api.ts — organizado em seções: auth/conta, perfil/uploads, notificações, posts, shows)

## O que já foi feito

### Base ✅

- ✅ Autenticação completa (login, cadastro, JWT, logout)
- ✅ Feed com posts reais do banco
- ✅ Criar e deletar posts
- ✅ Foto de perfil e foto de capa (via Cloudinary)
- ✅ Avatar em todo lugar (navbar, feed, newpost)
- ✅ Perfil do músico com edição (nome, instrumento, cidade, bio, gênero)
- ✅ Layout responsivo desktop e mobile, incluindo reordenação de seções do perfil no mobile (botão "Editar perfil" logo abaixo do nome, card de detalhes por último)
- ✅ Proteção de rotas
- ✅ Navbar de busca funcional

### Conta e segurança ✅

- ✅ Página de Configurações (`/configuracoes`), acessível pelo menu do avatar
- ✅ Alterar senha (exige senha atual, com confirmação e olho de mostrar/ocultar em cada campo)
- ✅ Email exibido como somente leitura (troca de email ainda não implementada nesta versão — backend já suporta via `/account/email`, só não está exposto no frontend)

### Busca avançada ✅

- ✅ Busca de músicos por nome, instrumento, cidade e gênero
- ✅ Busca ignora acentos e maiúsculas (Postgres unaccent)
- ✅ Filtros avançados (instrumento, gênero, cidade)
- ✅ Limpar filtros
- ✅ Busca combinada (texto + filtros)
- ✅ Clicar no resultado abre o perfil público do músico

### Work (marketplace) ✅

- ✅ Criar, editar e deletar works
- ✅ Categorias de serviço (Show, Aula, Gravação, Foto/Vídeo, Banda, Equipamento)
- ✅ Subcategoria de modalidade para Aula (Presencial, Online, Grupo, Individual)
- ✅ Localização flexível (Presencial + cidade, Online, País)
- ✅ Filtros por categoria e cidade
- ✅ Contato direto (WhatsApp ou email)
- ✅ Tipo Ofereço / Procuro
- ✅ Clicar no autor do work abre o perfil dele

### Feed e posts ✅

- ✅ Posts com texto, foto **ou** vídeo (nunca as duas mídias juntas — decisão de escopo, ver Convenções abaixo)
- ✅ Upload de foto (comprimida) ou vídeo (até 50MB) direto ao criar o post
- ✅ Aviso claro se tentar anexar foto e vídeo ao mesmo tempo
- ✅ Fixar um post no topo do próprio perfil (ícone de pin) — fixar um novo desfixa o anterior automaticamente, só 1 por vez
- ✅ Post fixado exibido com destaque visual (borda roxa + selo "Post fixado") no perfil próprio e no perfil público de quem visita
- ✅ Curtir e comentar funcionam normalmente em posts com mídia, incluindo o fixado

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
- ✅ Links sociais no perfil (Instagram, YouTube, Spotify)
- ✅ Profissão secundária como campo livre
- ✅ Instrumento principal + instrumentos secundários (múltiplos instrumentos por músico, selecionáveis via busca com chips removíveis)
- ✅ Novos instrumentos na lista (Trombone, Sanfona, Triângulo, Zabumba, Técnico de som)

### Deploy e Infraestrutura ✅

- ✅ Banco de dados na nuvem (Neon PostgreSQL — São Paulo)
- ✅ Deploy do backend (Render)
- ✅ Deploy do frontend (Vercel)
- ✅ Domínio próprio registrado: musicwork.com.br (Registro.br, expira 30/06/2027)
- ✅ DNS gerenciado pelo Cloudflare
- ✅ Frontend no domínio próprio: https://musicwork.com.br
- ✅ Backend no domínio próprio: https://api.musicwork.com.br
- ✅ CORS configurado para todos os domínios

### Melhorias de login/cadastro ✅

- ✅ Mostrar/ocultar senha (olhinho)
- ✅ Validação de formato de email
- ✅ Validação de senha mínima (6 caracteres) no cadastro
- ✅ Bloqueio dos campos durante o loading + spinner no botão
- ✅ Recuperação de senha implementada (backend `/forgot-password` e `/reset-password` + telas no frontend) — envio de email pendente até verificação de domínio no Resend

### Uploads robustos ✅

- ✅ Cloudinary (fotos e vídeos persistem entre deploys)
- ✅ Compressão de imagem no frontend (foto do celular ~1MB)
- ✅ Limite de 10MB (imagem) e 50MB (vídeo) + tratamento de erro
- ✅ Toasts de sucesso/erro no upload
- ✅ Upload funciona no mobile
- ✅ Helper getImageUrl (compatível com fotos antigas e novas do Cloudinary, e com vídeos)

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

### ⏳ Bloqueado — aguardando Resend

- ✅ Implementar recuperação de senha (backend: /forgot-password e /reset-password)
- ✅ Implementar telas de recuperação de senha no frontend
- ✅ Registros DNS do Resend no Cloudflare (TXT DKIM, MX SPF) — confirmado pelo suporte que estão válidos
- [ ] **Bloqueado por bug interno do Resend:** identidade do domínio registrada em região AWS diferente da usada pelo envio, causando erro 403. Suporte já confirmou o problema e está corrigindo, sem prazo. Nenhuma ação nossa necessária.
- [ ] Configurar Cloudflare Email Routing (contato@musicwork.com.br → Gmail)
- [ ] Criar API key no Resend e adicionar RESEND_API_KEY no Render

Sem ação a tomar aqui até o Resend responder o ticket.

### Fase 2.5 — Social avançado ✅ CONCLUÍDA

- ✅ Notificações (seguir, curtir, comentar, responder, curtir comentário)
- ✅ Responder comentários (threading)
- ✅ Curtir comentários

### Fase 3 — Conta e segurança (parcialmente concluída)

- ✅ Alterar senha (Configurações da conta)
- [ ] Editar email (backend pronto em `/account/email`, falta expor no frontend — decisão consciente de adiar até ter fluxo de confirmação por link, que depende do Resend voltar a funcionar)
- [ ] Verificação real de email no cadastro (também depende do Resend)
- [ ] Login com Google (OAuth)

### Fase 4 — Features grandes (parcialmente concluída)

- ✅ Múltiplos instrumentos no perfil
- ✅ Vídeo/áudio de apresentação no perfil ~ — evoluiu para posts com foto ou vídeo + sistema de fixar post no perfil
- ✅ Calendário de shows

### Fase 5 — Real-time (planejado, não iniciado)

- [ ] WebSocket (Socket.IO) para notificações instantâneas, substituindo o polling atual de 30s
- [ ] Lógica de reconexão no frontend (o backend no Render free hiberna por inatividade, então a conexão persistente vai cair)

**Decisão registrada (jul/2026):** optamos por adiar o WebSocket. Hoje as notificações funcionam por polling (frontend consulta `/notifications/unread-count` a cada 30s), o que não é real-time de verdade mas resolve bem pra um projeto com poucos usuários. WebSocket não vai exigir refazer nada do que já existe — é uma camada adicional em cima do que já temos (o REST continua servindo a lista de notificações, o socket só avisa "tem algo novo"). Faz mais sentido implementar quando: (a) já tivermos uma base de usuários ativa que justifique, e (b) migrarmos pra um plano/host que não hiberne, pra não ter reconexão toda hora.

### Fase 6 — Ideias futuras (não iniciado)

- [ ] Carrossel de múltiplas fotos/vídeos por post (hoje é limitado a 1 mídia por post — decisão de escopo consciente, ver Convenções abaixo)

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
JWT_SECRET=sua_chave
NODE_ENV=development
FRONTEND_URL=http://localhost:5173,https://musicwork.com.br,https://www.musicwork.com.br,https://music-work.vercel.app
DATABASE_URL=postgresql://...
DB_HOST=...
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=... (pendente)

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

- **Autenticação via `request.headers["userId"]`:** o `authMiddleware` decodifica o JWT e injeta o ID do usuário logado em `request.headers["userId"]` (não em `req.user.id`, que seria o padrão mais comum em outros projetos Express). Todos os controllers que precisam saber quem está logado leem daí.

- **Notificações nunca disparam para si mesmo:** regra centralizada em `NotificationService.create` (`if (recipientId === senderId) return null`). Qualquer novo tipo de notificação que for criado no futuro já herda essa proteção automaticamente, sem precisar reimplementar a checagem em cada lugar que dispara notificação.

- **Threading de comentários tem só 1 nível de profundidade:** uma resposta não pode ser respondida (não existe resposta-de-resposta). É uma escolha de design para manter a UI simples, não uma limitação técnica — se decidir aprofundar no futuro, vai exigir mudança tanto no modelo de dados quanto na renderização em árvore no frontend.

- **Posts suportam no máximo 1 mídia por post (foto OU vídeo, nunca as duas):** decisão de escopo consciente para evitar a complexidade de um carrossel de múltiplas mídias (tabela extra, componente de carrossel, lógica de ordenação). A trava é só no frontend (`NewPost.tsx` avisa e bloqueia se tentar anexar as duas) — o backend tecnicamente aceitaria ambos os campos preenchidos, mas isso nunca acontece na prática. Se decidir implementar carrossel no futuro, ver Fase 6 no roadmap.

- **Post fixado (`isPinned`) substituiu o campo `presentationVideoUrl`:** o campo `presentationVideoUrl` ainda existe na tabela `users` (dormente, sem uso no frontend) — foi mantido por simplicidade em vez de remover a coluna com outro ALTER em produção. A forma atual de destacar conteúdo no perfil é fixar qualquer post (com ou sem mídia) via `PostService.pinPost`.

- **Gênero musical do show é independente do gênero do perfil do músico:** cada show tem seu próprio campo `genre`, não herda do perfil de quem cria. Decisão consciente: permite que um músico toque em um evento de estilo diferente do seu gênero usual sem ficar inconsistente no filtro da Agenda.

- **`api.ts` organizado em seções por assunto:** o arquivo cresceu bastante e foi reagrupado em blocos comentados (Autenticação e conta / Perfil e uploads / Notificações / Posts / Shows e Agenda), sem alterar nenhum comportamento — só facilita encontrar funções relacionadas ao adicionar código novo.

- **Pasta `backend/dist` no `.gitignore`:** é a saída compilada do TypeScript (gerada automaticamente pelo `npm run build`), não deve ser versionada — o Render compila sozinho no deploy.

## Notas importantes

- **Banco único:** local e produção usam o mesmo banco Neon (ver TECH_DEBT.md)
- **Cold start:** o backend no Render free "dorme" após inatividade — primeiro acesso pode levar ~30-50s
- **Deploy automático:** push na branch main dispara deploy no Render e Vercel
- **Domínio:** musicwork.com.br gerenciado pelo Cloudflare, registrado no Registro.br até 30/06/2027
- **Email routing:** recuperação de senha já implementada no código; DNS (DKIM/SPF) validado. Envio bloqueado por bug interno do Resend (identidade do domínio em região AWS incorreta, erro 403) — suporte já ciente, corrigindo sem prazo definido.
- **Campo `type` da tabela `notifications`:** é `STRING` (não ENUM) de propósito, pra permitir novos tipos de notificação (ex: curtir comentário) sem precisar de migração no banco
- **Notificações:** atualmente via polling (30s), não real-time via WebSocket — decisão consciente, ver Fase 5 no roadmap
- **Busca de músicos:** filtra só pelo instrumento principal, não pelos instrumentos secundários — decisão consciente pra não reescrever a query de busca (que já usa `unaccent`)
