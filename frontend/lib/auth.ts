"use client";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export type StoredUser = {
  id: number;
  full_name: string;
  email: string;
  username: string;
  avatar_url: string;
  native_language: string;
  language_to_learn: string;
  country: string;
  xp: number;
  streak: number;
  hearts: number;
  max_hearts: number;
  gems: number;
  level: number;
  daily_xp_goal: number;
  dark_mode: boolean;
  sound_enabled: boolean;
  notifications_enabled: boolean;
  current_course_id?: number | null;
};

export function persistAuthSession(accessToken: string, user?: unknown) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredUser;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getPostAuthRedirect(redirectTo: string | null | undefined) {
  if (!redirectTo || !redirectTo.startsWith("/")) {
    return "/";
  }
  return redirectTo;
}
