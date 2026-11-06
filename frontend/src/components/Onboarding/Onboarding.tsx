import {
  Avatar,
  Box,
  Button,
  Dialog,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatOutlined";
import { ReactNode, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Logo from "../Logo/Logo";
import {
  dismissPushPrompt,
  enablePush,
  getPushStatus,
  PushStatus,
} from "../../services/push";

interface Slide {
  kind: "welcome" | "feature" | "notifications" | "credits";
  label?: string;
  icon?: ReactNode;
  title: string;
  text: string;
  chips?: string[];
}

const SLIDES: Slide[] = [
  {
    kind: "welcome",
    title: "Bem-vindo ao MusicWork",
    text: "A rede dos músicos. Em poucos passos, veja o que dá para fazer por aqui.",
  },
  {
    kind: "feature",
    label: "PERFIL",
    icon: <PersonIcon sx={{ fontSize: 52 }} />,
    title: "Comece pelo seu perfil",
    text: "Coloque sua foto, seus instrumentos e gêneros, a música do seu perfil e suas redes sociais. É assim que os outros músicos vão te encontrar.",
    chips: ["Foto", "Instrumentos", "Música do perfil", "Redes sociais"],
  },
  {
    kind: "feature",
    label: "BUSCAR E WORK",
    icon: <SearchIcon sx={{ fontSize: 52 }} />,
    title: "Encontre músicos e trabalhos",
    text: "Busque por instrumento, gênero, cidade e país, inclusive professores. No Work, anuncie ou encontre shows, aulas, gravações e mais, com contato direto.",
    chips: ["Professores", "Shows", "Aulas", "Gravações"],
  },
  {
    kind: "feature",
    label: "FEED E AGENDA",
    icon: <HomeIcon sx={{ fontSize: 52 }} />,
    title: "Publique e divulgue seus shows",
    text: "Poste textos, fotos, vídeos e links do YouTube no Feed. Na Agenda, cadastre seus shows com data, local e flyer.",
    chips: ["Foto", "Vídeo", "YouTube", "Shows"],
  },
  {
    kind: "notifications",
    label: "MENSAGENS",
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 52 }} />,
    title: "Converse e fique por dentro",
    text: "Mande mensagens pelo chat e receba um aviso no celular quando alguém te seguir, curtir, comentar ou mandar mensagem.",
  },
  {
    kind: "credits",
    label: "CONSIDERAÇÕES FINAIS",
    title: "Obrigado por fazer parte!",
    text: "Uma plataforma para músicos se conectarem, compartilharem seu trabalho e trocarem serviços musicais.",
  },
];

const AUTHORS = [
  { name: "Humberto Simoes", color: "#7c4dff" },
  { name: "Fábio duBaixo", color: "#ff4d6d" },
];

const PUSH_MESSAGE: Record<Exclude<PushStatus, "disabled">, string> = {
  enabled: "✓ Notificações ativadas neste aparelho",
  denied:
    "As notificações estão bloqueadas neste aparelho. Para receber, libere nas configurações do celular.",
  unsupported:
    "Este navegador não recebe notificações. No iPhone, adicione o MusicWork à Tela de Início.",
};

interface OnboardingProps {
  open: boolean;
  onClose: () => void;
  // "Sobre o MusicWork" em Configurações abre direto nos créditos
  startAtCredits?: boolean;
}

export default function Onboarding({
  open,
  onClose,
  startAtCredits = false,
}: OnboardingProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(0);
  const [pushStatus, setPushStatus] = useState<PushStatus | null>(null);
  const [enablingPush, setEnablingPush] = useState(false);

  const last = SLIDES.length - 1;
  const slide = SLIDES[step];

  useEffect(() => {
    if (open) setStep(startAtCredits ? last : 0);
  }, [open, startAtCredits, last]);

  // Chegou na tela de notificações: o convite já foi feito aqui, então o
  // banner do Feed não precisa aparecer depois
  useEffect(() => {
    if (open && slide.kind === "notifications") {
      dismissPushPrompt();
      getPushStatus().then(setPushStatus);
    }
  }, [open, slide.kind]);

  async function handleEnablePush() {
    setEnablingPush(true);
    try {
      const status = await enablePush();
      setPushStatus(status);
      if (status === "enabled") {
        enqueueSnackbar("Notificações ativadas!", { variant: "success" });
      }
    } catch {
      enqueueSnackbar("Não foi possível ativar as notificações", {
        variant: "error",
      });
    } finally {
      setEnablingPush(false);
    }
  }

  function handleNext() {
    if (step === last) onClose();
    else setStep(step + 1);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      aria-labelledby="onboarding-title"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#0f0f0f",
            backgroundImage: "none",
            border: isMobile ? "none" : "1px solid #2a2a2a",
            borderRadius: isMobile ? 0 : 3,
            height: isMobile ? "100%" : "min(760px, 90vh)",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Box
        sx={{
          height: 60,
          flexShrink: 0,
          pl: 3,
          pr: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #1f1f1f",
        }}
      >
        <Typography sx={{ color: "#999", fontSize: 13 }}>
          {step + 1} de {SLIDES.length}
        </Typography>
        {step < last && (
          <Button
            onClick={onClose}
            sx={{ color: "#aaa", textTransform: "none", fontSize: 14 }}
          >
            Pular
          </Button>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 3.5,
          py: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2.25,
          textAlign: "center",
        }}
      >
        {slide.kind === "welcome" && <Logo width={260} />}

        {slide.icon && (
          <Box
            sx={{
              width: 112,
              height: 112,
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: "rgba(124, 77, 255, 0.14)",
              border: "1px solid rgba(124, 77, 255, 0.4)",
              color: "#9c6fe4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {slide.icon}
          </Box>
        )}

        {slide.label && (
          <Typography
            sx={{
              color: "#9c6fe4",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {slide.label}
          </Typography>
        )}

        <Typography
          id="onboarding-title"
          component="h2"
          sx={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.25,
          }}
        >
          {slide.title}
        </Typography>
        <Typography
          sx={{ color: "#aaa", fontSize: 15, lineHeight: 1.6, maxWidth: 320 }}
        >
          {slide.text}
        </Typography>

        {slide.chips && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
              maxWidth: 320,
            }}
          >
            {slide.chips.map(chip => (
              <Typography
                key={chip}
                component="span"
                sx={{
                  height: 28,
                  px: 1.5,
                  borderRadius: "14px",
                  backgroundColor: "rgba(124, 77, 255, 0.16)",
                  color: "#b39dfa",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {chip}
              </Typography>
            ))}
          </Box>
        )}

        {slide.kind === "notifications" &&
          (pushStatus === "disabled" ? (
            <Button
              variant="outlined"
              onClick={handleEnablePush}
              disabled={enablingPush}
              sx={{
                mt: 1,
                color: "#b39dfa",
                borderColor: "#7c4dff88",
                "&:hover": {
                  borderColor: "#7c4dff",
                  backgroundColor: "#7c4dff11",
                },
              }}
            >
              {enablingPush ? "Ativando..." : "Ativar notificações"}
            </Button>
          ) : (
            pushStatus && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: 13,
                  lineHeight: 1.5,
                  maxWidth: 320,
                  color: pushStatus === "enabled" ? "#4caf50" : "#999",
                }}
              >
                {PUSH_MESSAGE[pushStatus]}
              </Typography>
            )
          ))}

        {slide.kind === "credits" && (
          <>
            <Box
              sx={{
                width: "100%",
                mt: 0.75,
                p: 2,
                borderRadius: 4,
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                display: "flex",
                flexDirection: "column",
                gap: 1.75,
                textAlign: "left",
              }}
            >
              <Typography sx={{ color: "#999", fontSize: 12 }}>
                Desenvolvido por
              </Typography>
              {AUTHORS.map(author => (
                <Box
                  key={author.name}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: author.color,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {author.name.charAt(0)}
                  </Avatar>
                  <Typography
                    sx={{ color: "#fff", fontSize: 16, fontWeight: 700 }}
                  >
                    {author.name}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography sx={{ color: "#999", fontSize: 13, lineHeight: 1.5 }}>
              Dúvidas ou sugestões? Fale com o suporte em Configurações.
            </Typography>
          </>
        )}
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          px: 3,
          pt: 1,
          pb: 3.5,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          {SLIDES.map((item, index) => (
            <Box
              key={item.title}
              sx={{
                width: index === step ? 22 : 8,
                height: 8,
                borderRadius: "4px",
                backgroundColor: index === step ? "#7c4dff" : "#3a3a3a",
                transition: "width 0.2s",
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {step > 0 && (
            <Button
              variant="outlined"
              onClick={() => setStep(step - 1)}
              sx={{
                flex: 1,
                height: 48,
                color: "#ddd",
                borderColor: "#3a3a3a",
                "&:hover": {
                  borderColor: "#666",
                  backgroundColor: "#ffffff08",
                },
              }}
            >
              Voltar
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              flex: 2,
              height: 48,
              fontWeight: 700,
              backgroundColor: "#7c4dff",
              "&:hover": { backgroundColor: "#6c3fef" },
            }}
          >
            {step === last ? "Começar" : "Próximo"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
