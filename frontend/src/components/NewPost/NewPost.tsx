import { Box, Avatar, InputBase, Button } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

export default function NewPost() {
  const { user } = useAuth();

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
        sx={{
          backgroundColor: "#7c4dff",
          fontWeight: 700,
          borderRadius: 2,
          whiteSpace: "nowrap",
          "&:hover": { backgroundColor: "#6a3de8" },
        }}
      >
        Postar
      </Button>
    </Box>
  );
}
