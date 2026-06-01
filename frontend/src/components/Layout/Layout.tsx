import { Box } from "@mui/material";
import { ReactNode } from "react";
import Navbar from "../NavBar/NavBar";
import Sidebar from "../SideBar/SideBar";
import BottomNav from "../BottomNav/BottomNav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        backgroundColor: "#0f0f0f",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          mt: "64px",
          overflow: "hidden",
        }}
      >
        <Sidebar />

        <Box
          sx={{
            flex: 1,
            ml: { xs: 0, md: "220px" },
            pb: { xs: "56px", md: 0 },
            overflowY: "auto",
            height: "100%",
          }}
        >
          {children}
        </Box>
      </Box>

      <BottomNav />
    </Box>
  );
}
