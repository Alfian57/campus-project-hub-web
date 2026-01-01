/**
 * Centralized Gamification Configuration
 * All EXP points and level thresholds are defined here
 */

// Action points - EXP gained for each action
export const ACTION_POINTS = {
  CREATE_PROJECT: 100,      // User creates a new project
  SELL_PROJECT: 150,        // User sells their project (seller gets this)
  BUY_PROJECT: 50,          // User buys a project (buyer gets this)
  RECEIVE_LIKE: 10,         // User's project receives a like
  RECEIVE_COMMENT: 5,       // User's project receives a comment
  PROJECT_VIEWED: 1,        // User's project is viewed
  CREATE_ARTICLE: 75,       // User creates a new article
  ARTICLE_VIEWED: 1,        // User's article is viewed
  
  // EXP for users performing actions
  GIVE_LIKE: 5,             // User gives a like to a project
  GIVE_COMMENT: 3,          // User gives a comment to a project
} as const;

// Level configuration
export const LEVEL_CONFIG = {
  BASE_EXP: 100,            // Base EXP for level 1
  MULTIPLIER: 2,            // Level^2 formula: EXP = BASE * level^MULTIPLIER
  MAX_LEVEL: 100,           // Maximum achievable level
} as const;

/**
 * Calculate required EXP for a specific level
 * Formula: BASE_EXP × level²
 */
export function getRequiredExpForLevel(level: number): number {
  return LEVEL_CONFIG.BASE_EXP * Math.pow(level, LEVEL_CONFIG.MULTIPLIER);
}

/**
 * Calculate user's level from total EXP
 */
export function getLevelFromExp(totalExp: number): number {
  let level = 1;
  while (level < LEVEL_CONFIG.MAX_LEVEL) {
    const required = getRequiredExpForLevel(level + 1);
    if (totalExp < required) break;
    level++;
  }
  return level;
}

/**
 * Calculate progress to next level (0-100%)
 */
export function getLevelProgress(totalExp: number): number {
  const currentLevel = getLevelFromExp(totalExp);
  if (currentLevel >= LEVEL_CONFIG.MAX_LEVEL) return 100;
  
  // Level 1 starts from 0 EXP, not from BASE_EXP
  const currentLevelExp = currentLevel === 1 ? 0 : getRequiredExpForLevel(currentLevel);
  const nextLevelExp = getRequiredExpForLevel(currentLevel + 1);
  const expInCurrentLevel = totalExp - currentLevelExp;
  const expNeeded = nextLevelExp - currentLevelExp;
  
  if (expNeeded <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((expInCurrentLevel / expNeeded) * 100)));
}

/**
 * Get EXP needed to reach next level
 */
export function getExpToNextLevel(totalExp: number): number {
  const currentLevel = getLevelFromExp(totalExp);
  if (currentLevel >= LEVEL_CONFIG.MAX_LEVEL) return 0;
  
  const nextLevelExp = getRequiredExpForLevel(currentLevel + 1);
  return Math.max(0, nextLevelExp - totalExp);
}

// Level titles/badges based on level thresholds
export const LEVEL_TITLES: Record<number, string> = {
  1: "Pemula",
  5: "Aktif",
  10: "Contributor",
  20: "Expert",
  50: "Master",
  100: "Legend",
};

/**
 * Get title/badge for a given level
 */
export function getLevelTitle(level: number): string {
  const thresholds = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const threshold of thresholds) {
    if (level >= threshold) {
      return LEVEL_TITLES[threshold];
    }
  }
  return LEVEL_TITLES[1];
}

// Level color configuration for UI badges
export const LEVEL_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "bg-zinc-500/20", text: "text-zinc-400", border: "border-zinc-500/30" },
  5: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  10: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  20: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
  50: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
  100: { bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
};

/**
 * Get color configuration for a given level
 */
export function getLevelColor(level: number): { bg: string; text: string; border: string } {
  const thresholds = Object.keys(LEVEL_COLORS)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const threshold of thresholds) {
    if (level >= threshold) {
      return LEVEL_COLORS[threshold];
    }
  }
  return LEVEL_COLORS[1];
}
