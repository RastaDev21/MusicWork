import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Typography,
  Badge,
  Divider,
  Avatar as MuiAvatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo/Logo";
import { Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getImageUrl,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsAsRead,
  NotificationItem,
} from "../../services/api";

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

function notificationText(notification: NotificationItem) {
  const name = notification.sender?.name || "Alguém";
  switch (notification.type) {
    case "follow":
      return `${name} começou a seguir você`;
    case "like":
      return `${name} curtiu sua publicação`;
    case "comment":
      return `${name} comentou na sua publicação`;
    case "reply":
      return `${name} respondeu seu comentário`;
    default:
      return `${name} interagiu com você`;
  }
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch {
      // silencioso: não trava a navbar por causa disso
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  async function handleOpenNotifications(event: React.MouseEvent<HTMLElement>) {
    setNotifAnchorEl(event.currentTarget);
    try {
      const data = await getNotifications();
      setNotifications(data);
      if (unreadCount > 0) {
        await markNotificationsAsRead();
        setUnreadCount(0);
      }
    } catch {
      // silencioso
    }
  }

  function handleCloseNotifications() {
    setNotifAnchorEl(null);
  }

  function handleNotificationClick(notification: NotificationItem) {
    handleCloseNotifications();
    if (notification.type === "follow") {
      navigate(`/musico/${notification.sender.id}`);
    } else {
      navigate("/feed");
    }
  }

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
          <IconButton sx={{ color: "#aaa" }} onClick={handleOpenNotifications}>
            <Badge
              badgeContent={unreadCount}
              max={9}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: 10,
                  height: 16,
                  minWidth: 16,
                },
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleCloseNotifications}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 2,
                  mt: 1,
                  width: 320,
                  maxHeight: 420,
                },
              },
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                px: 2,
                py: 1,
              }}
            >
              Notificações
            </Typography>
            <Divider sx={{ borderColor: "#2a2a2a" }} />

            {notifications.length === 0 && (
              <Typography sx={{ color: "#666", fontSize: 13, px: 2, py: 2 }}>
                Nenhuma notificação por enquanto.
              </Typography>
            )}

            {notifications.map(notification => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  gap: 1.5,
                  py: 1.2,
                  alignItems: "flex-start",
                  whiteSpace: "normal",
                  backgroundColor: notification.read
                    ? "transparent"
                    : "rgba(124, 77, 255, 0.08)",
                  "&:hover": { backgroundColor: "#2a2a2a" },
                }}
              >
                <MuiAvatar
                  src={getImageUrl(notification.sender?.avatarUrl)}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#7c4dff",
                    fontSize: 13,
                  }}
                >
                  {notification.sender?.name?.charAt(0).toUpperCase()}
                </MuiAvatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{ color: "#ddd", fontSize: 13, lineHeight: 1.4 }}
                  >
                    {notificationText(notification)}
                  </Typography>
                  <Typography sx={{ color: "#666", fontSize: 11, mt: 0.3 }}>
                    {timeAgo(notification.createdAt)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>

          <Avatar
            onClick={handleOpenMenu}
            src={getImageUrl(user?.avatarUrl)}
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
