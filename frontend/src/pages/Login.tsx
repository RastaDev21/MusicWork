import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
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

export default function Login() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit() {
    if (!email || !password) {
      setError("Preencha email e senha");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Digite um email válido");
      return;
    }
    try {
      setError("");
      await signIn(email, password);
    } catch (err) {
      setError((err as Error).message);
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

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            sx={{ ...inputSx, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Senha"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
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
            sx={{ ...inputSx, mb: 1 }}
          />

          <Box sx={{ textAlign: "right", mb: 2 }}>
            <Link
              href="#"
              sx={{ color: "#888", fontSize: 13 }}
              onClick={e => {
                e.preventDefault();
                setError("Recuperação de senha em breve 🙂");
              }}
            >
              Esqueci minha senha
            </Link>
          </Box>

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
              "Entrar"
            )}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link href="/register" sx={{ color: "#7c4dff", fontSize: 14 }}>
              Não tem conta? Cadastre-se
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
