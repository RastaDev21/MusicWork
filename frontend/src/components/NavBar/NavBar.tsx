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
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Logo/Logo";
import Onboarding from "../Onboarding/Onboarding";
import { Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import api, {
  getImageUrl,
  getNotifications,
  getOpenReportsCount,
  getUnreadNotificationCount,
  markNotificationsAsRead,
  markOnboardingSeen,
  NotificationItem,
} from "../../services/api";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import FlagIcon from "@mui/icons-material/OutlinedFlag";

// Depois disso o ícone do tour sai do header; o tour continua em
// Configurações
const TOUR_ICON_DAYS = 14;

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
    case "comment_like":
      return `${name} curtiu seu comentário`;
    default:
      return `${name} interagiu com você`;
  }
}

export default function Navbar() {
  const { user, signOut, updateUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);
  const [openReports, setOpenReports] = useState(0);
  const onboardingChecked = useRef(false);
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

  // Conta de suporte: quantas denúncias abertas (badge no avatar e no item
  // "Denúncias" do menu)
  useEffect(() => {
    if (!user?.isSupport) return;
    getOpenReportsCount()
      .then(setOpenReports)
      .catch(() => {
        // silencioso
      });
  }, [user?.isSupport, location.pathname]);

  // Tour abre sozinho uma vez por conta, depois do aceite dos termos
  // (TermsGate). O usuário salvo no localStorage pode estar desatualizado (viu
  // o tour em outro aparelho), então confere no servidor antes de abrir.
  useEffect(() => {
    if (
      !user ||
      !user.termsAcceptedAt ||
      user.onboardingSeenAt ||
      onboardingChecked.current
    ) {
      return;
    }
    onboardingChecked.current = true;

    async function checkOnboarding() {
      try {
        const { data } = await api.get("/profile");
        if (data.onboardingSeenAt) {
          updateUser({ onboardingSeenAt: data.onboardingSeenAt });
          return;
        }
        setTourOpen(true);
      } catch {
        // silencioso: tenta de novo na próxima tela
        onboardingChecked.current = false;
      }
    }
    checkOnboarding();
  }, [user, updateUser]);

  // Marca como visto ao fechar, não ao abrir: enquanto o tour está aberto o
  // banner de notificações do Feed fica escondido (PushPrompt), e ao fechar
  // ele só aparece se a pessoa pulou antes da tela de notificações.
  async function handleCloseTour() {
    setTourOpen(false);
    if (user?.onboardingSeenAt) return;
    try {
      const seenAt = await markOnboardingSeen();
      updateUser({ onboardingSeenAt: seenAt });
    } catch {
      // silencioso: o tour volta na próxima tela
      onboardingChecked.current = false;
    }
  }

  const showTourIcon =
    !!user?.onboardingSeenAt &&
    Date.now() - new Date(user.onboardingSeenAt).getTime() <
      TOUR_ICON_DAYS * 24 * 60 * 60 * 1000;

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
          {showTourIcon && (
            <IconButton
              sx={{ color: "#aaa" }}
              onClick={() => setTourOpen(true)}
              aria-label="Conheça o MusicWork"
            >
              <HelpOutlineIcon />
            </IconButton>
          )}

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

          <Badge
            badgeContent={openReports}
            color="error"
            overlap="circular"
            invisible={!user?.isSupport || openReports === 0}
          >
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
          </Badge>

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
            {/* Item desabilitado recebe opacidade do MUI pela classe
                .Mui-disabled, que ganha de um `opacity` solto no sx */}
            <MenuItem disabled sx={{ pb: 0, "&.Mui-disabled": { opacity: 1 } }}>
              <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                {user?.name}
              </Typography>
            </MenuItem>
            <MenuItem disabled sx={{ pt: 0, "&.Mui-disabled": { opacity: 1 } }}>
              <Typography sx={{ color: "#999", fontSize: 12 }}>
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
              onClick={() => {
                handleCloseMenu();
                navigate("/configuracoes");
              }}
              sx={{
                color: "#aaa",
                gap: 1,
                "&:hover": { color: "#fff", backgroundColor: "#2a2a2a" },
              }}
            >
              <SettingsIcon fontSize="small" />
              Configurações
            </MenuItem>

            {user?.isSupport && (
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  navigate("/denuncias");
                }}
                sx={{
                  color: "#aaa",
                  gap: 1,
                  "&:hover": { color: "#fff", backgroundColor: "#2a2a2a" },
                }}
              >
                <FlagIcon fontSize="small" />
                Denúncias{openReports > 0 ? ` (${openReports})` : ""}
              </MenuItem>
            )}

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
      <Onboarding open={tourOpen} onClose={handleCloseTour} />
    </AppBar>
  );
}
