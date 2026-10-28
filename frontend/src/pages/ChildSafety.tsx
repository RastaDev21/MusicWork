import { Container, Typography, Box } from "@mui/material";

// Página pública exigida pela Play Store para apps da categoria Social
// (Declaração de padrões de segurança infantil). Cores fixas, igual
// PrivacyPolicy: a rota fica fora do layout autenticado e não herda o tema.
export default function ChildSafety() {
  return (
    <Box sx={{ backgroundColor: "#0f0f0f", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md" sx={{ color: "#f0f0f0" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#ffffff" }}>
          Padrões de segurança infantil — MusicWork
        </Typography>
        <Typography variant="body2" sx={{ color: "#a0a0a0" }} gutterBottom>
          Última atualização: outubro de 2026
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            O MusicWork tem <strong>tolerância zero</strong> com abuso e
            exploração sexual infantil (CSAE). É proibido publicar, enviar,
            solicitar ou compartilhar, em qualquer parte do aplicativo (perfis,
            posts, comentários, anúncios, shows ou mensagens privadas):
          </Typography>
          <Box component="ul" sx={{ color: "inherit" }}>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Material de abuso sexual infantil (CSAM), incluindo imagens,
                vídeos, áudios, textos ou conteúdo gerado artificialmente
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Aliciamento de menores (grooming) ou qualquer contato com
                intenção sexual envolvendo crianças ou adolescentes
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Sextorsão, tráfico ou qualquer forma de exploração de menores
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Conteúdo que sexualize crianças ou adolescentes de qualquer
                forma
              </Typography>
            </li>
          </Box>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            Público do aplicativo
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            O MusicWork é destinado a pessoas com 18 anos ou mais. Contas de
            menores de idade identificadas são removidas.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            Como denunciar
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Se você encontrar qualquer conteúdo ou comportamento que viole estes
            padrões, denuncie:
          </Typography>
          <Box component="ul" sx={{ color: "inherit" }}>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Dentro do aplicativo:</strong> Configurações →{" "}
                <strong>Fale com o suporte</strong>. Informe o nome do perfil e
                o que aconteceu.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                <strong>Por email:</strong>{" "}
                <strong>humberto_21style@hotmail.com</strong>, com o assunto
                "Denúncia — segurança infantil".
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Você também pode denunciar diretamente às autoridades pela SaferNet
            Brasil (<strong>denuncie.org.br</strong>) ou pelo{" "}
            <strong>Disque 100</strong>.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            O que fazemos
          </Typography>
          <Box component="ul" sx={{ color: "inherit" }}>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Analisamos toda denúncia com prioridade
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Ao tomar conhecimento de CSAM ou de qualquer violação destes
                padrões, removemos o conteúdo e excluímos a conta responsável
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ color: "inherit" }}>
                Comunicamos os casos às autoridades competentes (Polícia
                Federal, SaferNet Brasil e, quando aplicável, ao NCMEC) e
                preservamos as informações exigidas por lei
              </Typography>
            </li>
          </Box>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            Conformidade com a lei
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            O MusicWork cumpre a legislação brasileira de proteção à criança e
            ao adolescente, incluindo o Estatuto da Criança e do Adolescente
            (Lei nº 8.069/1990) e o Marco Civil da Internet (Lei nº
            12.965/2014), e coopera com as autoridades sempre que solicitado.
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 4, color: "#ffffff" }}
          >
            Contato responsável
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Humberto Simões, responsável pelo MusicWork:{" "}
            <strong>humberto_21style@hotmail.com</strong>
          </Typography>

          <Box
            sx={{
              mt: 6,
              pt: 3,
              borderTop: "1px solid #2a2a2a",
              color: "#c8c8c8",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#ffffff", fontSize: 18 }}
            >
              Child Safety Standards (English)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5, color: "inherit" }}>
              MusicWork has zero tolerance for child sexual abuse and
              exploitation (CSAE). Child sexual abuse material (CSAM), grooming,
              sextortion, trafficking and any content that sexualizes minors are
              prohibited anywhere in the app. The app is intended for users aged
              18 and over.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5, color: "inherit" }}>
              Users can report violations inside the app (Settings → "Fale com o
              suporte", in-app support chat) or by email at
              humberto_21style@hotmail.com. When we obtain actual knowledge of
              CSAM or any violation, we remove the content, delete the
              responsible account and report it to the relevant authorities
              (Brazilian Federal Police, SaferNet Brasil and, where applicable,
              NCMEC), in compliance with applicable child safety laws.
            </Typography>
            <Typography variant="body2" sx={{ color: "inherit" }}>
              Child safety point of contact: Humberto Simões —
              humberto_21style@hotmail.com
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
