import {
  Box,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import Layout from "../components/Layout/Layout";
import PostCard from "../components/PostCard/PostCard";
import ShowCard from "../components/ShowCard/ShowCard";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, {
  getImageUrl,
  getPinnedPost,
  listShowsByUser,
  Show,
} from "../services/api";
import { startConversation } from "../services/api";
import { countryCodeToFlag } from "../constants/countries";
import SocialLinks from "../components/profile/SocialLinks";
import SpotifyEmbed from "../components/profile/SpotifyEmbed";
import ProfessorChip from "../components/profile/ProfessorChip";

interface Musician {
  id: string;
  name: string;
  instrument: string;
  secondaryInstruments?: string[];
  secondaryProfession: string;
  city: string;
  bio: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  genre: string;
  secondaryGenres?: string[];
  nationality?: string | null;
  instagram: string | null;
  youtube: string | null;
  spotify: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  favoriteSongUrl?: string | null;
  isProfessor?: boolean;
}

interface PinnedPost {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
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

export default function PublicProfile() {
  const { id } = useParams();
  const [musician, setMusician] = useState<Musician | null>(null);
  const [pinnedPost, setPinnedPost] = useState<PinnedPost | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setNotFound(false);
      try {
        const response = await api.get(`/users/${id}`);
        setMusician(response.data);
        const followRes = await api.get(`/follows/${id}`);
        setFollowing(followRes.data.following);
        setFollowers(followRes.data.followers);
        setFollowingCount(followRes.data.followingCount);

        if (id) {
          const pinned = await getPinnedPost(id);
          setPinnedPost(pinned);
          const showsData = await listShowsByUser(id);
          setShows(showsData);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadProfile();
  }, [id]);

  async function handleFollow() {
    const res = await api.post(`/follows/${id}`);
    setFollowing(res.data.following);
    setFollowers(prev => (res.data.following ? prev + 1 : prev - 1));
  }

  const navigate = useNavigate();

  async function handleMessage() {
    if (!id) return;
    const conversation = await startConversation(id);
    navigate(`/mensagens/${conversation.id}`);
  }

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

  const followButton = (
    <Button
      variant={following ? "outlined" : "contained"}
      onClick={handleFollow}
      sx={{
        backgroundColor: following ? "transparent" : "#7c4dff",
        borderColor: "#7c4dff",
        color: following ? "#7c4dff" : "#fff",
        "&:hover": {
          backgroundColor: following ? "#7c4dff11" : "#6a3de8",
          borderColor: "#7c4dff",
        },
      }}
    >
      {following ? "Seguindo" : "Seguir"}
    </Button>
  );

  const messageButton = (
    <Button
      variant="outlined"
      onClick={handleMessage}
      sx={{
        color: "#7c4dff",
        borderColor: "#7c4dff",
        "&:hover": { borderColor: "#9c6fe4", backgroundColor: "#7c4dff11" },
      }}
    >
      Mensagem
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
  );

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
              src={getImageUrl(musician.coverUrl)}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </Box>

        {/* Header */}
        <Box sx={{ px: 3, pb: 2, borderBottom: "1px solid #2a2a2a" }}>
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
                src={getImageUrl(musician.avatarUrl)}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              musician.name.charAt(0).toUpperCase()
            )}
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
                {musician.name}
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
                {musician.isProfessor && <ProfessorChip />}
                {musician.secondaryInstruments?.map(inst => (
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
                {musician.secondaryGenres?.map(g => (
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

              {/* Botão de seguir - só no mobile, logo abaixo dos chips */}
              <Box
                sx={{ display: { xs: "flex", md: "none" }, gap: 1, mb: 1.5 }}
              >
                {followButton}
                {messageButton}
              </Box>

              <Typography sx={{ color: "#666", fontSize: 13 }}>
                {musician.city}
                {musician.nationality && (
                  <Box component="span" sx={{ ml: 1 }}>
                    {countryCodeToFlag(musician.nationality)}
                  </Box>
                )}
              </Typography>

              <SocialLinks
                instagram={musician.instagram}
                youtube={musician.youtube}
                spotify={musician.spotify}
                facebook={musician.facebook}
                tiktok={musician.tiktok}
              />

              <SpotifyEmbed url={musician.favoriteSongUrl} />

              <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
                {[
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

              {musician.bio && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    sx={{ color: "#aaa", fontSize: 14, lineHeight: 1.7 }}
                  >
                    {musician.bio}
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
              <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                {followButton}
                {messageButton}
              </Box>
              {detailsCard}
            </Box>
          </Box>

          {/* Próximos shows - só aparece se tiver algum */}
          {shows.length > 0 && (
            <Box
              sx={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 3,
                p: 2,
                mt: 2,
              }}
            >
              <Typography
                sx={{ color: "#fff", fontWeight: 600, fontSize: 14, mb: 1.5 }}
              >
                📅 Próximos shows
              </Typography>
              {shows.map(show => (
                <ShowCard key={show.id} show={show} />
              ))}
            </Box>
          )}

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
                isPinned
              />
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
