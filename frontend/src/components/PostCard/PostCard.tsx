import { Box, Typography, Avatar, IconButton, Chip } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
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
  isOwner,
  onDelete,
}: PostCardProps) {
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
        <Avatar sx={{ backgroundColor: "#7c4dff", fontWeight: 700 }}>
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
            <DeleteIcon fontSize="small" />{" "}
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
            sx={{ color: "#666", "&:hover": { color: "#ff4d6d" } }}
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ color: "#666", fontSize: 13 }}>{likes}</Typography>
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
