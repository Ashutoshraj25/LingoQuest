"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";

interface User {
  id: number;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string;
  native_language: string;
  language_to_learn: string;
  country: string;
  provider?: string;
  google_id?: string;
  xp: number;
  level: number;
  streak_count: number;
  gems: number;
  hearts: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  googleLogin: (googleData: any) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Session initialization & Token persistence
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        document.cookie = `token=${storedToken}; path=/; max-age=86400`;
      } catch (e) {
        console.error("Error parsing user session:", e);
      }
    }

    // Fetch fresh profile from backend
    api.getUserProfile()
      .then((profile) => {
        if (profile && profile.id) {
          setUser(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        }
      })
      .catch(() => {
        if (!localStorage.getItem("token")) {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const saveAuthSession = (res: any) => {
    if (res && res.access_token) {
      localStorage.setItem("token", res.access_token);
      document.cookie = `token=${res.access_token}; path=/; max-age=86400`;
      if (res.refresh_token) {
        localStorage.setItem("refresh_token", res.refresh_token);
      }
      if (res.user) {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
    }
  };

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    saveAuthSession(res);
    const searchParams = new URLSearchParams(window.location.search);
    const returnUrl = searchParams.get("returnUrl") || "/";
    router.push(returnUrl);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    saveAuthSession(res);
    router.push("/");
  };

  const googleLogin = async (googleData: any) => {
    const res = await api.googleLogin(googleData);
    saveAuthSession(res);
    router.push("/");
  };

  const guestLogin = async () => {
    const res = await api.guestLogin();
    saveAuthSession(res);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);

    api.logout().catch(() => {});

    window.location.replace("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
