import { AppBar, Toolbar, Box, IconButton, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo/Logo";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1a1a1a",
        borderBottom: "1px solid #2a2a2a",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ width: 160, flexShrink: 0 }}>
          <Logo />
        </Box>

        <Box
          sx={{
            flex: 1,
            maxWidth: 400,
            backgroundColor: "#0f0f0f",
            borderRadius: "20px",
            border: "1px solid #2a2a2a",
            alignItems: "center",
            px: 2,
            py: 0.5,
            display: { xs: "none", md: "flex" },
          }}
        >
          <SearchIcon sx={{ color: "#555", fontSize: 18, mr: 1 }} />
          <InputBase
            placeholder="Buscar músicos..."
            sx={{ color: "#aaa", fontSize: 14, flex: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton sx={{ color: "#aaa" }}>
            <NotificationsIcon />
          </IconButton>

          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#7c4dff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
