import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Feed", icon: <HomeIcon />, path: "/feed" },
  { label: "Buscar", icon: <SearchIcon />, path: "/buscar" },
  { label: "Postar", icon: <AddCircleIcon />, path: "/postar" },
  { label: "Work", icon: <WorkIcon />, path: "/work" },
  { label: "Perfil", icon: <PersonIcon />, path: "/perfil" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = navItems.findIndex(
    item => item.path === location.pathname,
  );

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: "block", md: "none" },
        backgroundColor: "#1a1a1a",
        borderTop: "1px solid #2a2a2a",
        zIndex: 1000,
      }}
    >
      <BottomNavigation
        value={currentIndex}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        sx={{ backgroundColor: "#1a1a1a" }}
      >
        {navItems.map(item => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            sx={{
              color: "#666",
              "&.Mui-selected": { color: "#7c4dff" },
              "& .MuiBottomNavigationAction-label": { fontSize: 10 },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
