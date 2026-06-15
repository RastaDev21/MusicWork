import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

const genres = [
  "Rock",
  "Samba",
  "Jazz",
  "MPB",
  "Reggae",
  "Funk",
  "Forró",
  "Pagode",
  "Blues",
  "Metal",
  "Pop",
  "Gospel",
  "Eletrônico",
  "Clássico",
  "Bossa Nova",
  "Outro",
];

const selectSx = {
  color: "#fff",
  backgroundColor: "#1a1a1a",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a2a2a" },
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

export default function Search() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [instrument, setInstrument] = useState("");
  const [genre, setGenre] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<Musician[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(
    q = query,
    inst = instrument,
    gen = genre,
    cit = city,
  ) {
    // Busca se tiver texto OU algum filtro ativo
    if (q.trim().length < 2 && !inst && !gen && !cit) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.append("q", q);
      if (inst) params.append("instrument", inst);
      if (gen) params.append("genre", gen);
      if (cit.trim()) params.append("city", cit);

      const response = await api.get(`/users/search?${params.toString()}`);
      setResults(response.data);
      setSearched(true);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  }

  // Roda quando vem da navbar com ?q=
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.length >= 2) {
      handleSearch(q);
    }
  }, [searchParams]);

  // Busca automática quando muda filtro
  function handleFilterChange(
    type: "instrument" | "genre" | "city",
    value: string,
  ) {
    if (type === "instrument") {
      setInstrument(value);
      handleSearch(query, value, genre, city);
    }
    if (type === "genre") {
      setGenre(value);
      handleSearch(query, instrument, value, city);
    }
    if (type === "city") {
      setCity(value);
    }
  }

  // Conta filtros ativos para mostrar badge
  const activeFilters = [instrument, genre, city].filter(Boolean).length;

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        {/* Campo de busca */}
        <TextField
          fullWidth
          placeholder="Buscar por nome, instrumento, cidade ou gênero..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
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
            mb: 2,
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

        {/* Filtros */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ flex: 1, minWidth: 130 }}>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Instrumento
            </InputLabel>
            <Select
              value={instrument}
              label="Instrumento"
              onChange={e => handleFilterChange("instrument", e.target.value)}
              sx={selectSx}
              MenuProps={{ sx: menuSx }}
            >
              <MenuItem value="" sx={menuItemSx}>
                Todos
              </MenuItem>
              {instruments.map(i => (
                <MenuItem key={i} value={i} sx={menuItemSx}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: 1, minWidth: 130 }}>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Gênero
            </InputLabel>
            <Select
              value={genre}
              label="Gênero"
              onChange={e => handleFilterChange("genre", e.target.value)}
              sx={selectSx}
              MenuProps={{ sx: menuSx }}
            >
              <MenuItem value="" sx={menuItemSx}>
                Todos
              </MenuItem>
              {genres.map(g => (
                <MenuItem key={g} value={g} sx={menuItemSx}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Cidade..."
            value={city}
            onChange={e => handleFilterChange("city", e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            sx={{
              flex: 1,
              minWidth: 130,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                backgroundColor: "#1a1a1a",
                "& fieldset": { borderColor: "#2a2a2a" },
                "&:hover fieldset": { borderColor: "#7c4dff" },
                "&.Mui-focused fieldset": { borderColor: "#7c4dff" },
              },
              "& input::placeholder": { color: "#666" },
            }}
          />
        </Box>

        {/* Limpar filtros — linha separada */}
        {activeFilters > 0 && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Limpar filtros (${activeFilters})`}
              onClick={() => {
                setInstrument("");
                setGenre("");
                setCity("");
                handleSearch(query, "", "", "");
              }}
              sx={{
                backgroundColor: "#ff4d6d22",
                color: "#ff4d6d",
                border: "1px solid #ff4d6d44",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#ff4d6d33" },
              }}
            />
          </Box>
        )}

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
              Nenhum músico encontrado
            </Typography>
          </Box>
        )}

        {/* Estado inicial */}
        {!loading && !searched && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <SearchIcon sx={{ fontSize: 48, color: "#333", mb: 2 }} />
            <Typography sx={{ color: "#aaa" }}>
              Digite ou use os filtros para buscar músicos 🎵
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
