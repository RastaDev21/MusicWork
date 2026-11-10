import { Avatar, Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  FollowUser,
  getBlockedUsers,
  getImageUrl,
  unblockUser,
} from "../../services/api";

// Card de Configurações com quem a pessoa bloqueou e o desbloquear
export default function BlockedUsersCard() {
  const { enqueueSnackbar } = useSnackbar();
  const [people, setPeople] = useState<FollowUser[] | null>(null);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  useEffect(() => {
    getBlockedUsers()
      .then(setPeople)
      .catch(() => setPeople([]));
  }, []);

  async function handleUnblock(person: FollowUser) {
    setUnblockingId(person.id);
    try {
      await unblockUser(person.id);
      setPeople(prev => prev?.filter(p => p.id !== person.id) ?? null);
      enqueueSnackbar(`${person.name} foi desbloqueado(a)`, {
        variant: "success",
      });
    } catch {
      enqueueSnackbar("Não foi possível desbloquear", { variant: "error" });
    } finally {
      setUnblockingId(null);
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 3,
        p: 2,
        mt: 2,
      }}
    >
      <Typography
        sx={{ color: "#fff", fontWeight: 600, fontSize: 15, mb: 0.5 }}
      >
        🚫 Usuários bloqueados
      </Typography>
      <Typography sx={{ color: "#666", fontSize: 13 }}>
        Quem você bloqueou não pode seguir você nem mandar mensagens. Para
        bloquear alguém, use o menu ⋮ no perfil ou na conversa.
      </Typography>

      {people !== null && people.length === 0 && (
        <Typography sx={{ color: "#888", fontSize: 13, mt: 1.5 }}>
          Você não bloqueou ninguém.
        </Typography>
      )}

      {people?.map(person => (
        <Box
          key={person.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mt: 1.5,
          }}
        >
          <Avatar
            src={getImageUrl(person.avatarUrl)}
            sx={{ width: 36, height: 36, backgroundColor: "#7c4dff" }}
          >
            {person.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            noWrap
            sx={{ color: "#ddd", fontSize: 14, flex: 1, minWidth: 0 }}
          >
            {person.name}
          </Typography>
          <Button
            size="small"
            onClick={() => handleUnblock(person)}
            disabled={unblockingId === person.id}
            sx={{ color: "#ff6b84", textTransform: "none", flexShrink: 0 }}
          >
            Desbloquear
          </Button>
        </Box>
      ))}
    </Box>
  );
}
