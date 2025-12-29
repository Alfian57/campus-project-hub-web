"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { projectsService } from "@/lib/services/projects";
import { ProjectApiResponse } from "@/types/api";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  Github,
  Ban,
  CheckCircle,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { BlockProjectModal } from "@/components/admin/block-project-modal";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function AdminProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const data = await projectsService.getProject(params.id as string);
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Gagal memuat proyek");
      router.push("/dashboard/admin/projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async (projectId: string, reason: string) => {
    try {
      await projectsService.blockProject(projectId, reason);
      toast.success("Proyek berhasil diblokir");
      fetchProject();
      setIsBlockModalOpen(false);
    } catch (error) {
      console.error("Error blocking project:", error);
      toast.error("Gagal memblokir proyek");
    }
  };

  const handleUnblock = async () => {
    if (!project) return;
    try {
      await projectsService.unblockProject(project.id);
      toast.success("Proyek berhasil dibuka blokirnya");
      fetchProject();
    } catch (error) {
      console.error("Error unblocking project:", error);
      toast.error("Gagal membuka blokir proyek");
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    try {
      await projectsService.deleteProject(project.id);
      toast.success("Proyek berhasil dihapus");
      setIsDeleteModalOpen(false);
      router.push("/dashboard/admin/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Gagal menghapus proyek");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12 text-zinc-500">
        Proyek tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/projects">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Detail Proyek
            </h1>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              Kelola dan moderasi proyek ini
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/project/${project.id}`} target="_blank">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <ExternalLink className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Lihat di Landing Page</span>
            </Button>
          </Link>
          {project.status === "blocked" ? (
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

      {/* Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <img
              src={project.thumbnailUrl || "/placeholder-project.jpg"}
              alt={project.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={
                        project.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {project.status === "published" ? "Terpublikasi" : "Diblokir"}
                    </Badge>
                    <Badge variant="secondary">
                      {project.type === "free" ? "Gratis" : formatCurrency(project.price)}
                    </Badge>
                    {project.category && (
                      <Badge variant="outline">{project.category.name}</Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                {project.description}
              </p>
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          {(project.links.github || project.links.demo) && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Link</h3>
              <div className="flex gap-4">
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  </a>
                )}
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Author */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-4">Pembuat</h3>
            <div className="flex items-center gap-3">
              <img
                src={project.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author.name}`}
                alt={project.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-medium">{project.author.name}</div>
                <div className="text-sm text-zinc-500">{project.author.email}</div>
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
                <span className="font-medium">{project.stats?.views || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Heart className="w-4 h-4" />
                  <span>Likes</span>
                </div>
                <span className="font-medium">{project.stats?.likes || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>Komentar</span>
                </div>
                <span className="font-medium">{project.stats?.commentCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-4">Tanggal</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Dibuat</span>
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Diperbarui</span>
                <span>{formatDate(project.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BlockProjectModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        projectId={project.id}
        projectTitle={project.title}
        onBlock={handleBlock}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Proyek"
        itemName={project.title}
      />
    </div>
  );
}
