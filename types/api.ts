// API Response Types matching Backend format

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

// Auth types
export interface LoginResponse {
  user: UserApiResponse;
  token: TokenPair;
}

export interface RegisterResponse {
  user: UserApiResponse;
  token: TokenPair;
}

export interface MeResponse {
  user: UserApiResponse;
  gamification: GamificationStats;
}

// User types from API
export interface UserApiResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  university: string | null;
  major: string | null;
  bio: string | null;
  phone: string | null;
  role: "user" | "admin" | "moderator";
  status: "active" | "blocked";
  totalExp: number;
  level: number;
  createdAt: string;
}

// Project types from API
export interface ProjectApiResponse {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  images: string[];
  techStack: string[];
  links: {
    github: string;
    demo: string;
  };
  stats: {
    views: number;
    likes: number;
    commentCount: number;
    isLiked: boolean;
  };
  type: "free" | "paid";
  price: number;
  status: "published" | "draft" | "blocked";
  author: UserApiResponse;
  categoryId: string | null;
  createdAt: string;
}

// Article types from API
export interface ArticleApiResponse {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string | null;
  category: string;
  readingTime: number;
  viewCount: number;
  status: "published" | "draft" | "blocked";
  author: UserApiResponse;
  createdAt: string;
  updatedAt: string;
}

// Comment types from API
export interface CommentApiResponse {
  id: string;
  content: string;
  user: UserApiResponse;
  createdAt: string;
}

// Category types from API
export interface CategoryApiResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  projectCount: number;
  createdAt: string;
}

// Transaction types from API
export interface TransactionApiResponse {
  id: string;
  projectId: string;
  projectTitle: string;
  buyerName: string;
  amount: number;
  status: "pending" | "success" | "failed";
  createdAt: string;
}

export interface CreateTransactionResponse {
  token: string;
  redirectUrl: string;
  transactionId: string;
}

export interface CheckPurchaseResponse {
  purchased: boolean;
}

// Gamification types from API
export interface GamificationStats {
  totalExp: number;
  level: number;
  levelTitle: string;
  currentLevelExp: number;
  nextLevelExp: number;
  progress: number;
}

export interface GamificationConfig {
  expValues: Record<string, number>;
  levels: Array<{
    level: number;
    title: string;
    minExp: number;
  }>;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  user: UserApiResponse;
  totalExp: number;
  level: number;
  levelTitle: string;
}
