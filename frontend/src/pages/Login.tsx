import { useState } from "react";
import { Box, Button, Container, TextField, Paper, Link } from "@mui/material";
import Logo from "../components/Logo/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    console.log({ email, password });
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
      <Container maxWidth="xs">
        <Paper
          elevation={4}
          sx={{ padding: 4, backgroundColor: "#1a1a1a", borderRadius: 3 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Logo />
          </Box>

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#7c4dff" },
                "&.Mui-focused fieldset": { borderColor: "#7c4dff" },
              },
              "& .MuiInputLabel-root": { color: "#aaa" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#7c4dff" },
            }}
          />

          <TextField
            fullWidth
            label="Senha"
            type="password"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#7c4dff" },
                "&.Mui-focused fieldset": { borderColor: "#7c4dff" },
              },
              "& .MuiInputLabel-root": { color: "#aaa" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#7c4dff" },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ backgroundColor: "#7c4dff", py: 1.5, fontWeight: "bold" }}
          >
            Entrar
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
