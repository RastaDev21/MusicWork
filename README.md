# MusicWork 🎵

Plataforma para músicos se conectarem, compartilharem posts e trocarem serviços musicais.

**🌐 Produção:**

- Frontend: https://music-work.vercel.app
- Backend: https://musicwork.onrender.com

## Stack

- **Frontend:** React + TypeScript + Vite + Material UI
- **Backend:** Node.js + Express + TypeScript + Sequelize + PostgreSQL
- **Auth:** JWT + bcrypt
- **Banco produção:** Neon PostgreSQL (São Paulo)
- **Uploads:** Cloudinary (imagens persistentes)
- **Deploy:** Render (backend) + Vercel (frontend)
- **Toasts:** notistack
- **Compressão de imagem:** browser-image-compression

## Estrutura

```
musicwork/
├── backend/
│   └── src/
│       ├── config/ (cloudinary.ts)
│       ├── controllers/ (AuthController, UserController, PostController, UploadController, LikeController, WorkController)
│       ├── middlewares/ (authMiddleware, uploadMiddleware)
│       ├── models/ (User, Post, Like, Work)
│       ├── routes/ (authRoutes, userRoutes, postRoutes, uploadRoutes, likeRoutes, workRoutes)
│       ├── services/ (AuthService, UserService, PostService, WorkService)
│       └── server.ts
└── frontend/
    └── src/
        ├── components/ (Layout, Navbar, Sidebar, BottomNav, PostCard, NewPost, Logo)
        ├── contexts/ (AuthContext)
        ├── pages/ (Login, Register, Feed, Profile, PublicProfile, Search, Work)
        ├── routes/ (AppRoutes, PrivateRoute)
        └── services/ (api.ts — inclui helper getImageUrl)
```

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
- ✅ Filtros por categoria e cidade
- ✅ Contato direto (WhatsApp ou email)
- ✅ Tipo Ofereço / Procuro
- ✅ Clicar no autor do work abre o perfil dele

### Curtidas ✅

- ✅ Curtir e descurtir posts
- ✅ Contador de curtidas em tempo real

### Perfil público ✅

- ✅ Página de perfil público de outros usuários (/musico/:id)

### Deploy 🚀 ✅

- ✅ Banco de dados na nuvem (Neon PostgreSQL — São Paulo)
- ✅ Deploy do backend (Render)
- ✅ Deploy do frontend (Vercel)
- ✅ CORS configurado para aceitar local + produção

### Melhorias de login/cadastro ✅

- ✅ Mostrar/ocultar senha (olhinho)
- ✅ Validação de formato de email
- ✅ Validação de senha mínima (6 caracteres) no cadastro
- ✅ Bloqueio dos campos durante o loading + spinner no botão
- ✅ Link "Esqueci minha senha" (visual — recuperação real é dívida técnica)

### Uploads robustos ✅

- ✅ Cloudinary (fotos persistem entre deploys)
- ✅ Compressão de imagem no frontend (foto do celular ~1MB)
- ✅ Limite de 10MB + tratamento de erro
- ✅ Toasts de sucesso/erro no upload
- ✅ Upload funciona no mobile
- ✅ Helper getImageUrl (compatível com fotos antigas e novas do Cloudinary)

---

## Próximos passos — ROADMAP

### ▶️ Fase 1 — Vitórias rápidas (PRÓXIMA)

- ✅ #2 Profissão secundária como campo livre (dropdown → texto) ← COMEÇAR POR AQUI
- ✅ #5 Subcategoria de tipo de aula no Work (instrumento ensinado)
- ✅ #7 Localização flexível no Work (online / estado / país)
- ✅ Links sociais no perfil (Instagram, YouTube, SoundCloud)
- ✅ Compartilhar post (copiar link)

### Fase 2 — Coração social

- [ ] Comentários nos posts
- ✅ Seguir músicos (contadores reais)

### Fase 3 — Conta e segurança

- [ ] Serviço de email + recuperação de senha
- [ ] Editar email e senha (configurações)
- [ ] Verificação real de email

### Fase 4 — Features grandes

- [ ] Calendário de shows
- [ ] Notificações
- [ ] Vídeo/áudio de apresentação no perfil
- [ ] #3 Múltiplos instrumentos no perfil

### Funcionalidades incompletas (botão existe, sem ação)

- [ ] Comentar (botão no PostCard)
- [ ] Compartilhar (ícone no PostCard)
- [ ] Seguir (contadores fixos em 0)
- [ ] Notificações (sino na navbar)

> 📋 Dívida técnica detalhada em `TECH_DEBT.md`

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
FRONTEND_URL=http://localhost:5173,https://music-work.vercel.app
DATABASE_URL=postgresql://...
DB_HOST=...
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3333
```

## Notas importantes

- **Banco único:** local e produção usam o mesmo banco Neon (ver TECH_DEBT.md)
- **Cold start:** o backend no Render free "dorme" após inatividade — primeiro acesso pode levar ~30-50s
- **Deploy automático:** push na branch main dispara deploy no Render e Vercel
