"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ContentStatusBadge, Pagination } from "@/components/shared";
import { Edit, Trash2, Eye, Loader2, Search, ArrowUpDown, Filter, FolderKanban, Heart, Plus, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthContext";
import { projectsService } from "@/lib/services/projects";
import { categoriesService } from "@/lib/services/categories";
import { ProjectApiResponse, CategoryApiResponse } from "@/types/api";
import { toast } from "sonner";
import { ACTION_POINTS } from "@/lib/config/gamification";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [categories, setCategories] = useState<CategoryApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "free" | "paid">("all");

  // Pagination & Sort
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectApiResponse | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchProjects();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, pagination.page, pagination.perPage, categoryFilter, statusFilter, typeFilter, sortConfig]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getCategories({ perPage: 100 });
      setCategories(data.items);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await projectsService.getProjects({
        userId: user.id,
        page: pagination.page,
        perPage: pagination.perPage,
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter || undefined,
        type: typeFilter,
        sortBy: sortConfig?.key,
        sortDirection: sortConfig?.direction,
      });
      setProjects(data.items);
      setPagination(prev => ({
        ...prev,
        totalItems: data.meta.total_items,
        totalPages: data.meta.total_pages,
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Gagal memuat proyek");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    const validKeys = ["title", "created_at"];
    if (!validKeys.includes(key)) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return <ArrowUpDown className={`w-4 h-4 ml-1 inline text-blue-500`} />
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 inline text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
  };

  const handleDeleteClick = (project: ProjectApiResponse) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await projectsService.deleteProject(projectToDelete.id);
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      toast.success("Proyek berhasil dihapus");
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Gagal menghapus proyek");
    }
  };

  // Calculate stats
  const totalLikes = projects.reduce((sum, p) => sum + (p.stats?.likes || 0), 0);

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Proyek Saya
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1">
            Kelola semua proyek Anda
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span className="sm:inline">Unggah Proyek Baru</span>
          </Button>
        </Link>
      </div>

      {/* Stats - only Total Proyek and Total Suka */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Proyek</p>
              <p className="text-2xl font-bold text-zinc-50">{pagination.totalItems}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Suka</p>
              <p className="text-2xl font-bold text-zinc-50">{totalLikes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Cari proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <div className="relative">
            <select 
              className="h-10 w-full md:w-[150px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none dark:text-zinc-100"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              <option value="" className="dark:bg-zinc-900 dark:text-zinc-100">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="dark:bg-zinc-900 dark:text-zinc-100">{cat.name}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select 
              className="h-10 w-full md:w-[150px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none dark:text-zinc-100"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              <option value="" className="dark:bg-zinc-900 dark:text-zinc-100">Semua Status</option>
              <option value="published" className="dark:bg-zinc-900 dark:text-zinc-100">Terpublikasi</option>
              <option value="draft" className="dark:bg-zinc-900 dark:text-zinc-100">Draft</option>
              <option value="blocked" className="dark:bg-zinc-900 dark:text-zinc-100">Diblokir</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select 
              className="h-10 w-full md:w-[130px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none dark:text-zinc-100"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as "all" | "free" | "paid");
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              <option value="all" className="dark:bg-zinc-900 dark:text-zinc-100">Semua Tipe</option>
              <option value="free" className="dark:bg-zinc-900 dark:text-zinc-100">Gratis</option>
              <option value="paid" className="dark:bg-zinc-900 dark:text-zinc-100">Berbayar</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Projects Table */}
      {projects.length > 0 ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer group select-none"
                  onClick={() => handleSort("title")}
                >
                  Proyek {getSortIcon("title")}
                </TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Suka</TableHead>
                <TableHead>Komentar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={project.thumbnailUrl || "/placeholder.jpg"}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">
                          {project.title}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {project.description?.slice(0, 40)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {project.category?.name || "Tidak Ada"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.type === "free" ? "secondary" : "default"}>
                      {project.type === "free" ? "Gratis" : `Rp ${project.price?.toLocaleString("id-ID")}`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      ❤️ {project.stats?.likes || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      💬 {project.stats?.commentCount || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ContentStatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:text-red-600"
                        onClick={() => handleDeleteClick(project)}
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
      ) : !isLoading ? (
        <div className="text-center py-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-zinc-500 mb-4">
            {searchQuery || categoryFilter || statusFilter || typeFilter !== "all" 
              ? "Tidak ada proyek yang sesuai dengan filter Anda"
              : "Anda belum membuat proyek apapun"}
          </p>
          {!searchQuery && !categoryFilter && !statusFilter && typeFilter === "all" && (
            <Link href="/dashboard/projects/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Buat Proyek Pertama Anda
              </Button>
            </Link>
          )}
        </div>
      ) : null}

      {/* Pagination Controls - always show if there are items */}
      {pagination.totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Baris per halaman:</span>
            <div className="relative">
              <select
                className="h-9 w-[70px] rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 cursor-pointer appearance-none dark:text-zinc-100"
                value={pagination.perPage}
                onChange={(e) => setPagination(prev => ({ ...prev, perPage: Number(e.target.value), page: 1 }))}
              >
                <option value="10" className="dark:bg-zinc-900">10</option>
                <option value="20" className="dark:bg-zinc-900">20</option>
                <option value="50" className="dark:bg-zinc-900">50</option>
                <option value="100" className="dark:bg-zinc-900">100</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tips Card */}
      <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100 mb-2">Tips Memamerkan Proyek</h3>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Gunakan thumbnail yang menarik dan berkualitas tinggi</li>
              <li>• Tulis deskripsi yang jelas tentang fitur dan teknologi</li>
              <li>• Tambahkan screenshot untuk menunjukkan UI proyek</li>
              <li>• Sertakan link demo dan repository GitHub</li>
              <li>• Dapatkan <span className="text-green-400 font-semibold">+{ACTION_POINTS.CREATE_PROJECT} EXP</span> untuk setiap proyek yang dipublikasikan!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Hapus Proyek"
        itemName={projectToDelete?.title || ""}
      />
    </div>
  );
}
