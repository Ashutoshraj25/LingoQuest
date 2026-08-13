const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: {
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
};

export async function fetchApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`Fetch error for ${endpoint}:`, err);
    throw err;
  }
}

// Service methods
export const api = {
  // Auth
  login: (data: { email: string; password: string; remember_me?: boolean }) =>
    fetchApi<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data: {
    full_name: string;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    native_language?: string;
    language_to_learn?: string;
    country?: string;
  }) => fetchApi<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  forgotPassword: (data: { email: string }) =>
    fetchApi<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify(data) }),
  guestLogin: () => fetchApi<AuthResponse>("/auth/guest", { method: "POST" }),

  // Dashboard
  getDashboard: (userId = 1) => fetchApi<any>(`/dashboard?user_id=${userId}`),

  // Lessons & Exercises
  getLesson: (lessonId: number) => fetchApi<any>(`/lessons/${lessonId}`),
  checkAnswer: (exerciseId: number, answer: any) =>
    fetchApi<any>("/lessons/check-answer", {
      method: "POST",
      body: JSON.stringify({ exercise_id: exerciseId, user_answer: answer }),
    }),
  completeLesson: (data: { lesson_id: number; accuracy: number; combo_max: number; time_taken_seconds: number }) =>
    fetchApi<any>("/lessons/complete", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Leaderboard
  getLeaderboard: () => fetchApi<any>("/leaderboard"),

  // Achievements
  getAchievements: (userId = 1) => fetchApi<any>(`/achievements?user_id=${userId}`),
  claimAchievement: (id: number) => fetchApi<any>(`/achievements/claim/${id}`, { method: "POST" }),

  // Statistics
  getStatistics: (userId = 1) => fetchApi<any>(`/statistics?user_id=${userId}`),

  // Shop
  getShopItems: () => fetchApi<any>("/shop/items"),
  purchaseItem: (shopItemId: number) =>
    fetchApi<any>("/shop/purchase", {
      method: "POST",
      body: JSON.stringify({ shop_item_id: shopItemId }),
    }),

  // Daily Goals
  getDailyGoals: (userId = 1) => fetchApi<any>(`/daily-goals?user_id=${userId}`),
  claimQuest: (id: number) => fetchApi<any>(`/daily-goals/claim/${id}`, { method: "POST" }),

  // User & Settings
  getUserProfile: (userId = 1) => fetchApi<any>(`/user/me?user_id=${userId}`),
  updateSettings: (settings: any) => fetchApi<any>("/user/settings", { method: "POST", body: JSON.stringify(settings) }),
  refillHearts: () => fetchApi<any>("/user/refill-hearts", { method: "POST" }),
};
