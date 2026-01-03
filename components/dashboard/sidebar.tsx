"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import * as LucideIcons from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmLogoutModal } from "@/components/dashboard/confirm-logout-modal";

interface SidebarProps {
  role?: "user" | "admin" | "moderator";
  onClose?: () => void;
  isMobile?: boolean;
}

interface NavLink {
  href: string;
  label: string;
  iconName: string;
}

export function Sidebar({ role = "user", onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };


  // =========================================
  // MENU MAHASISWA (User/Student Dashboard)
  // =========================================
  const userLinks: NavLink[] = [
    {
      href: "/dashboard",
      label: "Ringkasan",
      iconName: "LayoutDashboard",
    },
    {
      href: "/dashboard/projects",
      label: "Proyek Saya",
      iconName: "FolderKanban",
    },
    {
      href: "/dashboard/articles",
      label: "Artikel Saya",
      iconName: "FileText",
    },
    {
      href: "/dashboard/leaderboard",
      label: "Leaderboard",
      iconName: "Trophy",
    },
  ];

  // =========================================
  // MENU ADMIN (Admin Dashboard)
  // =========================================
  const adminLinks: NavLink[] = [
    {
      href: "/dashboard/admin",
      label: "Dashboard",
      iconName: "LayoutDashboard",
    },
    {
      href: "/dashboard/admin/users",
      label: "Pengguna",
      iconName: "Users",
    },
    {
      href: "/dashboard/admin/projects",
      label: "Proyek",
      iconName: "FolderKanban",
    },
    {
      href: "/dashboard/admin/categories",
      label: "Kategori",
      iconName: "Tags",
    },
    {
      href: "/dashboard/admin/articles",
      label: "Artikel",
      iconName: "FileText",
    },
    {
      href: "/dashboard/admin/transactions",
      label: "Transaksi",
      iconName: "DollarSign",
    },
    {
      href: "/dashboard/admin/settings",
      label: "Pengaturan",
      iconName: "Settings",
    },
  ];

  // =========================================
  // MENU MODERATOR (Moderator Dashboard)
  // =========================================
  const moderatorLinks: NavLink[] = [
    {
      href: "/dashboard/moderator",
      label: "Dashboard",
      iconName: "LayoutDashboard",
    },
    {
      href: "/dashboard/moderator/users",
      label: "Pengguna",
      iconName: "Users",
    },
    {
      href: "/dashboard/moderator/projects",
      label: "Proyek",
      iconName: "FolderKanban",
    },
    {
      href: "/dashboard/moderator/articles",
      label: "Artikel",
      iconName: "FileText",
    },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "moderator"
      ? moderatorLinks
      : userLinks;

  const LogoIcon = LucideIcons.Sparkles;

  const rolePanelLabel = {
    user: "Panel Pengguna",
    admin: "Panel Admin",
    moderator: "Panel Moderator",
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 p-4">
      {/* Logo Card - Floating */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={handleNavClick} className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Campus Project Hub Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Campus Hub
                </h1>
                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                  {rolePanelLabel[role]}
                </p>
              </div>
            </Link>
            {/* Mobile Close Button */}
            {isMobile && onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Tutup menu"
              >
                <LucideIcons.X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Navigation - Floating Card */}
      <nav className="flex-1 overflow-y-auto mb-4">
        <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            {links.map((link, index) => {
              const isActive = pathname === link.href;
              const Icon = LucideIcons[link.iconName as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
              
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    )}
                  >
                    {/* Active indicator line */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                      isActive 
                        ? "bg-white/20" 
                        : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                    )}>
                      <Icon className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : ""
                      )} />
                    </div>
                    <span className="flex-1">{link.label}</span>
                    
                    {/* Hover arrow */}
                    <LucideIcons.ChevronRight className={cn(
                      "w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0",
                      isActive && "opacity-100 translate-x-0"
                    )} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Info Card - Floating */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800"
      >
        {/* User Info - Clickable to toggle menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 -mx-2 px-2 py-1 rounded-lg transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
          <LucideIcons.ChevronUp className={cn(
            "w-4 h-4 text-zinc-400 transition-transform duration-200",
            isMenuOpen ? "rotate-180" : ""
          )} />
        </button>
        
        {/* Quick Menu - Toggleable */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                <Link href="/dashboard/profile" onClick={handleNavClick}>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm transition-colors cursor-pointer">
                    <LucideIcons.User className="w-4 h-4" />
                    <span>Profil Saya</span>
                  </button>
                </Link>
                <button 
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm transition-colors cursor-pointer"
                >
                  <LucideIcons.LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
