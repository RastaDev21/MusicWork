import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  instrument: string;
  secondaryInstruments?: string[];
  city: string;
  avatarUrl?: string | null;
  genre?: string | null;
  isEmailVerified?: boolean;
}
interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    instrument?: string;
    secondaryProfession?: string;
    city?: string;
    bio?: string;
  }) => Promise<void>;
  signOut: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("musicwork_token");
    const savedUser = localStorage.getItem("musicwork_user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("musicwork_token", token.replace(/"/g, ""));

      // 👇 Busca o perfil completo com avatarUrl após login
      const profileResponse = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token.replace(/"/g, "")}` },
      });

      const fullUser = { ...user, ...profileResponse.data };
      localStorage.setItem("musicwork_user", JSON.stringify(fullUser));
      setUser(fullUser);

      navigate("/feed");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  async function signUp(data: {
    name: string;
    email: string;
    password: string;
    instrument?: string;
    secondaryProfession?: string;
    city?: string;
    bio?: string;
  }) {
    setLoading(true);
    try {
      await api.post("/users", data);
      await signIn(data.email, data.password);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem("musicwork_token");
    localStorage.removeItem("musicwork_user");
    setUser(null);
    navigate("/");
  }

  function updateUser(data: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("musicwork_user", JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
