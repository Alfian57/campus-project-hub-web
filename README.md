# Campus Project Hub - Web

Official Frontend untuk platform Campus Project Hub. Dibangun menggunakan Next.js 15, TypeScript, Tailwind CSS, dan Shadcn UI. Platform ini berfungsi sebagai tempat mahasiswa memamerkan karya, berbagi artikel, dan berkolaborasi.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **Runtime:** Bun

## 🚀 Fitur Utama

- **Showcase Proyek:** Galeri proyek mahasiswa dengan filter kategori dan teknologi.
- **Article & Blog:** Platform berbagi pengetahuan dan tips seputar dunia IT dan karir.
- **Gamification:** Sistem level dan EXP untuk menghargai kontribusi user.
- **Role Based Access:** Dashboard khusus untuk User, Moderator, dan Admin.
- **SEO Optimized:** Metadata dinamis, Open Graph, dan Sitemap otomatis.

## ⚙️ Cara Menjalankan Project

1. **Prerequisites**
   Pastikan Anda sudah menginstall [Bun](https://bun.sh/) di sistem Anda.

2. **Setup Environment Variables**
   Copy file `.env.local.example` ke `.env.local` (jika ada) atau buat file `.env.local` baru:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Install Dependencies**
   ```bash
   bun install
   ```

4. **Jalankan Development Server**
   ```bash
   bun run dev
   ```
   Akses aplikasi di [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

- `/app` - Halaman dan routing Next.js (App Router)
- `/components` - Komponen UI reusable (atom, molecule, organism)
- `/lib` - Utility function, hooks, dan konfigurasi
- `/types` - Definisi tipe TypeScript global
- `/public` - Aset statis (gambar, font, dll)

## 🔐 Login

Untuk login, gunakan kredensial yang tersedia di README backend (setelah menjalankan seeder).
- **Admin:** `admin@campus-hub.com` / `password123`
- **User:** `gading@uty.ac.id` / `password123`
