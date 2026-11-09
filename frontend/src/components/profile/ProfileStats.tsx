import { Box, ButtonBase, Typography } from "@mui/material";
import { useState } from "react";
import FollowListDialog from "./FollowListDialog";

interface ProfileStatsProps {
  userId?: string;
  posts: number;
  followers: number;
  following: number;
}

// Contadores do perfil (próprio e público). Seguidores e Seguindo abrem a
// lista de pessoas.
export default function ProfileStats({
  userId,
  posts,
  followers,
  following,
}: ProfileStatsProps) {
  const [listOpen, setListOpen] = useState(false);
  // Guarda o último tipo aberto para o título não trocar durante o fechar
  const [listType, setListType] = useState<"followers" | "following">(
    "followers",
  );

  function openList(type: "followers" | "following") {
    setListType(type);
    setListOpen(true);
  }

  const stats = [
    { label: "Posts", value: posts },
    { label: "Seguidores", value: followers, list: "followers" as const },
    { label: "Seguindo", value: following, list: "following" as const },
  ];

  return (
    <>
      <Box sx={{ display: "flex", gap: 4 }}>
        {stats.map(stat => {
          const content = (
            <>
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
                {stat.value}
              </Typography>
              <Typography sx={{ color: "#999", fontSize: 12 }}>
                {stat.label}
              </Typography>
            </>
          );

          if (!stat.list) {
            return (
              <Box key={stat.label} sx={{ textAlign: "center" }}>
                {content}
              </Box>
            );
          }

          const list = stat.list;
          return (
            <ButtonBase
              key={stat.label}
              onClick={() => openList(list)}
              disabled={!userId}
              aria-label={`Ver ${stat.label.toLowerCase()}`}
              sx={{
                flexDirection: "column",
                textAlign: "center",
                borderRadius: 2,
                px: 1,
                mx: -1,
                py: 0.5,
                my: -0.5,
                "&:hover": { backgroundColor: "#ffffff0d" },
              }}
            >
              {content}
            </ButtonBase>
          );
        })}
      </Box>

      {userId && (
        <FollowListDialog
          userId={userId}
          type={listType}
          open={listOpen}
          onClose={() => setListOpen(false)}
        />
      )}
    </>
  );
}
