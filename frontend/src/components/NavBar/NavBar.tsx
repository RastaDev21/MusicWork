import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo/Logo";
import { Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  function handleSearch(e: React.KeyboardEvent) {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/buscar?q=${searchQuery.trim()}`);
    }
  }

  function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleSignOut() {
    handleCloseMenu();
    signOut();
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1a1a1a",
        borderBottom: "1px solid #2a2a2a",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", gap: 2, position: "relative" }}
      >
        {" "}
        <Box sx={{ width: 160, flexShrink: 0 }}>
          <Logo />
        </Box>
        <Box
          sx={{
            position: "absolute",
            left: { md: "calc(50% + 110px)", xs: "50%" },
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#0f0f0f",
            borderRadius: "20px",
            border: "1px solid #2a2a2a",
            alignItems: "center",
            px: 2,
            py: 0.5,
            display:
              location.pathname === "/buscar"
                ? "none"
                : { xs: "none", md: "flex" },
          }}
        >
          <SearchIcon sx={{ color: "#555", fontSize: 18, mr: 1 }} />
          <InputBase
            placeholder="Buscar músicos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            sx={{ color: "#aaa", fontSize: 14, flex: 1 }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton sx={{ color: "#aaa" }}>
            <NotificationsIcon />
          </IconButton>

          <Avatar
            onClick={handleOpenMenu}
            src={
              user?.avatarUrl
                ? `http://localhost:3333${user.avatarUrl}`
                : undefined
            }
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "#7c4dff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              "&:hover": { opacity: 0.85 },
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 2,
                  mt: 1,
                },
              },
            }}
          >
            <MenuItem disabled sx={{ opacity: 1, pb: 0 }}>
              <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                {user?.name}
              </Typography>
            </MenuItem>
            <MenuItem disabled sx={{ opacity: 1, pt: 0 }}>
              <Typography sx={{ color: "#666", fontSize: 12 }}>
                {user?.instrument} · {user?.city}
              </Typography>
            </MenuItem>

            <Box sx={{ borderTop: "1px solid #2a2a2a", my: 0.5 }} />

            <MenuItem
              onClick={() => {
                handleCloseMenu();
                navigate("/perfil");
              }}
              sx={{
                color: "#aaa",
                gap: 1,
                "&:hover": { color: "#fff", backgroundColor: "#2a2a2a" },
              }}
            >
              <PersonIcon fontSize="small" />
              Perfil
            </MenuItem>

            <MenuItem
              onClick={handleSignOut}
              sx={{
                color: "#ff4d6d",
                gap: 1,
                "&:hover": { backgroundColor: "#2a2a2a" },
              }}
            >
              <LogoutIcon fontSize="small" />
              Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
