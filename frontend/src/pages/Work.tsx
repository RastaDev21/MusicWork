import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../components/Layout/Layout";
import { useEffect, useState } from "react";
import api from "../services/api";

interface Work {
  id: string;
  userId: string;
  type: "offer" | "request";
  title: string;
  description: string;
  price: string;
  city: string;
  createdAt: string;
  User: {
    id: string;
    name: string;
    instrument: string;
    city: string;
    avatarUrl: string | null;
  };
}

function timeAgo(date: string) {
  const now = new Date();
  const created = new Date(date);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000 / 60);
  if (diff < 1) return "agora";
  if (diff < 60) return `${diff}min atrás`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`;
  return `${Math.floor(diff / 1440)}d atrás`;
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

export default function WorkPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "offer" | "request">("all");
  const [openNew, setOpenNew] = useState(false);
  const [type, setType] = useState<"offer" | "request">("offer");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("musicwork_user") || "{}",
  );

  async function loadWorks() {
    try {
      const response = await api.get("/works");
      setWorks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorks();
  }, []);

  async function handleCreate() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await api.post("/works", { type, title, description, price, city });
      setTitle("");
      setDescription("");
      setPrice("");
      setCity("");
      setType("offer");
      setOpenNew(false);
      loadWorks();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/works/${id}`);
      loadWorks();
    } catch (error) {
      console.error(error);
    }
  }

  const filtered = works.filter(w => filter === "all" || w.type === filter);

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
              Work
            </Typography>
            <Typography sx={{ color: "#666", fontSize: 13 }}>
              Encontre e ofereça serviços musicais
            </Typography>
          </Box>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setOpenNew(true)}
            sx={{
              backgroundColor: "#7c4dff",
              "&:hover": { backgroundColor: "#6a3de8" },
            }}
          >
            Novo work
          </Button>
        </Box>

        {/* Filtros */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          {[
            { key: "all", label: "Todos" },
            { key: "offer", label: "Ofereço" },
            { key: "request", label: "Procuro" },
          ].map(f => (
            <Chip
              key={f.key}
              label={f.label}
              onClick={() => setFilter(f.key as "all" | "offer" | "request")}
              sx={{
                cursor: "pointer",
                backgroundColor: filter === f.key ? "#7c4dff" : "#1a1a1a",
                color: filter === f.key ? "#fff" : "#aaa",
                border: "1px solid",
                borderColor: filter === f.key ? "#7c4dff" : "#2a2a2a",
                "&:hover": {
                  backgroundColor: filter === f.key ? "#6a3de8" : "#2a2a2a",
                },
              }}
            />
          ))}
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#7c4dff" }} />
          </Box>
        )}

        {/* Lista */}
        {!loading && filtered.length === 0 && (
          <Typography sx={{ color: "#aaa", textAlign: "center", mt: 6 }}>
            Nenhum work ainda. Seja o primeiro! 💼
          </Typography>
        )}

        {!loading &&
          filtered.map(work => {
            const isOffer = work.type === "offer";
            const isOwner = currentUser?.id === work.userId;
            const accentColor = isOffer ? "#1D9E75" : "#7c4dff";
            const bgColor = isOffer ? "#1D9E7511" : "#7c4dff11";
            const badgeBg = isOffer ? "#1D9E7522" : "#7c4dff22";
            const badgeColor = isOffer ? "#085041" : "#3C3489";

            return (
              <Box
                key={work.id}
                sx={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: 3,
                  border: "1px solid #2a2a2a",
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                {/* Cabeçalho colorido */}
                <Box
                  sx={{
                    backgroundColor: bgColor,
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #2a2a2a",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={isOffer ? "Ofereço" : "Procuro"}
                      size="small"
                      sx={{
                        backgroundColor: badgeBg,
                        color: badgeColor,
                        fontSize: 11,
                        height: 20,
                      }}
                    />
                    <Typography
                      sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}
                    >
                      {work.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {work.price && (
                      <Typography
                        sx={{
                          color: accentColor,
                          fontWeight: 600,
                          fontSize: 14,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {work.price}
                      </Typography>
                    )}
                    {isOwner && (
                      <DeleteIcon
                        fontSize="small"
                        onClick={() => handleDelete(work.id)}
                        sx={{
                          color: "#555",
                          cursor: "pointer",
                          "&:hover": { color: "#ff4d6d" },
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Corpo */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  {work.description && (
                    <Typography
                      sx={{
                        color: "#aaa",
                        fontSize: 13,
                        lineHeight: 1.7,
                        mb: 1.5,
                      }}
                    >
                      {work.description}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={
                        work.User?.avatarUrl
                          ? `http://localhost:3333${work.User.avatarUrl}`
                          : undefined
                      }
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: 11,
                        backgroundColor: "#7c4dff",
                      }}
                    >
                      {work.User?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography sx={{ color: "#666", fontSize: 12 }}>
                      {work.User?.name}
                      {work.city && ` · ${work.city}`}
                      {` · ${timeAgo(work.createdAt)}`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>

      {/* Modal novo work */}
      <Dialog
        open={openNew}
        onClose={() => setOpenNew(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { backgroundColor: "#1a1a1a", borderRadius: 3 } },
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #2a2a2a" }}>
          Novo work
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {/* Tipo */}
          <Box sx={{ display: "flex", gap: 1, mb: 2, mt: 1 }}>
            {[
              { value: "offer", label: "Ofereço um serviço" },
              { value: "request", label: "Procuro um serviço" },
            ].map(t => (
              <Box
                key={t.value}
                onClick={() => setType(t.value as "offer" | "request")}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: type === t.value ? "#7c4dff" : "#333",
                  backgroundColor:
                    type === t.value ? "#7c4dff22" : "transparent",
                }}
              >
                <Typography
                  sx={{
                    color: type === t.value ? "#9c6fe4" : "#aaa",
                    fontSize: 13,
                  }}
                >
                  {t.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <TextField
            fullWidth
            label="Título"
            value={title}
            onChange={e => setTitle(e.target.value)}
            sx={{ ...inputSx, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Descrição"
            multiline
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descreva o serviço..."
            sx={{ ...inputSx, mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Valor (ex: R$ 80/h)"
              value={price}
              onChange={e => setPrice(e.target.value)}
              sx={inputSx}
            />
            <TextField
              fullWidth
              label="Cidade"
              value={city}
              onChange={e => setCity(e.target.value)}
              sx={inputSx}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #2a2a2a", p: 2, gap: 1 }}>
          <Button onClick={() => setOpenNew(false)} sx={{ color: "#aaa" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={saving || !title.trim()}
            sx={{
              backgroundColor: "#7c4dff",
              "&:hover": { backgroundColor: "#6a3de8" },
            }}
          >
            {saving ? "Publicando..." : "Publicar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
