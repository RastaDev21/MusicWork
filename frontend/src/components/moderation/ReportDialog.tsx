import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { createReport, ReportTargetType } from "../../services/api";

// Mesmas chaves do REASON_LABEL do backend (ReportService)
export const REPORT_REASONS = [
  { value: "spam", label: "Spam ou golpe" },
  { value: "harassment", label: "Assédio ou bullying" },
  { value: "hate", label: "Discurso de ódio" },
  { value: "sexual", label: "Nudez ou conteúdo sexual" },
  { value: "violence", label: "Violência ou ameaça" },
  { value: "child_safety", label: "Risco a menores de idade" },
  { value: "fake", label: "Perfil falso" },
  { value: "other", label: "Outro motivo" },
];

const TITLES: Record<ReportTargetType, string> = {
  post: "Denunciar publicação",
  comment: "Denunciar comentário",
  user: "Denunciar perfil",
  work: "Denunciar anúncio",
  conversation: "Denunciar conversa",
};

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
}

export default function ReportDialog({
  open,
  onClose,
  targetType,
  targetId,
}: ReportDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setDetails("");
    }
  }, [open]);

  async function handleSend() {
    setSending(true);
    try {
      await createReport({ targetType, targetId, reason, details });
      enqueueSnackbar("Denúncia enviada. Obrigado por avisar!", {
        variant: "success",
      });
      onClose();
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      enqueueSnackbar(
        err.response?.data?.error || "Não foi possível enviar a denúncia",
        { variant: "error" },
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={sending ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#1a1a1a",
            backgroundImage: "none",
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle
        sx={{ color: "#fff", fontSize: 17, fontWeight: 700, pb: 0.5 }}
      >
        {TITLES[targetType]}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#999", fontSize: 13, mb: 1.5 }}>
          O que está acontecendo? A pessoa não fica sabendo quem denunciou.
        </Typography>
        <RadioGroup value={reason} onChange={e => setReason(e.target.value)}>
          {REPORT_REASONS.map(option => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  size="small"
                  sx={{ color: "#666", "&.Mui-checked": { color: "#7c4dff" } }}
                />
              }
              label={option.label}
              sx={{ color: "#ddd", "& .MuiTypography-root": { fontSize: 14 } }}
            />
          ))}
        </RadioGroup>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Quer contar mais alguma coisa? (opcional)"
          value={details}
          onChange={e => setDetails(e.target.value.slice(0, 500))}
          sx={{
            mt: 1.5,
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              fontSize: 14,
              "& fieldset": { borderColor: "#333" },
              "&:hover fieldset": { borderColor: "#7c4dff" },
              "&.Mui-focused fieldset": { borderColor: "#7c4dff" },
            },
          }}
        />
        {targetType === "conversation" && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.25,
              borderRadius: 2,
              backgroundColor: "#7c4dff14",
            }}
          >
            <Typography sx={{ color: "#b39dfa", fontSize: 12.5 }}>
              As últimas mensagens desta conversa vão junto para a equipe do
              MusicWork analisar.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={sending} sx={{ color: "#aaa" }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!reason || sending}
          sx={{
            backgroundColor: "#ff4d6d",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#e63e5c" },
            "&.Mui-disabled": { backgroundColor: "#ff4d6d55", color: "#fff9" },
          }}
        >
          Enviar denúncia
        </Button>
      </DialogActions>
    </Dialog>
  );
}
