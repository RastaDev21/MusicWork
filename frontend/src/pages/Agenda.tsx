import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import ShowCard from "../components/ShowCard/ShowCard";
import ShowDialog from "../components/ShowDialog/ShowDialog";
import { listShows, deleteShow, Show } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

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

export default function Agenda() {
  const { user } = useAuth();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  async function loadShows() {
    setLoading(true);
    try {
      const data = await listShows({
        city: cityFilter || undefined,
        genre: genreFilter || undefined,
        date: dateFilter || undefined,
      });
      setShows(data);
    } catch (error) {
      console.error("Erro ao carregar shows:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityFilter, genreFilter, dateFilter]);

  async function handleDelete(showId: string) {
    try {
      await deleteShow(showId);
      setShows(prev => prev.filter(s => s.id !== showId));
    } catch (error) {
      console.error("Erro ao deletar show:", error);
    }
  }

  function handleClearFilters() {
    setCityFilter("");
    setGenreFilter("");
    setDateFilter("");
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
            Agenda de shows
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: "#7c4dff",
              "&:hover": { backgroundColor: "#6a3de8" },
            }}
          >
            + Novo show
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <TextField
            label="Cidade"
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            size="small"
            sx={{ ...inputSx, flex: 1, minWidth: 140 }}
          />
          <FormControl size="small" sx={{ flex: 1, minWidth: 140 }}>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Gênero
            </InputLabel>
            <Select
              value={genreFilter}
              label="Gênero"
              onChange={e => setGenreFilter(e.target.value)}
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
            type="date"
            label="Data"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ ...inputSx, flex: 1, minWidth: 140 }}
          />
          <Button
            onClick={handleClearFilters}
            sx={{
              color: "#7c4dff",
              border: "1px solid #7c4dff",
              "&:hover": { backgroundColor: "#7c4dff11" },
            }}
          >
            Limpar
          </Button>
        </Box>

        {loading ? (
          <Typography sx={{ color: "#aaa" }}>Carregando...</Typography>
        ) : shows.length === 0 ? (
          <Typography sx={{ color: "#aaa", textAlign: "center", mt: 4 }}>
            Nenhum show encontrado. 🎸
          </Typography>
        ) : (
          shows.map(show => (
            <ShowCard
              key={show.id}
              show={show}
              isOwner={user?.id === show.userId}
              onDelete={handleDelete}
            />
          ))
        )}
      </Box>

      <ShowDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onCreated={loadShows}
      />
    </Layout>
  );
}
