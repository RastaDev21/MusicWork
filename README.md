# MusicWork 🎵

## 🔄 Onde paramos (última atualização: 05/08/2026)

**Última sessão:** Ponto 4 do backlog do professor Fábio — reorganização visual do cabeçalho do perfil, pra acabar com a duplicação de informação que ficou evidente depois de tantas features novas (gêneros extras, chip de Professor, player).

**O que foi feito:**

- ✅ **Chips do cabeçalho** (`components/profile/ProfileChips.tsx`, novo): Professor sempre em primeiro (mais ênfase), depois instrumento e gênero principal, depois os secundários — todos exibidos sempre, quebrando linha naturalmente. Chegamos a testar um "+N mais" que expandia/recolhia os secundários, mas foi descartado depois de testar na prática: a posição do toggle ficava inconsistente dependendo de quantos chips cabiam por linha (ora isolado sozinho, ora no meio da lista). Decisão final: mostrar tudo sempre, sem esconder nada.
- ✅ **Card de detalhes** (`components/profile/ProfileDetailsCard.tsx`, novo): tirou `Instrumento` e `Gênero` (já aparecem completos nos chips) e trocou por `Profissão`, `Cidade` e `Nacionalidade` por extenso (antes a nacionalidade só aparecia como bandeira solta ao lado da cidade). Zero duplicação agora — cada informação mora num lugar só.
- ✅ **Estatísticas e redes sociais** ficaram na mesma linha (antes eram duas linhas separadas), com `flexWrap` pra quebrar sozinho no mobile sem precisar de media query manual.
- ✅ Aplicado em `Profile.tsx` e `PublicProfile.tsx`, ambos compilando limpo e testados manualmente (incluindo o comportamento de quebra de linha no mobile).

**Decisão de processo (importante pra não repetir):** o checkout local ficou preso numa branch antiga (`revisao-codigo-jul2026`) depois da revisão de código de jul/2026, e vários commits foram parar nela sem querer, exigindo um `git merge` manual pra trazer tudo de volta pra `main`. Decisão registrada: **por enquanto, sempre trabalhar direto na `main`**, sem branch de feature — só faz sentido criar uma branch de desenvolvimento separada quando o app tiver usuários reais em produção, pra não arriscar quebrar algo ao vivo. Até lá, checar a branch atual (`git status` ou o canto inferior esquerdo do VS Code) antes de cada commit é a única salvaguarda.

**Status:** Tudo commitado e na `main` (local e GitHub sincronizados). Backend e frontend compilam sem erros (`tsc --noEmit`).

**Pendente do backlog do professor:** só o ponto 8 (chat de suporte com conta fixa) — é o único item que resta.

**Próximo passo sugerido:** Ponto 8 — chat de suporte, reaproveitando o sistema de chat já existente.

---

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
├── components/ (Layout, NavBar, SideBar, BottomNav, PostCard, NewPost, ShowCard, ShowDialog, Logo; profile/ — SocialLinks, AudioPlayer, ProfessorChip compartilhados entre Profile/PublicProfile/Search)
├── constants/ (musicOptions.ts — instrumentos e gêneros; countries.ts — países e bandeira; youtube.ts — helper de embed de vídeo em posts)
├── contexts/ (AuthContext)
├── pages/ (Login, Register, Feed, Profile, PublicProfile, Search, Work, Agenda, Messages, Chat, Settings, ForgotPassword, ResetPassword)
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
- ✅ Filtros avançados (instrumento, gênero, cidade, país, professor)
- ✅ Limpar filtros
- ✅ Busca combinada (texto + filtros, todos os filtros se combinam com E lógico)
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
- ✅ Vídeo do YouTube embutido automaticamente quando o post tem um link no texto
- ✅ Criar post direto da página de perfil, além do Feed

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

### Chat (mensagens diretas) ✅ CONCLUÍDO — não estava no roadmap original

- ✅ Conversas e mensagens (texto, foto, vídeo)
- ✅ Sem restrição de quem pode iniciar conversa (decisão consciente, ver Convenções abaixo)

### Fase 3 — Conta e segurança (parcialmente concluída)

- ✅ Alterar senha (Configurações da conta)
- [ ] Editar email (backend pronto em `/account/email`, falta expor no frontend — decisão consciente de adiar até ter fluxo de confirmação por link, que depende do Resend voltar a funcionar)
- [ ] Verificação real de email no cadastro (também depende do Resend)
- [ ] Login com Google (OAuth)

### Fase 4 — Features grandes (parcialmente concluída)

- ✅ Múltiplos instrumentos no perfil
- ✅ Vídeo/áudio de apresentação no perfil — evoluiu para posts com foto ou vídeo + sistema de fixar post no perfil
- ✅ Calendário de shows

### Fase 5 — Real-time (planejado, não iniciado)

- [ ] WebSocket (Socket.IO) para notificações instantâneas, substituindo o polling atual de 30s
- [ ] Lógica de reconexão no frontend (o backend no Render free hiberna por inatividade, então a conexão persistente vai cair)

**Decisão registrada (jul/2026):** optamos por adiar o WebSocket. Hoje as notificações funcionam por polling (frontend consulta `/notifications/unread-count` a cada 30s), o que não é real-time de verdade mas resolve bem pra um projeto com poucos usuários. WebSocket não vai exigir refazer nada do que já existe — é uma camada adicional em cima do que já temos (o REST continua servindo a lista de notificações, o socket só avisa "tem algo novo"). Faz mais sentido implementar quando: (a) já tivermos uma base de usuários ativa que justifique, e (b) migrarmos pra um plano/host que não hiberne, pra não ter reconexão toda hora.

### Fase 6 — Ideias futuras (não iniciado)

- [ ] Carrossel de múltiplas fotos/vídeos por post (hoje é limitado a 1 mídia por post — decisão de escopo consciente, ver Convenções abaixo)

### 📋 Feedback do professor Fábio (jul/2026) — backlog de sugestões

- ✅ Múltiplos gêneros musicais no perfil (mesmo padrão dos instrumentos secundários)
- ✅ Facebook e TikTok como links sociais (mesmo padrão de Instagram/YouTube/Spotify)
- ✅ Adicionar "Ukulele" à lista de instrumentos — unificada a lista duplicada em `constants/musicOptions.ts`
- ✅ Revisar duplicação de informações no perfil — resolvido em duas rodadas: primeiro tirou o Gênero repetido do card de detalhes (trocado por Nacionalidade), depois eliminou a última duplicação (Instrumento/Cidade também saíram do card), reorganizou os chips (Professor em destaque primeiro) e uniu estatísticas + redes sociais na mesma linha. Ver "Feedback do professor Fábio (ago/2026)" abaixo.
- ✅ Player de música no perfil — decisão inicial foi embed do Spotify via `favoriteSongUrl`, depois substituído por upload de áudio próprio (`profileAudioUrl`) — ver segunda rodada abaixo.
- ✅ Filtro de "Professor" na busca — decisão: Opção B, campo explícito `isProfessor` no perfil (mantém Busca e Work independentes)
- ✅ Nacionalidade no perfil, com bandeira (emoji Unicode, sem precisar de imagem)
- [ ] Chat de suporte — reaproveitar o sistema de chat já existente, com uma conta fixa de suporte

### 📋 Feedback do professor Fábio (revisão ago/2026) — segunda rodada

- ✅ Renomear checkbox "Só professores" → "Buscar professores" na busca
- ✅ Vídeo do YouTube embutido nos posts (antes só aparecia o link em texto)
- ✅ Criar post direto da página de perfil (antes só dava pra postar pelo Feed)
- ✅ Player de música do perfil trocado de embed do Spotify pra upload de áudio próprio (decisão: o link do artista já cobria a divulgação; o player devia tocar áudio de verdade, não outro link)
- ✅ Reorganização dos chips e do card de detalhes do perfil (ponto 4, ver Convenções de código para os detalhes das decisões descartadas no caminho — toggle "+N mais", card só com Profissão)
- [ ] Chat de suporte — reaproveitar o sistema de chat já existente, com uma conta fixa de suporte (único item pendente do backlog do professor)

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

- **Autenticação via `request.userId`:** o `authMiddleware` decodifica o JWT e injeta o ID do usuário logado em `request.userId`, tipado por augmentation em `backend/src/@types/express.d.ts`. Todos os controllers que precisam saber quem está logado leem daí. (Até jul/2026 isso ficava em `request.headers["userId"]`; foi migrado para `req.userId` por ser dado de aplicação, não header HTTP — e isso passou a alimentar corretamente o `public_id` dos uploads no `uploadMiddleware`, que já lia `req.userId`.)

- **Notificações nunca disparam para si mesmo:** regra centralizada em `NotificationService.create` (`if (recipientId === senderId) return null`). Qualquer novo tipo de notificação que for criado no futuro já herda essa proteção automaticamente, sem precisar reimplementar a checagem em cada lugar que dispara notificação.

- **Threading de comentários tem só 1 nível de profundidade:** uma resposta não pode ser respondida (não existe resposta-de-resposta). É uma escolha de design para manter a UI simples, não uma limitação técnica — se decidir aprofundar no futuro, vai exigir mudança tanto no modelo de dados quanto na renderização em árvore no frontend.

- **Posts suportam no máximo 1 mídia por post (foto OU vídeo, nunca as duas):** decisão de escopo consciente para evitar a complexidade de um carrossel de múltiplas mídias (tabela extra, componente de carrossel, lógica de ordenação). A trava é só no frontend (`NewPost.tsx` avisa e bloqueia se tentar anexar as duas) — o backend tecnicamente aceitaria ambos os campos preenchidos, mas isso nunca acontece na prática. Se decidir implementar carrossel no futuro, ver Fase 6 no roadmap.

- **Post fixado (`isPinned`) substituiu o campo `presentationVideoUrl`:** o campo `presentationVideoUrl` ainda existe na tabela `users` (dormente, sem uso no frontend) — foi mantido por simplicidade em vez de remover a coluna com outro ALTER em produção. A forma atual de destacar conteúdo no perfil é fixar qualquer post (com ou sem mídia) via `PostService.pinPost`.

- **Gênero musical do show é independente do gênero do perfil do músico:** cada show tem seu próprio campo `genre`, não herda do perfil de quem cria. Decisão consciente: permite que um músico toque em um evento de estilo diferente do seu gênero usual sem ficar inconsistente no filtro da Agenda.

- **`api.ts` organizado em seções por assunto:** o arquivo cresceu bastante e foi reagrupado em blocos comentados (Autenticação e conta / Perfil e uploads / Notificações / Posts / Shows e Agenda), sem alterar nenhum comportamento — só facilita encontrar funções relacionadas ao adicionar código novo.

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

- **Banco único:** local e produção usam o mesmo banco Neon (ver TECH_DEBT.md)
- **Cold start:** o backend no Render free "dorme" após inatividade — primeiro acesso pode levar ~30-50s
- **Deploy automático:** push na branch main dispara deploy no Render e Vercel
- **Domínio:** musicwork.com.br gerenciado pelo Cloudflare, registrado no Registro.br até 30/06/2027
- **Email routing:** recuperação de senha já implementada no código; DNS (DKIM/SPF) validado. Envio bloqueado por bug interno do Resend (identidade do domínio em região AWS incorreta, erro 403) — suporte já ciente, corrigindo sem prazo definido.
- **Campo `type` da tabela `notifications`:** é `STRING` (não ENUM) de propósito, pra permitir novos tipos de notificação (ex: curtir comentário) sem precisar de migração no banco
- **Notificações:** atualmente via polling (30s), não real-time via WebSocket — decisão consciente, ver Fase 5 no roadmap
- **Busca de músicos:** filtra só pelo instrumento principal, não pelos instrumentos secundários — decisão consciente pra não reescrever a query de busca (que já usa `unaccent`)
- **`JWT_SECRET` obrigatório:** desde a revisão de jul/2026 o backend aborta o boot se a variável não estiver definida (sem fallback `default_secret`) — garantir que ela esteja no Render e no `.env` local. Ver Convenções de código.
- **Feed e Work paginam** (`limit`/`offset`, botão "Carregar mais"); os filtros do Work agora rodam no servidor. Detalhes nas Convenções de código.
