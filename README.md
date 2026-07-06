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
- **Uploads:** Cloudinary (imagens persistentes)
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
│ ├── controllers/ (AuthController, UserController, PostController, UploadController, LikeController, WorkController, FollowController, CommentController, NotificationController)
│ ├── middlewares/ (authMiddleware, uploadMiddleware)
│ ├── models/ (User, Post, Like, Work, Follow, Comment, Notification)
│ ├── routes/ (authRoutes, userRoutes, postRoutes, uploadRoutes, likeRoutes, workRoutes, followRoutes, commentRoutes, notificationRoutes)
│ ├── services/ (AuthService, UserService, PostService, WorkService, FollowService, CommentService, NotificationService, EmailService)
│ └── server.ts
└── frontend/
└── src/
├── components/ (Layout, NavBar, SideBar, BottomNav, PostCard, NewPost, Logo)
├── contexts/ (AuthContext)
├── pages/ (Login, Register, Feed, Profile, PublicProfile, Search, Work, ForgotPassword, ResetPassword)
├── routes/ (App.Routes, PrivateRoute)
└── services/ (api.ts — inclui helper getImageUrl)

## O que já foi feito

### Base ✅

- ✅ Autenticação completa (login, cadastro, JWT, logout)
- ✅ Feed com posts reais do banco
- ✅ Criar e deletar posts
- ✅ Foto de perfil e foto de capa (via Cloudinary)
- ✅ Avatar em todo lugar (navbar, feed, newpost)
- ✅ Perfil do músico com edição (nome, instrumento, cidade, bio, gênero)
- ✅ Layout responsivo desktop e mobile
- ✅ Proteção de rotas
- ✅ Navbar de busca funcional

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

### Social ✅

- ✅ Curtir e descurtir posts
- ✅ Contador de curtidas em tempo real
- ✅ Comentários nos posts (criar, listar, deletar)
- ✅ Responder comentários (threading, 1 nível de profundidade)
- ✅ Curtir e descurtir comentários e respostas
- ✅ Contador de comentários real no feed (inclui respostas)
- ✅ Seguir músicos (persistido no banco)
- ✅ Contadores reais de seguidores/seguindo no perfil público
- ✅ Notificações (seguir, curtir post, comentar, responder, curtir comentário) com sino no navbar, badge de não lidas e marcação automática ao abrir

### Perfil ✅

- ✅ Página de perfil público de outros usuários (/musico/:id)
- ✅ Links sociais no perfil (Instagram, YouTube, Spotify)
- ✅ Profissão secundária como campo livre
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

- ✅ Cloudinary (fotos persistem entre deploys)
- ✅ Compressão de imagem no frontend (foto do celular ~1MB)
- ✅ Limite de 10MB + tratamento de erro
- ✅ Toasts de sucesso/erro no upload
- ✅ Upload funciona no mobile
- ✅ Helper getImageUrl (compatível com fotos antigas e novas do Cloudinary)

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

### Fase 2.5 — Social avançado

- ✅ Notificações (seguir, curtir, comentar, responder)
- ✅ Responder comentários (threading)
- ✅ Curtir comentários

### Fase 3 — Conta e segurança

- [ ] Editar email e senha (configurações)
- [ ] Verificação real de email no cadastro
- [ ] Login com Google (OAuth)

### Fase 4 — Features grandes

- [ ] Calendário de shows
- [ ] Vídeo/áudio de apresentação no perfil
- [ ] Múltiplos instrumentos no perfil

### Fase 5 — Real-time (planejado, não iniciado)

- [ ] WebSocket (Socket.IO) para notificações instantâneas, substituindo o polling atual de 30s
- [ ] Lógica de reconexão no frontend (o backend no Render free hiberna por inatividade, então a conexão persistente vai cair)

**Decisão registrada (jul/2026):** optamos por adiar o WebSocket. Hoje as notificações funcionam por polling (frontend consulta `/notifications/unread-count` a cada 30s), o que não é real-time de verdade mas resolve bem pra um projeto com poucos usuários. WebSocket não vai exigir refazer nada do que já existe — é uma camada adicional em cima do que já temos (o REST continua servindo a lista de notificações, o socket só avisa "tem algo novo"). Faz mais sentido implementar quando: (a) já tivermos uma base de usuários ativa que justifique, e (b) migrarmos pra um plano/host que não hiberne, pra não ter reconexão toda hora.

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

```
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
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3333
```

### Frontend (.env.production)

VITE_API_URL=https://api.musicwork.com.br

## Notas importantes

- **Banco único:** local e produção usam o mesmo banco Neon (ver TECH_DEBT.md)
- **Cold start:** o backend no Render free "dorme" após inatividade — primeiro acesso pode levar ~30-50s
- **Deploy automático:** push na branch main dispara deploy no Render e Vercel
- **Domínio:** musicwork.com.br gerenciado pelo Cloudflare, registrado no Registro.br até 30/06/2027
- **Email routing:** recuperação de senha já implementada no código; DNS (DKIM/SPF) validado. Envio bloqueado por bug interno do Resend (identidade do domínio em região AWS incorreta, erro 403) — suporte já ciente, corrigindo sem prazo definido.
- **Campo `type` da tabela `notifications`:** é `STRING` (não ENUM) de propósito, pra permitir novos tipos de notificação (ex: curtir comentário) sem precisar de migração no banco
- **Notificações:** atualmente via polling (30s), não real-time via WebSocket — decisão consciente, ver Fase 5 no roadmap
