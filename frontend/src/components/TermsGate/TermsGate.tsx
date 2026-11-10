import {
  Box,
  Button,
  Dialog,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import GavelIcon from "@mui/icons-material/GavelOutlined";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/AuthContext";
import api, { acceptTerms } from "../../services/api";

const RULES = [
  "Respeite as pessoas: nada de assédio, ameaças ou discurso de ódio.",
  "Nada de nudez, conteúdo sexual ou violência.",
  "Tolerância zero com qualquer conteúdo que envolva abuso de menores.",
  "Sem spam, golpes ou perfis falsos.",
  "Publique só músicas, vídeos e fotos que você tem direito de usar.",
  "Você pode denunciar e bloquear quem desrespeitar essas regras.",
];

// Aceite dos termos de uso antes de usar o app (exigência do Play para
// conteúdo gerado por usuários): aparece para contas de antes dos termos e
// para contas novas pelo Google. Não dá para fechar sem aceitar; a outra
// saída é sair da conta.
export default function TermsGate() {
  const { user, updateUser, signOut } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const checked = useRef(false);

  // O usuário salvo no localStorage pode não ter o campo (login de antes dos
  // termos) ou estar desatualizado (aceitou em outro aparelho): confere no
  // servidor antes de abrir.
  useEffect(() => {
    if (!user || user.termsAcceptedAt || checked.current) return;
    checked.current = true;

    async function checkTerms() {
      try {
        const { data } = await api.get("/profile");
        if (data.termsAcceptedAt) {
          updateUser({ termsAcceptedAt: data.termsAcceptedAt });
          return;
        }
        setOpen(true);
      } catch {
        // silencioso: tenta de novo na próxima tela
        checked.current = false;
      }
    }
    checkTerms();
  }, [user, updateUser]);

  async function handleAccept() {
    setSaving(true);
    try {
      const acceptedAt = await acceptTerms();
      updateUser({ termsAcceptedAt: acceptedAt });
      setOpen(false);
    } catch {
      enqueueSnackbar("Não foi possível salvar. Tente de novo.", {
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      fullScreen={isMobile}
      maxWidth="xs"
      fullWidth
      // Sem onClose: nem Esc nem toque fora fecham
      aria-labelledby="terms-gate-title"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#0f0f0f",
            backgroundImage: "none",
            border: isMobile ? "none" : "1px solid #2a2a2a",
            borderRadius: isMobile ? 0 : 3,
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, pt: 5, pb: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "rgba(124, 77, 255, 0.14)",
            color: "#b39dfa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
          }}
        >
          <GavelIcon />
        </Box>
        <Typography
          id="terms-gate-title"
          sx={{ color: "#fff", fontWeight: 700, fontSize: 22, mb: 1 }}
        >
          Termos de uso
        </Typography>
        <Typography sx={{ color: "#aaa", fontSize: 14, lineHeight: 1.6 }}>
          Para continuar no MusicWork, leia e aceite os Termos de uso. Os
          principais pontos:
        </Typography>

        <Box component="ul" sx={{ pl: 2.5, my: 2 }}>
          {RULES.map(rule => (
            <Box component="li" key={rule} sx={{ color: "#7c4dff", mb: 1 }}>
              <Typography sx={{ color: "#ddd", fontSize: 14, lineHeight: 1.5 }}>
                {rule}
              </Typography>
            </Box>
          ))}
        </Box>

        <Link
          href="/termos"
          target="_blank"
          rel="noopener"
          sx={{ color: "#9c6fe4", fontSize: 14 }}
        >
          Ler os Termos de uso completos
        </Link>
      </Box>

      <Box
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          borderTop: "1px solid #2a2a2a",
        }}
      >
        <Button
          variant="contained"
          onClick={handleAccept}
          disabled={saving}
          sx={{
            height: 48,
            fontWeight: 700,
            backgroundColor: "#7c4dff",
            "&:hover": { backgroundColor: "#6c3fef" },
          }}
        >
          Li e aceito
        </Button>
        <Button
          onClick={signOut}
          disabled={saving}
          sx={{ color: "#999", textTransform: "none" }}
        >
          Sair da conta
        </Button>
      </Box>
    </Dialog>
  );
}
