import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api.tsx";

interface AuthContextProps {
  user: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
  if (user) {
    localStorage.setItem("user", user);
    const token = localStorage.getItem("token");
     if (token) {
      api.get("/auth/me").then(res => {
        setIsAdmin(res.data.isAdmin);
      }).catch(() => {
        setIsAdmin(false);
      });
    }
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
  }
}, [user, isAdmin]);
useEffect(() => {
  const storedIsAdmin = localStorage.getItem("isAdmin");
  if (storedIsAdmin !== null) {
    setIsAdmin(JSON.parse(storedIsAdmin));
  }
}, []);
  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(email);
    setIsAdmin(res.data.isAdmin);
  };

  const register = async (email: string, password: string) => {
    await api.post("/auth/register", { email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
