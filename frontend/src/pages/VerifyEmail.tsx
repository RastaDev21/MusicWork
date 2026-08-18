import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import Logo from "../components/Logo/Logo";
import { verifyEmail } from "../services/api";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    async function confirm() {
      if (!token) {
        setStatus("error");
        setError("Link inválido ou expirado");
        return;
      }
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError((err as Error).message || "Erro ao confirmar email");
      }
    }
    confirm();
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            backgroundColor: "#1a1a1a",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Logo />
          </Box>

          {status === "loading" && (
            <Box sx={{ py: 2 }}>
              <CircularProgress sx={{ color: "#7c4dff" }} />
            </Box>
          )}

          {status === "success" && (
            <>
              <Alert severity="success" sx={{ mb: 2, textAlign: "left" }}>
                Email confirmado com sucesso!
              </Alert>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/feed")}
                sx={{
                  backgroundColor: "#7c4dff",
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#6a3de8" },
                }}
              >
                Ir para o Feed
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
                {error}
              </Alert>
              <Box sx={{ textAlign: "center" }}>
                <Link
                  component={RouterLink}
                  to="/"
                  sx={{ color: "#7c4dff", fontSize: 14 }}
                >
                  Voltar ao login
                </Link>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
