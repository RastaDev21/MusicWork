import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import api, { getImageUrl } from "../../services/api";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/AuthContext";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  User: {
    id: string;
    name: string;
    avatarUrl: string | null;
    instrument: string;
  };
}

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
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(comments);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  function handleShare() {
    const url = `https://music-work.vercel.app/post/${id}`;
    navigator.clipboard.writeText(url);
    enqueueSnackbar("Link copiado!", { variant: "success" });
  }

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

  async function handleToggleComments() {
    if (!showComments && commentsList.length === 0) {
      setLoadingComments(true);
      try {
        const res = await api.get(`/posts/${id}/comments`);
        setCommentsList(res.data);
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(prev => !prev);
  }

  async function handleSendComment() {
    if (!newComment.trim()) return;
    setSendingComment(true);
    try {
      const res = await api.post(`/posts/${id}/comments`, {
        content: newComment,
      });
      setCommentsList(prev => [...prev, res.data]);
      setCommentsCount(prev => prev + 1);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao comentar:", error);
    } finally {
      setSendingComment(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await api.delete(`/comments/${commentId}`);
      setCommentsList(prev => prev.filter(c => c.id !== commentId));
      setCommentsCount(prev => prev - 1);
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
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
          src={getImageUrl(avatarUrl)}
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
            onClick={handleToggleComments}
            sx={{
              color: showComments ? "#7c4dff" : "#666",
              "&:hover": { color: "#7c4dff" },
            }}
          >
            <ModeCommentOutlinedIcon fontSize="small" />
          </IconButton>
          <Typography
            sx={{ color: showComments ? "#7c4dff" : "#666", fontSize: 13 }}
          >
            {commentsCount}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={handleShare}
          sx={{ color: "#666", "&:hover": { color: "#7c4dff" } }}
        >
          <ShareIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Seção de comentários */}
      {showComments && (
        <Box sx={{ mt: 2, borderTop: "1px solid #2a2a2a", pt: 2 }}>
          {loadingComments ? (
            <Typography sx={{ color: "#666", fontSize: 13 }}>
              Carregando...
            </Typography>
          ) : (
            <>
              {commentsList.length === 0 && (
                <Typography sx={{ color: "#555", fontSize: 13, mb: 1.5 }}>
                  Nenhum comentário ainda. Seja o primeiro!
                </Typography>
              )}
              {commentsList.map(comment => (
                <Box key={comment.id} sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                  <Avatar
                    src={getImageUrl(comment.User?.avatarUrl)}
                    sx={{
                      width: 28,
                      height: 28,
                      fontSize: 12,
                      backgroundColor: "#7c4dff",
                    }}
                  >
                    {comment.User?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: "#242424",
                      borderRadius: 2,
                      px: 1.5,
                      py: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{ color: "#9c6fe4", fontSize: 12, fontWeight: 600 }}
                      >
                        {comment.User?.name}
                      </Typography>
                      {user?.id === comment.User?.id && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteComment(comment.id)}
                          sx={{
                            color: "#444",
                            "&:hover": { color: "#ff4d6d" },
                            p: 0.2,
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                    </Box>
                    <Typography sx={{ color: "#ccc", fontSize: 13 }}>
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Input novo comentário */}
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Avatar
                  src={getImageUrl(user?.avatarUrl)}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 12,
                    backgroundColor: "#7c4dff",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Escreva um comentário..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e =>
                      e.key === "Enter" && !e.shiftKey && handleSendComment()
                    }
                    disabled={sendingComment}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        fontSize: 13,
                        "& fieldset": { borderColor: "#333" },
                        "&:hover fieldset": { borderColor: "#7c4dff" },
                        "&.Mui-focused fieldset": { borderColor: "#7c4dff" },
                      },
                      "& input::placeholder": { color: "#555" },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleSendComment}
                    disabled={sendingComment || !newComment.trim()}
                    sx={{
                      color: "#7c4dff",
                      "&:hover": { backgroundColor: "#7c4dff22" },
                      "&.Mui-disabled": { color: "#444" },
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
}
