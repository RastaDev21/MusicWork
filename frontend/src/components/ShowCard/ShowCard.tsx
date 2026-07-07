import { Box, Typography, Chip, IconButton, Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { getImageUrl, Show } from "../../services/api";

const genreColors: Record<string, string> = {
  Rock: "#ff4d6d",
  Samba: "#f9c74f",
  Jazz: "#577590",
  MPB: "#43aa8b",
  Reggae: "#90be6d",
  Funk: "#f3722c",
  Forró: "#f8961e",
  Pagode: "#f9844a",
  Blues: "#277da1",
  Metal: "#4d4d4d",
  Pop: "#e63980",
  Gospel: "#9c6fe4",
  Eletrônico: "#4361ee",
  Clássico: "#7209b7",
  "Bossa Nova": "#2a9d8f",
  Outro: "#7c4dff",
};

function formatDate(dateTime: string) {
  const d = new Date(dateTime);
  const day = d.toLocaleDateString("pt-BR", { day: "2-digit" });
  const month = d.toLocaleDateString("pt-BR", { month: "short" });
  const time = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { day, month: month.replace(".", ""), time };
}

interface ShowCardProps {
  show: Show;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export default function ShowCard({ show, isOwner, onDelete }: ShowCardProps) {
  const navigate = useNavigate();
  const { day, month, time } = formatDate(show.dateTime);
  const color = genreColors[show.genre] || "#7c4dff";

  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 3,
        p: 1.5,
        display: "flex",
        gap: 1.5,
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: 2,
          backgroundColor: "#7c4dff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
          {day}
        </Typography>
        <Typography sx={{ fontSize: 9, textTransform: "uppercase" }}>
          {month}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
            {show.title}
          </Typography>
          <Chip
            label={show.genre}
            size="small"
            sx={{
              backgroundColor: `${color}22`,
              color,
              fontSize: 10,
              height: 18,
            }}
          />
        </Box>

        <Typography sx={{ fontSize: 12, color: "#888", mt: 0.3 }}>
          {time} · {show.city}
          {show.venue ? ` · ${show.venue}` : ""}
        </Typography>

        {show.description && (
          <Typography sx={{ fontSize: 12, color: "#aaa", mt: 0.5 }}>
            {show.description}
          </Typography>
        )}

        <Box
          onClick={() => navigate(`/musico/${show.User.id}`)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            mt: 0.7,
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          <Avatar
            src={getImageUrl(show.User.avatarUrl)}
            sx={{
              width: 18,
              height: 18,
              fontSize: 9,
              backgroundColor: "#7c4dff",
            }}
          >
            {show.User.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            sx={{
              fontSize: 12,
              color: "#9c6fe4",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {show.User.name}
          </Typography>
        </Box>
      </Box>

      {isOwner && onDelete && (
        <IconButton
          size="small"
          onClick={() => onDelete(show.id)}
          sx={{
            color: "#555",
            alignSelf: "flex-start",
            "&:hover": { color: "#ff4d6d", backgroundColor: "#ff4d6d11" },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
