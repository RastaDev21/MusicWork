import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "notistack";
import {
  getMessages,
  sendMessage,
  uploadMessageImage,
  uploadMessageVideo,
  getImageUrl,
  ChatMessage,
} from "../services/api";

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chat() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadMessages() {
    if (!id) return;
    try {
      const data = await getMessages(id);
      setMessages(data);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (videoFile) {
      enqueueSnackbar("Remova o vídeo antes de anexar uma foto.", {
        variant: "warning",
      });
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function handleSelectVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageFile) {
      enqueueSnackbar("Remova a foto antes de anexar um vídeo.", {
        variant: "warning",
      });
      e.target.value = "";
      return;
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  async function handleSend() {
    if (!id || (!content.trim() && !imageFile && !videoFile)) return;

    setSending(true);
    try {
      let imageUrl: string | undefined;
      let videoUrl: string | undefined;

      if (imageFile) {
        const data = await uploadMessageImage(imageFile);
        imageUrl = data.imageUrl;
      }
      if (videoFile) {
        const data = await uploadMessageVideo(videoFile);
        videoUrl = data.videoUrl;
      }

      const message = await sendMessage(id, { content, imageUrl, videoUrl });
      setMessages(prev => [...prev, message]);
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      setVideoFile(null);
      setVideoPreview(null);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      enqueueSnackbar("Erro ao enviar mensagem", { variant: "error" });
    } finally {
      setSending(false);
    }
  }

  const otherUser = messages.find(m => m.senderId !== user?.id)?.sender;

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          <IconButton
            onClick={() => navigate("/mensagens")}
            sx={{ color: "#aaa" }}
          >
            <ArrowBackIcon />
          </IconButton>
          {otherUser && (
            <>
              <Avatar
                src={getImageUrl(otherUser.avatarUrl)}
                sx={{ backgroundColor: "#7c4dff" }}
              >
                {otherUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
                {otherUser.name}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress sx={{ color: "#7c4dff" }} />
            </Box>
          ) : (
            messages.map(msg => {
              const isMine = msg.senderId === user?.id;
              return (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ maxWidth: "75%" }}>
                    <Box
                      sx={{
                        backgroundColor: isMine ? "#7c4dff" : "#242424",
                        color: isMine ? "#fff" : "#eee",
                        borderRadius: isMine
                          ? "12px 12px 2px 12px"
                          : "12px 12px 12px 2px",
                        px: 1.5,
                        py: 1,
                        overflow: "hidden",
                      }}
                    >
                      {msg.imageUrl && (
                        <Box
                          component="img"
                          src={getImageUrl(msg.imageUrl)}
                          sx={{
                            width: "100%",
                            maxHeight: 260,
                            objectFit: "cover",
                            borderRadius: 1.5,
                            mb: msg.content ? 1 : 0,
                          }}
                        />
                      )}
                      {msg.videoUrl && (
                        <Box
                          component="video"
                          src={getImageUrl(msg.videoUrl)}
                          controls
                          sx={{
                            width: "100%",
                            maxHeight: 260,
                            borderRadius: 1.5,
                            mb: msg.content ? 1 : 0,
                            backgroundColor: "#000",
                          }}
                        />
                      )}
                      {msg.content && (
                        <Typography sx={{ fontSize: 14 }}>
                          {msg.content}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: "#666",
                        mt: 0.3,
                        textAlign: isMine ? "right" : "left",
                      }}
                    >
                      {formatTime(msg.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
          <div ref={bottomRef} />
        </Box>

        {imagePreview && (
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              m: 1.5,
              mb: 0,
            }}
          >
            <Box
              component="img"
              src={imagePreview}
              sx={{ maxHeight: 120, borderRadius: 2 }}
            />
            <IconButton
              size="small"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              disabled={sending}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {videoPreview && (
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              m: 1.5,
              mb: 0,
            }}
          >
            <Box
              component="video"
              src={videoPreview}
              controls
              sx={{ maxHeight: 140, borderRadius: 2, backgroundColor: "#000" }}
            />
            <IconButton
              size="small"
              onClick={() => {
                setVideoFile(null);
                setVideoPreview(null);
              }}
              disabled={sending}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            p: 1.5,
            borderTop: "1px solid #2a2a2a",
          }}
        >
          <IconButton
            component="label"
            size="small"
            sx={{ color: "#7c4dff" }}
            disabled={sending}
          >
            <ImageIcon fontSize="small" />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleSelectImage}
              disabled={sending}
            />
          </IconButton>
          <IconButton
            component="label"
            size="small"
            sx={{ color: "#7c4dff" }}
            disabled={sending}
          >
            <VideocamIcon fontSize="small" />
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              hidden
              onChange={handleSelectVideo}
              disabled={sending}
            />
          </IconButton>

          <TextField
            fullWidth
            size="small"
            placeholder="Escreva uma mensagem..."
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={sending}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                borderRadius: 5,
                "& fieldset": { borderColor: "#2a2a2a" },
                "&:hover fieldset": { borderColor: "#7c4dff" },
                "&.Mui-focused fieldset": { borderColor: "#7c4dff" },
              },
            }}
          />

          <IconButton
            onClick={handleSend}
            disabled={sending || (!content.trim() && !imageFile && !videoFile)}
            sx={{
              backgroundColor: "#7c4dff",
              color: "#fff",
              "&:hover": { backgroundColor: "#6a3de8" },
              "&.Mui-disabled": { backgroundColor: "#333", color: "#666" },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Layout>
  );
}
