import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import Search from "../pages/Search";
import WorkPage from "../pages/Work";
import PrivateRoute from "./PrivateRoute";
import PublicProfile from "../pages/PublicProfile";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/feed"
        element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/buscar"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />
      <Route
        path="/work"
        element={
          <PrivateRoute>
            <WorkPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/musico/:id"
        element={
          <PrivateRoute>
            <PublicProfile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
