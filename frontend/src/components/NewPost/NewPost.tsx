import { Box, Avatar, InputBase, Button } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

interface NewPostProps {
  onPost: () => void;
}

export default function NewPost({ onPost }: NewPostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePost() {
    if (!content.trim()) return;

    setLoading(true);
    try {
      await api.post("/posts", { content });
      setContent("");
      onPost();
    } catch (error) {
      console.error("Erro ao criar post:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        borderRadius: 3,
        border: "1px solid #2a2a2a",
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Avatar sx={{ backgroundColor: "#7c4dff", fontWeight: 700 }}>
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>

      <InputBase
        fullWidth
        placeholder="No que você está pensando?"
        value={content}
        onChange={e => setContent(e.target.value)}
        sx={{
          color: "#aaa",
          fontSize: 14,
          backgroundColor: "#0f0f0f",
          borderRadius: 2,
          px: 2,
          py: 1,
          border: "1px solid #2a2a2a",
          "&:hover": { border: "1px solid #7c4dff" },
        }}
      />

      <Button
        variant="contained"
        onClick={handlePost}
        disabled={loading || !content.trim()}
        sx={{
          backgroundColor: "#7c4dff",
          fontWeight: 700,
          borderRadius: 2,
          whiteSpace: "nowrap",
          "&:hover": { backgroundColor: "#6a3de8" },
          "&:disabled": { backgroundColor: "#3a2a6a", color: "#666" },
        }}
      >
        {loading ? "Postando..." : "Postar"}
      </Button>
    </Box>
  );
}
