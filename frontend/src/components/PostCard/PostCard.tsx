import { Box, Typography, Avatar, IconButton, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import api from "../../services/api";

interface PostCardProps {
  id: string;
  name: string;
  instrument: string;
  secondaryProfession: string;
  city: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  likedByMe?: boolean;
  avatarUrl?: string | null;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export default function PostCard({
  id,
  name,
  instrument,
  secondaryProfession,
  city,
  time,
  content,
  likes,
  comments,
  likedByMe = false,
  avatarUrl,
  isOwner,
  onDelete,
}: PostCardProps) {
  const [liked, setLiked] = useState(likedByMe);
  const [likesCount, setLikesCount] = useState(likes);

  async function handleLike() {
    try {
      const response = await api.post(`/likes/${id}`);

      if (response.data.liked) {
        setLiked(true);
        setLikesCount(prev => prev + 1);
      } else {
        setLiked(false);
        setLikesCount(prev => prev - 1);
      }
    } catch (error) {
      console.error("Erro ao curtir:", error);
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        borderRadius: 3,
        border: "1px solid #2a2a2a",
        p: 2.5,
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <Avatar
          src={
            avatarUrl
              ? `${import.meta.env.VITE_API_URL}${avatarUrl}`
              : undefined
          }
          sx={{ backgroundColor: "#7c4dff", fontWeight: 700 }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
              {name}
            </Typography>
            <Chip
              label={instrument}
              size="small"
              sx={{
                backgroundColor: "#7c4dff22",
                color: "#9c6fe4",
                fontSize: 11,
                height: 20,
              }}
            />
          </Box>
          <Typography sx={{ color: "#666", fontSize: 12 }}>
            {secondaryProfession} · {city} · {time}
          </Typography>
        </Box>

        {isOwner && onDelete && (
          <IconButton
            size="small"
            onClick={() => onDelete(id)}
            sx={{
              color: "#555",
              "&:hover": { color: "#ff4d6d", backgroundColor: "#ff4d6d11" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Typography sx={{ color: "#ccc", fontSize: 14, lineHeight: 1.7, mb: 2 }}>
        {content}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          borderTop: "1px solid #2a2a2a",
          pt: 1.5,
        }}
      >
        {/* Botão de curtir */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={handleLike}
            sx={{
              color: liked ? "#ff4d6d" : "#666",
              "&:hover": { color: "#ff4d6d" },
              transition: "color 0.2s",
            }}
          >
            {/* Coração cheio se curtido, vazio se não */}
            {liked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          <Typography sx={{ color: liked ? "#ff4d6d" : "#666", fontSize: 13 }}>
            {likesCount}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            sx={{ color: "#666", "&:hover": { color: "#7c4dff" } }}
          >
            <ModeCommentOutlinedIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ color: "#666", fontSize: 13 }}>
            {comments}
          </Typography>
        </Box>

        <IconButton
          size="small"
          sx={{ color: "#666", "&:hover": { color: "#7c4dff" } }}
        >
          <ShareIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
