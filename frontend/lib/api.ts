const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || `API request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  login: (data: { email: string; password: string; remember_me?: boolean }) => 
    fetchApi("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  
  register: (data: any) => 
    fetchApi("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  googleLogin: (data: { email: string; full_name: string; google_id: string; avatar_url?: string }) => 
    fetchApi("/auth/google", { method: "POST", body: JSON.stringify(data) }),

  switchLanguage: (language: string) => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id || 1;
    return fetchApi(`/auth/select-language?user_id=${userId}`, {
      method: "POST",
      body: JSON.stringify({ language })
    });
  },

  guestLogin: () => 
    fetchApi("/auth/guest", { method: "POST" }),

  logout: () =>
    fetchApi("/auth/logout", { method: "POST" }),

  refreshToken: (refreshToken: string) =>
    fetchApi("/auth/refresh", { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }) }),

  forgotPassword: (data: { email: string }) =>
    fetchApi("/auth/forgot-password", { method: "POST", body: JSON.stringify(data) }),

  resetPassword: (data: { email: string; new_password: string }) =>
    fetchApi("/auth/reset-password", { method: "POST", body: JSON.stringify(data) }),

  getDashboard: (userId?: number) => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = userStr ? JSON.parse(userStr) : null;
    const uid = userId || user?.id || 1;
    return fetchApi(`/dashboard/?user_id=${uid}`);
  },
  
  getLanguages: () => 
    fetchApi("/lessons/languages"),
  
  getLanguageUnits: (langId: number) => 
    fetchApi(`/lessons/languages/${langId}/units`),
  
  getLesson: (lessonId: number) => 
    fetchApi(`/lessons/${lessonId}`),
  
  checkAnswer: (exerciseId: number, answer: string) =>
    fetchApi("/lessons/exercise/submit", { method: "POST", body: JSON.stringify({ exercise_id: exerciseId, selected_answer: answer, is_correct: true }) }),

  submitExercise: (data: { exercise_id: number; selected_answer: string; is_correct: boolean }) => 
    fetchApi("/lessons/exercise/submit", { method: "POST", body: JSON.stringify(data) }),
  
  completeLesson: (data: { lesson_id: number; user_id?: number; score?: number; accuracy?: number; combo_max?: number; time_taken_seconds?: number }) => 
    fetchApi("/lessons/complete", { method: "POST", body: JSON.stringify(data) }),
  
  getPracticeExercises: (mode: string) => 
    fetchApi(`/lessons/practice/${mode}`),

  getLeaderboard: (timeframe: string = "weekly") => 
    fetchApi(`/leaderboard/?timeframe=${timeframe}`),
  
  getAchievements: () => 
    fetchApi("/achievements/"),
  
  claimAchievement: (achievementId: number) =>
    fetchApi(`/achievements/claim/${achievementId}`, { method: "POST" }),

  getDailyGoals: () =>
    fetchApi("/daily-goals/"),

  updateDailyGoal: (xpGoal: number) =>
    fetchApi("/daily-goals/update", { method: "POST", body: JSON.stringify({ goal: xpGoal }) }),

  claimQuest: (questId: number) =>
    fetchApi(`/daily-goals/claim/${questId}`, { method: "POST" }),

  getStatistics: () => 
    fetchApi("/statistics/"),
  
  getShopItems: () => 
    fetchApi("/shop/items"),
  
  buyShopItem: (itemId: number) => 
    fetchApi(`/shop/buy/${itemId}`, { method: "POST" }),
  
  purchaseItem: (itemId: number) => 
    fetchApi(`/shop/buy/${itemId}`, { method: "POST" }),

  getUserProfile: () => 
    fetchApi("/auth/me"),

  updateProfile: (data: any) => 
    fetchApi("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),

  refillHearts: () => 
    fetchApi("/shop/refill-hearts", { method: "POST" })
};
