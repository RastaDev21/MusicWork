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
- **Email sistema:** Resend (pendente verificação de domínio)

## Estrutura

musicwork/
├── backend/
│ └── src/
│ ├── config/ (cloudinary.ts)
│ ├── controllers/ (AuthController, UserController, PostController, UploadController, LikeController, WorkController, FollowController, CommentController)
│ ├── middlewares/ (authMiddleware, uploadMiddleware)
│ ├── models/ (User, Post, Like, Work, Follow, Comment)
│ ├── routes/ (authRoutes, userRoutes, postRoutes, uploadRoutes, likeRoutes, workRoutes, followRoutes, commentRoutes)
│ ├── services/ (AuthService, UserService, PostService, WorkService, FollowService, CommentService)
│ └── server.ts
└── frontend/
└── src/
├── components/ (Layout, Navbar, Sidebar, BottomNav, PostCard, NewPost, Logo)
├── contexts/ (AuthContext)
├── pages/ (Login, Register, Feed, Profile, PublicProfile, Search, Work)
├── routes/ (AppRoutes, PrivateRoute)
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
- ✅ Contador de comentários real no feed
- ✅ Seguir músicos (persistido no banco)
- ✅ Contadores reais de seguidores/seguindo no perfil público

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
- ✅ Link "Esqueci minha senha" (visual — recuperação real pendente)

### Uploads robustos ✅

- ✅ Cloudinary (fotos persistem entre deploys)
- ✅ Compressão de imagem no frontend (foto do celular ~1MB)
- ✅ Limite de 10MB + tratamento de erro
- ✅ Toasts de sucesso/erro no upload
- ✅ Upload funciona no mobile
- ✅ Helper getImageUrl (compatível com fotos antigas e novas do Cloudinary)

---

## Próximos passos — ROADMAP

### ⏳ Pendente — Configuração de email (FAZER PRIMEIRO NA PRÓXIMA SESSÃO)

- [ ] Adicionar registros DNS do Resend no Cloudflare (TXT DKIM, MX SPF)
- [ ] Configurar Cloudflare Email Routing (contato@musicwork.com.br → Gmail)
- [ ] Criar API key no Resend e adicionar RESEND_API_KEY no Render
- [ ] Implementar recuperação de senha (backend: /forgot-password e /reset-password)
- [ ] Implementar telas de recuperação de senha no frontend

### Fase 3 — Conta e segurança

- [ ] Recuperação de senha por email (Resend)
- [ ] Editar email e senha (configurações)
- [ ] Verificação real de email no cadastro
- [ ] Login com Google (OAuth)

### Fase 2.5 — Social avançado

- [ ] Curtir comentários
- [ ] Responder comentários (threading)
- [ ] Notificações (seguir, curtir, comentar)

### Fase 4 — Features grandes

- [ ] Calendário de shows
- [ ] Vídeo/áudio de apresentação no perfil
- [ ] Múltiplos instrumentos no perfil

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
- **Email routing:** pendente configuração do Cloudflare Email Routing e verificação do Resend
