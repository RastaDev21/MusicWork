import { Container, Typography, Box, Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

// Página pública exigida pela Play Store (link vai no formulário de
// Segurança dos dados). Cores fixas, igual PrivacyPolicy: a rota fica fora
// do layout autenticado e não herda o tema.
export default function DeleteAccount() {
  return (
    <Box sx={{ backgroundColor: "#0f0f0f", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md" sx={{ color: "#f0f0f0" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#ffffff" }}>
          Excluir sua conta do MusicWork
        </Typography>
        <Typography variant="body2" sx={{ color: "#a0a0a0" }} gutterBottom>
          Última atualização: outubro de 2026
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Você pode excluir sua conta do MusicWork e todos os dados associados
            a ela a qualquer momento, sem precisar falar com ninguém. A exclusão
            é imediata e definitiva.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            Como excluir pelo app ou pelo site
          </Typography>
          <Box component="ol" sx={{ color: "inherit" }}>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Entre na sua conta pelo app MusicWork ou pelo site{" "}
                <strong>musicwork.com.br</strong>
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Toque na sua foto (menu do avatar) e abra{" "}
                <strong>Configurações</strong>
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                No fim da página, toque em <strong>Excluir conta</strong>
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Digite <strong>EXCLUIR</strong> no campo de confirmação e toque
                em <strong>Excluir definitivamente</strong>
              </Typography>
            </li>
          </Box>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            sx={{
              mt: 1,
              mb: 2,
              backgroundColor: "#7c4dff",
              "&:hover": { backgroundColor: "#6c3fef" },
            }}
          >
            Entrar no MusicWork
          </Button>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            Sem acesso à sua conta?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Se você não consegue mais entrar, envie um email para{" "}
            <strong>humberto_21style@hotmail.com</strong> a partir do email
            cadastrado na conta, com o assunto <strong>"Exclusão de conta"</strong>.
            A exclusão é feita em até 15 dias e você recebe uma confirmação por
            email.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            O que é apagado
          </Typography>
          <Box component="ul" sx={{ color: "inherit" }}>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Dados de cadastro e de perfil (nome, email, senha, cidade,
                instrumentos, gêneros, links de redes sociais, etc.)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Foto de perfil, foto de capa e áudio do perfil
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Posts (com fotos e vídeos), comentários e curtidas
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Seguidores, quem você segue e notificações
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Works do marketplace e shows da Agenda (com flyers)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Conversas do chat, inteiras, com todas as mensagens, fotos e
                vídeos — elas deixam de existir também para a outra pessoa da
                conversa
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Os arquivos de mídia são apagados também do nosso provedor de
            armazenamento (Cloudinary).
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            O que pode ser mantido
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Não mantemos nenhum dado da conta excluída. Cópias de segurança
            automáticas dos nossos provedores de infraestrutura (banco de dados
            e armazenamento de mídia) podem conter esses dados por até 30 dias,
            até serem descartadas automaticamente. Essas cópias não são usadas
            para nenhuma outra finalidade.
          </Typography>

          <Typography variant="body1" sx={{ mt: 4, mb: 2, color: "inherit" }}>
            Mais detalhes na nossa{" "}
            <Link
              component={RouterLink}
              to="/privacidade"
              sx={{ color: "#b39dff" }}
            >
              Política de Privacidade
            </Link>
            .
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
