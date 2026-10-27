import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import api, {
  changePassword,
  startSupportConversation,
  resendVerification,
  deleteAccount,
} from "../services/api";
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
  const { user, updateUser, signOut } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [openingSupport, setOpeningSupport] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Busca o perfil de novo ao entrar na tela — o usuário em localStorage
  // fica desatualizado depois de ações feitas fora dessa aba (ex: confirmar
  // email pelo link, que abre em outra guia).
  useEffect(() => {
    async function loadFreshProfile() {
      try {
        const response = await api.get("/profile");
        updateUser(response.data);
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
      }
    }
    loadFreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getErrorMessage(error: unknown, fallback: string) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { data?: { error?: string } } };
      if (err.response?.data?.error) return err.response.data.error;
    }
    return fallback;
  }

  async function handleResendVerification() {
    setResendingVerification(true);
    try {
      await resendVerification();
      enqueueSnackbar("Email de confirmação reenviado!", {
        variant: "success",
      });
    } catch (error: unknown) {
      enqueueSnackbar(
        getErrorMessage(error, "Erro ao reenviar email de confirmação"),
        { variant: "error" },
      );
    } finally {
      setResendingVerification(false);
    }
  }

  async function handleOpenSupport() {
    setOpeningSupport(true);
    try {
      const conversation = await startSupportConversation();
      navigate(`/mensagens/${conversation.id}`);
    } catch (error: unknown) {
      enqueueSnackbar(
        getErrorMessage(error, "Erro ao abrir o chat de suporte"),
        { variant: "error" },
      );
    } finally {
      setOpeningSupport(false);
    }
  }

  function handleCloseDeleteDialog() {
    if (deletingAccount) return;
    setDeleteDialogOpen(false);
    setDeleteConfirmText("");
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText.trim() !== "EXCLUIR") return;

    setDeletingAccount(true);
    try {
      await deleteAccount("EXCLUIR");
      enqueueSnackbar("Sua conta foi excluída", { variant: "success" });
      signOut();
    } catch (error: unknown) {
      enqueueSnackbar(getErrorMessage(error, "Erro ao excluir a conta"), {
        variant: "error",
      });
      setDeletingAccount(false);
    }
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
      <Box sx={{ maxWidth: 600, mx: "auto", pt: 2, px: 2 }}>
        <Typography
          sx={{ color: "#fff", fontWeight: 700, fontSize: 20, mb: 2 }}
        >
          Configurações da conta
        </Typography>

        {/* Email (somente leitura) */}
        <Box
          sx={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 3,
            p: 2,
            mb: 2,
          }}
        >
          <Typography
            sx={{ color: "#fff", fontWeight: 600, fontSize: 15, mb: 0.5 }}
          >
            Email
          </Typography>
          <Typography sx={{ color: "#999", fontSize: 14 }}>
            {user?.email}
          </Typography>

          {user?.isEmailVerified ? (
            <Typography
              sx={{
                color: "#4caf50",
                fontSize: 12,
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              ✓ Email confirmado
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 0.5,
                flexWrap: "wrap",
              }}
            >
              <Typography sx={{ color: "#ff9800", fontSize: 12 }}>
                ⚠ Email ainda não confirmado
              </Typography>
              <Button
                size="small"
                onClick={handleResendVerification}
                disabled={resendingVerification}
                sx={{
                  color: "#7c4dff",
                  fontSize: 12,
                  minWidth: 0,
                  p: 0,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                {resendingVerification ? "Enviando..." : "Reenviar confirmação"}
              </Button>
            </Box>
          )}

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
            p: 2,
          }}
        >
          <Typography
            sx={{ color: "#fff", fontWeight: 600, fontSize: 15, mb: 1.5 }}
          >
            Alterar senha
          </Typography>

          <TextField
            fullWidth
            size="small"
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
            sx={{ ...inputSx, mb: 1.2 }}
          />

          <TextField
            fullWidth
            size="small"
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
            sx={{ ...inputSx, mb: 1.2 }}
          />

          <TextField
            fullWidth
            size="small"
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
            sx={{ ...inputSx, mb: 1.2 }}
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

        {/* Fale com o suporte */}
        <Box
          sx={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #4caf5044",
            borderRadius: 3,
            p: 2,
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              🎧 Fale com o suporte
            </Typography>
            <Typography sx={{ color: "#666", fontSize: 13 }}>
              Dúvidas, problemas técnicos ou sugestões — respondemos por aqui
              mesmo, direto no chat.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleOpenSupport}
            disabled={openingSupport}
            sx={{
              color: "#4caf50",
              borderColor: "#4caf5088",
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "#4caf50",
                backgroundColor: "#4caf5011",
              },
            }}
          >
            {openingSupport ? "Abrindo..." : "Abrir chat"}
          </Button>
        </Box>

        {/* Excluir conta */}
        <Box
          sx={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #f4433644",
            borderRadius: 3,
            p: 2,
            mt: 2,
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              sx={{ color: "#fff", fontWeight: 600, fontSize: 15, mb: 0.5 }}
            >
              Excluir minha conta
            </Typography>
            <Typography sx={{ color: "#666", fontSize: 13 }}>
              Apaga sua conta e todos os seus dados de forma definitiva.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              color: "#f44336",
              borderColor: "#f4433688",
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "#f44336",
                backgroundColor: "#f4433611",
              },
            }}
          >
            Excluir conta
          </Button>
        </Box>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { backgroundColor: "#1a1a1a", borderRadius: 3 } },
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #2a2a2a" }}>
          Excluir minha conta
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ color: "#f44336", fontWeight: 600, mt: 2, mb: 1 }}>
            Esta ação é definitiva e não pode ser desfeita.
          </Typography>
          <Typography sx={{ color: "#ccc", fontSize: 14, mb: 1 }}>
            Serão apagados:
          </Typography>
          <Box
            component="ul"
            sx={{ color: "#aaa", fontSize: 14, mt: 0, mb: 2, pl: 3 }}
          >
            <li>Seu perfil, fotos de perfil e capa e o áudio do perfil</li>
            <li>Seus posts, comentários e curtidas</li>
            <li>Seus seguidores e quem você segue</li>
            <li>Seus works e shows da Agenda</li>
            <li>
              Suas conversas do chat, inteiras — elas somem também para a outra
              pessoa
            </li>
          </Box>
          <TextField
            fullWidth
            size="small"
            label="Digite EXCLUIR para confirmar"
            value={deleteConfirmText}
            onChange={e => setDeleteConfirmText(e.target.value)}
            disabled={deletingAccount}
            autoComplete="off"
            sx={inputSx}
          />
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #2a2a2a", p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deletingAccount}
            sx={{ color: "#aaa", "&:hover": { color: "#fff" } }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteAccount}
            disabled={deletingAccount || deleteConfirmText.trim() !== "EXCLUIR"}
            sx={{
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            {deletingAccount ? "Excluindo..." : "Excluir definitivamente"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
