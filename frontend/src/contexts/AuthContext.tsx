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
  city: string;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
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

      localStorage.setItem("musicwork_token", token);
      localStorage.setItem("musicwork_user", JSON.stringify(user));
      setUser(user);

      navigate("/feed");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || "Erro ao fazer login");
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

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
