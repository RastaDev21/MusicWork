import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Layout from "../components/Layout/Layout";
import { REPORT_REASONS } from "../components/moderation/ReportDialog";
import {
  getImageUrl,
  getReports,
  ReportItem,
  ReportTargetType,
  resolveReport,
} from "../services/api";

const TARGET_LABEL: Record<ReportTargetType, string> = {
  post: "Publicação",
  comment: "Comentário",
  user: "Perfil",
  work: "Anúncio do Work",
  conversation: "Conversa",
};

// Perfis e conversas não têm um conteúdo único para remover
const REMOVABLE: ReportTargetType[] = ["post", "comment", "work"];

type Action = "remove_content" | "delete_account" | "dismiss";

function reasonLabel(reason: string) {
  return REPORT_REASONS.find(r => r.value === reason)?.label ?? reason;
}

function timeAgo(dateString: string) {
  const minutes = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 60000,
  );
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  return `há ${Math.floor(hours / 24)}d`;
}

// Cópia do conteúdo guardada no momento da denúncia
function Snapshot({ report }: { report: ReportItem }) {
  const snap = report.snapshot;
  if (!snap) return null;

  if (snap.messages) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        {snap.messages.length === 0 && (
          <Typography sx={{ color: "#777", fontSize: 13 }}>
            Conversa sem mensagens.
          </Typography>
        )}
        {snap.messages.map((message, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: 13,
              color: message.fromReported ? "#fff" : "#999",
            }}
          >
            <strong
              style={{ color: message.fromReported ? "#ff8fa3" : "#9c6fe4" }}
            >
              {message.senderName}:
            </strong>{" "}
            {message.content ||
              (message.imageUrl
                ? "📷 Foto"
                : message.videoUrl
                  ? "🎥 Vídeo"
                  : "")}
            {message.imageUrl && (
              <Box
                component="img"
                src={getImageUrl(message.imageUrl)}
                sx={{
                  display: "block",
                  maxHeight: 160,
                  borderRadius: 1.5,
                  mt: 0.5,
                }}
              />
            )}
          </Typography>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {snap.title && (
        <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
          {snap.title}
        </Typography>
      )}
      {snap.content && (
        <Typography
          sx={{ color: "#ddd", fontSize: 14, whiteSpace: "pre-wrap", mt: 0.5 }}
        >
          {snap.content}
        </Typography>
      )}
      {snap.contact && (
        <Typography sx={{ color: "#999", fontSize: 12, mt: 0.5 }}>
          Contato: {snap.contact}
        </Typography>
      )}
      {snap.imageUrl && (
        <Box
          component="img"
          src={getImageUrl(snap.imageUrl)}
          sx={{
            display: "block",
            maxWidth: "100%",
            maxHeight: 260,
            borderRadius: 2,
            mt: 1,
          }}
        />
      )}
      {snap.videoUrl && (
        <Box
          component="video"
          src={getImageUrl(snap.videoUrl)}
          controls
          sx={{
            display: "block",
            maxWidth: "100%",
            maxHeight: 260,
            borderRadius: 2,
            mt: 1,
          }}
        />
      )}
      {!snap.title && !snap.content && !snap.imageUrl && !snap.videoUrl && (
        <Typography sx={{ color: "#777", fontSize: 13 }}>
          Sem texto ou mídia.
        </Typography>
      )}
    </Box>
  );
}

// Fila de denúncias da conta de suporte (/denuncias). O push de denúncia
// nova abre aqui.
export default function Reports() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [reports, setReports] = useState<ReportItem[] | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [pending, setPending] = useState<{
    report: ReportItem;
    action: Action;
  } | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    getReports()
      .then(setReports)
      .catch(error => {
        if (error?.response?.status === 403) setForbidden(true);
        setReports([]);
      });
  }, []);

  async function handleConfirm() {
    if (!pending) return;
    const { report, action } = pending;
    setWorking(true);
    try {
      const result = await resolveReport(report.id, action);
      // Remover conteúdo resolve as outras denúncias do mesmo conteúdo, e
      // excluir a conta apaga as denúncias sobre ela
      setReports(prev =>
        (prev ?? []).filter(item => {
          if (item.id === report.id) return false;
          if (action === "remove_content") {
            return !(
              item.targetType === report.targetType &&
              item.targetId === report.targetId
            );
          }
          if (action === "delete_account") {
            return item.reportedUser?.id !== report.reportedUser?.id;
          }
          return true;
        }),
      );
      enqueueSnackbar(result.message, { variant: "success" });
      setPending(null);
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      enqueueSnackbar(
        err.response?.data?.error || "Não foi possível concluir",
        {
          variant: "error",
        },
      );
    } finally {
      setWorking(false);
    }
  }

  const confirmText: Record<
    Action,
    { title: string; body: string; button: string }
  > = {
    remove_content: {
      title: "Remover este conteúdo?",
      body: "O conteúdo é apagado para todo mundo, incluindo fotos e vídeos. Não dá para desfazer.",
      button: "Remover",
    },
    delete_account: {
      title: `Excluir a conta de ${pending?.report.reportedUser?.name ?? "usuário"}?`,
      body: "Apaga o perfil e tudo o que a pessoa publicou, como na exclusão de conta pelo próprio usuário. Não dá para desfazer.",
      button: "Excluir conta",
    },
    dismiss: {
      title: "Arquivar esta denúncia?",
      body: "Use quando o conteúdo não viola as regras. Nada é apagado.",
      button: "Arquivar",
    },
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 20 }}>
          Denúncias
        </Typography>
        <Typography sx={{ color: "#777", fontSize: 13, mb: 2 }}>
          Denúncias abertas, mais recentes primeiro. Priorize as que envolvem
          menores de idade.
        </Typography>

        {reports === null && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress sx={{ color: "#7c4dff" }} />
          </Box>
        )}

        {forbidden && (
          <Typography sx={{ color: "#aaa", textAlign: "center", mt: 6 }}>
            Acesso restrito à conta de suporte.
          </Typography>
        )}

        {!forbidden && reports?.length === 0 && (
          <Typography sx={{ color: "#aaa", textAlign: "center", mt: 6 }}>
            Nenhuma denúncia aberta. 🎉
          </Typography>
        )}

        {reports?.map(report => {
          const urgent = report.reason === "child_safety";
          return (
            <Box
              key={report.id}
              sx={{
                backgroundColor: "#1a1a1a",
                border: urgent ? "1px solid #ff4d6d" : "1px solid #2a2a2a",
                borderRadius: 3,
                p: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                  mb: 1.5,
                }}
              >
                <Chip
                  label={TARGET_LABEL[report.targetType]}
                  size="small"
                  sx={{ backgroundColor: "#2a2a2a", color: "#ccc" }}
                />
                <Chip
                  label={reasonLabel(report.reason)}
                  size="small"
                  sx={{
                    backgroundColor: urgent ? "#ff4d6d" : "#ff4d6d22",
                    color: urgent ? "#fff" : "#ff8fa3",
                    fontWeight: urgent ? 700 : 500,
                  }}
                />
                <Typography sx={{ color: "#666", fontSize: 12, ml: "auto" }}>
                  {timeAgo(report.createdAt)}
                </Typography>
              </Box>

              {report.reportedUser && (
                <Box
                  onClick={() => navigate(`/musico/${report.reportedUser?.id}`)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    mb: 1,
                    width: "fit-content",
                  }}
                >
                  <Avatar
                    src={getImageUrl(report.reportedUser.avatarUrl)}
                    sx={{
                      width: 28,
                      height: 28,
                      fontSize: 12,
                      backgroundColor: "#7c4dff",
                    }}
                  >
                    {report.reportedUser.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography
                    sx={{ color: "#fff", fontSize: 14, fontWeight: 600 }}
                  >
                    {report.reportedUser.name}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  backgroundColor: "#121212",
                  borderRadius: 2,
                  p: 1.5,
                  mb: 1.5,
                }}
              >
                <Snapshot report={report} />
              </Box>

              {report.details && (
                <Typography sx={{ color: "#bbb", fontSize: 13, mb: 1 }}>
                  “{report.details}”
                </Typography>
              )}
              <Typography sx={{ color: "#666", fontSize: 12, mb: 1.5 }}>
                Denunciado por {report.reporter?.name ?? "usuário"}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {REMOVABLE.includes(report.targetType) && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      setPending({ report, action: "remove_content" })
                    }
                    sx={{
                      backgroundColor: "#ff4d6d",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#e63e5c" },
                    }}
                  >
                    Remover conteúdo
                  </Button>
                )}
                {report.reportedUser && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      setPending({ report, action: "delete_account" })
                    }
                    sx={{
                      color: "#ff6b84",
                      borderColor: "#ff6b8488",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#ff4d6d",
                        backgroundColor: "#ff4d6d11",
                      },
                    }}
                  >
                    Excluir conta
                  </Button>
                )}
                <Button
                  size="small"
                  onClick={() => setPending({ report, action: "dismiss" })}
                  sx={{ color: "#aaa", textTransform: "none" }}
                >
                  Arquivar
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Dialog
        open={!!pending}
        onClose={working ? undefined : () => setPending(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#1a1a1a",
              backgroundImage: "none",
              borderRadius: 3,
            },
          },
        }}
      >
        {pending && (
          <>
            <DialogTitle sx={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>
              {confirmText[pending.action].title}
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ color: "#bbb", fontSize: 14 }}>
                {confirmText[pending.action].body}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button
                onClick={() => setPending(null)}
                disabled={working}
                sx={{ color: "#aaa" }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={working}
                sx={{
                  backgroundColor:
                    pending.action === "dismiss" ? "#7c4dff" : "#ff4d6d",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor:
                      pending.action === "dismiss" ? "#6a3de8" : "#e63e5c",
                  },
                }}
              >
                {confirmText[pending.action].button}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  );
}
