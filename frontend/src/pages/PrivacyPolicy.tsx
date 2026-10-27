import { Container, Typography, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <Box sx={{ backgroundColor: "#0f0f0f", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md" sx={{ color: "#f0f0f0" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#ffffff" }}>
          Política de Privacidade — MusicWork
        </Typography>
        <Typography variant="body2" sx={{ color: "#a0a0a0" }} gutterBottom>
          Última atualização: outubro de 2026
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            O MusicWork ("nós", "nosso" ou "aplicativo") é uma plataforma que
            conecta músicos, permitindo a criação de perfis, publicação de
            posts, troca de mensagens e oferta ou busca de serviços musicais.
            Esta política explica quais dados coletamos, como usamos e como você
            pode exercer seus direitos sobre eles.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            1. Dados que coletamos
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Ao criar uma conta e usar o MusicWork, coletamos:
          </Typography>
          <Box component="ul" sx={{ color: "inherit" }}>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Dados de cadastro:</strong> nome, email e senha
                (armazenada de forma criptografada). Se você usar o login com
                Google, coletamos nome, email e foto de perfil fornecidos pela
                sua conta Google.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Dados de perfil:</strong> cidade, nacionalidade,
                biografia, instrumentos musicais, gêneros musicais e indicação
                de atuação como professor.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Mídia enviada por você:</strong> foto de perfil, foto de
                capa e um arquivo de áudio de apresentação, todos armazenados em
                nosso provedor de armazenamento em nuvem (Cloudinary).
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Links de redes sociais:</strong> endereços que você
                escolher informar (Instagram, YouTube, Spotify, Facebook,
                TikTok).
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Conteúdo gerado por você:</strong> posts (texto, foto ou
                vídeo), comentários, curtidas e shows cadastrados na Agenda.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Mensagens:</strong> conteúdo trocado no chat entre
                usuários da plataforma, incluindo texto, fotos e vídeos
                enviados.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Dados de uso técnico:</strong> informações padrão de
                autenticação (token de sessão) necessárias para manter você
                conectado com segurança.
              </Typography>
            </li>
          </Box>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            2. Como usamos os dados
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Usamos os dados coletados para:
          </Typography>
          <Box component="ul" sx={{ color: "inherit" }}>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Criar e manter seu perfil público na plataforma
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Permitir a busca de outros músicos por instrumento, gênero,
                cidade e país
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Viabilizar a publicação de posts, comentários, curtidas e shows
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Viabilizar o envio e recebimento de mensagens entre usuários
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Enviar emails operacionais, como confirmação de cadastro e
                recuperação de senha
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Prestar suporte quando você entra em contato pelo chat de
                suporte
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Não vendemos seus dados pessoais a terceiros.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            3. Compartilhamento de dados
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Seus dados podem ser processados pelos seguintes prestadores de
            serviço, que atuam como operadores em nosso nome:
          </Typography>
          <Box component="ul" sx={{ color: "inherit" }}>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Cloudinary:</strong> armazenamento de fotos, vídeos e
                áudios enviados
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Neon (PostgreSQL):</strong> armazenamento do banco de
                dados da aplicação
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Resend:</strong> envio de emails transacionais
                (confirmação de cadastro, recuperação de senha)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Google:</strong> autenticação via login com Google,
                quando você optar por esse método
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Informações de perfil que você marcar como públicas (nome, foto,
            instrumentos, posts, etc.) ficam visíveis para outros usuários da
            plataforma e, no caso de perfis públicos, podem ser acessadas por
            qualquer visitante do site.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            4. Seus direitos
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Você pode, a qualquer momento:
          </Typography>
          <Box component="ul" sx={{ color: "inherit" }}>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Editar a maior parte dos dados do seu perfil diretamente na tela
                de Configurações
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Excluir sua conta e os dados associados (ver abaixo)
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Solicitar a correção de dados incorretos
              </Typography>
            </li>
          </Box>

          <Box
            sx={{
              mt: 3,
              mb: 2,
              p: 2.5,
              border: "1px solid #f4433666",
              backgroundColor: "#f4433614",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#ffffff", fontSize: 18 }}
            >
              Exclusão de conta
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5, color: "inherit" }}>
              Você mesmo pode excluir sua conta a qualquer momento, pelo app ou
              pelo site: <strong>Configurações → Excluir conta</strong>. A
              exclusão é imediata e definitiva e apaga seu perfil, suas mídias,
              posts, comentários, curtidas, seguidores, works, shows e conversas
              do chat.
            </Typography>
            <Typography variant="body1" sx={{ color: "inherit" }}>
              Passo a passo, o que é apagado e como pedir a exclusão sem acesso
              à conta:{" "}
              <Link
                component={RouterLink}
                to="/excluir-conta"
                sx={{ color: "#b39dff" }}
              >
                musicwork.com.br/excluir-conta
              </Link>
            </Typography>
          </Box>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            5. Retenção de dados
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Mantemos seus dados enquanto sua conta estiver ativa. Quando você
            exclui a conta, os dados associados são apagados imediatamente.
            Cópias de segurança automáticas dos nossos provedores de
            infraestrutura podem conter esses dados por até 30 dias, até serem
            descartadas automaticamente, e não são usadas para nenhuma outra
            finalidade.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            6. Segurança
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Adotamos medidas técnicas para proteger seus dados, incluindo
            criptografia de senhas e conexões seguras (HTTPS/SSL) entre o
            aplicativo e nossos servidores.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            7. Menores de idade
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            O MusicWork não é direcionado a menores de 13 anos. Se você tiver
            conhecimento de que um menor de 13 anos forneceu dados pessoais à
            plataforma, entre em contato conosco para que possamos remover essas
            informações.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            8. Alterações nesta política
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Podemos atualizar esta política periodicamente. Mudanças
            significativas serão comunicadas por email ou por aviso dentro do
            aplicativo.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            9. Contato
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Dúvidas sobre esta política ou sobre seus dados podem ser enviadas
            para <strong>contato@musicwork.com.br</strong> ou pelo chat de
            suporte disponível dentro do aplicativo.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
