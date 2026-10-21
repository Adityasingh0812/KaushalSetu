import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/authRequest";

// Define the shape of our auth context
interface AuthContextType {
  user: {
    id: number;
    email: string;
    full_name: string;
    phone: string | null;
    role: string;
    is_active: boolean;
  } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, fullName: string, phone: string | null, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // On app load, we could attempt to restore token from storage, but we decided not to persist tokens.
  // So we start with no user and loading false after checking if there is a token? Actually we have no persistence.
  // We'll set loading to false immediately.
  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const tokens = await authApi.login(email, password);
      // tokens already stored in tokenStorage by authApi.login
      const userData = await authApi.me();
      setUser(userData);
    } catch (err) {
      // clear any partial tokens
      // authApi.login already throws error and does not set tokens on failure
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, fullName: string, phone: string | null, password: string) => {
    setLoading(true);
    try {
      await authApi.register(email, fullName, phone, password);
      // Registration successful but does not auto-login (backend doesn't return tokens)
      // We don't set user here; user must log in separately
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};