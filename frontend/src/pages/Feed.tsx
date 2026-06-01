import { Box, Typography } from "@mui/material";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../contexts/AuthContext";

export default function Feed() {
  const { user } = useAuth();

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <Typography
          sx={{ color: "#fff", fontWeight: 700, fontSize: 22, mb: 2 }}
        >
          Olá, {user?.name}! 👋
        </Typography>
        <Typography sx={{ color: "#aaa" }}>Feed em construção... 🎵</Typography>
      </Box>
    </Layout>
  );
}
