"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { uploadFile } from "@/lib/services/upload";
import { ApiError } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";
import { ACTION_POINTS } from "@/lib/config/gamification";
import { toast } from "sonner";
import { articlesService } from "@/lib/services/articles";

import { getApiUrl } from "@/lib/env";

const API_BASE_URL = getApiUrl();

// Article categories
const articleCategories = [
  { value: "karier", label: "Karier" },
  { value: "teknologi", label: "Teknologi" },
  { value: "produktivitas", label: "Produktivitas" },
  { value: "pengembangan", label: "Pengembangan" },
  { value: "mobile", label: "Mobile" },
  { value: "keamanan", label: "Keamanan" },
];

export default function NewArticlePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    content: "",
  });

  // File state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const preview = URL.createObjectURL(file);
      setThumbnailPreview(preview);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft: boolean = false) => {
    e.preventDefault();
    setIsDraft(saveAsDraft);
    setIsSubmitting(true);
    setFieldErrors({});

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Judul artikel harus diisi";
    }

    if (!formData.category) {
      errors.category = "Kategori harus dipilih";
    }

    if (!formData.content.trim()) {
      errors.content = "Konten artikel harus diisi";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload thumbnail if provided
      let thumbnailUrl: string | undefined;
      if (thumbnailFile) {
        toast.loading("Mengunggah thumbnail...", { id: "upload-thumbnail" });
        const result = await uploadFile(thumbnailFile);
        thumbnailUrl = `${API_BASE_URL.replace('/api/v1', '')}${result.url}`;
        toast.dismiss("upload-thumbnail");
      }

      await articlesService.createArticle({
        title: formData.title,
        excerpt: formData.excerpt || formData.content.slice(0, 150) + "...",
        content: formData.content,
        category: formData.category,
        thumbnailUrl: thumbnailUrl,
        status: saveAsDraft ? "draft" : "published",
      });

      if (saveAsDraft) {
        toast.success("Artikel disimpan sebagai draft");
      } else {
        toast.success(
          <div>
            <p>Artikel berhasil dipublikasikan!</p>
            <p className="text-green-400 text-sm">+{ACTION_POINTS.CREATE_ARTICLE} EXP</p>
          </div>
        );
      }

      router.push("/dashboard/articles");
    } catch (error) {
      console.error("Error creating article:", error);
      
      if (error instanceof ApiError) {
        // Show specific error message from API
        toast.error(error.message);
        
        // If there are field-specific errors, display them
        if (error.errors) {
          const newErrors: Record<string, string> = {};
          Object.entries(error.errors).forEach(([field, message]) => {
            newErrors[field] = message;
          });
          setFieldErrors(newErrors);
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <LucideIcons.Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/articles">
          <Button variant="ghost" size="icon" className="shrink-0">
            <LucideIcons.ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-zinc-50">Buat Artikel Baru</h1>
          <p className="text-zinc-400 mt-1">
            Bagikan pengetahuan dan pengalamanmu
          </p>
        </div>
        <div className="bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
          <span className="text-green-400 text-sm font-medium">
            +{ACTION_POINTS.CREATE_ARTICLE} EXP
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.FileText className="w-5 h-5 text-zinc-400" />
            Informasi Artikel
          </h3>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Judul Artikel <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Masukkan judul artikel yang menarik"
                className={`mt-1.5 bg-zinc-800/50 border-zinc-700 ${fieldErrors.title ? 'border-red-500' : ''}`}
                required
              />
              {fieldErrors.title && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="excerpt">Ringkasan</Label>
              <Input
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Deksripsi singkat artikel (opsional)"
                className="mt-1.5 bg-zinc-800/50 border-zinc-700"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Akan ditampilkan di daftar artikel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategori <span className="text-red-500">*</span></Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={`w-full mt-1.5 h-10 px-3 bg-zinc-800/50 border rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${fieldErrors.category ? 'border-red-500' : 'border-zinc-700'}`}
                >
                  <option value="" className="bg-zinc-900 text-zinc-100">Pilih kategori</option>
                  {articleCategories.map((cat) => (
                    <option key={cat.value} value={cat.label} className="bg-zinc-900 text-zinc-100">
                      {cat.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <p className="text-sm text-red-500 mt-1">{fieldErrors.category}</p>
                )}
              </div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Thumbnail Section */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-6">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <LucideIcons.Image className="w-5 h-5 text-zinc-400" />
            Thumbnail Artikel
          </h3>

          <div>
            <Label className="text-sm font-medium">Gambar Thumbnail</Label>
            <p className="text-xs text-zinc-500 mt-0.5 mb-3">Gambar utama yang akan ditampilkan di daftar artikel</p>
            <div className="mt-1.5">
              {thumbnailPreview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-3 right-3 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <LucideIcons.X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="w-full aspect-video border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-zinc-800/50 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <LucideIcons.Upload className="w-8 h-8 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-sm text-zinc-400 font-medium">Klik untuk upload thumbnail</span>
                  <span className="text-xs text-zinc-500 mt-1">Format: JPG, PNG, WebP (max 5MB)</span>
                </div>
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
              <LucideIcons.Edit3 className="w-5 h-5 text-zinc-400" />
              Konten Artikel
            </h3>
            {formData.content && (
              <span className="text-sm text-zinc-500">
                ~{calculateReadingTime(formData.content)} menit baca
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="content">
              Konten <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Tulis konten artikel Anda di sini...

Tips:
- Gunakan baris baru untuk paragraf baru
- Mulai dengan heading utama (# Judul)
- Gunakan ## untuk sub-heading
- Format kode dengan ``` untuk code block"
              rows={16}
              required
              className={`w-full mt-1.5 px-3 py-2 bg-zinc-800/50 border rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none font-mono text-sm ${fieldErrors.content ? 'border-red-500' : 'border-zinc-700'}`}
            />
            {fieldErrors.content && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.content}</p>
            )}
            <p className="text-xs text-zinc-500 mt-1">
              Mendukung format Markdown
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            <span className="text-red-500">*</span> Wajib diisi
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e as any, true)}
              className="gap-2"
            >
              <LucideIcons.Save className="w-4 h-4" />
              Simpan Draft
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isSubmitting && !isDraft ? (
                <>
                  <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                  Mempublikasikan...
                </>
              ) : (
                <>
                  <LucideIcons.Send className="w-4 h-4" />
                  Publikasikan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
