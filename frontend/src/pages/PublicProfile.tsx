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
  instagram: string | null;
  youtube: string | null;
  spotify: string | null;
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
              </Typography>

              {(musician.instagram || musician.youtube || musician.spotify) && (
                <Box sx={{ display: "flex", gap: 1.5, mt: 1.5 }}>
                  {musician.instagram && (
                    <Box
                      component="a"
                      href={
                        musician.instagram.startsWith("http")
                          ? musician.instagram
                          : `https://instagram.com/${musician.instagram.replace("@", "")}`
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
                  {musician.youtube && (
                    <Box
                      component="a"
                      href={
                        musician.youtube.startsWith("http")
                          ? musician.youtube
                          : `https://youtube.com/${musician.youtube}`
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
                  {musician.spotify && (
                    <Box
                      component="a"
                      href={
                        musician.spotify.startsWith("http")
                          ? musician.spotify
                          : `https://open.spotify.com/artist/${musician.spotify}`
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
                </Box>
              )}

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
