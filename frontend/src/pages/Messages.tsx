import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Badge,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import {
  listConversations,
  getImageUrl,
  ConversationSummary,
} from "../services/api";

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function previewText(msg: ConversationSummary["lastMessage"]) {
  if (!msg) return "Nenhuma mensagem ainda";
  if (msg.content) return msg.content;
  if (msg.imageUrl) return "📷 Foto";
  if (msg.videoUrl) return "🎥 Vídeo";
  return "";
}

export default function Messages() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await listConversations();
        setConversations(data);
      } catch (error) {
        console.error("Erro ao carregar conversas:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <Typography
          sx={{ color: "#fff", fontWeight: 700, fontSize: 20, mb: 2 }}
        >
          Mensagens
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#7c4dff" }} />
          </Box>
        ) : conversations.length === 0 ? (
          <Typography sx={{ color: "#aaa", textAlign: "center", mt: 4 }}>
            Nenhuma conversa ainda. Manda uma mensagem pra um músico pelo perfil
            dele! 💬
          </Typography>
        ) : (
          conversations.map(conv => (
            <Box
              key={conv.id}
              onClick={() => navigate(`/mensagens/${conv.id}`)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 3,
                cursor: "pointer",
                backgroundColor:
                  conv.unreadCount > 0 ? "#7c4dff11" : "transparent",
                "&:hover": { backgroundColor: "#1a1a1a" },
              }}
            >
              <Avatar
                src={getImageUrl(conv.otherUser.avatarUrl)}
                sx={{ backgroundColor: "#7c4dff", fontWeight: 700 }}
              >
                {conv.otherUser.name.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: conv.unreadCount > 0 ? 700 : 500,
                    }}
                  >
                    {conv.otherUser.name}
                  </Typography>
                  {conv.lastMessage && (
                    <Typography sx={{ color: "#666", fontSize: 11 }}>
                      {timeAgo(conv.lastMessage.createdAt)}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: conv.unreadCount > 0 ? "#ddd" : "#888",
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {previewText(conv.lastMessage)}
                  </Typography>
                  {conv.unreadCount > 0 && (
                    <Badge
                      badgeContent={conv.unreadCount}
                      color="error"
                      sx={{
                        ml: 1,
                        "& .MuiBadge-badge": {
                          position: "static",
                          transform: "none",
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Layout>
  );
}
