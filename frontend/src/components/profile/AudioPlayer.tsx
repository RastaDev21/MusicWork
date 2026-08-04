import { Box, Typography } from "@mui/material";
import { getImageUrl } from "../../services/api";

export default function AudioPlayer({ url }: { url?: string | null }) {
  if (!url) return null;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mt: 1.5,
        p: 1.5,
        backgroundColor: "#0f0f0f",
        border: "1px solid #2a2a2a",
        borderRadius: 3,
      }}
    >
      <Typography sx={{ color: "#666", fontSize: 11, mb: 0.5 }}>
        🎵 Música do perfil
      </Typography>
      <Box
        component="audio"
        src={getImageUrl(url)}
        controls
        loop
        sx={{ width: "100%", height: 36 }}
      />
    </Box>
  );
}
