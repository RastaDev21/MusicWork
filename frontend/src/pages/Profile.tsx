import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard/PostCard";
import { useEffect, useState } from "react";
import api, { uploadAvatar, uploadCover } from "../services/api";
interface Post {
  id: string;
  content: string;
  createdAt: string;
  User: {
    name: string;
    instrument: string;
    secondaryProfession: string;
    city: string;
  };
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

const professions = [
  "Designer",
  "Fotógrafo",
  "Editor de vídeo",
  "Desenvolvedor",
  "Marketing",
  "Professor",
  "Técnico de som",
  "Eletricista",
  "Barbeiro",
  "Tatuador",
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

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [instrument, setInstrument] = useState(user?.instrument || "");
  const [city, setCity] = useState(user?.city || "");
  const [secondaryProfession, setSecondaryProfession] = useState("");
  const [bio, setBio] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [postsRes, profileRes] = await Promise.all([
          api.get("/posts"),
          api.get("/profile"),
        ]);

        const myPosts = postsRes.data.filter(
          (post: Post & { userId: string }) => post.User.name === user?.name,
        );
        setPosts(myPosts);
        setBio(profileRes.data.bio || "");
        setAvatarUrl(profileRes.data.avatarUrl || null);
        setCoverUrl(profileRes.data.coverUrl || null);
        setSecondaryProfession(profileRes.data.secondaryProfession || "");
        setGenre(profileRes.data.genre || "");
      } catch (error) {
        console.error(error);
      }
    }
    loadData();
  }, [user]);

  async function handleSave() {
    setLoading(true);
    try {
      await api.put("/users", {
        name,
        instrument,
        secondaryProfession,
        city,
        bio,
        genre,
      });
      const savedUser = localStorage.getItem("musicwork_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const updated = { ...parsed, name, instrument, city };
        localStorage.setItem("musicwork_user", JSON.stringify(updated));
        window.location.reload();
      }
      setOpenEdit(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const data = await uploadAvatar(file);
      setAvatarUrl(data.avatarUrl);
      updateUser({ avatarUrl: data.avatarUrl });
    } catch (error) {
      console.error("Erro ao enviar avatar:", error);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const data = await uploadCover(file);
      setCoverUrl(data.coverUrl);
    } catch (error) {
      console.error("Erro ao enviar capa:", error);
    } finally {
      setUploadingCover(false);
    }
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {/* Capa */}
        <Box
          component="label" // vira um label para o input ficar dentro
          sx={{
            height: 160,
            backgroundColor: "#2a2a2a",
            display: "block",
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
            "&:hover .cover-overlay": { opacity: 1 },
          }}
        >
          {/* Mostra a foto de capa se tiver, senão fundo escuro */}
          {coverUrl && (
            <Box
              component="img"
              src={`http://localhost:3333${coverUrl}`}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          {/* Overlay com ícone de câmera */}
          <Box
            className="cover-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: coverUrl ? 0 : 1, // se não tiver foto, sempre visível
              transition: "opacity 0.2s",
            }}
          >
            <Typography sx={{ color: "#fff", fontSize: 13 }}>
              {uploadingCover ? "Enviando..." : "📷 Alterar foto de capa"}
            </Typography>
          </Box>

          {/* Input escondido que abre o seletor de arquivo */}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleCoverChange}
          />
        </Box>

        {/* Header */}
        <Box sx={{ px: 3, pb: 2, borderBottom: "1px solid #2a2a2a" }}>
          <Box
            component="label"
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
              cursor: "pointer",
              overflow: "hidden",
              "&:hover .avatar-overlay": { opacity: 1 },
            }}
          >
            {/* Foto ou inicial */}
            {avatarUrl ? (
              <Box
                component="img"
                src={`http://localhost:3333${avatarUrl}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}

            {/* Overlay com câmera */}
            <Box
              className="avatar-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s",
                borderRadius: "50%",
              }}
            >
              <Typography sx={{ fontSize: 20 }}>
                {uploadingAvatar ? "⏳" : "📷"}
              </Typography>
            </Box>

            {/* Input escondido */}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 22 }}>
                {user?.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 0.5,
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                {user?.instrument && (
                  <Chip
                    label={user.instrument}
                    size="small"
                    sx={{
                      backgroundColor: "#7c4dff22",
                      color: "#9c6fe4",
                      fontSize: 11,
                    }}
                  />
                )}
              </Box>
              <Typography sx={{ color: "#666", fontSize: 13 }}>
                {user?.city}
              </Typography>
            </Box>

            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={() => setOpenEdit(true)}
              sx={{
                color: "#7c4dff",
                borderColor: "#7c4dff",
                "&:hover": {
                  borderColor: "#9c6fe4",
                  backgroundColor: "#7c4dff11",
                },
              }}
            >
              Editar perfil
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
            {[
              { label: "Posts", value: posts.length },
              { label: "Seguidores", value: 0 },
              { label: "Seguindo", value: 0 },
            ].map(stat => (
              <Box key={stat.label} sx={{ textAlign: "center" }}>
                <Typography
                  sx={{ color: "#fff", fontWeight: 700, fontSize: 18 }}
                >
                  {stat.value}
                </Typography>
                <Typography sx={{ color: "#666", fontSize: 12 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
          {bio && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: "#aaa", fontSize: 14, lineHeight: 1.7 }}>
                {bio}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Conteúdo */}
        <Box sx={{ display: "flex", gap: 2, p: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{ color: "#fff", fontWeight: 600, fontSize: 15, mb: 2 }}
            >
              Posts
            </Typography>
            {posts.length === 0 ? (
              <Typography sx={{ color: "#aaa", fontSize: 14 }}>
                Nenhum post ainda. 🎵
              </Typography>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  name={post.User.name}
                  instrument={post.User.instrument}
                  secondaryProfession={post.User.secondaryProfession}
                  city={post.User.city}
                  time={timeAgo(post.createdAt)}
                  content={post.content}
                  likes={0}
                  comments={0}
                />
              ))
            )}
          </Box>

          <Box sx={{ width: 200, display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                backgroundColor: "#1a1a1a",
                borderRadius: 3,
                border: "1px solid #2a2a2a",
                p: 2,
              }}
            >
              {[
                { label: "Instrumento", value: user?.instrument },
                { label: "Profissão", value: secondaryProfession },
                { label: "Cidade", value: user?.city },
              ].map((item, i) => (
                <Box key={item.label}>
                  {i > 0 && (
                    <Divider sx={{ borderColor: "#2a2a2a", my: 1.5 }} />
                  )}
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
      </Box>

      {/* Modal de edição */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { backgroundColor: "#1a1a1a", borderRadius: 3 } },
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #2a2a2a" }}>
          Editar perfil
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ ...inputSx, mb: 2, mt: 1 }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel
                sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
              >
                Instrumento
              </InputLabel>
              <Select
                value={instrument}
                label="Instrumento"
                onChange={e => setInstrument(e.target.value)}
                sx={selectSx}
                MenuProps={{ sx: menuSx }}
              >
                {instruments.map(i => (
                  <MenuItem key={i} value={i} sx={menuItemSx}>
                    {i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Cidade - Estado"
              value={city}
              onChange={e => setCity(e.target.value)}
              sx={inputSx}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Profissão secundária
            </InputLabel>
            <Select
              value={secondaryProfession}
              label="Profissão secundária"
              onChange={e => setSecondaryProfession(e.target.value)}
              sx={selectSx}
              MenuProps={{ sx: menuSx }}
            >
              {professions.map(p => (
                <MenuItem key={p} value={p} sx={menuItemSx}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Gênero musical
            </InputLabel>
            <Select
              value={genre}
              label="Gênero musical"
              onChange={e => setGenre(e.target.value)}
              sx={selectSx}
              MenuProps={{ sx: menuSx }}
            >
              {genres.map(g => (
                <MenuItem key={g} value={g} sx={menuItemSx}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Conta um pouco sobre você..."
            sx={inputSx}
          />
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #2a2a2a", p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenEdit(false)}
            sx={{ color: "#aaa", "&:hover": { color: "#fff" } }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              backgroundColor: "#7c4dff",
              "&:hover": { backgroundColor: "#6a3de8" },
            }}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
