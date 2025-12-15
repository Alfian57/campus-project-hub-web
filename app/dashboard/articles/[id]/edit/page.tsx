"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { uploadFile } from "@/lib/services/upload";
import { ApiError } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { articlesService } from "@/lib/services/articles";

import { getApiUrl, getAssetUrl } from "@/lib/env";

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

export default function EditArticlePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [isLoadingArticle, setIsLoadingArticle] = useState(true);

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
    status: "published" as "published" | "draft",
  });

  // Existing thumbnail URL
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null);
  
  // File state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch article data on mount
  useEffect(() => {
    async function fetchArticle() {
      if (!articleId) return;
      
      try {
        const article = await articlesService.getArticle(articleId);
        setFormData({
          title: article.title,
          excerpt: article.excerpt || "",
          category: article.category || "",
          content: article.content || "",
          status: article.status as "published" | "draft",
        });
        if (article.thumbnailUrl) {
          setExistingThumbnailUrl(article.thumbnailUrl);
          setThumbnailPreview(article.thumbnailUrl);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Gagal memuat artikel");
        router.push("/dashboard/articles");
      } finally {
        setIsLoadingArticle(false);
      }
    }

    if (user) {
      fetchArticle();
    }
  }, [articleId, user, router]);

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
      setExistingThumbnailUrl(null); // Clear existing URL when new file is selected
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setExistingThumbnailUrl(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // Upload new thumbnail if provided
      let thumbnailUrl: string | undefined = existingThumbnailUrl || undefined;
      if (thumbnailFile) {
        toast.loading("Mengunggah thumbnail...", { id: "upload-thumbnail" });
        const result = await uploadFile(thumbnailFile);
        thumbnailUrl = `${API_BASE_URL.replace('/api/v1', '')}${result.url}`;
        toast.dismiss("upload-thumbnail");
      }

      await articlesService.updateArticle(articleId, {
        title: formData.title,
        excerpt: formData.excerpt || formData.content.slice(0, 150) + "...",
        content: formData.content,
        category: formData.category,
        thumbnailUrl: thumbnailUrl,
        status: formData.status,
      });

      toast.success("Artikel berhasil diperbarui!");
      router.push("/dashboard/articles");
    } catch (error) {
      console.error("Error updating article:", error);
      
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

  if (authLoading || !user || isLoadingArticle) {
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
          <h1 className="text-3xl font-bold text-zinc-50">Edit Artikel</h1>
          <p className="text-zinc-400 mt-1">
            Perbarui artikel Anda
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
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
                  <option value="">Pilih kategori</option>
                  {articleCategories.map((cat) => (
                    <option key={cat.value} value={cat.label}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <p className="text-sm text-red-500 mt-1">{fieldErrors.category}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full mt-1.5 h-10 px-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="published">Terbit</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Thumbnail</Label>
              <div className="mt-1.5">
                {thumbnailPreview ? (
                  <div className="relative w-full h-10 flex items-center gap-2 px-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <img
                      src={getAssetUrl(thumbnailPreview)}
                      alt="Thumbnail"
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span className="text-sm text-zinc-300 truncate flex-1">
                      {thumbnailFile?.name || "Thumbnail saat ini"}
                    </span>
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="p-1 hover:bg-zinc-700 rounded transition-colors"
                    >
                      <LucideIcons.X className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-full h-10 flex items-center gap-2 px-3 bg-zinc-800/50 border border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-zinc-800 transition-colors"
                  >
                    <LucideIcons.Upload className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-500">Upload thumbnail</span>
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
              placeholder="Tulis konten artikel Anda di sini..."
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

        {/* Preview Thumbnail */}
        {thumbnailPreview && (
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
              <LucideIcons.Image className="w-5 h-5 text-zinc-400" />
              Preview Thumbnail
            </h3>
            <div className="relative aspect-video max-w-md rounded-lg overflow-hidden bg-zinc-800">
              <img
                src={getAssetUrl(thumbnailPreview)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            <span className="text-red-500">*</span> Wajib diisi
          </p>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/articles">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isSubmitting ? (
                <>
                  <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <LucideIcons.Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
