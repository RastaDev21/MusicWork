import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Paper,
  Link,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../components/Logo/Logo";
import { useAuth } from "../contexts/AuthContext";

const instruments = [
  "Guitarra",
  "Baixo",
  "Bateria",
  "Teclado",
  "Violão",
  "Voz",
  "Saxofone",
  "Trompete",
  "Violino",
  "Percussão",
  "DJ",
  "Produtor Musical",
  "Outro",
];

const professions = [
  "Designer",
  "Fotógrafo",
  "Editor de vídeo",
  "Desenvolvedor",
  "Marketing",
  "Professor",
  "Técnico de som",
  "Eletricista",
  "Barbeiro",
  "Tatuador",
  "Outro",
];

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

const selectSx = {
  color: "#fff",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7c4dff" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7c4dff" },
  "& .MuiSvgIcon-root": { color: "#aaa" },
};

const menuSx = {
  "& .MuiPaper-root": {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
  },
};

const menuItemSx = {
  color: "#fff",
  "&:hover": { backgroundColor: "#7c4dff22" },
  "&.Mui-selected": { backgroundColor: "#7c4dff33" },
};

export default function Register() {
  const { signUp, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instrument, setInstrument] = useState("");
  const [secondaryProfession, setSecondaryProfession] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit() {
    if (!name || !email || !password) {
      setError("Nome, email e senha são obrigatórios");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Digite um email válido");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
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
            disabled={loading}
            sx={{ ...inputSx, mb: 2 }}
          />

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

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel
                sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
              >
                Instrumento
              </InputLabel>
              <Select
                value={instrument}
                label="Instrumento"
                onChange={e => setInstrument(e.target.value)}
                sx={selectSx}
                MenuProps={{ sx: menuSx }}
              >
                {instruments.map(i => (
                  <MenuItem key={i} value={i} sx={menuItemSx}>
                    {i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Cidade - Estado"
              variant="outlined"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Ex: Santos - SP"
              disabled={loading}
              sx={inputSx}
            />
          </Box>

          <FormControl fullWidth disabled={loading} sx={{ mb: 3 }}>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Profissão secundária
            </InputLabel>
            <Select
              value={secondaryProfession}
              label="Profissão secundária"
              onChange={e => setSecondaryProfession(e.target.value)}
              sx={selectSx}
              MenuProps={{ sx: menuSx }}
            >
              {professions.map(p => (
                <MenuItem key={p} value={p} sx={menuItemSx}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
              "Cadastrar"
            )}
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
