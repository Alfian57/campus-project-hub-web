"use client";

import { useState, useEffect } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { StatsCard } from "@/components/dashboard/stats-card";
import { usersService } from "@/lib/services/users";
import { projectsService } from "@/lib/services/projects";
import { articlesService } from "@/lib/services/articles";
import { Loader2, Shield, Users, FolderKanban, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ModeratorPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    totalProjects: 0,
    blockedProjects: 0,
    totalArticles: 0,
    blockedArticles: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersData, projectsData, articlesData, blockedProjectsData, blockedArticlesData] = await Promise.all([
        usersService.getUsers({ perPage: 100 }),
        projectsService.getProjects({ perPage: 1 }),
        articlesService.getArticles({ perPage: 1 }),
        projectsService.getProjects({ status: "blocked", perPage: 1 }),
        articlesService.getArticles({ status: "blocked", perPage: 1 }),
      ]);

      const blockedUsers = usersData.items.filter(u => u.status === "blocked").length;

      setStats({
        totalUsers: usersData.meta.total_items,
        blockedUsers,
        totalProjects: projectsData.meta.total_items,
        blockedProjects: blockedProjectsData.meta.total_items,
        totalArticles: articlesData.meta.total_items,
        blockedArticles: blockedArticlesData.meta.total_items,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["moderator", "admin"]}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["moderator", "admin"]}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Dashboard Moderator
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Kelola konten dan moderasi platform
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Ringkasan Moderasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Pengguna"
              value={stats.totalUsers}
              iconName="Users"
              description={`${stats.blockedUsers} diblokir`}
              color="blue"
            />
            <StatsCard
              title="Total Proyek"
              value={stats.totalProjects}
              iconName="FolderKanban"
              description={`${stats.blockedProjects} diblokir`}
              color="purple"
            />
            <StatsCard
              title="Total Artikel"
              value={stats.totalArticles}
              iconName="FileText"
              description={`${stats.blockedArticles} diblokir`}
              color="green"
            />
          </div>
        </div>

        {/* Blocked Items Summary */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Konten Diblokir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Pengguna Diblokir"
              value={stats.blockedUsers}
              iconName="UserX"
              description="Akun pengguna"
              color="red"
            />
            <StatsCard
              title="Proyek Diblokir"
              value={stats.blockedProjects}
              iconName="FolderX"
              description="Proyek ditangguhkan"
              color="red"
            />
            <StatsCard
              title="Artikel Diblokir"
              value={stats.blockedArticles}
              iconName="FileX"
              description="Artikel ditangguhkan"
              color="red"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/moderator/users">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Kelola Pengguna</h3>
                    <p className="text-sm text-zinc-500">Blokir atau buka blokir akun</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/moderator/projects">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Kelola Proyek</h3>
                    <p className="text-sm text-zinc-500">Moderasi konten proyek</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/moderator/articles">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Kelola Artikel</h3>
                    <p className="text-sm text-zinc-500">Moderasi konten artikel</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Moderation Guidelines */}
        <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-xl border border-orange-500/20 p-6">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-orange-400" />
            Panduan Moderasi
          </h3>
          <ul className="text-sm text-zinc-400 space-y-2">
            <li>• Blokir konten yang melanggar ketentuan layanan</li>
            <li>• Periksa laporan pengguna secara berkala</li>
            <li>• Berikan alasan yang jelas saat memblokir konten</li>
            <li>• Hubungi admin jika menemukan kasus yang kompleks</li>
          </ul>
        </div>
      </div>
    </RoleGuard>
  );
}
