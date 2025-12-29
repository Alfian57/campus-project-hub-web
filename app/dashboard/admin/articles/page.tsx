"use client";

import { useState, useEffect } from "react";
import { articlesService } from "@/lib/services/articles";
import { ArticleApiResponse } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentStatusBadge, Pagination } from "@/components/shared";
import { toast } from "sonner";
import { Search, Loader2, Trash2, Eye, ArrowUpDown, Filter, Ban, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import { BlockArticleModal } from "@/components/admin/block-article-modal";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [articleToDelete, setArticleToDelete] = useState<ArticleApiResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToBlock, setArticleToBlock] = useState<ArticleApiResponse | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Pagination & Sort
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchArticles();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchArticles();
  }, [pagination.page, pagination.perPage, filterStatus, sortConfig]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const data = await articlesService.getArticles({
        page: pagination.page,
        perPage: pagination.perPage,
        search: searchQuery,
        status: filterStatus,
        sortBy: sortConfig?.key,
        sortDirection: sortConfig?.direction,
      });
      setArticles(data.items);
       setPagination(prev => ({
        ...prev,
        totalItems: data.meta.total_items,
        totalPages: data.meta.total_pages,
      }));
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Gagal memuat artikel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;
    
    try {
      await articlesService.deleteArticle(articleToDelete.id);
      toast.success(`Artikel "${articleToDelete.title}" berhasil dihapus`);
      setIsDeleteModalOpen(false);
      fetchArticles(); // Refresh
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Gagal menghapus artikel");
    }
  };

  const openDeleteModal = (article: ArticleApiResponse) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const handleSort = (key: string) => {
    const validKeys = ["title", "author", "created_at"];
    if (!validKeys.includes(key)) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
    }
    setSortConfig({ key, direction });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBlockArticle = async (articleId: string, reason: string) => {
    try {
      await articlesService.blockArticle(articleId);
      toast.success("Artikel berhasil diblokir");
      fetchArticles();
      setIsBlockModalOpen(false);
    } catch (error) {
      console.error("Error blocking article:", error);
      toast.error("Gagal memblokir artikel");
    }
  };

  const handleUnblockArticle = async (articleId: string) => {
    try {
      await articlesService.unblockArticle(articleId);
      toast.success("Artikel berhasil dibuka blokirnya");
      fetchArticles();
    } catch (error) {
      console.error("Error unblocking article:", error);
      toast.error("Gagal membuka blokir artikel");
    }
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
        return <ArrowUpDown className={`w-4 h-4 ml-1 inline ${sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-blue-500'}`} />
    }
    const validKeys = ["title", "author", "created_at"];
    if (validKeys.includes(key)) {
        return <ArrowUpDown className="w-4 h-4 ml-1 inline text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    }
    return null;
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Manajemen Artikel
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Kelola artikel dan berita
          </p>
        </div>
      </div>

       {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
           <Input
             placeholder="Cari artikel..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="pl-10"
           />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
             {/* Status Filter */}
             <div className="relative">
                <select 
                    className="h-10 w-full md:w-[150px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                    <option value="all">Semua Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="blocked">Blocked</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
             </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer group select-none"
                  onClick={() => handleSort("title")}
                >
                  Artikel {getSortIcon("title")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer group select-none"
                  onClick={() => handleSort("author")}
                >
                  Penulis {getSortIcon("author")}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead 
                   className="cursor-pointer group select-none"
                   onClick={() => handleSort("created_at")}
                >
                  Dipublikasikan {getSortIcon("created_at")}
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={article.thumbnailUrl || "/placeholder-article.jpg"}
                        alt={article.title}
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">
                          {article.title}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {(article.content || "").slice(0, 40)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={article.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author.name}`}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm">{article.author.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ContentStatusBadge status={article.status} />
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-1 text-zinc-500">
                        <Eye className="w-3 h-3" />
                        <span className="text-sm">{article.viewCount}</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(article.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/admin/articles/${article.id}`}>
                        <Button size="sm" variant="ghost" className="hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      {article.status !== "blocked" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setArticleToBlock(article);
                            setIsBlockModalOpen(true);
                          }}
                          className="hover:text-red-600"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUnblockArticle(article.id)}
                          className="hover:text-green-600"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openDeleteModal(article)}
                        className="hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

       {articles.length === 0 && !isLoading && (
        <div className="text-center py-12 text-zinc-500">
          Tidak ada artikel yang ditemukan.
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.perPage}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      {articleToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Hapus Artikel"
          itemName={articleToDelete.title}
        />
      )}

      {articleToBlock && (
        <BlockArticleModal
          isOpen={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
          articleId={articleToBlock.id}
          articleTitle={articleToBlock.title}
          onBlock={handleBlockArticle}
        />
      )}
    </div>
  );
}
