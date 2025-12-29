"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/role-guard";
import { articlesService } from "@/lib/services/articles";
import { ArticleApiResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlockReasonModal } from "@/components/moderator/block-reason-modal";
import { 
  Loader2, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  ExternalLink,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { getAssetUrl } from "@/lib/env";

export default function ModeratorArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<ArticleApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const data = await articlesService.getArticle(articleId);
      setArticle(data);
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Gagal memuat artikel");
      router.push("/dashboard/moderator/articles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async (reason: string) => {
    setIsBlocking(true);
    try {
      await articlesService.blockArticle(articleId);
      toast.success("Artikel berhasil diblokir");
      fetchArticle();
    } catch (error) {
      console.error("Error blocking article:", error);
      toast.error("Gagal memblokir artikel");
    } finally {
      setIsBlocking(false);
      setShowBlockModal(false);
    }
  };

  const handleUnblock = async () => {
    setIsUnblocking(true);
    try {
      await articlesService.unblockArticle(articleId);
      toast.success("Artikel berhasil dibuka blokirnya");
      fetchArticle();
    } catch (error) {
      console.error("Error unblocking article:", error);
      toast.error("Gagal membuka blokir artikel");
    } finally {
      setIsUnblocking(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Terbit</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Diblokir</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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

  if (!article) {
    return (
      <RoleGuard allowedRoles={["moderator", "admin"]}>
        <div className="text-center py-20">
          <p className="text-zinc-500">Artikel tidak ditemukan</p>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["moderator", "admin"]}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/moderator/articles">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-zinc-50">Detail Artikel</h1>
              <p className="text-sm md:text-base text-zinc-400">Moderasi konten artikel</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/articles/${article.id}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Lihat Publik</span>
              </Button>
            </Link>
            
            {article.status === "blocked" ? (
              <Button
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={handleUnblock}
                disabled={isUnblocking}
              >
                {isUnblocking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Buka Blokir</span>
              </Button>
            ) : (
              <Button
                size="sm"
                className="gap-2 bg-red-600 hover:bg-red-700"
                onClick={() => setShowBlockModal(true)}
                disabled={isBlocking}
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Blokir Artikel</span>
              </Button>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          {getStatusBadge(article.status)}
          {article.category && <Badge variant="secondary">{article.category}</Badge>}
        </div>

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

        {/* Article Info */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h2 className="text-xl font-bold text-zinc-100">{article.title}</h2>
          <p className="text-zinc-400">{article.excerpt}</p>
          
          {/* Stats */}
          <div className="flex items-center gap-6 py-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400">
              <Eye className="w-4 h-4" />
              <span>{article.viewCount} views</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-4 h-4" />
              <span>{article.readingTime} menit baca</span>
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-300 mb-4">Pratinjau Konten</h3>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-zinc-400 whitespace-pre-wrap">
              {article.content.slice(0, 1000)}
              {article.content.length > 1000 && "..."}
            </p>
          </div>
        </div>

        {/* Author Info */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-300 mb-4">Penulis</h3>
          <div className="flex items-center gap-4">
            <img
              src={article.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author.name}`}
              alt={article.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-zinc-100">{article.author.name}</p>
              <p className="text-sm text-zinc-400">{article.author.email}</p>
            </div>
            <div className="ml-auto">
              <Badge
                className={
                  article.author.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }
              >
                {article.author.status === "active" ? "Aktif" : "Diblokir"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-300 mb-4">Informasi</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-500">Dibuat</span>
              <p className="text-zinc-300">
                {new Date(article.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>
            <div>
              <span className="text-zinc-500">Diperbarui</span>
              <p className="text-zinc-300">
                {new Date(article.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>
            {article.publishedAt && (
              <div>
                <span className="text-zinc-500">Diterbitkan</span>
                <p className="text-zinc-300">
                  {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Modal */}
      <BlockReasonModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={handleBlock}
        title="Blokir Artikel"
        itemName={article.title}
        itemType="artikel"
        isLoading={isBlocking}
      />
    </RoleGuard>
  );
}
