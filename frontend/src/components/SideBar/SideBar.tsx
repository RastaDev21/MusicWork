import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const menuItems = [
  { label: "Feed", icon: <HomeIcon />, path: "/feed" },
  { label: "Buscar", icon: <SearchIcon />, path: "/buscar" },
  { label: "Trampo", icon: <WorkIcon />, path: "/trampo" },
  { label: "Perfil", icon: <PersonIcon />, path: "/perfil" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Box
      sx={{
        width: 220,
        backgroundColor: "#141414",
        borderRight: "1px solid #2a2a2a",
        height: "100vh",
        position: "fixed",
        top: 64,
        left: 0,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        pt: 2,
      }}
    >
      <List sx={{ flex: 1 }}>
        {menuItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <ListItem
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                width: "auto",
                cursor: "pointer",
                backgroundColor: active ? "#7c4dff22" : "transparent",
                "&:hover": { backgroundColor: "#7c4dff11" },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 36, color: active ? "#7c4dff" : "#aaa" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  "& span": {
                    color: active ? "#fff" : "#aaa",
                    fontWeight: active ? 600 : 400,
                    fontSize: 15,
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <List>
        <ListItem
          onClick={signOut}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 2,
            cursor: "pointer",
            "&:hover": { backgroundColor: "#ff000011" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "#666" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sair"
            sx={{ "& span": { color: "#666", fontSize: 15 } }}
          />
        </ListItem>
      </List>
    </Box>
  );
}
