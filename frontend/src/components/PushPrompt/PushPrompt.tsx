import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/AuthContext";
import {
  dismissPushPrompt,
  enablePush,
  isPushPromptDismissed,
  isPushSupported,
} from "../../services/push";

// Convite para ativar as notificações no aparelho. Some de vez quando o
// usuário permite, bloqueia, toca em "Agora não" ou passa pela tela de
// notificações do tour; depois disso, só por Configurações.
function shouldShow() {
  return (
    isPushSupported() &&
    Notification.permission === "default" &&
    !isPushPromptDismissed()
  );
}

export default function PushPrompt() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(shouldShow);
  const [enabling, setEnabling] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  function handleDismiss() {
    dismissPushPrompt();
    setVisible(false);
  }

  async function handleEnable() {
    setEnabling(true);
    try {
      const status = await enablePush();
      if (status === "enabled") {
        enqueueSnackbar("Notificações ativadas!", { variant: "success" });
      }
      setVisible(false);
    } catch {
      enqueueSnackbar("Não foi possível ativar as notificações", {
        variant: "error",
      });
      setEnabling(false);
    }
  }

  // Quem ainda não viu o tour vai receber o convite lá dentro. A checagem do
  // "dispensado" roda de novo aqui porque o tour pode ter dispensado o banner
  // depois de ele montar (re-renderiza quando o tour fecha e marca a conta).
  if (!visible || !user?.onboardingSeenAt || isPushPromptDismissed()) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        borderRadius: 3,
        border: "1px solid #7c4dff44",
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Typography
          sx={{ color: "#fff", fontWeight: 600, fontSize: 15, mb: 0.5 }}
        >
          🔔 Ative as notificações
        </Typography>
        <Typography sx={{ color: "#888", fontSize: 13 }}>
          Saiba na hora quando alguém te seguir, interagir com seus posts ou
          mandar mensagem.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
        <Button
          onClick={handleDismiss}
          disabled={enabling}
          sx={{ color: "#aaa", textTransform: "none" }}
        >
          Agora não
        </Button>
        <Button
          variant="contained"
          onClick={handleEnable}
          disabled={enabling}
          sx={{
            backgroundColor: "#7c4dff",
            whiteSpace: "nowrap",
            "&:hover": { backgroundColor: "#6c3fef" },
          }}
        >
          {enabling ? "Ativando..." : "Ativar"}
        </Button>
      </Box>
    </Box>
  );
}
