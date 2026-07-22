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
  Autocomplete,
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

  useEffect(() => {
    async function loadData() {
      try {
        const [postsRes, profileRes, followRes] = await Promise.all([
          api.get("/posts"),
          api.get("/profile"),
          user?.id ? api.get(`/follows/${user.id}`) : Promise.resolve(null),
        ]);

        const myPosts = postsRes.data.filter(
          (post: Post) => post.User.name === user?.name,
        );
        setPosts(myPosts);
        setBio(profileRes.data.bio || "");
        setAvatarUrl(profileRes.data.avatarUrl || null);
        setCoverUrl(profileRes.data.coverUrl || null);
        setSecondaryProfession(profileRes.data.secondaryProfession || "");
        setGenre(profileRes.data.genre || "");
        setInstagram(profileRes.data.instagram || "");
        setYoutube(profileRes.data.youtube || "");
        setSpotify(profileRes.data.spotify || "");
        setFacebook(profileRes.data.facebook || "");
        setTiktok(profileRes.data.tiktok || "");
        setSecondaryInstruments(profileRes.data.secondaryInstruments || []);
        setSecondaryGenres(profileRes.data.secondaryGenres || []);
        setNationality(profileRes.data.nationality || "");

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
      const postsRes = await api.get("/posts");
      const myPosts = postsRes.data.filter(
        (post: Post) => post.User.name === user?.name,
      );
      setPosts(myPosts);
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
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        borderRadius: 3,
        border: "1px solid #2a2a2a",
        p: 2,
        width: "100%",
      }}
    >
      {[
        { label: "Instrumento", value: user?.instrument },
        { label: "Profissão", value: secondaryProfession },
        { label: "Gênero", value: genre },
        { label: "Cidade", value: user?.city },
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
                {genre && (
                  <Chip
                    label={genre}
                    size="small"
                    sx={{
                      backgroundColor: "#ff4d6d22",
                      color: "#ff4d6d",
                      fontSize: 11,
                    }}
                  />
                )}
                {secondaryInstruments.map(inst => (
                  <Chip
                    key={inst}
                    label={inst}
                    size="small"
                    sx={{
                      backgroundColor: "#33333380",
                      color: "#bbb",
                      fontSize: 11,
                    }}
                  />
                ))}
                {secondaryGenres.map(g => (
                  <Chip
                    key={g}
                    label={g}
                    size="small"
                    sx={{
                      backgroundColor: "#ff4d6d15",
                      color: "#ff9baf",
                      fontSize: 11,
                    }}
                  />
                ))}
              </Box>

              {/* Botão de editar - só no mobile, logo abaixo dos chips */}
              <Box sx={{ display: { xs: "block", md: "none" }, mb: 1.5 }}>
                {editButton}
              </Box>

              <Typography sx={{ color: "#666", fontSize: 13 }}>
                {user?.city}
                {nationality && (
                  <Box component="span" sx={{ ml: 1 }}>
                    {countryCodeToFlag(nationality)}
                  </Box>
                )}
              </Typography>

              {(instagram || youtube || spotify || facebook || tiktok) && (
                <Box sx={{ display: "flex", gap: 1.5, mt: 1.5 }}>
                  {instagram && (
                    <Box
                      component="a"
                      href={
                        instagram.startsWith("http")
                          ? instagram
                          : `https://instagram.com/${instagram.replace("@", "")}`
                      }
                      target="_blank"
                      sx={{
                        display: "flex",
                        color: "#E1306C",
                        "&:hover": { opacity: 0.8 },
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </Box>
                  )}
                  {youtube && (
                    <Box
                      component="a"
                      href={
                        youtube.startsWith("http")
                          ? youtube
                          : `https://youtube.com/${youtube}`
                      }
                      target="_blank"
                      sx={{
                        display: "flex",
                        color: "#FF0000",
                        "&:hover": { opacity: 0.8 },
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                      </svg>
                    </Box>
                  )}
                  {spotify && (
                    <Box
                      component="a"
                      href={
                        spotify.startsWith("http")
                          ? spotify
                          : `https://open.spotify.com/artist/${spotify}`
                      }
                      target="_blank"
                      sx={{
                        display: "flex",
                        color: "#1DB954",
                        "&:hover": { opacity: 0.8 },
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </Box>
                  )}
                  {facebook && (
                    <Box
                      component="a"
                      href={
                        facebook.startsWith("http")
                          ? facebook
                          : `https://facebook.com/${facebook}`
                      }
                      target="_blank"
                      sx={{
                        display: "flex",
                        color: "#1877F2",
                        "&:hover": { opacity: 0.8 },
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </Box>
                  )}
                  {tiktok && (
                    <Box
                      component="a"
                      href={
                        tiktok.startsWith("http")
                          ? tiktok
                          : `https://tiktok.com/@${tiktok.replace("@", "")}`
                      }
                      target="_blank"
                      sx={{
                        display: "flex",
                        color: "#fff",
                        "&:hover": { opacity: 0.8 },
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.43 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    </Box>
                  )}
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
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

              {bio && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    sx={{ color: "#aaa", fontSize: 14, lineHeight: 1.7 }}
                  >
                    {bio}
                  </Typography>
                </Box>
              )}

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
