import {
  Box,
  Typography,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import Layout from "../components/Layout/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Musician {
  id: string;
  name: string;
  instrument: string;
  secondaryProfession: string;
  city: string;
  bio: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  genre: string;
}

export default function PublicProfile() {
  const { id } = useParams();
  const [musician, setMusician] = useState<Musician | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setNotFound(false);
      try {
        const response = await api.get(`/users/${id}`);
        setMusician(response.data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadProfile();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#7c4dff" }} />
        </Box>
      </Layout>
    );
  }

  if (notFound || !musician) {
    return (
      <Layout>
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography sx={{ color: "#aaa", fontSize: 16 }}>
            Músico não encontrado
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {/* Capa */}
        <Box
          sx={{
            height: 160,
            backgroundColor: "#2a2a2a",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {musician.coverUrl && (
            <Box
              component="img"
              src={`${import.meta.env.VITE_API_URL}${musician.coverUrl}`}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </Box>

        {/* Header */}
        <Box sx={{ px: 3, pb: 2, borderBottom: "1px solid #2a2a2a" }}>
          {/* Avatar */}
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              backgroundColor: "#7c4dff",
              border: "4px solid #0f0f0f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#fff",
              mt: "-45px",
              mb: 1.5,
              position: "relative",
              zIndex: 1,
              overflow: "hidden",
            }}
          >
            {musician.avatarUrl ? (
              <Box
                component="img"
                src={`${import.meta.env.VITE_API_URL}${musician.avatarUrl}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              musician.name.charAt(0).toUpperCase()
            )}
          </Box>

          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 22 }}>
            {musician.name}
          </Typography>

          <Box
            sx={{ display: "flex", gap: 1, mt: 0.5, mb: 1, flexWrap: "wrap" }}
          >
            {musician.instrument && (
              <Chip
                label={musician.instrument}
                size="small"
                sx={{
                  backgroundColor: "#7c4dff22",
                  color: "#9c6fe4",
                  fontSize: 11,
                }}
              />
            )}
            {musician.genre && (
              <Chip
                label={musician.genre}
                size="small"
                sx={{
                  backgroundColor: "#ff4d6d22",
                  color: "#ff4d6d",
                  fontSize: 11,
                }}
              />
            )}
          </Box>

          <Typography sx={{ color: "#666", fontSize: 13 }}>
            {musician.city}
          </Typography>

          {musician.bio && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: "#aaa", fontSize: 14, lineHeight: 1.7 }}>
                {musician.bio}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Detalhes */}
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              backgroundColor: "#1a1a1a",
              borderRadius: 3,
              border: "1px solid #2a2a2a",
              p: 2,
              maxWidth: 300,
            }}
          >
            {[
              { label: "Instrumento", value: musician.instrument },
              { label: "Profissão", value: musician.secondaryProfession },
              { label: "Gênero", value: musician.genre },
              { label: "Cidade", value: musician.city },
            ].map((item, i) => (
              <Box key={item.label}>
                {i > 0 && <Divider sx={{ borderColor: "#2a2a2a", my: 1.5 }} />}
                <Typography sx={{ color: "#666", fontSize: 12, mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography sx={{ color: "#ccc", fontSize: 13 }}>
                  {item.value || "—"}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
