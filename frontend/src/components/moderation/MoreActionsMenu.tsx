import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ReactNode, useState } from "react";

export interface MoreAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

// Botão ⋮ com as ações de denunciar e bloquear (post, perfil, conversa,
// anúncio do Work). Cada ação tem nome próprio, separada das outras, como
// pede a política do Play.
export default function MoreActionsMenu({
  actions,
  label = "Mais opções",
  size = "small",
}: {
  actions: MoreAction[];
  label?: string;
  size?: "small" | "medium";
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <IconButton
        size={size}
        aria-label={label}
        onClick={event => setAnchorEl(event.currentTarget)}
        sx={{ color: "#888", "&:hover": { color: "#fff" } }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 2,
            },
          },
        }}
      >
        {actions.map(action => (
          <MenuItem
            key={action.label}
            onClick={() => {
              setAnchorEl(null);
              action.onClick();
            }}
            sx={{
              color: "#ff6b84",
              gap: 1.25,
              fontSize: 14,
              "&:hover": { backgroundColor: "#2a2a2a" },
            }}
          >
            {action.icon}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
