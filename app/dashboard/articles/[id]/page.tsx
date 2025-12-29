"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { articlesService } from "@/lib/services/articles";
import { ArticleApiResponse } from "@/types/api";
import { getAssetUrl } from "@/lib/env";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Clock,
  Calendar,
  AlertTriangle,
  ToggleLeft,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function ArticleDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<ArticleApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchArticle() {
      if (!articleId || !user) return;

      try {
        const data = await articlesService.getArticle(articleId);
        
        // Ownership verification
        if (data.author.id !== user.id) {
          setAccessDenied(true);
          return;
        }
        
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Gagal memuat artikel");
        router.push("/dashboard/articles");
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchArticle();
    }
  }, [articleId, user, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await articlesService.deleteArticle(articleId);
      toast.success("Artikel berhasil dihapus");
      router.push("/dashboard/articles");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Gagal menghapus artikel");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!article || article.status === "blocked") return;
    
    const newStatus = article.status === "published" ? "draft" : "published";
    setIsTogglingStatus(true);
    try {
      // Send all existing article data to prevent data loss
      await articlesService.updateArticle(articleId, { 
        title: article.title,
        excerpt: article.excerpt || "",
        content: article.content || "",
        category: article.category || "",
        thumbnailUrl: article.thumbnailUrl || "",
        status: newStatus,
      });
      setArticle({ ...article, status: newStatus });
      toast.success(newStatus === "published" ? "Artikel dipublikasikan!" : "Artikel disimpan sebagai draft");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal mengubah status artikel");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertTriangle className="w-16 h-16 text-yellow-500" />
        <h2 className="text-2xl font-bold text-zinc-50">Akses Ditolak</h2>
        <p className="text-zinc-400">Anda tidak memiliki izin untuk mengakses artikel ini.</p>
        <Link href="/dashboard/articles">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Artikel
          </Button>
        </Link>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-zinc-400">Artikel tidak ditemukan</p>
        <Link href="/dashboard/articles">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Artikel
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/articles">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-zinc-50 line-clamp-1">{article.title}</h1>
            <p className="text-sm md:text-base text-zinc-400 mt-1">Detail dan pengelolaan artikel</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Toggle Button - only show for non-blocked articles */}
          {article.status !== "blocked" && (
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 ${article.status === "published" ? "text-yellow-500 hover:text-yellow-400 border-yellow-500/30" : "text-green-500 hover:text-green-400 border-green-500/30"}`}
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
            >
              {isTogglingStatus ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : article.status === "published" ? (
                <ToggleLeft className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{article.status === "published" ? "Jadikan Draft" : "Publikasikan"}</span>
            </Button>
          )}
          
          {article.status !== "blocked" && (
            <Link href={`/dashboard/articles/${article.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/30"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting || article.status === "blocked"}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        </div>
      </div>

      {/* Status & Meta */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge
          className={
            article.status === "published"
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : article.status === "blocked"
              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
          }
        >
          {article.status === "published"
            ? "Terbit"
            : article.status === "blocked"
            ? "Diblokir"
            : "Draft"}
        </Badge>
        
        {article.category && (
          <Badge variant="secondary">{article.category}</Badge>
        )}
        
        <span className="flex items-center gap-1.5 text-sm text-zinc-500">
          <Clock className="w-4 h-4" />
          {article.readingTime || 5} menit baca
        </span>
        
        <span className="flex items-center gap-1.5 text-sm text-zinc-500">
          <Eye className="w-4 h-4" />
          {article.viewCount || 0} views
        </span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          {article.thumbnailUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <Image
                src={getAssetUrl(article.thumbnailUrl) || "/placeholder.jpg"}
                alt={article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Excerpt */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="font-semibold text-zinc-100 mb-3">Ringkasan</h3>
            <p className="text-zinc-400">{article.excerpt}</p>
          </div>

          {/* Full Content */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="font-semibold text-zinc-100 mb-3">Konten</h3>
            <div 
              className="prose prose-invert prose-zinc max-w-none prose-p:text-zinc-400 prose-headings:text-zinc-100"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-100">Statistik</h3>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-zinc-50">{article.viewCount || 0}</div>
                <div className="text-xs text-zinc-500">Views</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-zinc-50">{article.readingTime || 5}</div>
                <div className="text-xs text-zinc-500">Menit Baca</div>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-3">
            <h3 className="font-semibold text-zinc-100">Informasi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Dibuat</span>
                <span className="text-zinc-300">
                  {new Date(article.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Diperbarui</span>
                <span className="text-zinc-300">
                  {new Date(article.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              {article.publishedAt && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Diterbitkan</span>
                  <span className="text-zinc-300">
                    {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* View Public Page */}
          <Link href={`/articles/${article.id}`} target="_blank">
            <Button variant="outline" className="w-full gap-2">
              <Eye className="w-4 h-4" />
              Lihat Halaman Publik
            </Button>
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Hapus Artikel"
        itemName={article.title}
      />
    </div>
  );
}
