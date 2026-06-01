import { Box, Typography, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export default function Feed() {
  const { user, signOut } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f0f0f", padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
          Olá, {user?.name}! 👋
        </Typography>
        <Button
          variant="outlined"
          onClick={signOut}
          sx={{ color: "#7c4dff", borderColor: "#7c4dff" }}
        >
          Sair
        </Button>
      </Box>
      <Typography sx={{ color: "#aaa" }}>Feed em construção... 🎵</Typography>
    </Box>
  );
}
