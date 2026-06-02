import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import PostCard from "../components/PostCard/PostCard";
import NewPost from "../components/NewPost/NewPost";
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

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    const token = localStorage.getItem("musicwork_token");
    if (!token) return;

    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("musicwork_token");
    if (token) {
      loadPosts();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <NewPost onPost={loadPosts} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#7c4dff" }} />
          </Box>
        ) : posts.length === 0 ? (
          <Typography sx={{ color: "#aaa", textAlign: "center", mt: 4 }}>
            Nenhum post ainda. Seja o primeiro! 🎵
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
    </Layout>
  );
}
