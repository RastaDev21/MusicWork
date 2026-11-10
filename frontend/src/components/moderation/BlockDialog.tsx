import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { blockUser } from "../../services/api";

interface BlockDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  name: string;
  onBlocked: () => void;
}

export default function BlockDialog({
  open,
  onClose,
  userId,
  name,
  onBlocked,
}: BlockDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [blocking, setBlocking] = useState(false);

  async function handleBlock() {
    setBlocking(true);
    try {
      await blockUser(userId);
      enqueueSnackbar(`${name} foi bloqueado(a)`, { variant: "success" });
      onClose();
      onBlocked();
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      enqueueSnackbar(
        err.response?.data?.error || "Não foi possível bloquear",
        { variant: "error" },
      );
    } finally {
      setBlocking(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={blocking ? undefined : onClose}
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
      <DialogTitle sx={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>
        Bloquear {name}?
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#bbb", fontSize: 14, lineHeight: 1.6 }}>
          {name} não vai poder seguir você nem mandar mensagens, e vocês deixam
          de ver as publicações e os comentários um do outro. Se vocês se
          seguem, isso é desfeito.
        </Typography>
        <Typography sx={{ color: "#888", fontSize: 13, mt: 1.5 }}>
          A pessoa não é avisada. Você pode desbloquear quando quiser em
          Configurações.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={blocking} sx={{ color: "#aaa" }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleBlock}
          disabled={blocking}
          sx={{
            backgroundColor: "#ff4d6d",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#e63e5c" },
          }}
        >
          Bloquear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
