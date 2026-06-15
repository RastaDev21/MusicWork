import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Layout from "../components/Layout/Layout";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

interface Musician {
  id: string;
  name: string;
  instrument: string;
  secondaryProfession: string;
  city: string;
  bio: string;
  avatarUrl: string | null;
  genre: string;
}

export default function Search() {
  const [results, setResults] = useState<Musician[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.length >= 2) {
      handleSearch(q);
    }
  }, [searchParams]);

  async function handleSearch(value: string) {
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/users/search?q=${value}`);
      setResults(response.data);
      setSearched(true);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        {/* Campo de busca */}
        <TextField
          fullWidth
          placeholder="Buscar por nome, instrumento, cidade ou gênero..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              backgroundColor: "#1a1a1a",
              borderRadius: 3,
              "& fieldset": { borderColor: "#2a2a2a" },
              "&:hover fieldset": { borderColor: "#7c4dff" },
              "&.Mui-focused fieldset": { borderColor: "#7c4dff" },
            },
          }}
        />

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#7c4dff" }} />
          </Box>
        )}

        {/* Nenhum resultado */}
        {!loading && searched && results.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <MusicNoteIcon sx={{ fontSize: 48, color: "#333", mb: 2 }} />
            <Typography sx={{ color: "#aaa" }}>
              Nenhum músico encontrado para "{query}"
            </Typography>
          </Box>
        )}

        {/* Estado inicial */}
        {!loading && !searched && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <SearchIcon sx={{ fontSize: 48, color: "#333", mb: 2 }} />
            <Typography sx={{ color: "#aaa" }}>
              Digite para buscar músicos 🎵
            </Typography>
          </Box>
        )}

        {/* Resultados */}
        {!loading &&
          results.map(musician => (
            <Box
              key={musician.id}
              sx={{
                backgroundColor: "#1a1a1a",
                borderRadius: 3,
                border: "1px solid #2a2a2a",
                p: 2,
                mb: 2,
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
                "&:hover": { borderColor: "#7c4dff44", cursor: "pointer" },
                transition: "border-color 0.2s",
              }}
            >
              {/* Avatar */}
              <Avatar
                src={
                  musician.avatarUrl
                    ? `http://localhost:3333${musician.avatarUrl}`
                    : undefined
                }
                sx={{
                  backgroundColor: "#7c4dff",
                  fontWeight: 700,
                  width: 52,
                  height: 52,
                }}
              >
                {musician.name.charAt(0).toUpperCase()}
              </Avatar>

              {/* Infos */}
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    sx={{ color: "#fff", fontWeight: 600, fontSize: 15 }}
                  >
                    {musician.name}
                  </Typography>
                  {musician.instrument && (
                    <Chip
                      label={musician.instrument}
                      size="small"
                      sx={{
                        backgroundColor: "#7c4dff22",
                        color: "#9c6fe4",
                        fontSize: 11,
                        height: 20,
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
                        height: 20,
                      }}
                    />
                  )}
                </Box>

                <Typography sx={{ color: "#666", fontSize: 12, mb: 0.5 }}>
                  {[musician.secondaryProfession, musician.city]
                    .filter(Boolean)
                    .join(" · ")}
                </Typography>

                {musician.bio && (
                  <Typography
                    sx={{ color: "#aaa", fontSize: 13, lineHeight: 1.5 }}
                    noWrap
                  >
                    {musician.bio}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
      </Box>
    </Layout>
  );
}
