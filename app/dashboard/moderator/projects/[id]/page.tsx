"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/role-guard";
import { projectsService } from "@/lib/services/projects";
import { ProjectApiResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlockReasonModal } from "@/components/moderator/block-reason-modal";
import { 
  Loader2, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  ExternalLink,
  User,
  Calendar,
  Eye,
  Heart,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { getAssetUrl } from "@/lib/env";

export default function ModeratorProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const data = await projectsService.getProject(projectId);
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Gagal memuat proyek");
      router.push("/dashboard/moderator/projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async (reason: string) => {
    setIsBlocking(true);
    try {
      await projectsService.blockProject(projectId, reason);
      toast.success("Proyek berhasil diblokir");
      fetchProject();
    } catch (error) {
      console.error("Error blocking project:", error);
      toast.error("Gagal memblokir proyek");
    } finally {
      setIsBlocking(false);
      setShowBlockModal(false);
    }
  };

  const handleUnblock = async () => {
    setIsUnblocking(true);
    try {
      await projectsService.unblockProject(projectId);
      toast.success("Proyek berhasil dibuka blokirnya");
      fetchProject();
    } catch (error) {
      console.error("Error unblocking project:", error);
      toast.error("Gagal membuka blokir proyek");
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

  if (!project) {
    return (
      <RoleGuard allowedRoles={["moderator", "admin"]}>
        <div className="text-center py-20">
          <p className="text-zinc-500">Proyek tidak ditemukan</p>
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
            <Link href="/dashboard/moderator/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-zinc-50">Detail Proyek</h1>
              <p className="text-sm md:text-base text-zinc-400">Moderasi konten proyek</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/projects/${project.id}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Lihat Publik</span>
              </Button>
            </Link>
            
            {project.status === "blocked" ? (
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
                <span className="hidden sm:inline">Blokir Proyek</span>
              </Button>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          {getStatusBadge(project.status)}
          {project.category && <Badge variant="secondary">{project.category.name}</Badge>}
          {project.type === "paid" && (
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
              Berbayar - Rp {project.price.toLocaleString()}
            </Badge>
          )}
        </div>

        {/* Thumbnail */}
        {project.thumbnailUrl && (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <Image
              src={getAssetUrl(project.thumbnailUrl) || "/placeholder.jpg"}
              alt={project.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Project Info */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 space-y-4">
          <h2 className="text-xl font-bold text-zinc-100">{project.title}</h2>
          <p className="text-zinc-400">{project.description}</p>
          
          {/* Stats */}
          <div className="flex items-center gap-6 py-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400">
              <Eye className="w-4 h-4" />
              <span>{project.stats.views} views</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Heart className="w-4 h-4" />
              <span>{project.stats.likes} suka</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <MessageSquare className="w-4 h-4" />
              <span>{project.stats.commentCount} komentar</span>
            </div>
          </div>

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-300 mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <Badge key={i} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-300 mb-4">Pemilik Proyek</h3>
          <div className="flex items-center gap-4">
            <img
              src={project.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author.name}`}
              alt={project.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-zinc-100">{project.author.name}</p>
              <p className="text-sm text-zinc-400">{project.author.email}</p>
            </div>
            <div className="ml-auto">
              <Badge
                className={
                  project.author.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }
              >
                {project.author.status === "active" ? "Aktif" : "Diblokir"}
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
                {new Date(project.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>
            <div>
              <span className="text-zinc-500">Diperbarui</span>
              <p className="text-zinc-300">
                {new Date(project.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Block Modal */}
      <BlockReasonModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={handleBlock}
        title="Blokir Proyek"
        itemName={project.title}
        itemType="proyek"
        isLoading={isBlocking}
      />
    </RoleGuard>
  );
}
