import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#0f0f0f",
        }}
      >
        <CircularProgress sx={{ color: "#7c4dff" }} />
      </Box>
    );
  }

  if (!signed) {
    return <Navigate to="/" />;
  }

  return children;
}
