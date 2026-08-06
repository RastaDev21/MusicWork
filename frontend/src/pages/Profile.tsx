import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard/PostCard";
import ShowCard from "../components/ShowCard/ShowCard";
import ShowDialog from "../components/ShowDialog/ShowDialog";
import { useEffect, useState } from "react";
import api, {
  uploadAvatar,
  uploadCover,
  uploadProfileAudio,
  deleteProfileAudio,
  pinPost,
  unpinPost,
  getPinnedPost,
  listShowsByUser,
  deleteShow,
  getImageUrl,
  Show,
} from "../services/api";
import { useSnackbar } from "notistack";
import { instruments, genres } from "../constants/musicOptions";
import { countries, countryCodeToFlag } from "../constants/countries";
import SocialLinks from "../components/profile/SocialLinks";
import ProfileChips from "../components/profile/ProfileChips";
import ProfileDetailsCard from "../components/profile/ProfileDetailsCard";
import NewPost from "../components/NewPost/NewPost";
import AudioPlayer from "../components/profile/AudioPlayer";
interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  isPinned?: boolean;
  createdAt: string;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  User: {
    name: string;
    instrument: string;
    secondaryProfession: string;
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
  const [pinnedPost, setPinnedPost] = useState<Post | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [instrument, setInstrument] = useState(user?.instrument || "");
  const [secondaryInstruments, setSecondaryInstruments] = useState<string[]>(
    [],
  );
  const [city, setCity] = useState(user?.city || "");
  const [secondaryProfession, setSecondaryProfession] = useState("");
  const [bio, setBio] = useState("");
  const [genre, setGenre] = useState(user?.genre || "");
  const [secondaryGenres, setSecondaryGenres] = useState<string[]>([]);
  const [nationality, setNationality] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [spotify, setSpotify] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [favoriteSongUrl, setFavoriteSongUrl] = useState("");
  const [profileAudioUrl, setProfileAudioUrl] = useState<string | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);

  async function loadPinned() {
    if (!user?.id) return;
    try {
      const pinned = await getPinnedPost(user.id);
      setPinnedPost(pinned);
    } catch (error) {
      console.error("Erro ao carregar post fixado:", error);
    }
  }

  async function loadShows() {
    if (!user?.id) return;
    try {
      const data = await listShowsByUser(user.id);
      setShows(data);
    } catch (error) {
      console.error("Erro ao carregar shows:", error);
    }
  }

  async function loadPosts() {
    if (!user?.id) return;
    try {
      const postsRes = await api.get(`/posts/user/${user.id}`);
      setPosts(postsRes.data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    }
  }
  useEffect(() => {
    async function loadData() {
      try {
        const [postsRes, profileRes, followRes] = await Promise.all([
          user?.id
            ? api.get(`/posts/user/${user.id}`)
            : Promise.resolve({ data: [] as Post[] }),
          api.get("/profile"),
          user?.id ? api.get(`/follows/${user.id}`) : Promise.resolve(null),
        ]);

        setPosts(postsRes.data);
        setBio(profileRes.data.bio || "");
        setAvatarUrl(profileRes.data.avatarUrl || null);
        setCoverUrl(profileRes.data.coverUrl || null);
        setSecondaryProfession(profileRes.data.secondaryProfession || "");
        setGenre(profileRes.data.genre || "");
        setInstagram(profileRes.data.instagram || "");
        setYoutube(profileRes.data.youtube || "");
        setSpotify(profileRes.data.spotify || "");
        setFavoriteSongUrl(profileRes.data.favoriteSongUrl || "");
        setIsProfessor(profileRes.data.isProfessor || false);
        setFacebook(profileRes.data.facebook || "");
        setTiktok(profileRes.data.tiktok || "");
        setSecondaryInstruments(profileRes.data.secondaryInstruments || []);
        setSecondaryGenres(profileRes.data.secondaryGenres || []);
        setNationality(profileRes.data.nationality || "");
        setFavoriteSongUrl(profileRes.data.favoriteSongUrl || "");
        setProfileAudioUrl(profileRes.data.profileAudioUrl || null);
        setIsProfessor(profileRes.data.isProfessor || false);

        if (followRes) {
          setFollowers(followRes.data.followers);
          setFollowingCount(followRes.data.followingCount);
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadData();
    loadPinned();
    loadShows();
  }, [user]);

  async function handleSave() {
    setLoading(true);
    try {
      await api.put("/users", {
        name,
        instrument,
        secondaryInstruments,
        secondaryProfession,
        city,
        bio,
        genre,
        secondaryGenres,
        nationality,
        instagram,
        youtube,
        spotify,
        favoriteSongUrl,
        isProfessor,
        facebook,
        tiktok,
      });

      updateUser({ name, instrument, secondaryInstruments, city, genre });

      const profileRes = await api.get("/profile");
      setBio(profileRes.data.bio || "");
      setGenre(profileRes.data.genre || "");
      setSecondaryProfession(profileRes.data.secondaryProfession || "");
      setSecondaryInstruments(profileRes.data.secondaryInstruments || []);
      setSecondaryGenres(profileRes.data.secondaryGenres || []);
      setNationality(profileRes.data.nationality || "");
      setFavoriteSongUrl(profileRes.data.favoriteSongUrl || "");
      setIsProfessor(profileRes.data.isProfessor || false);
      setFacebook(profileRes.data.facebook || "");
      setTiktok(profileRes.data.tiktok || "");

      setOpenEdit(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(postId: string) {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (pinnedPost?.id === postId) setPinnedPost(null);
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  }

  async function handleTogglePin(postId: string) {
    const targetPost =
      posts.find(p => p.id === postId) ||
      (pinnedPost?.id === postId ? pinnedPost : null);
    if (!targetPost) return;

    try {
      if (targetPost.isPinned) {
        await unpinPost(postId);
      } else {
        await pinPost(postId);
      }
      await loadPosts();
      loadPinned();
    } catch (error) {
      console.error("Erro ao fixar/desafixar post:", error);
    }
  }

  async function handleDeleteShow(showId: string) {
    try {
      await deleteShow(showId);
      setShows(prev => prev.filter(s => s.id !== showId));
    } catch (error) {
      console.error("Erro ao deletar show:", error);
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
      enqueueSnackbar("Foto de perfil atualizada!", { variant: "success" });
    } catch (error: unknown) {
      let msg = "Erro ao enviar a foto. Tente novamente.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        if (err.response?.data?.error) {
          msg = err.response.data.error;
        }
      }
      enqueueSnackbar(msg, { variant: "error" });
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
      enqueueSnackbar("Foto de capa atualizada!", { variant: "success" });
    } catch (error: unknown) {
      let msg = "Erro ao enviar a foto. Tente novamente.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        if (err.response?.data?.error) {
          msg = err.response.data.error;
        }
      }
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleAudioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAudio(true);
    try {
      const data = await uploadProfileAudio(file);
      setProfileAudioUrl(data.profileAudioUrl);
      enqueueSnackbar("Música do perfil atualizada!", { variant: "success" });
    } catch (error: unknown) {
      let msg = "Erro ao enviar o áudio. Tente novamente.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        if (err.response?.data?.error) {
          msg = err.response.data.error;
        }
      }
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setUploadingAudio(false);
    }
  }

  async function handleRemoveAudio() {
    try {
      await deleteProfileAudio();
      setProfileAudioUrl(null);
      enqueueSnackbar("Música do perfil removida.", { variant: "success" });
    } catch (error) {
      console.error("Erro ao remover áudio:", error);
    }
  }

  const editButton = (
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
  );

  const detailsCard = (
    <ProfileDetailsCard
      secondaryProfession={secondaryProfession}
      city={user?.city}
      nationality={nationality}
    />
  );

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {/* Capa */}
        <Box
          component="label"
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
          {coverUrl && (
            <Box
              component="img"
              src={getImageUrl(coverUrl)}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}

          <Box
            className="cover-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: coverUrl ? 0 : 1,
              transition: "opacity 0.2s",
            }}
          >
            <Typography sx={{ color: "#fff", fontSize: 13 }}>
              {uploadingCover ? "Enviando..." : "📷 Alterar foto de capa"}
            </Typography>
          </Box>

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
            {avatarUrl ? (
              <Box
                component="img"
                src={getImageUrl(user?.avatarUrl)}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}

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
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 22 }}>
                {user?.name}
              </Typography>
              <ProfileChips
                instrument={user?.instrument}
                genre={genre}
                secondaryInstruments={secondaryInstruments}
                secondaryGenres={secondaryGenres}
                isProfessor={isProfessor}
              />

              {/* Botão de editar - só no mobile, logo abaixo dos chips */}
              <Box sx={{ display: { xs: "block", md: "none" }, mb: 1.5 }}>
                {editButton}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 4,
                  mt: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 4 }}>
                  {[
                    { label: "Posts", value: posts.length },
                    { label: "Seguidores", value: followers },
                    { label: "Seguindo", value: followingCount },
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

                <SocialLinks
                  instagram={instagram}
                  youtube={youtube}
                  spotify={spotify}
                  facebook={facebook}
                  tiktok={tiktok}
                />
              </Box>

              {bio && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    sx={{ color: "#aaa", fontSize: 14, lineHeight: 1.7 }}
                  >
                    {bio}
                  </Typography>
                </Box>
              )}

              <AudioPlayer url={profileAudioUrl} />

              {/* Card de detalhes - só no mobile, depois da bio */}
              <Box sx={{ display: { xs: "block", md: "none" }, mt: 2 }}>
                {detailsCard}
              </Box>
            </Box>

            {/* Botão + card - só no desktop, na coluna da direita */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                minWidth: 200,
              }}
            >
              {editButton}
              {detailsCard}
            </Box>
          </Box>

          {/* Próximos shows */}
          <Box
            sx={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 3,
              p: 2,
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: shows.length ? 1.5 : 0,
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                📅 Próximos shows
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setOpenShowDialog(true)}
                sx={{
                  color: "#7c4dff",
                  borderColor: "#7c4dff",
                  fontSize: 12,
                  "&:hover": {
                    borderColor: "#9c6fe4",
                    backgroundColor: "#7c4dff11",
                  },
                }}
              >
                + Adicionar
              </Button>
            </Box>
            {shows.length === 0 ? (
              <Typography sx={{ color: "#666", fontSize: 13 }}>
                Nenhum show marcado ainda.
              </Typography>
            ) : (
              shows.map(show => (
                <ShowCard
                  key={show.id}
                  show={show}
                  isOwner
                  onDelete={handleDeleteShow}
                />
              ))
            )}
          </Box>

          {/* Post fixado */}
          {pinnedPost && (
            <Box sx={{ mt: 2 }}>
              <PostCard
                id={pinnedPost.id}
                userId={pinnedPost.userId}
                name={pinnedPost.User.name}
                instrument={pinnedPost.User.instrument}
                secondaryProfession={pinnedPost.User.secondaryProfession}
                city={pinnedPost.User.city}
                time={timeAgo(pinnedPost.createdAt)}
                content={pinnedPost.content}
                imageUrl={pinnedPost.imageUrl}
                videoUrl={pinnedPost.videoUrl}
                likes={pinnedPost.likesCount}
                likedByMe={pinnedPost.likedByMe}
                comments={pinnedPost.commentsCount}
                avatarUrl={pinnedPost.User.avatarUrl}
                isOwner
                isPinned
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            </Box>
          )}
        </Box>

        {/* Conteúdo — Posts, sempre por último */}
        <Box sx={{ p: 2 }}>
          <NewPost onPost={loadPosts} />
          <Typography
            sx={{ color: "#fff", fontWeight: 600, fontSize: 15, mb: 2 }}
          >
            Posts
          </Typography>
          {posts.filter(post => post.id !== pinnedPost?.id).length === 0 ? (
            <Typography sx={{ color: "#aaa", fontSize: 14 }}>
              Nenhum post ainda. 🎵
            </Typography>
          ) : (
            posts
              .filter(post => post.id !== pinnedPost?.id)
              .map(post => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  userId={post.userId}
                  name={post.User.name}
                  instrument={post.User.instrument}
                  secondaryProfession={post.User.secondaryProfession}
                  city={post.User.city}
                  time={timeAgo(post.createdAt)}
                  content={post.content}
                  imageUrl={post.imageUrl}
                  videoUrl={post.videoUrl}
                  likes={post.likesCount}
                  likedByMe={post.likedByMe}
                  comments={post.commentsCount}
                  avatarUrl={post.User.avatarUrl}
                  isOwner
                  isPinned={post.isPinned}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                />
              ))
          )}
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

          <Autocomplete
            multiple
            options={instruments.filter(
              i => i !== instrument && !secondaryInstruments.includes(i),
            )}
            value={secondaryInstruments}
            onChange={(_, newValue) => setSecondaryInstruments(newValue)}
            renderInput={params => (
              <TextField
                {...params}
                label="Outros instrumentos (opcional)"
                placeholder={
                  secondaryInstruments.length === 0 ? "Selecione..." : ""
                }
                sx={inputSx}
              />
            )}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  "& .MuiAutocomplete-option": {
                    color: "#fff",
                    '&[aria-selected="true"]': {
                      backgroundColor: "#7c4dff33",
                    },
                    "&:hover": { backgroundColor: "#7c4dff22" },
                  },
                },
              },
            }}
            sx={{
              mb: 2,
              "& .MuiAutocomplete-tag": {
                backgroundColor: "#7c4dff",
                color: "#fff",
                fontWeight: 600,
              },
              "& .MuiAutocomplete-tag .MuiChip-deleteIcon": {
                color: "#fff",
                opacity: 0.85,
                "&:hover": { opacity: 1 },
              },
            }}
          />

          <TextField
            fullWidth
            label="Profissão secundária"
            value={secondaryProfession}
            onChange={e => setSecondaryProfession(e.target.value)}
            placeholder="Ex: Fotógrafo, Designer, Professor..."
            sx={{ ...inputSx, mb: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isProfessor}
                onChange={e => setIsProfessor(e.target.checked)}
                sx={{
                  color: "#666",
                  "&.Mui-checked": { color: "#7c4dff" },
                }}
              />
            }
            label="Dou aulas (aparecer como Professor na busca)"
            sx={{ color: "#ccc", mb: 2, display: "flex" }}
          />

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

          <Autocomplete
            multiple
            options={genres.filter(
              g => g !== genre && !secondaryGenres.includes(g),
            )}
            value={secondaryGenres}
            onChange={(_, newValue) => setSecondaryGenres(newValue)}
            renderInput={params => (
              <TextField
                {...params}
                label="Outros gêneros (opcional)"
                placeholder={secondaryGenres.length === 0 ? "Selecione..." : ""}
                sx={inputSx}
              />
            )}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  "& .MuiAutocomplete-option": {
                    color: "#fff",
                    '&[aria-selected="true"]': {
                      backgroundColor: "#7c4dff33",
                    },
                    "&:hover": { backgroundColor: "#7c4dff22" },
                  },
                },
              },
            }}
            sx={{
              mb: 2,
              "& .MuiAutocomplete-tag": {
                backgroundColor: "#ff4d6d",
                color: "#fff",
                fontWeight: 600,
              },
              "& .MuiAutocomplete-tag .MuiChip-deleteIcon": {
                color: "#fff",
                opacity: 0.85,
                "&:hover": { opacity: 1 },
              },
            }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              sx={{ color: "#aaa", "&.Mui-focused": { color: "#7c4dff" } }}
            >
              Nacionalidade
            </InputLabel>
            <Select
              value={nationality}
              label="Nacionalidade"
              onChange={e => setNationality(e.target.value)}
              sx={selectSx}
              MenuProps={{ sx: menuSx }}
            >
              {countries.map(c => (
                <MenuItem key={c.code} value={c.code} sx={menuItemSx}>
                  {countryCodeToFlag(c.code)} {c.name}
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
            sx={{ ...inputSx, mb: 2 }}
          />

          <Typography sx={{ color: "#aaa", fontSize: 12, mt: 2, mb: 1 }}>
            Links sociais
          </Typography>
          <TextField
            fullWidth
            label="Instagram (link ou @)"
            value={instagram}
            onChange={e => setInstagram(e.target.value)}
            placeholder="Ex: @seuusuario"
            sx={{ ...inputSx, mb: 2 }}
          />
          <TextField
            fullWidth
            label="YouTube (link do canal)"
            value={youtube}
            onChange={e => setYoutube(e.target.value)}
            placeholder="Ex: youtube.com/seucanal"
            sx={{ ...inputSx, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Spotify (link do artista)"
            value={spotify}
            onChange={e => setSpotify(e.target.value)}
            placeholder="Ex: open.spotify.com/artist/..."
            sx={{ ...inputSx, mb: 2 }}
          />

          <Typography sx={{ color: "#aaa", fontSize: 12, mt: 1, mb: 1 }}>
            Música do perfil
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 0.5,
              flexWrap: "wrap",
            }}
          >
            <Button
              component="label"
              variant="outlined"
              disabled={uploadingAudio}
              sx={{
                color: "#7c4dff",
                borderColor: "#7c4dff",
                "&:hover": {
                  borderColor: "#9c6fe4",
                  backgroundColor: "#7c4dff11",
                },
              }}
            >
              {uploadingAudio
                ? "Enviando..."
                : profileAudioUrl
                  ? "Trocar áudio"
                  : "Enviar áudio"}
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/ogg"
                hidden
                onChange={handleAudioChange}
              />
            </Button>
            {profileAudioUrl && (
              <Button
                onClick={handleRemoveAudio}
                sx={{ color: "#ff4d6d", "&:hover": { color: "#ff8099" } }}
              >
                Remover
              </Button>
            )}
          </Box>
          <Typography sx={{ color: "#666", fontSize: 12, mb: 2 }}>
            Toca direto no seu perfil, em loop. Troque quando quiser. (MP3, WAV,
            M4A ou OGG — até 20MB)
          </Typography>

          <TextField
            fullWidth
            label="Facebook (link ou usuário)"
            value={facebook}
            onChange={e => setFacebook(e.target.value)}
            placeholder="Ex: facebook.com/seuusuario"
            sx={{ ...inputSx, mb: 2 }}
          />
          <TextField
            fullWidth
            label="TikTok (@usuário)"
            value={tiktok}
            onChange={e => setTiktok(e.target.value)}
            placeholder="Ex: @seuusuario"
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

      <ShowDialog
        open={openShowDialog}
        onClose={() => setOpenShowDialog(false)}
        onCreated={loadShows}
      />
    </Layout>
  );
}
