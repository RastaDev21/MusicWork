# MusicWork 🎵

Plataforma para músicos se conectarem, compartilharem posts e trocarem serviços musicais.

## Stack

- **Frontend:** React + TypeScript + Vite + Material UI
- **Backend:** Node.js + Express + TypeScript + Sequelize + PostgreSQL
- **Auth:** JWT + bcrypt
- **Banco produção:** Neon PostgreSQL

## Estrutura

```
musicwork/
├── backend/
│   └── src/
│       ├── controllers/ (AuthController, UserController, PostController, UploadController, LikeController, WorkController)
│       ├── middlewares/ (authMiddleware, uploadMiddleware)
│       ├── models/ (User, Post, Like, Work)
│       ├── routes/ (authRoutes, userRoutes, postRoutes, uploadRoutes, likeRoutes, workRoutes)
│       ├── services/ (AuthService, UserService, PostService, WorkService)
│       ├── uploads/ (avatars, covers)
│       └── server.ts
└── frontend/
    └── src/
        ├── components/ (Layout, Navbar, Sidebar, BottomNav, PostCard, NewPost, Logo)
        ├── contexts/ (AuthContext)
        ├── pages/ (Login, Register, Feed, Profile, Search, Work)
        ├── routes/ (AppRoutes, PrivateRoute)
        └── services/ (api.ts)
```

## O que já foi feito

### Fase 1 — Base ✅

- ✅ Autenticação completa (login, cadastro, JWT, logout)
- ✅ Feed com posts reais do banco
- ✅ Criar e deletar posts
- ✅ Foto de perfil e foto de capa
- ✅ Avatar em todo lugar (navbar, feed, newpost)
- ✅ Perfil do músico com edição (nome, instrumento, cidade, bio, gênero)
- ✅ Layout responsivo desktop e mobile
- ✅ Proteção de rotas
- ✅ Navbar de busca funcional

### Fase 2 — Busca avançada ✅

- ✅ Busca de músicos por nome, instrumento, cidade e gênero
- ✅ Filtros avançados (instrumento, gênero, cidade)
- ✅ Limpar filtros
- ✅ Busca combinada (texto + filtros)

### Fase 3 — Work (marketplace) ✅

- ✅ Criar, editar e deletar works
- ✅ Categorias de serviço (Show, Aula, Gravação, Foto/Vídeo, Banda, Equipamento)
- ✅ Filtros por categoria e cidade
- ✅ Contato direto (WhatsApp ou email)
- ✅ Tipo Ofereço / Procuro

### Curtidas ✅

- ✅ Curtir e descurtir posts
- ✅ Contador de curtidas em tempo real

## Próximos passos

### Deploy 🚀

- ✅ Banco de dados na nuvem (Neon PostgreSQL — São Paulo)
- [ ] Deploy do backend (Render)
- [ ] Deploy do frontend (Vercel)

### Fase 4 — Perfil rico

- [ ] Links sociais no perfil (Instagram, YouTube, SoundCloud)
- [ ] Vídeo/áudio de apresentação

### Fase 5 — Funcionalidades sociais

- [ ] Comentários nos posts
- [ ] Seguir músicos
- [ ] Notificações
- [ ] Página de perfil público de outros usuários
- [ ] Editar email e senha (configurações)

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
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://...
DB_HOST=...
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=...
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3333
```
