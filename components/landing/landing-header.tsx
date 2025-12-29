"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthContext";

interface LandingHeaderProps {
  showArticlesActive?: boolean;
  activePage?: "home" | "projects" | "articles" | "about" | "contact";
}

const navLinks = [
  { href: "/", label: "Beranda", key: "home" as const },
  { href: "/projects", label: "Proyek", key: "projects" as const },
  { href: "/articles", label: "Artikel", key: "articles" as const },
  { href: "/about", label: "Tentang Kami", key: "about" as const },
  { href: "/contact", label: "Kontak", key: "contact" as const },
];

export function LandingHeader({ showArticlesActive = false, activePage }: LandingHeaderProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLinkActive = (key: string) => {
    if (key === "articles") {
      return activePage === "articles" || showArticlesActive;
    }
    return activePage === key;
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-50">Campus Hub</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isLinkActive(link.key) ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side - Auth Buttons & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              {/* Auth Buttons - Desktop */}
              <div className="hidden sm:flex items-center gap-3">
                {isLoading ? (
                  <div className="w-24 h-10 bg-zinc-800 animate-pulse rounded-lg" />
                ) : isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                      >
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                        Daftar Gratis
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-zinc-900 border-l border-zinc-800 z-50 md:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <span className="text-lg font-semibold text-zinc-100">Menu</span>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isLinkActive(link.key)
                  ? "text-white bg-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Auth Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-900 space-y-3">
          {isLoading ? (
            <div className="w-full h-10 bg-zinc-800 animate-pulse rounded-lg" />
          ) : isAuthenticated ? (
            <Link href="/dashboard" onClick={closeMobileMenu} className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" onClick={closeMobileMenu} className="block">
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register" onClick={closeMobileMenu} className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Daftar Gratis
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
