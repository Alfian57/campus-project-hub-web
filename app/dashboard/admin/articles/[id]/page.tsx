"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { articlesService } from "@/lib/services/articles";
import { ArticleApiResponse } from "@/types/api";
import { formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  Ban,
  CheckCircle,
  Trash2,
  Eye,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { BlockArticleModal } from "@/components/admin/block-article-modal";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function AdminArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const fetchArticle = async () => {
    setIsLoading(true);
    try {
      const data = await articlesService.getArticle(params.id as string);
      setArticle(data);
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Gagal memuat artikel");
      router.push("/dashboard/admin/articles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async (articleId: string, reason: string) => {
    try {
      await articlesService.blockArticle(articleId);
      toast.success("Artikel berhasil diblokir");
      fetchArticle();
      setIsBlockModalOpen(false);
    } catch (error) {
      console.error("Error blocking article:", error);
      toast.error("Gagal memblokir artikel");
    }
  };

  const handleUnblock = async () => {
    if (!article) return;
    try {
      await articlesService.unblockArticle(article.id);
      toast.success("Artikel berhasil dibuka blokirnya");
      fetchArticle();
    } catch (error) {
      console.error("Error unblocking article:", error);
      toast.error("Gagal membuka blokir artikel");
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    try {
      await articlesService.deleteArticle(article.id);
      toast.success("Artikel berhasil dihapus");
      router.push("/dashboard/admin/articles");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Gagal menghapus artikel");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12 text-zinc-500">
        Artikel tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/articles">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Detail Artikel
            </h1>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              Kelola dan moderasi artikel ini
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/articles/${article.id}`} target="_blank">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <ExternalLink className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Lihat di Landing Page</span>
            </Button>
          </Link>
          {article.status === "blocked" ? (
            <Button
              onClick={handleUnblock}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-xs md:text-sm"
            >
              <CheckCircle className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Buka Blokir</span>
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBlockModalOpen(true)}
              className="text-xs md:text-sm"
            >
              <Ban className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Blokir</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 text-xs md:text-sm"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Hapus</span>
          </Button>
        </div>
      </div>

      {/* Article Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {article.thumbnailUrl && (
              <img
                src={article.thumbnailUrl}
                alt={article.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {article.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={
                        article.status === "published"
                          ? "bg-green-100 text-green-700"
                          : article.status === "blocked"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {article.status === "published" 
                        ? "Terpublikasi" 
                        : article.status === "blocked"
                        ? "Diblokir"
                        : "Draft"}
                    </Badge>
                    {article.category && (
                      <Badge variant="outline">{article.category}</Badge>
                    )}
                  </div>
                </div>
              </div>
              {article.excerpt && (
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 italic">
                  {article.excerpt}
                </p>
              )}
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content || "" }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-4">Penulis</h3>
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author.name}`}
                alt={article.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-medium">{article.author.name}</div>
                <div className="text-sm text-zinc-500">{article.author.email}</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-4">Statistik</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Eye className="w-4 h-4" />
                  <span>Views</span>
                </div>
                <span className="font-medium">{article.viewCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Clock className="w-4 h-4" />
                  <span>Waktu Baca</span>
                </div>
                <span className="font-medium">{article.readingTime} menit</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-4">Tanggal</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Dibuat</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>
              {article.publishedAt && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Diterbitkan</span>
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BlockArticleModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        articleId={article.id}
        articleTitle={article.title}
        onBlock={handleBlock}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Artikel"
        itemName={article.title}
      />
    </div>
  );
}
