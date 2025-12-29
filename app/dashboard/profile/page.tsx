"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "@/components/dashboard/level-badge";
import { ExpProgress } from "@/components/dashboard/exp-progress";
import * as LucideIcons from "lucide-react";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, isLoading, gamification } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LucideIcons.Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Check if user is regular user (not admin or moderator)
  const isRegularUser = user.role === "user";
  const canBeBlocked = user.role === "user" || user.role === "moderator";

  // Stats for regular users only
  const userStats = [
    {
      label: "Total EXP",
      value: (user.totalExp || 0).toLocaleString(),
      icon: "Sparkles",
      color: "text-yellow-400",
    },
    {
      label: "Level",
      value: user.level || gamification?.level || 1,
      icon: "Trophy",
      color: "text-blue-400",
    },
  ];

  // Add status stat only if user can be blocked
  if (canBeBlocked) {
    userStats.push({
      label: "Status",
      value: user.status === "active" ? "Aktif" : "Diblokir",
      icon: "Shield",
      color: user.status === "active" ? "text-green-400" : "text-red-400",
    });
  }

  // Stats for admin/moderator (minimal stats)
  const adminStats = [
    {
      label: "Role",
      value: user.role === "admin" ? "Administrator" : "Moderator",
      icon: "Crown",
      color: "text-purple-400",
    },
    {
      label: "Status",
      value: user.status === "active" ? "Aktif" : "-",
      icon: "Shield",
      color: "text-green-400",
    },
  ];

  const stats = isRegularUser ? userStats : adminStats;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-50">Profil Saya</h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/dashboard/profile/password">
            <Button variant="outline" size="sm" className="gap-2">
              <LucideIcons.Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Ubah Password</span>
            </Button>
          </Link>
          <Link href="/dashboard/profile/edit">
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
              <LucideIcons.Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Profil</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        </div>

        {/* Avatar & Basic Info */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-32 h-32 rounded-2xl bg-zinc-800 border-4 border-zinc-900 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-zinc-900" />
            </div>

            {/* Name & Role */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-zinc-50">{user.name}</h2>
                {isRegularUser && <LevelBadge totalExp={user.totalExp || 0} />}
                {!isRegularUser && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {user.role === "admin" ? "Administrator" : "Moderator"}
                  </span>
                )}
              </div>
              <p className="text-zinc-400">{user.email}</p>
              {isRegularUser && (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <LucideIcons.GraduationCap className="w-4 h-4" />
                  <span>{user.major || "Belum diisi"} • {user.university || "Belum diisi"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EXP Progress - Only for regular users */}
      {isRegularUser && (
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <LucideIcons.Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100">Experience Points</h3>
              <p className="text-sm text-zinc-500">Kumpulkan EXP untuk naik level</p>
            </div>
          </div>
          <ExpProgress totalExp={user.totalExp || 0} />
        </div>
      )}

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 ${isRegularUser ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
        {stats.map((stat) => {
          const Icon = LucideIcons[stat.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
          return (
            <div
              key={stat.label}
              className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-sm text-zinc-400">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bio */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <LucideIcons.FileText className="w-5 h-5 text-zinc-400" />
            <h3 className="font-semibold text-zinc-100">Bio</h3>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            {user.bio || "Belum ada bio. Klik Edit Profil untuk menambahkan."}
          </p>
        </div>

        {/* Contact & Info */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <LucideIcons.Info className="w-5 h-5 text-zinc-400" />
            <h3 className="font-semibold text-zinc-100">Informasi</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <LucideIcons.Phone className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400">
                {user.phone || "Belum ada nomor telepon"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <LucideIcons.Calendar className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400">
                Bergabung {formatDate(user.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <LucideIcons.Shield className="w-4 h-4 text-zinc-500" />
              <span className="text-zinc-400 capitalize">
                {user.role === "admin" ? "Administrator" : user.role === "moderator" ? "Moderator" : "Mahasiswa"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
