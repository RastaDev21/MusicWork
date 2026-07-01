import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Paper,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../components/Logo/Logo";
import { resetPassword } from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!token) {
      setError("Link inválido ou expirado");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Preencha os dois campos");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    try {
      setError("");
      setLoading(true);
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={4}
          sx={{ padding: 4, backgroundColor: "#1a1a1a", borderRadius: 3 }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Logo />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success ? (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                Senha atualizada com sucesso! Faça login com sua nova senha.
              </Alert>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/")}
                sx={{
                  backgroundColor: "#7c4dff",
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#6a3de8" },
                }}
              >
                Ir para o login
              </Button>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Nova senha"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#888" }}
                          tabIndex={-1}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ ...inputSx, mb: 2 }}
              />

              <TextField
                fullWidth
                label="Confirmar nova senha"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                disabled={loading}
                sx={{ ...inputSx, mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  backgroundColor: "#7c4dff",
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#6a3de8" },
                  "&.Mui-disabled": {
                    backgroundColor: "#7c4dff",
                    opacity: 0.7,
                    color: "#fff",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Redefinir senha"
                )}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link href="/" sx={{ color: "#7c4dff", fontSize: 14 }}>
                  Voltar ao login
                </Link>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
