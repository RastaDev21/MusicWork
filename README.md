# MusicWork 🎵

Plataforma para músicos se conectarem, compartilharem posts e trocarem serviços.

## Stack

- **Frontend:** React + TypeScript + Vite + Material UI
- **Backend:** Node.js + Express + TypeScript + Sequelize + PostgreSQL
- **Auth:** JWT + bcrypt

## Estrutura

musicwork/
├── backend/
│ └── src/
│ ├── controllers/ (AuthController, UserController, PostController)
│ ├── middlewares/ (authMiddleware)
│ ├── models/ (User, Post)
│ ├── routes/ (authRoutes, userRoutes, postRoutes)
│ ├── services/ (AuthService, UserService, PostService)
│ └── server.ts
└── frontend/
└── src/
├── components/ (Layout, Navbar, Sidebar, BottomNav, PostCard, NewPost, Logo)
├── contexts/ (AuthContext)
├── pages/ (Login, Register, Feed, Profile)
├── routes/ (AppRoutes, PrivateRoute)
└── services/ (api.ts)

## O que já foi feito

- ✅ Autenticação completa (login, cadastro, JWT, logout)
- ✅ Feed com posts reais do banco
- ✅ Criar posts
- ✅ Deletar posts (só o seu)
- ✅ Perfil do músico com edição
- ✅ Layout responsivo desktop e mobile
- ✅ Proteção de rotas
- ✅ Menu do usuário no header
- ✅ Deletar posts com ícone de lixeira (só aparece nos seus posts)

## Próximos passos

- [ ] Foto de perfil e foto de capa
- [ ] Curtir posts
- [ ] Página de busca de músicos
- [ ] Trampo (marketplace de serviços)

## Como rodar

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

## Portas

- Backend: http://localhost:3333
- Frontend: http://localhost:5173
