import { Box } from "@mui/material";
import { getSpotifyEmbedUrl } from "../../constants/spotify";

// Player embutido do Spotify da "música do perfil".
// Computa o embed uma vez (antes rodava o regex 2x por render).
export default function SpotifyEmbed({ url }: { url?: string | null }) {
  const embedUrl = url ? getSpotifyEmbedUrl(url) : null;
  if (!embedUrl) return null;

  return (
    <Box
      component="iframe"
      src={embedUrl}
      sx={{
        width: "100%",
        maxWidth: 400,
        height: 152,
        border: "none",
        borderRadius: 3,
        mt: 1.5,
      }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
