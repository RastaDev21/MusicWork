import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import { changePassword } from "../services/api";
import { useSnackbar } from "notistack";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#7c4dff" },
    "&.Mui-focused fieldset": { borderColor: "#7c4dff" },
  },
  "& .MuiInputLabel-root": { color: "#aaa" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#7c4dff" },
};

export default function Settings() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function getErrorMessage(error: unknown, fallback: string) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { data?: { error?: string } } };
      if (err.response?.data?.error) return err.response.data.error;
    }
    return fallback;
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      enqueueSnackbar("Preencha todos os campos de senha", {
        variant: "warning",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      enqueueSnackbar("A nova senha e a confirmação não coincidem", {
        variant: "warning",
      });
      return;
    }

    if (newPassword.length < 6) {
      enqueueSnackbar("A nova senha deve ter no mínimo 6 caracteres", {
        variant: "warning",
      });
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      enqueueSnackbar("Senha atualizada com sucesso!", { variant: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: unknown) {
      enqueueSnackbar(getErrorMessage(error, "Erro ao atualizar senha"), {
        variant: "error",
      });
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Typography
          sx={{ color: "#fff", fontWeight: 700, fontSize: 22, mb: 3 }}
        >
          Configurações da conta
        </Typography>

        {/* Email (somente leitura) */}
        <Box
          sx={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 3,
            p: 3,
            mb: 3,
          }}
        >
          <Typography
            sx={{ color: "#fff", fontWeight: 600, fontSize: 16, mb: 0.5 }}
          >
            Email
          </Typography>
          <Typography sx={{ color: "#999", fontSize: 14 }}>
            {user?.email}
          </Typography>
          <Typography sx={{ color: "#555", fontSize: 12, mt: 1 }}>
            A troca de email ainda não está disponível nesta versão.
          </Typography>
        </Box>

        {/* Trocar senha */}
        <Box
          sx={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography
            sx={{ color: "#fff", fontWeight: 600, fontSize: 16, mb: 2 }}
          >
            Alterar senha
          </Typography>

          <TextField
            fullWidth
            type={showCurrentPassword ? "text" : "password"}
            label="Senha atual"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            disabled={savingPassword}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      edge="end"
                      sx={{ color: "#888" }}
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ ...inputSx, mb: 2 }}
          />

          <TextField
            fullWidth
            type={showNewPassword ? "text" : "password"}
            label="Nova senha"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={savingPassword}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      sx={{ color: "#888" }}
                      tabIndex={-1}
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ ...inputSx, mb: 2 }}
          />

          <TextField
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            label="Confirmar nova senha"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            disabled={savingPassword}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      sx={{ color: "#888" }}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ ...inputSx, mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={savingPassword}
            sx={{
              backgroundColor: "#7c4dff",
              "&:hover": { backgroundColor: "#6c3fef" },
            }}
          >
            {savingPassword ? "Salvando..." : "Salvar nova senha"}
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}
