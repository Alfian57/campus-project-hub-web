"use client";

import { useState, useEffect, useCallback } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { projectsService } from "@/lib/services/projects";
import { ProjectApiResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlockReasonModal } from "@/components/moderator/block-reason-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Loader2, 
  Search, 
  ArrowLeft, 
  Lock,
  Unlock,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getAssetUrl } from "@/lib/env";

export default function ModeratorProjectsPage() {
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectApiResponse | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await projectsService.getProjects({
        page,
        perPage: 20,
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setProjects(data.items);
      setTotalPages(data.meta.total_pages);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Gagal memuat data proyek");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchProjects]);

  const openBlockModal = (project: ProjectApiResponse) => {
    setSelectedProject(project);
    setShowBlockModal(true);
  };

  const handleBlock = async (reason: string) => {
    if (!selectedProject) return;
    setActionLoading(selectedProject.id);
    try {
      await projectsService.blockProject(selectedProject.id, reason);
      toast.success("Proyek berhasil diblokir");
      fetchProjects();
    } catch (error) {
      console.error("Error blocking project:", error);
      toast.error("Gagal memblokir proyek");
    } finally {
      setActionLoading(null);
      setShowBlockModal(false);
      setSelectedProject(null);
    }
  };

  const handleUnblock = async (projectId: string) => {
    setActionLoading(projectId);
    try {
      await projectsService.unblockProject(projectId);
      toast.success("Proyek berhasil dibuka blokirnya");
      fetchProjects();
    } catch (error) {
      console.error("Error unblocking project:", error);
      toast.error("Gagal membuka blokir proyek");
    } finally {
      setActionLoading(null);
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

  return (
    <RoleGuard allowedRoles={["moderator", "admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/moderator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-50">Moderasi Proyek</h1>
            <p className="text-zinc-400">Kelola dan moderasi konten proyek</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Cari proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-800/50 border-zinc-700"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100"
          >
            <option value="all" className="bg-zinc-900">Semua Status</option>
            <option value="published" className="bg-zinc-900">Terbit</option>
            <option value="draft" className="bg-zinc-900">Draft</option>
            <option value="blocked" className="bg-zinc-900">Diblokir</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : projects.length > 0 ? (
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-zinc-800">
                  <TableHead className="text-zinc-400">Proyek</TableHead>
                  <TableHead className="text-zinc-400">Pemilik</TableHead>
                  <TableHead className="text-zinc-400">Kategori</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="border-zinc-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={getAssetUrl(project.thumbnailUrl) || "/placeholder.jpg"}
                          alt={project.title}
                          className="w-16 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-zinc-100 line-clamp-1">{project.title}</p>
                          <p className="text-sm text-zinc-500 line-clamp-1">{project.description?.slice(0, 50)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-400">{project.author?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.category?.name || "-"}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/moderator/projects/${project.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {project.status === "blocked" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-500 hover:text-green-400 border-green-500/30"
                            onClick={() => handleUnblock(project.id)}
                            disabled={actionLoading === project.id}
                          >
                            {actionLoading === project.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Unlock className="w-4 h-4 mr-1" />
                            )}
                            Buka Blokir
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:text-red-400 border-red-500/30"
                            onClick={() => openBlockModal(project)}
                            disabled={actionLoading === project.id}
                          >
                            {actionLoading === project.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Lock className="w-4 h-4 mr-1" />
                            )}
                            Blokir
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <p className="text-zinc-500">Tidak ada proyek ditemukan</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Block Reason Modal */}
      {selectedProject && (
        <BlockReasonModal
          isOpen={showBlockModal}
          onClose={() => {
            setShowBlockModal(false);
            setSelectedProject(null);
          }}
          onConfirm={handleBlock}
          title="Blokir Proyek"
          itemName={selectedProject.title}
          itemType="proyek"
          isLoading={actionLoading === selectedProject.id}
        />
      )}
    </RoleGuard>
  );
}
