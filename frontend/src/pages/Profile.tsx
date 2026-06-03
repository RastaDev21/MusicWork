import { Box, Typography, Chip, Button, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard/PostCard";
import { useEffect, useState } from "react";
import api from "../services/api";

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

function timeAgo(date: string) {
  const now = new Date();
  const created = new Date(date);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000 / 60);
  if (diff < 1) return "agora";
  if (diff < 60) return `${diff}min atrás`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`;
  return `${Math.floor(diff / 1440)}d atrás`;
}

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function loadMyPosts() {
      try {
        const response = await api.get("/posts");
        const myPosts = response.data.filter(
          (post: Post & { userId: string }) => post.User.name === user?.name,
        );
        setPosts(myPosts);
      } catch (error) {
        console.error(error);
      }
    }
    loadMyPosts();
  }, [user]);

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {/* Capa */}
        <Box
          sx={{
            height: 160,
            backgroundColor: "#2a2a2a",
            position: "relative",
          }}
        />

        {/* Header do perfil */}
        <Box sx={{ px: 3, pb: 2, borderBottom: "1px solid #2a2a2a" }}>
          {/* Avatar */}
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
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
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

          {/* Estatísticas */}
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
        </Box>

        {/* Conteúdo */}
        <Box sx={{ display: "flex", gap: 2, p: 2 }}>
          {/* Posts */}
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

          {/* Card lateral — só desktop */}
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
    </Layout>
  );
}
