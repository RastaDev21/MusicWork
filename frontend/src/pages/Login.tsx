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
} from "@mui/material";
import Logo from "../components/Logo/Logo";

export default function Login() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email || !password) {
      setError("Preencha email e senha");
      return;
    }
    try {
      setError("");
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message);
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
            sx={{ ...inputSx, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{ ...inputSx, mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ backgroundColor: "#7c4dff", py: 1.5, fontWeight: "bold" }}
          >
            {loading ? "Entrando..." : "Entrar"}
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
