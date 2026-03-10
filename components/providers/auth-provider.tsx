"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Publisher } from "@/types/user";

interface AuthContextType {
  user: Publisher | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { name: string; organization: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: Publisher = {
  id: "pub-001",
  email: "developer@dankook.ac.kr",
  name: "김개발",
  organization: "단국대학교",
  status: "active",
  createdAt: "2024-01-15",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Publisher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("union-auth");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("union-auth");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const loggedInUser = { ...MOCK_USER, email };
    setUser(loggedInUser);
    localStorage.setItem("union-auth", JSON.stringify(loggedInUser));
    return true;
  };

  const signup = async (data: { name: string; organization: string; email: string }): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const newUser: Publisher = {
      ...MOCK_USER,
      id: `pub-${Date.now()}`,
      email: data.email,
      name: data.name,
      organization: data.organization,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("union-auth", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("union-auth");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
