"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { usersService } from "@/lib/services/users";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { LevelBadge } from "@/components/dashboard/level-badge";
import { ExpProgress } from "@/components/dashboard/exp-progress";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { LeaderboardEntry } from "@/types/api";

const ITEMS_PER_PAGE = 10;

export default function LeaderboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [rankedUsers, setRankedUsers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await usersService.getLeaderboard(100); // Fetch more for pagination
        setRankedUsers(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <LucideIcons.Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Find current user's rank
  const currentUserRank = rankedUsers.findIndex((u) => u.user.id === user.id) + 1;

  // Top 3 users for podium
  const topThree = rankedUsers.slice(0, 3);

  // Pagination calculations
  const totalPages = Math.ceil(rankedUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = rankedUsers.slice(startIndex, endIndex);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 mb-2 flex items-center gap-3">
          <LucideIcons.Trophy className="w-8 h-8 text-yellow-400" />
          Leaderboard
        </h1>
        <p className="text-zinc-400">
          Peringkat pengguna berdasarkan Experience Points (EXP)
        </p>
      </div>

      {/* Current User Stats */}
      <div className="bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 rounded-2xl border border-blue-500/30 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Rank Badge */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/30">
              #{currentUserRank || "-"}
            </div>
            <div>
              <p className="text-sm text-zinc-400">Peringkat Anda</p>
              <p className="text-xl font-bold text-zinc-100">{user.name}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-zinc-700" />

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <LevelBadge totalExp={user.totalExp || 0} />
              <span className="text-zinc-400 text-sm">
                {(user.totalExp || 0).toLocaleString()} EXP
              </span>
            </div>
            <ExpProgress totalExp={user.totalExp || 0} showDetails={false} />
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LucideIcons.Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : topThree.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 0, 2].map((index) => {
            const entry = topThree[index];
            if (!entry) return <div key={index} />;

            const actualRank = index === 1 ? 1 : index === 0 ? 2 : 3;
            const heights = { 1: "h-36", 2: "h-28", 3: "h-24" };
            const colors = {
              1: "from-yellow-400 to-amber-500",
              2: "from-zinc-300 to-zinc-400",
              3: "from-orange-400 to-orange-600",
            };

            return (
              <div
                key={entry.user.id}
                className="flex flex-col items-center"
              >
                {/* Avatar */}
                <div className="relative mb-4">
                  <img
                    src={entry.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user.name}`}
                    alt={entry.user.name}
                    className="w-16 h-16 rounded-full bg-zinc-800 border-4 border-zinc-700"
                  />
                  <div
                    className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${colors[actualRank as keyof typeof colors]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                  >
                    {actualRank}
                  </div>
                </div>

                {/* Name */}
                <p className="text-sm font-semibold text-zinc-100 text-center truncate max-w-full px-2">
                  {entry.user.name}
                </p>
                <p className="text-xs text-zinc-500 mb-2">
                  {entry.totalExp.toLocaleString()} EXP
                </p>

                {/* Podium */}
                <div
                  className={`w-full ${heights[actualRank as keyof typeof heights]} rounded-t-xl bg-gradient-to-t ${colors[actualRank as keyof typeof colors]} opacity-80`}
                />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Full Ranking List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <LucideIcons.Users className="w-5 h-5 text-zinc-400" />
            Peringkat Lengkap
          </h2>
          {rankedUsers.length > 0 && (
            <span className="text-sm text-zinc-500">
              {rankedUsers.length} pengguna
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-zinc-500">Memuat...</div>
        ) : rankedUsers.length > 0 ? (
          <>
            <div className="space-y-2">
              {paginatedUsers.map((entry) => (
                <LeaderboardCard
                  key={entry.user.id}
                  user={{
                    id: entry.user.id,
                    name: entry.user.name,
                    avatarUrl: entry.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.user.name}`,
                    university: entry.user.university || "",
                    totalExp: entry.totalExp,
                  }}
                  rank={entry.rank}
                  isCurrentUser={entry.user.id === user.id}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-4">
                <span className="text-sm text-zinc-500">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, rankedUsers.length)} dari {rankedUsers.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                  >
                    <LucideIcons.ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first, last, and pages around current
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, idx, arr) => (
                        <>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span key={`ellipsis-${page}`} className="text-zinc-500 px-1">...</span>
                          )}
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </>
                      ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <LucideIcons.ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-zinc-500">
            Belum ada data leaderboard
          </div>
        )}
      </div>

      {/* How to Earn EXP */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2 mb-4">
          <LucideIcons.Sparkles className="w-5 h-5 text-yellow-400" />
          Cara Mendapatkan EXP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "FolderPlus", label: "Buat proyek baru", exp: "+100 EXP" },
            { icon: "FileText", label: "Buat artikel baru", exp: "+75 EXP" },
            { icon: "ShoppingCart", label: "Jual proyek", exp: "+150 EXP" },
            { icon: "ShoppingBag", label: "Beli proyek", exp: "+50 EXP" },
            { icon: "Heart", label: "Proyek kamu disukai", exp: "+10 EXP" },
            { icon: "HeartHandshake", label: "Suka proyek orang lain", exp: "+5 EXP" },
            { icon: "MessageSquare", label: "Proyek kamu dikomentari", exp: "+5 EXP" },
            { icon: "MessageCircle", label: "Komentari proyek orang lain", exp: "+3 EXP" },
          ].map((item) => {
            const Icon = LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-green-400">
                  {item.exp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
