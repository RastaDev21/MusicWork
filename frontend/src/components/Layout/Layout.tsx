import { Box } from "@mui/material";
import { ReactNode } from "react";
import Navbar from "../NavBar/NavBar";
import Sidebar from "../SideBar/SideBar";
import BottomNav from "../BottomNav/BottomNav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ backgroundColor: "#0f0f0f", minHeight: "100vh" }}>
      <Navbar />
      <Sidebar />

      <Box
        sx={{
          ml: { xs: 0, md: "220px" },
          pt: "64px",
          pb: { xs: "56px", md: 0 },
        }}
      >
        {children}
      </Box>

      <BottomNav />
    </Box>
  );
}
