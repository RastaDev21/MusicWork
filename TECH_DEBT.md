# 🛠️ Dívida Técnica & Melhorias Futuras — MusicWork

Itens conhecidos que funcionam no estágio atual mas precisam ser revisitados.
Cada item tem: contexto, quando resolver e como resolver.

---

## 🔴 Alta prioridade

### Separar banco de desenvolvimento do de produção

**Contexto:** Hoje o backend local e o de produção apontam para o mesmo banco Neon
(a `DATABASE_URL` no `.env` é a mesma do Render). Testar localmente mexe nos dados
reais que aparecem no app publicado.

**Quando resolver:**

- Antes do app ter usuários reais que não podem ser perdidos
- Ou quando um teste local acidentalmente quebrar dados de produção

**Como resolver:**

- Criar um 2º projeto Neon gratuito (banco de dev)
- `.env` local aponta pro banco de dev; Render continua no de produção
- Rodar o sync/seed no banco de dev para ter dados de teste isolados

---

## 🟡 Média prioridade

### Verificação real de email no cadastro

**Contexto:** A validação de email é só de formato (regex no frontend). Qualquer
email com formato válido é aceito, mesmo que não exista de verdade.

**Como resolver:**

- Integrar serviço de envio de email (Resend, SendGrid)
- Enviar link/código de confirmação no cadastro
- Marcar usuário como "verificado" só após confirmar

### Recuperação de senha ("Esqueci minha senha")

**Contexto:** O link existe no login mas só mostra um aviso. Não recupera de verdade.

**Como resolver:**

- Depende do serviço de email acima
- Gerar token temporário + tela de redefinir senha

### Limpar fotos órfãs no Cloudinary ao trocar

**Contexto:** Quando o usuário troca a foto de perfil ou capa, a imagem antiga fica
órfã no Cloudinary para sempre. Não é urgente (o free tier aguenta muito acúmulo),
mas com o tempo gera lixo desnecessário.

**Como resolver:**

- Salvar o `public_id` de cada foto no banco (hoje guardamos só a URL)
- Ao subir uma nova, chamar `cloudinary.uploader.destroy(public_id_antigo)`
- Bom de fazer junto com outras mudanças na área de perfil

---

## 🟢 Baixa prioridade / quando der

### Cold start do backend (~30-50s)

**Contexto:** O Render free coloca o serviço em repouso após inatividade. O primeiro
acesso depois disso demora pra "acordar".

**Como resolver:**

- Plano pago do Render, OU
- Um ping periódico (cron) para manter o serviço acordado

---

## ✅ Resolvidos

- **Uploads em filesystem efêmero** -> migrado para Cloudinary (jun 2026). Fotos
  agora persistem entre deploys.

---

_Última atualização: junho 2026_
