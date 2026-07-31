import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import PostCard from "../components/PostCard/PostCard";
import NewPost from "../components/NewPost/NewPost";
import api, { pinPost, unpinPost } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

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

export default function Feed() {
  const PAGE_SIZE = 20;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user: currentUser } = useAuth();

  async function loadPosts() {
    const token = localStorage.getItem("musicwork_token");
    if (!token) return;

    try {
      const response = await api.get(`/posts?limit=${PAGE_SIZE}&offset=0`);
      setPosts(response.data);
      setHasMore(response.data.length === PAGE_SIZE);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    setLoadingMore(true);
    try {
      const response = await api.get(
        `/posts?limit=${PAGE_SIZE}&offset=${posts.length}`,
      );
      setPosts(prev => [...prev, ...response.data]);
      setHasMore(response.data.length === PAGE_SIZE);
    } catch (error) {
      console.error("Erro ao carregar mais posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }
  async function handleDelete(postId: string) {
    try {
      await api.delete(`/posts/${postId}`);
      loadPosts();
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  }

  async function handleTogglePin(postId: string) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.isPinned) {
        await unpinPost(postId);
      } else {
        await pinPost(postId);
      }
      loadPosts();
    } catch (error) {
      console.error("Erro ao fixar/desafixar post:", error);
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
              isOwner={currentUser?.id === post.userId}
              isPinned={post.isPinned}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
              avatarUrl={post.User.avatarUrl}
            />
          ))
        )}

        {!loading && hasMore && posts.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 2 }}>
            <Button
              onClick={loadMore}
              disabled={loadingMore}
              sx={{
                color: "#7c4dff",
                border: "1px solid #7c4dff",
                "&:hover": { backgroundColor: "#7c4dff11" },
              }}
            >
              {loadingMore ? "Carregando..." : "Carregar mais"}
            </Button>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
