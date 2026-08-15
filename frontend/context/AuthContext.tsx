"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { DEMO_USER, UserProfile } from "@/lib/demoData";

interface AuthContextType {
  user: UserProfile;
  realUser: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  googleLogin: (googleData: any) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => void;
  updateUserSession: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [realUser, setRealUser] = useState<UserProfile | null>(null);
  const [guestUser, setGuestUser] = useState<UserProfile>(DEMO_USER);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Initialize Guest User from localStorage if available
    const storedGuest = localStorage.getItem("lingoquest_guest_user");
    if (storedGuest) {
      try {
        setGuestUser({ ...DEMO_USER, ...JSON.parse(storedGuest) });
      } catch (e) {
        console.error("Error reading stored guest user:", e);
      }
    }

    // 2. Resolve Authenticated User session from localStorage token
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setRealUser(parsedUser);
        document.cookie = `token=${storedToken}; path=/; max-age=86400`;
      } catch (e) {
        console.error("Error parsing user session:", e);
      }
    }

    setLoading(false);

    // Silent Render server warm-up (non-blocking)
    api.pingHealth();

    // Background profile synchronization if token exists
    if (storedToken) {
      api.getUserProfile()
        .then((profile) => {
          if (profile && profile.id) {
            setRealUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          }
        })
        .catch((err) => {
          if (err instanceof Error && /401|403/.test(err.message)) {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            setRealUser(null);
          }
        });
    }
  }, []);

  const saveAuthSession = (res: any) => {
    if (res && res.access_token) {
      localStorage.setItem("token", res.access_token);
      document.cookie = `token=${res.access_token}; path=/; max-age=86400`;
      if (res.refresh_token) {
        localStorage.setItem("refresh_token", res.refresh_token);
      }
      if (res.user) {
        setRealUser(res.user);
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
    // Keeps user in Guest mode
    router.push("/");
  };

  const updateUserSession = (updated: Partial<UserProfile>) => {
    if (realUser) {
      setRealUser((prev) => {
        const next = { ...(prev || DEMO_USER), ...updated } as UserProfile;
        localStorage.setItem("user", JSON.stringify(next));
        return next;
      });
    } else {
      setGuestUser((prev) => {
        const next = { ...(prev || DEMO_USER), ...updated } as UserProfile;
        localStorage.setItem("lingoquest_guest_user", JSON.stringify(next));
        return next;
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setRealUser(null);
    api.logout().catch(() => {});
  };

  const activeUser = realUser || guestUser;
  const isAuthenticated = Boolean(realUser);
  const isGuest = !isAuthenticated;

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        realUser,
        isAuthenticated,
        isGuest,
        loading,
        login,
        register,
        googleLogin,
        guestLogin,
        logout,
        updateUserSession,
      }}
    >
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
