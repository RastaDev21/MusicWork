import { Container, Typography, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ReactNode } from "react";

// Termos de uso, separados da política de privacidade (exigência da política
// de conteúdo gerado por usuários do Play). Rota pública com cores fixas,
// igual PrivacyPolicy.

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography variant="h6" gutterBottom sx={{ mt: 4, color: "#ffffff" }}>
      {children}
    </Typography>
  );
}

function Item({ children }: { children: ReactNode }) {
  return (
    <li>
      <Typography variant="body1" sx={{ color: "inherit", mb: 0.5 }}>
        {children}
      </Typography>
    </li>
  );
}

const linkSx = { color: "#b39dff" };

export default function TermsOfUse() {
  return (
    <Box sx={{ backgroundColor: "#0f0f0f", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md" sx={{ color: "#f0f0f0" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#ffffff" }}>
          Termos de uso — MusicWork
        </Typography>
        <Typography variant="body2" sx={{ color: "#a0a0a0" }} gutterBottom>
          Última atualização: novembro de 2026
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            O MusicWork é uma rede social para músicos. Ao criar uma conta ou
            usar o aplicativo, você concorda com estes termos. A forma como
            tratamos seus dados está na{" "}
            <Link component={RouterLink} to="/privacidade" sx={linkSx}>
              Política de privacidade
            </Link>
            , que é um documento separado.
          </Typography>

          <SectionTitle>1. Quem pode usar</SectionTitle>
          <Box component="ul" sx={{ color: "inherit" }}>
            <Item>O MusicWork é destinado a pessoas com 18 anos ou mais.</Item>
            <Item>
              Use informações verdadeiras e uma conta por pessoa. Você é
              responsável pelo que acontece na sua conta e por manter sua senha
              em segredo.
            </Item>
          </Box>

          <SectionTitle>2. O que é proibido</SectionTitle>
          <Typography variant="body1" sx={{ mb: 1, color: "inherit" }}>
            Em qualquer parte do aplicativo (perfil, publicações, comentários,
            anúncios do Work, shows e mensagens), é proibido publicar, enviar ou
            compartilhar:
          </Typography>
          <Box component="ul" sx={{ color: "inherit" }}>
            <Item>
              <strong>Abuso ou exploração sexual infantil</strong>, ou qualquer
              conteúdo que sexualize crianças ou adolescentes. Tolerância zero:
              veja os{" "}
              <Link component={RouterLink} to="/seguranca-infantil" sx={linkSx}>
                Padrões de segurança infantil
              </Link>
              .
            </Item>
            <Item>Nudez, pornografia ou conteúdo sexual explícito.</Item>
            <Item>
              Assédio, bullying, ameaças, intimidação ou exposição de alguém
              para humilhar.
            </Item>
            <Item>
              Discurso de ódio ou discriminação por raça, cor, etnia, religião,
              origem, gênero, orientação sexual, deficiência ou qualquer outra
              característica.
            </Item>
            <Item>
              Violência explícita ou incentivo à violência, ao terrorismo ou à
              automutilação.
            </Item>
            <Item>
              Spam, golpes, fraudes e anúncios enganosos no Work, como cobrar
              por um serviço que você não pretende prestar.
            </Item>
            <Item>
              Perfis falsos ou se passar por outra pessoa, banda ou empresa.
            </Item>
            <Item>
              Conteúdo ilegal, incluindo venda de drogas, armas ou produtos
              proibidos.
            </Item>
            <Item>
              Músicas, vídeos ou fotos de outras pessoas sem autorização:
              publique só o que é seu ou o que você tem direito de usar.
            </Item>
            <Item>
              Dados pessoais de outras pessoas sem autorização, como telefone,
              endereço ou documentos.
            </Item>
          </Box>

          <SectionTitle>3. Seu conteúdo</SectionTitle>
          <Box component="ul" sx={{ color: "inherit" }}>
            <Item>
              O que você publica continua sendo seu. Ao publicar, você autoriza
              o MusicWork a exibir esse conteúdo para os outros usuários dentro
              do aplicativo, enquanto ele estiver publicado.
            </Item>
            <Item>
              Você é responsável pelo que publica e pelos combinados que fizer
              com outros usuários, inclusive pelo Work. O MusicWork não
              participa das negociações nem garante pagamentos ou serviços
              combinados entre usuários.
            </Item>
          </Box>

          <SectionTitle>4. Denúncias e bloqueios</SectionTitle>
          <Box component="ul" sx={{ color: "inherit" }}>
            <Item>
              <strong>Denunciar:</strong> pelo menu <strong>⋮</strong> de
              publicações, perfis, anúncios do Work e conversas, e pelo link
              "Denunciar" dos comentários. Também dá para falar com a gente pelo
              chat "Fale com o suporte", em Configurações.
            </Item>
            <Item>
              <strong>Bloquear:</strong> pelo menu <strong>⋮</strong> do perfil
              ou da conversa. Quem foi bloqueado não pode seguir você nem mandar
              mensagens, e vocês deixam de ver as publicações e os comentários
              um do outro. A pessoa não é avisada. Você pode desbloquear em
              Configurações.
            </Item>
            <Item>
              Analisamos as denúncias o quanto antes, com prioridade para as que
              envolvem menores de idade.
            </Item>
          </Box>

          <SectionTitle>5. Quando as regras são violadas</SectionTitle>
          <Box component="ul" sx={{ color: "inherit" }}>
            <Item>Podemos remover o conteúdo, sem aviso prévio.</Item>
            <Item>Podemos excluir a conta, em casos graves ou repetidos.</Item>
            <Item>
              Crimes, especialmente os que envolvem crianças e adolescentes, são
              comunicados às autoridades competentes.
            </Item>
          </Box>

          <SectionTitle>6. Exclusão da conta</SectionTitle>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Você pode excluir sua conta quando quiser, em Configurações. Veja o
            que é apagado em{" "}
            <Link component={RouterLink} to="/excluir-conta" sx={linkSx}>
              musicwork.com.br/excluir-conta
            </Link>
            .
          </Typography>

          <SectionTitle>7. Mudanças nestes termos</SectionTitle>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Podemos atualizar estes termos. Mudanças importantes serão avisadas
            dentro do aplicativo. Estes termos seguem as leis do Brasil.
          </Typography>

          <SectionTitle>8. Contato</SectionTitle>
          <Typography variant="body1" sx={{ mb: 2, color: "inherit" }}>
            Dúvidas sobre estes termos podem ser enviadas para{" "}
            <strong>humberto_21style@hotmail.com</strong> ou pelo chat de
            suporte dentro do aplicativo.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
