import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import Search from "../pages/Search";
import WorkPage from "../pages/Work";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
    </Routes>
  );
}
