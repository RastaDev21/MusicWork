import { Box } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "../NavBar/NavBar";
import Sidebar from "../SideBar/SideBar";
import BottomNav from "../BottomNav/BottomNav";
import { getUnreadMessageCount } from "../../services/api";

export default function Layout({ children }: { children: ReactNode }) {
  // Mensagens não lidas: badge no "Mensagens" do menu lateral (desktop) e do
  // menu de baixo (celular). Antes ficava num ícone do header.
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    async function fetchUnreadMessages() {
      try {
        const count = await getUnreadMessageCount();
        setUnreadMessages(count);
      } catch {
        // silencioso
      }
    }
    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 10000);
    return () => clearInterval(interval);
  }, []);

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
        <Sidebar unreadMessages={unreadMessages} />

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

      <BottomNav unreadMessages={unreadMessages} />
    </Box>
  );
}
