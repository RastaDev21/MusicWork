import { useState } from "react";
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
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { signUp, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instrument, setInstrument] = useState("");
  const [secondaryProfession, setSecondaryProfession] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name || !email || !password) {
      setError("Nome, email e senha são obrigatórios");
      return;
    }

    try {
      setError("");
      await signUp({
        name,
        email,
        password,
        instrument,
        secondaryProfession,
        city,
      });
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
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
      <Container maxWidth="sm">
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
            label="Nome"
            variant="outlined"
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ ...inputSx, mb: 2 }}
          />

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
            sx={{ ...inputSx, mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Instrumento"
              variant="outlined"
              value={instrument}
              onChange={e => setInstrument(e.target.value)}
              sx={inputSx}
            />
            <TextField
              fullWidth
              label="Cidade"
              variant="outlined"
              value={city}
              onChange={e => setCity(e.target.value)}
              sx={inputSx}
            />
          </Box>

          <TextField
            fullWidth
            label="Profissão secundária"
            variant="outlined"
            value={secondaryProfession}
            onChange={e => setSecondaryProfession(e.target.value)}
            sx={{ ...inputSx, mb: 3 }}
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
            }}
          >
            {loading ? "Criando conta..." : "Cadastrar"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link href="/" sx={{ color: "#7c4dff", fontSize: 14 }}>
              Já tem conta? Entrar
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
