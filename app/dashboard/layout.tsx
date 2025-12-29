"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useAuth } from "@/components/providers/AuthContext";
import { Loader2, Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black relative">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 flex items-center px-4 z-40 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Buka menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold text-zinc-50">Campus Hub</h1>
        </div>
        {/* Spacer for centering */}
        <div className="w-10" />
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar - Desktop (fixed) & Mobile (drawer) */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 flex-shrink-0
          transform transition-transform duration-300 ease-out
          lg:transform-none lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar 
          role={user.role} 
          onClose={() => setIsSidebarOpen(false)}
          isMobile={true}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

