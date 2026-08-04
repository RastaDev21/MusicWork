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
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { useState } from "react";
import api, { getImageUrl } from "../../services/api";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getYoutubeEmbedUrl } from "../../constants/youtube";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  likesCount: number;
  likedByMe: boolean;
  User: {
    id: string;
    name: string;
    avatarUrl: string | null;
    instrument: string;
  };
}

interface PostCardProps {
  id: string;
  userId: string;
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
  imageUrl?: string | null;
  videoUrl?: string | null;
  isOwner?: boolean;
  isPinned?: boolean;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export default function PostCard({
  id,
  userId,
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
  imageUrl,
  videoUrl,
  isOwner,
  isPinned = false,
  onDelete,
  onTogglePin,
}: PostCardProps) {
  const [liked, setLiked] = useState(likedByMe);
  const [likesCount, setLikesCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(comments);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleGoToProfile() {
    if (isOwner) {
      navigate("/perfil");
    } else {
      navigate(`/musico/${userId}`);
    }
  }

  function handleShare() {
    // Não há página de post individual (nem rota /post/:id nem GET /posts/:id),
    // então compartilhamos o perfil do autor — um link real e alcançável.
    const url = `${window.location.origin}/musico/${userId}`;
    navigator.clipboard.writeText(url);
    enqueueSnackbar("Link do perfil copiado!", { variant: "success" });
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
      setCommentsList(prev => [
        ...prev,
        { ...res.data, likesCount: 0, likedByMe: false },
      ]);
      setCommentsCount(prev => prev + 1);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao comentar:", error);
    } finally {
      setSendingComment(false);
    }
  }

  async function handleSendReply(parentId: string) {
    if (!replyContent.trim()) return;
    setSendingReply(true);
    try {
      const res = await api.post(`/posts/${id}/comments`, {
        content: replyContent,
        parentId,
      });
      setCommentsList(prev => [
        ...prev,
        { ...res.data, likesCount: 0, likedByMe: false },
      ]);
      setCommentsCount(prev => prev + 1);
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Erro ao responder:", error);
    } finally {
      setSendingReply(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await api.delete(`/comments/${commentId}`);
      const repliesRemoved = commentsList.filter(
        c => c.parentId === commentId,
      ).length;
      setCommentsList(prev =>
        prev.filter(c => c.id !== commentId && c.parentId !== commentId),
      );
      setCommentsCount(prev => prev - 1 - repliesRemoved);
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
    }
  }

  async function handleLikeComment(commentId: string) {
    try {
      const response = await api.post(`/comment-likes/${commentId}`);
      const liked = response.data.liked;
      setCommentsList(prev =>
        prev.map(c =>
          c.id === commentId
            ? {
                ...c,
                likedByMe: liked,
                likesCount: c.likesCount + (liked ? 1 : -1),
              }
            : c,
        ),
      );
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        borderRadius: 3,
        border: isPinned ? "1px solid #7c4dff" : "1px solid #2a2a2a",
        p: 2.5,
        mb: 2,
      }}
    >
      {isPinned && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 1,
            color: "#7c4dff",
          }}
        >
          <PushPinIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
            Post fixado
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <Avatar
          src={getImageUrl(avatarUrl)}
          onClick={handleGoToProfile}
          sx={{
            backgroundColor: "#7c4dff",
            fontWeight: 700,
            cursor: "pointer",
          }}
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
            <Typography
              onClick={handleGoToProfile}
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
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

        {isOwner && onTogglePin && (
          <IconButton
            size="small"
            onClick={() => onTogglePin(id)}
            title={isPinned ? "Remover do topo do perfil" : "Fixar no perfil"}
            sx={{
              color: isPinned ? "#7c4dff" : "#555",
              "&:hover": { color: "#7c4dff", backgroundColor: "#7c4dff11" },
            }}
          >
            {isPinned ? (
              <PushPinIcon fontSize="small" />
            ) : (
              <PushPinOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        )}

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

      {content && (
        <Typography
          sx={{ color: "#ccc", fontSize: 14, lineHeight: 1.7, mb: 2 }}
        >
          {content}
        </Typography>
      )}

      {content && getYoutubeEmbedUrl(content) && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            pt: "56.25%",
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            component="iframe"
            src={getYoutubeEmbedUrl(content) || undefined}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </Box>
      )}

      {imageUrl && (
        <Box
          component="img"
          src={getImageUrl(imageUrl)}
          sx={{
            width: "100%",
            maxHeight: 500,
            objectFit: "cover",
            borderRadius: 2,
            mb: 2,
            display: "block",
          }}
        />
      )}

      {videoUrl && (
        <Box
          component="video"
          src={getImageUrl(videoUrl)}
          controls
          sx={{
            width: "100%",
            maxHeight: 500,
            borderRadius: 2,
            mb: 2,
            display: "block",
            backgroundColor: "#000",
          }}
        />
      )}

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

              {commentsList
                .filter(comment => !comment.parentId)
                .map(comment => {
                  const replies = commentsList.filter(
                    r => r.parentId === comment.id,
                  );
                  return (
                    <Box key={comment.id} sx={{ mb: 1.5 }}>
                      <Box sx={{ display: "flex", gap: 1 }}>
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
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
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
                                sx={{
                                  color: "#9c6fe4",
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                {comment.User?.name}
                              </Typography>
                              {user?.id === comment.User?.id && (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDeleteComment(comment.id)
                                  }
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

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              mt: 0.5,
                              ml: 0.5,
                            }}
                          >
                            <Box
                              onClick={() => handleLikeComment(comment.id)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.4,
                                cursor: "pointer",
                                color: comment.likedByMe ? "#ff4d6d" : "#666",
                                "&:hover": { color: "#ff4d6d" },
                              }}
                            >
                              {comment.likedByMe ? (
                                <FavoriteIcon sx={{ fontSize: 13 }} />
                              ) : (
                                <FavoriteBorderIcon sx={{ fontSize: 13 }} />
                              )}
                              <Typography sx={{ fontSize: 11 }}>
                                {comment.likesCount > 0
                                  ? comment.likesCount
                                  : ""}
                              </Typography>
                            </Box>

                            <Typography
                              onClick={() =>
                                setReplyingTo(prev =>
                                  prev === comment.id ? null : comment.id,
                                )
                              }
                              sx={{
                                color: "#666",
                                fontSize: 11,
                                cursor: "pointer",
                                "&:hover": { color: "#7c4dff" },
                              }}
                            >
                              Responder
                            </Typography>
                          </Box>

                          {/* Respostas */}
                          {replies.map(reply => (
                            <Box
                              key={reply.id}
                              sx={{ display: "flex", gap: 1, mt: 1, ml: 2 }}
                            >
                              <Avatar
                                src={getImageUrl(reply.User?.avatarUrl)}
                                sx={{
                                  width: 24,
                                  height: 24,
                                  fontSize: 11,
                                  backgroundColor: "#7c4dff",
                                }}
                              >
                                {reply.User?.name?.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    backgroundColor: "#1f1f1f",
                                    borderRadius: 2,
                                    px: 1.5,
                                    py: 0.8,
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
                                      sx={{
                                        color: "#9c6fe4",
                                        fontSize: 11,
                                        fontWeight: 600,
                                      }}
                                    >
                                      {reply.User?.name}
                                    </Typography>
                                    {user?.id === reply.User?.id && (
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleDeleteComment(reply.id)
                                        }
                                        sx={{
                                          color: "#444",
                                          "&:hover": { color: "#ff4d6d" },
                                          p: 0.2,
                                        }}
                                      >
                                        <DeleteIcon sx={{ fontSize: 12 }} />
                                      </IconButton>
                                    )}
                                  </Box>
                                  <Typography
                                    sx={{ color: "#ccc", fontSize: 12 }}
                                  >
                                    {reply.content}
                                  </Typography>
                                </Box>

                                <Box
                                  onClick={() => handleLikeComment(reply.id)}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.4,
                                    mt: 0.4,
                                    ml: 0.5,
                                    cursor: "pointer",
                                    width: "fit-content",
                                    color: reply.likedByMe ? "#ff4d6d" : "#666",
                                    "&:hover": { color: "#ff4d6d" },
                                  }}
                                >
                                  {reply.likedByMe ? (
                                    <FavoriteIcon sx={{ fontSize: 12 }} />
                                  ) : (
                                    <FavoriteBorderIcon sx={{ fontSize: 12 }} />
                                  )}
                                  <Typography sx={{ fontSize: 10 }}>
                                    {reply.likesCount > 0
                                      ? reply.likesCount
                                      : ""}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          ))}

                          {/* Input de resposta */}
                          {replyingTo === comment.id && (
                            <Box sx={{ display: "flex", gap: 1, mt: 1, ml: 2 }}>
                              <TextField
                                fullWidth
                                size="small"
                                autoFocus
                                placeholder={`Responder ${comment.User?.name}...`}
                                value={replyContent}
                                onChange={e => setReplyContent(e.target.value)}
                                onKeyDown={e =>
                                  e.key === "Enter" &&
                                  !e.shiftKey &&
                                  handleSendReply(comment.id)
                                }
                                disabled={sendingReply}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    color: "#fff",
                                    fontSize: 12,
                                    "& fieldset": { borderColor: "#333" },
                                    "&:hover fieldset": {
                                      borderColor: "#7c4dff",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#7c4dff",
                                    },
                                  },
                                  "& input::placeholder": { color: "#555" },
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleSendReply(comment.id)}
                                disabled={sendingReply || !replyContent.trim()}
                                sx={{
                                  color: "#7c4dff",
                                  "&:hover": {
                                    backgroundColor: "#7c4dff22",
                                  },
                                  "&.Mui-disabled": { color: "#444" },
                                }}
                              >
                                <SendIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}

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
