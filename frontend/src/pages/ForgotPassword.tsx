import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Paper,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import Logo from "../components/Logo/Logo";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit() {
    if (!email) {
      setError("Digite seu email");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Digite um email válido");
      return;
    }
    try {
      setError("");
      setLoading(true);
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || "Erro ao enviar email");
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
                Se este email estiver cadastrado, você receberá as instruções em
                instantes. Confira também a caixa de spam.
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
                Voltar ao login
              </Button>
            </>
          ) : (
            <>
              <Box sx={{ color: "#aaa", fontSize: 14, mb: 2 }}>
                Digite seu email cadastrado para receber o link de recuperação
                de senha.
              </Box>

              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                  "Enviar link de recuperação"
                )}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link
                  component={RouterLink}
                  to="/"
                  sx={{ color: "#7c4dff", fontSize: 14 }}
                >
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
