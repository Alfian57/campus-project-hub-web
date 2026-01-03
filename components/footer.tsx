"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useConfiguration } from "@/components/providers/configuration-provider";

export function Footer() {
  const { get } = useConfiguration();

  return (
    <footer className="bg-zinc-900 dark:bg-black border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Campus Project Hub Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">
                Campus Hub
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              Memberdayakan mahasiswa untuk menampilkan kreativitas dan mendapatkan pengakuan atas karya mereka.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={get("site.github", "https://github.com")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4 text-zinc-400" />
              </a>
              <a
                href={get("site.twitter", "https://twitter.com")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4 text-zinc-400" />
              </a>
              <a
                href={get("site.linkedin", "https://linkedin.com")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4 text-zinc-400" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-blue-400 transition-colors text-sm">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-zinc-400 hover:text-blue-400 transition-colors text-sm">
                  Proyek
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-zinc-400 hover:text-blue-400 transition-colors text-sm">
                  Artikel
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Daftar
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Syarat Layanan
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Kebijakan Cookie
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Panduan Komunitas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              © 2025 Campus Project Hub.
            </p>
            <div className="flex items-center gap-6">
              <a
                href={`mailto:${get("site.email", "support@campushub.com")}`}
                className="text-sm text-zinc-400 hover:text-lime-400 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {get("site.email", "support@campushub.com")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
