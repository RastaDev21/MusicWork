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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
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
  category: string;
  contact: string;
  createdAt: string;
  User: {
    id: string;
    name: string;
    instrument: string;
    city: string;
    avatarUrl: string | null;
  };
}

const categories = [
  { value: "show", label: "🎸 Show / Evento" },
  { value: "aula", label: "🎓 Aula" },
  { value: "gravacao", label: "🎙️ Gravação / Estúdio" },
  { value: "fotovideo", label: "📸 Foto / Vídeo" },
  { value: "banda", label: "🥁 Banda / Projeto" },
  { value: "equipamento", label: "🔧 Equipamento" },
  { value: "outro", label: "🎵 Outro" },
];

function timeAgo(date: string) {
  const now = new Date();
  const created = new Date(date);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000 / 60);
  if (diff < 1) return "agora";
  if (diff < 60) return `${diff}min atrás`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`;
  return `${Math.floor(diff / 1440)}d atrás`;
}

function getCategoryLabel(value: string) {
  return categories.find(c => c.value === value)?.label || value;
}

function isWhatsApp(contact: string) {
  return /^[+\d\s()-]{8,}$/.test(contact);
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

export default function WorkPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "offer" | "request">("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [type, setType] = useState<"offer" | "request">("offer");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);

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
      if (editingWork) {
        // Editar work existente
        await api.put(`/works/${editingWork.id}`, {
          type,
          title,
          description,
          price,
          city,
          category,
          contact,
        });
      } else {
        // Criar novo work
        await api.post("/works", {
          type,
          title,
          description,
          price,
          city,
          category,
          contact,
        });
      }
      setTitle("");
      setDescription("");
      setPrice("");
      setCity("");
      setCategory("");
      setContact("");
      setType("offer");
      setEditingWork(null);
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

  function handleContact(contact: string, name: string) {
    if (isWhatsApp(contact)) {
      const phone = contact.replace(/\D/g, "");
      window.open(
        `https://wa.me/55${phone}?text=Olá ${name}, vi seu anúncio no MusicWork!`,
        "_blank",
      );
    } else {
      window.open(`mailto:${contact}?subject=MusicWork - ${name}`, "_blank");
    }
  }

  const filtered = works.filter(w => {
    if (filter !== "all" && w.type !== filter) return false;
    if (categoryFilter && w.category !== categoryFilter) return false;
    if (cityFilter && !w.city?.toLowerCase().includes(cityFilter.toLowerCase()))
      return false;
    return true;
  });

  const activeFilters = [categoryFilter, cityFilter].filter(Boolean).length;

  function handleEdit(work: Work) {
    setEditingWork(work);
    setType(work.type);
    setTitle(work.title);
    setDescription(work.description || "");
    setPrice(work.price || "");
    setCity(work.city || "");
    setCategory(work.category || "");
    setContact(work.contact || "");
    setOpenNew(true);
  }

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

        {/* Filtros tipo */}
        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
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

        {/* Filtros avançados */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ flex: 1, minWidth: 150 }}>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Categoria
            </InputLabel>
            <Select
              value={categoryFilter}
              label="Categoria"
              onChange={e => setCategoryFilter(e.target.value)}
              sx={{ ...selectSx, backgroundColor: "#1a1a1a" }}
              MenuProps={{ sx: menuSx }}
            >
              <MenuItem value="" sx={menuItemSx}>
                Todas
              </MenuItem>
              {categories.map(c => (
                <MenuItem key={c.value} value={c.value} sx={menuItemSx}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Cidade..."
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
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

          {activeFilters > 0 && (
            <Chip
              label={`Limpar (${activeFilters})`}
              onClick={() => {
                setCategoryFilter("");
                setCityFilter("");
              }}
              sx={{
                backgroundColor: "#ff4d6d22",
                color: "#ff4d6d",
                border: "1px solid #ff4d6d44",
                cursor: "pointer",
              }}
            />
          )}
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#7c4dff" }} />
          </Box>
        )}

        {/* Vazio */}
        {!loading && filtered.length === 0 && (
          <Typography sx={{ color: "#aaa", textAlign: "center", mt: 6 }}>
            Nenhum work encontrado. 💼
          </Typography>
        )}

        {/* Lista */}
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
                {/* Cabeçalho */}
                <Box
                  sx={{
                    backgroundColor: bgColor,
                    px: 2,
                    py: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #2a2a2a",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
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
                    {work.category && (
                      <Chip
                        label={getCategoryLabel(work.category)}
                        size="small"
                        sx={{
                          backgroundColor: "#2a2a2a",
                          color: "#aaa",
                          fontSize: 11,
                          height: 20,
                        }}
                      />
                    )}
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
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <EditIcon
                          fontSize="small"
                          onClick={() => handleEdit(work)}
                          sx={{
                            color: "#555",
                            cursor: "pointer",
                            "&:hover": { color: "#7c4dff" },
                          }}
                        />
                        <DeleteIcon
                          fontSize="small"
                          onClick={() => handleDelete(work.id)}
                          sx={{
                            color: "#555",
                            cursor: "pointer",
                            "&:hover": { color: "#ff4d6d" },
                          }}
                        />
                      </Box>
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
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

                    {/* Botão de contato */}
                    {work.contact && !isOwner && (
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleContact(work.contact, work.User?.name)
                        }
                        sx={{
                          color: isWhatsApp(work.contact)
                            ? "#25D366"
                            : "#7c4dff",
                          backgroundColor: isWhatsApp(work.contact)
                            ? "#25D36622"
                            : "#7c4dff22",
                          "&:hover": {
                            backgroundColor: isWhatsApp(work.contact)
                              ? "#25D36633"
                              : "#7c4dff33",
                          },
                        }}
                      >
                        {isWhatsApp(work.contact) ? (
                          <WhatsAppIcon fontSize="small" />
                        ) : (
                          <EmailIcon fontSize="small" />
                        )}
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>

      {/* Modal novo work */}
      <Dialog
        open={openNew}
        onClose={() => {
          setOpenNew(false);
          setEditingWork(null);
          setTitle("");
          setDescription("");
          setPrice("");
          setCity("");
          setCategory("");
          setContact("");
          setType("offer");
        }}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { backgroundColor: "#1a1a1a", borderRadius: 3 } },
        }}
        sx={{
          "& .MuiDialog-container": { alignItems: "center" },
          "& .MuiBackdrop-root": { left: 0 },
          left: { md: "220px", xs: 0 }, // 👈 empurra o modal para começar após a sidebar
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #2a2a2a" }}>
          {editingWork ? "Editar work" : "Novo work"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1 }}>
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
          {/* Categoria */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Categoria
            </InputLabel>
            <Select
              value={category}
              label="Categoria"
              onChange={e => setCategory(e.target.value)}
              sx={selectSx}
              MenuProps={{ sx: menuSx }}
            >
              {categories.map(c => (
                <MenuItem key={c.value} value={c.value} sx={menuItemSx}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descreva o serviço..."
            sx={{ ...inputSx, mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
          <TextField
            fullWidth
            label="Contato (WhatsApp ou email)"
            value={contact}
            onChange={e => setContact(e.target.value)}
            placeholder="Ex: 13999999999 ou seu@email.com"
            helperText="Quem ver seu anúncio poderá entrar em contato diretamente"
            sx={{
              ...inputSx,
              "& .MuiFormHelperText-root": { color: "#666" },
            }}
          />
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
              "&.Mui-disabled": {
                backgroundColor: "#3a2a6a",
                color: "#9c6fe4",
              },
            }}
          >
            {saving ? "Salvando..." : editingWork ? "Salvar" : "Publicar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
