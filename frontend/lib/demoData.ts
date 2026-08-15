export interface UserProfile {
  id: number;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string;
  native_language: string;
  language_to_learn: string;
  country: string;
  xp: number;
  level: number;
  streak: number;
  streak_count: number;
  gems: number;
  hearts: number;
  max_hearts: number;
  daily_xp_goal: number;
  dark_mode: boolean;
  sound_enabled: boolean;
  notifications_enabled: boolean;
  league: string;
  completed_lessons: number;
}

export const DEMO_USER: UserProfile = {
  id: 0,
  full_name: "Guest Learner",
  username: "guest_learner",
  email: "guest@lingoquest.demo",
  avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=GuestLearner",
  native_language: "English",
  language_to_learn: "Hindi",
  country: "India",
  xp: 2350,
  level: 8,
  streak: 21,
  streak_count: 21,
  gems: 650,
  hearts: 5,
  max_hearts: 5,
  daily_xp_goal: 50,
  dark_mode: false,
  sound_enabled: true,
  notifications_enabled: true,
  league: "Gold",
  completed_lessons: 42,
};

export const DEMO_LEADERBOARD = [
  { id: 101, rank: 1, name: "Aarav Sharma", xp: 5100, isCurrent: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav" },
  { id: 0, rank: 2, name: "Guest Learner (You)", xp: 2350, isCurrent: true, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=GuestLearner" },
  { id: 102, rank: 3, name: "Priya Patel", xp: 2120, isCurrent: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya" },
  { id: 103, rank: 4, name: "Rohan Verma", xp: 1980, isCurrent: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rohan" },
  { id: 104, rank: 5, name: "Ananya Iyer", xp: 1850, isCurrent: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Ananya" },
  { id: 105, rank: 6, name: "Vikram Singh", xp: 1640, isCurrent: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Vikram" },
  { id: 106, rank: 7, name: "Neha Gupta", xp: 1420, isCurrent: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Neha" },
  { id: 107, rank: 8, name: "Kabir Mehta", xp: 1290, isCurrent: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Kabir" },
  { id: 108, rank: 9, name: "Diya Rao", xp: 1150, isCurrent: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Diya" },
  { id: 109, rank: 10, name: "Arjun Reddy", xp: 980, isCurrent: false, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Arjun" },
];

export const DEMO_ACHIEVEMENTS = [
  {
    id: 1,
    title: "Wildfire",
    description: "Reach a 14-day streak",
    icon: "🔥",
    progress: 14,
    max_progress: 14,
    unlocked: true,
    unlocked_at: "2026-08-01",
    reward_gems: 50,
  },
  {
    id: 2,
    title: "Sage",
    description: "Earn 2,000 total XP",
    icon: "🎓",
    progress: 2350,
    max_progress: 2000,
    unlocked: true,
    unlocked_at: "2026-08-10",
    reward_gems: 100,
  },
  {
    id: 3,
    title: "Sharpshooter",
    description: "Complete 20 lessons with 100% accuracy",
    icon: "🎯",
    progress: 18,
    max_progress: 20,
    unlocked: false,
    reward_gems: 75,
  },
  {
    id: 4,
    title: "Champion",
    description: "Finish in the Top 3 of Gold League",
    icon: "🏆",
    progress: 2,
    max_progress: 3,
    unlocked: true,
    unlocked_at: "2026-08-12",
    reward_gems: 150,
  },
  {
    id: 5,
    title: "Polyglot",
    description: "Start learning a 2nd Indian language",
    icon: "🌐",
    progress: 1,
    max_progress: 2,
    unlocked: false,
    reward_gems: 60,
  },
];

export const DEMO_STATISTICS = {
  total_xp: 2350,
  streak_days: 21,
  accuracy_percentage: 94,
  lessons_completed: 42,
  time_spent_minutes: 380,
  weekly_xp: [
    { day: "Mon", xp: 250 },
    { day: "Tue", xp: 320 },
    { day: "Wed", xp: 180 },
    { day: "Thu", xp: 400 },
    { day: "Fri", xp: 310 },
    { day: "Sat", xp: 450 },
    { day: "Sun", xp: 440 },
  ],
};

export const DEMO_SHOP_ITEMS = [
  {
    id: "streak_freeze",
    title: "Streak Freeze",
    description: "Protects your streak if you miss a day of practice.",
    cost: 200,
    icon: "❄️",
    owned: 1,
  },
  {
    id: "double_or_nothing",
    title: "Double or Nothing",
    description: "Double your 50 gem wager by maintaining a 7-day streak.",
    cost: 50,
    icon: "💎",
    owned: 0,
  },
  {
    id: "heart_refill",
    title: "Refill Hearts",
    description: "Instantly restore all 5 hearts to full capacity.",
    cost: 150,
    icon: "❤️",
    owned: 0,
  },
];

export const DEMO_DAILY_GOALS = [
  {
    id: 1,
    title: "Earn 50 XP today",
    progress: 35,
    max_progress: 50,
    reward_gems: 10,
    completed: false,
  },
  {
    id: 2,
    title: "Complete 3 lessons",
    progress: 2,
    max_progress: 3,
    reward_gems: 15,
    completed: false,
  },
  {
    id: 3,
    title: "Practice for 15 minutes",
    progress: 15,
    max_progress: 15,
    reward_gems: 20,
    completed: true,
  },
];
