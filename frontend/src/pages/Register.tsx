import { useState } from "react";
import { Box, Button, Container, TextField, Paper, Link } from "@mui/material";
import Logo from "../components/Logo/Logo";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instrument, setInstrument] = useState("");
  const [secondaryProfession, setSecondaryProfession] = useState("");
  const [city, setCity] = useState("");

  function handleSubmit() {
    console.log({
      name,
      email,
      password,
      instrument,
      secondaryProfession,
      city,
    });
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
            sx={{ backgroundColor: "#7c4dff", py: 1.5, fontWeight: "bold" }}
          >
            Cadastrar
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
