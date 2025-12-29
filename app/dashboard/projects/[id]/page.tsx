"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthContext";
import { projectsService } from "@/lib/services/projects";
import { ProjectApiResponse } from "@/types/api";
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
  Github,
  Globe,
  Heart,
  Eye,
  MessageCircle,
  Crown,
  Check,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";

export default function ProjectDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchProject() {
      if (!projectId || !user) return;

      try {
        const data = await projectsService.getProject(projectId);
        
        // Ownership verification
        if (data.author.id !== user.id) {
          setAccessDenied(true);
          return;
        }
        
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Gagal memuat proyek");
        router.push("/dashboard/projects");
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchProject();
    }
  }, [projectId, user, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await projectsService.deleteProject(projectId);
      toast.success("Proyek berhasil dihapus");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Gagal menghapus proyek");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
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
        <p className="text-zinc-400">Anda tidak memiliki izin untuk mengakses proyek ini.</p>
        <Link href="/dashboard/projects">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Proyek
          </Button>
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-zinc-400">Proyek tidak ditemukan</p>
        <Link href="/dashboard/projects">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Proyek
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-zinc-50 truncate">{project.title}</h1>
            <p className="text-sm md:text-base text-zinc-400 mt-1">Detail dan pengelolaan proyek</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href={`/dashboard/projects/${project.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/30"
            onClick={() => setShowDeleteModal(true)}
            disabled={isDeleting}
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

      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <Badge
          className={
            project.status === "published"
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : project.status === "blocked"
              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
          }
        >
          {project.status === "published"
            ? "Terpublikasi"
            : project.status === "blocked"
            ? "Diblokir"
            : "Draft"}
        </Badge>
        
        {project.type === "paid" ? (
          <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold flex items-center gap-1.5">
            <Crown className="w-4 h-4" />
            Rp {project.price?.toLocaleString("id-ID")}
          </Badge>
        ) : (
          <Badge className="bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-700 dark:text-green-400 font-semibold flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            Gratis
          </Badge>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <Image
              src={getAssetUrl(project.thumbnailUrl) || "/placeholder.jpg"}
              alt={project.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Additional Images */}
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {project.images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900"
                >
                  <Image
                    src={getAssetUrl(img)}
                    alt={`${project.title} - ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="font-semibold text-zinc-100 mb-3">Deskripsi</h3>
            <p className="text-zinc-400 whitespace-pre-wrap">
              {project.description || "Tidak ada deskripsi"}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="font-semibold text-zinc-100 mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack && project.techStack.length > 0 ? (
                project.techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-sm px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700"
                  >
                    {tech}
                  </Badge>
                ))
              ) : (
                <p className="text-zinc-500">Tidak ada tech stack</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Stats and Links */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-100">Statistik</h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-zinc-50">{project.stats.views}</div>
                <div className="text-xs text-zinc-500">Dilihat</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-zinc-50">{project.stats.likes}</div>
                <div className="text-xs text-zinc-500">Suka</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-zinc-50">{project.stats.commentCount}</div>
                <div className="text-xs text-zinc-500">Komentar</div>
              </div>
            </div>
          </div>

          {/* Links Card */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-100">Tautan</h3>
            
            <div className="space-y-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <Github className="w-5 h-5 text-zinc-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-200">GitHub Repository</div>
                    <div className="text-xs text-zinc-500 truncate">{project.links.github}</div>
                  </div>
                </a>
              )}
              
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <Globe className="w-5 h-5 text-zinc-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-200">Live Demo</div>
                    <div className="text-xs text-zinc-500 truncate">{project.links.demo}</div>
                  </div>
                </a>
              )}

              {!project.links.github && !project.links.demo && (
                <p className="text-zinc-500 text-sm">Tidak ada tautan</p>
              )}
            </div>
          </div>

          {/* Category Card */}
          {project.category && (
            <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
              <h3 className="font-semibold text-zinc-100 mb-3">Kategori</h3>
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border border-zinc-700">
                {project.category.name}
              </Badge>
            </div>
          )}

          {/* Metadata Card */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-3">
            <h3 className="font-semibold text-zinc-100">Informasi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Dibuat</span>
                <span className="text-zinc-300">
                  {new Date(project.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Diperbarui</span>
                <span className="text-zinc-300">
                  {new Date(project.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* View Public Page */}
          <Link href={`/project/${project.id}`} target="_blank">
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
        title="Hapus Proyek"
        itemName={project.title}
      />
    </div>
  );
}
