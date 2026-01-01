"use client";

import { cn } from "@/lib/cn";
import { 
  getLevelFromExp, 
  getLevelProgress, 
  getExpToNextLevel,
  getLevelColor,
  LEVEL_CONFIG
} from "@/lib/config/gamification";
import { motion } from "framer-motion";

interface ExpProgressProps {
  totalExp: number;
  showDetails?: boolean;
  className?: string;
}

export function ExpProgress({ 
  totalExp, 
  showDetails = true,
  className 
}: ExpProgressProps) {
  const level = getLevelFromExp(totalExp);
  const progress = getLevelProgress(totalExp);
  const expToNext = getExpToNextLevel(totalExp);
  const colors = getLevelColor(level);

  // Calculate EXP range for current level
  const currentLevelMinExp = level === 1 ? 0 : LEVEL_CONFIG.BASE_EXP * Math.pow(level, 2);
  const nextLevelExp = LEVEL_CONFIG.BASE_EXP * Math.pow(level + 1, 2);

  return (
    <div className={cn("space-y-3", className)}>
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("text-lg font-bold", colors.text)}>
              Level {level}
            </span>
            <span className="text-sm text-zinc-400">
              • {totalExp.toLocaleString()} EXP
            </span>
          </div>
          {level < LEVEL_CONFIG.MAX_LEVEL && (
            <span className="text-sm text-zinc-500">
              Butuh <span className="text-zinc-300 font-medium">{expToNext.toLocaleString()}</span> EXP lagi
            </span>
          )}
        </div>
      )}
      
      <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            "bg-gradient-to-r from-blue-500 to-cyan-500"
          )}
        />
        {/* Glow effect */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500/50 to-cyan-500/50 blur-sm"
        />
      </div>

      {showDetails && level < LEVEL_CONFIG.MAX_LEVEL && (
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{currentLevelMinExp.toLocaleString()} EXP</span>
          <span className="text-zinc-400 font-medium">{progress}% ke Level {level + 1}</span>
          <span>{nextLevelExp.toLocaleString()} EXP</span>
        </div>
      )}
    </div>
  );
}

