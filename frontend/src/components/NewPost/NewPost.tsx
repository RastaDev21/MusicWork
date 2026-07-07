import { Box, Avatar, InputBase, Button, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api, {
  getImageUrl,
  uploadPostImage,
  uploadPostVideo,
} from "../../services/api";
import { useSnackbar } from "notistack";

interface NewPostProps {
  onPost: () => void;
}

export default function NewPost({ onPost }: NewPostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (videoFile) {
      enqueueSnackbar(
        "Você só pode anexar uma foto ou um vídeo, não os dois. Remova o vídeo primeiro.",
        { variant: "warning" },
      );
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
      enqueueSnackbar(
        "Você só pode anexar uma foto ou um vídeo, não os dois. Remova a foto primeiro.",
        { variant: "warning" },
      );
      e.target.value = "";
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  function handleRemoveVideo() {
    setVideoFile(null);
    setVideoPreview(null);
  }

  async function handlePost() {
    if (!content.trim() && !imageFile && !videoFile) return;

    setLoading(true);
    try {
      let imageUrl: string | undefined;
      let videoUrl: string | undefined;

      if (imageFile) {
        const data = await uploadPostImage(imageFile);
        imageUrl = data.imageUrl;
      }

      if (videoFile) {
        const data = await uploadPostVideo(videoFile);
        videoUrl = data.videoUrl;
      }

      await api.post("/posts", { content, imageUrl, videoUrl });

      setContent("");
      handleRemoveImage();
      handleRemoveVideo();
      onPost();
    } catch (error: unknown) {
      let msg = "Erro ao criar o post. Tente novamente.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        if (err.response?.data?.error) {
          msg = err.response.data.error;
        }
      }
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  const canPost = content.trim() || imageFile || videoFile;

  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        borderRadius: 3,
        border: "1px solid #2a2a2a",
        p: 2,
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          src={getImageUrl(user?.avatarUrl)}
          sx={{ backgroundColor: "#7c4dff", fontWeight: 700 }}
        >
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
      </Box>

      {imagePreview && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box
              component="img"
              src={imagePreview}
              sx={{
                maxHeight: 180,
                borderRadius: 2,
                display: "block",
              }}
            />
            <IconButton
              size="small"
              onClick={handleRemoveImage}
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}

      {videoPreview && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box
              component="video"
              src={videoPreview}
              controls
              sx={{
                maxHeight: 220,
                maxWidth: "100%",
                borderRadius: 2,
                display: "block",
                backgroundColor: "#000",
              }}
            />
            <IconButton
              size="small"
              onClick={handleRemoveVideo}
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton component="label" size="small" sx={{ color: "#7c4dff" }}>
            <ImageIcon fontSize="small" />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleSelectImage}
            />
          </IconButton>
          <IconButton component="label" size="small" sx={{ color: "#7c4dff" }}>
            <VideocamIcon fontSize="small" />
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              hidden
              onChange={handleSelectVideo}
            />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          onClick={handlePost}
          disabled={loading || !canPost}
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
    </Box>
  );
}
