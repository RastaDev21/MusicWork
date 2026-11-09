import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FollowUser,
  getFollowers,
  getFollowing,
  getImageUrl,
} from "../../services/api";

interface FollowListDialogProps {
  userId: string;
  type: "followers" | "following";
  open: boolean;
  onClose: () => void;
}

export default function FollowListDialog({
  userId,
  type,
  open,
  onClose,
}: FollowListDialogProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [people, setPeople] = useState<FollowUser[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setPeople(null);
    setError(false);
    (type === "followers" ? getFollowers(userId) : getFollowing(userId))
      .then(data => {
        if (!cancelled) setPeople(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open, type, userId]);

  function handleOpenProfile(id: string) {
    onClose();
    navigate(id === user?.id ? "/perfil" : `/musico/${id}`);
  }

  const title = type === "followers" ? "Seguidores" : "Seguindo";
  const emptyText =
    type === "followers"
      ? "Ainda não tem seguidores."
      : "Ainda não segue ninguém.";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#1a1a1a",
            borderRadius: 3,
            maxHeight: "70vh",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#fff",
          fontSize: 16,
          fontWeight: 600,
          borderBottom: "1px solid #2a2a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
          pr: 1,
        }}
      >
        {title}
        <IconButton
          aria-label="Fechar"
          onClick={onClose}
          sx={{ color: "#aaa" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {error && (
          <Typography
            sx={{ color: "#999", fontSize: 14, p: 3, textAlign: "center" }}
          >
            Não foi possível carregar a lista.
          </Typography>
        )}

        {!error && people === null && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={28} sx={{ color: "#7c4dff" }} />
          </Box>
        )}

        {people?.length === 0 && (
          <Typography
            sx={{ color: "#999", fontSize: 14, p: 3, textAlign: "center" }}
          >
            {emptyText}
          </Typography>
        )}

        {people && people.length > 0 && (
          <List disablePadding>
            {people.map(person => (
              <ListItemButton
                key={person.id}
                onClick={() => handleOpenProfile(person.id)}
                sx={{
                  gap: 1.5,
                  py: 1.25,
                  "&:hover": { backgroundColor: "#2a2a2a" },
                }}
              >
                <Avatar
                  src={getImageUrl(person.avatarUrl)}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#7c4dff",
                    fontWeight: 700,
                  }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{ color: "#fff", fontSize: 14, fontWeight: 600 }}
                  >
                    {person.name}
                  </Typography>
                  <Typography noWrap sx={{ color: "#999", fontSize: 12 }}>
                    {[person.instrument, person.city]
                      .filter(Boolean)
                      .join(" · ")}
                  </Typography>
                </Box>
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
