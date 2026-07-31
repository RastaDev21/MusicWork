import {
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Dialog,
  DialogContent,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useState } from "react";
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
  "Todos os estilos": "#7c4dff",
  Outro: "#7c4dff",
};

const dialogCenterSx = {
  "& .MuiDialog-container": {
    "@media (min-width: 900px)": { paddingLeft: "220px" },
  },
};

function formatDate(dateTime: string) {
  const d = new Date(dateTime);
  const day = d.toLocaleDateString("pt-BR", { day: "2-digit" });
  const month = d.toLocaleDateString("pt-BR", { month: "short" });
  const time = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const fullDate = d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return { day, month: month.replace(".", ""), time, fullDate };
}

interface ShowCardProps {
  show: Show;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
}

export default function ShowCard({ show, isOwner, onDelete }: ShowCardProps) {
  const navigate = useNavigate();
  const [openDetails, setOpenDetails] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);
  const { day, month, time, fullDate } = formatDate(show.dateTime);
  const color = genreColors[show.genre] || "#7c4dff";

  function handleMusicianClick(e: React.MouseEvent) {
    e.stopPropagation();
    navigate(`/musico/${show.User.id}`);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete?.(show.id);
  }

  return (
    <>
      <Box
        onClick={() => setOpenDetails(true)}
        sx={{
          backgroundColor: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 3,
          p: 1.5,
          display: "flex",
          gap: 1.5,
          mb: 1.5,
          cursor: "pointer",
          "&:hover": { borderColor: "#7c4dff" },
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

          <Box
            onClick={handleMusicianClick}
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
            onClick={handleDeleteClick}
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

      {/* Modal de detalhes */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="sm"
        fullWidth
        sx={dialogCenterSx}
        slotProps={{
          paper: { sx: { backgroundColor: "#1a1a1a", borderRadius: 3 } },
        }}
      >
        <IconButton
          onClick={() => setOpenDetails(false)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#aaa",
            zIndex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {show.flyerUrl && (
          <Box
            onClick={() => setOpenLightbox(true)}
            sx={{
              position: "relative",
              width: "100%",
              maxHeight: 320,
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: "zoom-in",
              "&:hover .zoom-hint": { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={getImageUrl(show.flyerUrl)}
              sx={{
                width: "100%",
                maxHeight: 320,
                objectFit: "contain",
                display: "block",
              }}
            />
            <Box
              className="zoom-hint"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: "50%",
                p: 0.5,
                display: "flex",
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
            >
              <ZoomInIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
          </Box>
        )}

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              {show.title}
            </Typography>
            <Chip
              label={show.genre}
              size="small"
              sx={{ backgroundColor: `${color}22`, color, fontSize: 11 }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: 13,
              color: "#aaa",
              mb: 0.5,
              textTransform: "capitalize",
            }}
          >
            {fullDate} às {time}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#aaa", mb: 1.5 }}>
            {show.city}
            {show.venue ? ` · ${show.venue}` : ""}
          </Typography>

          {show.description && (
            <Typography
              sx={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, mb: 1.5 }}
            >
              {show.description}
            </Typography>
          )}

          <Box
            onClick={handleMusicianClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            <Avatar
              src={getImageUrl(show.User.avatarUrl)}
              sx={{
                width: 28,
                height: 28,
                fontSize: 12,
                backgroundColor: "#7c4dff",
              }}
            >
              {show.User.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              sx={{
                fontSize: 13,
                color: "#9c6fe4",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {show.User.name}
            </Typography>
          </Box>

          {isOwner && onDelete && (
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => {
                onDelete(show.id);
                setOpenDetails(false);
              }}
              sx={{
                mt: 2,
                color: "#ff4d6d",
                border: "1px solid #ff4d6d",
                "&:hover": { backgroundColor: "#ff4d6d11" },
              }}
            >
              Deletar show
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox do flyer em tamanho grande */}
      {show.flyerUrl && (
        <Dialog
          open={openLightbox}
          onClose={() => setOpenLightbox(false)}
          maxWidth="md"
          fullWidth
          sx={dialogCenterSx}
          slotProps={{
            paper: {
              sx: { backgroundColor: "transparent", boxShadow: "none" },
            },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setOpenLightbox(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={getImageUrl(show.flyerUrl)}
              sx={{
                width: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
                display: "block",
                borderRadius: 2,
              }}
            />
          </Box>
        </Dialog>
      )}
    </>
  );
}
