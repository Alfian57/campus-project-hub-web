import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/comment-section";
import { ImageCarousel } from "@/components/image-carousel";
import { ProjectActionCard } from "@/components/project-action-card";
import { Eye, Heart, ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";
import { ProjectApiResponse, CommentApiResponse } from "@/types/api";
import { getAssetUrl } from "@/lib/env";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getProject(id: string): Promise<ProjectApiResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      next: { revalidate: 30 },
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

async function getComments(projectId: string): Promise<CommentApiResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/comments?perPage=50`, {
      next: { revalidate: 30 },
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.data?.items || [] : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const apiComments = await getComments(id);
  
  // Convert API comments to the format expected by CommentSection
  const comments = apiComments.map((c) => ({
    id: c.id,
    user: {
      id: c.user.id,
      name: c.user.name,
      avatarUrl: c.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user.name}`,
      university: c.user.university || undefined,
      major: c.user.major || undefined,
    },
    content: c.content,
    createdAt: new Date(c.createdAt),
  }));

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Proyek
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-zinc-50">
                  {project.title}
                </h1>
                {/* Price Badge */}
                {project.type === "paid" && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-3 py-1 flex items-center gap-1.5">
                    <Crown className="w-4 h-4" />
                    Rp {project.price?.toLocaleString("id-ID")}
                  </Badge>
                )}
                {project.type === "free" && (
                  <Badge className="bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-700 dark:text-green-400 font-semibold">
                    Gratis
                  </Badge>
                )}
              </div>
              <p className="text-lg text-zinc-400 mb-6">
                {project.description}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
                  <Image
                    src={getAssetUrl(project.author.avatarUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author.name}`}
                    alt={project.author.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <div className="font-semibold text-zinc-50">
                    {project.author.name}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {project.author.university || "Unknown University"} • {project.author.major || "Unknown Major"}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{project.stats.views} dilihat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  <span>{project.stats.likes} suka</span>
                </div>
              </div>
            </div>

            {/* Project Images Carousel */}
            <ImageCarousel
              images={project.images?.length ? project.images : (project.thumbnailUrl ? [project.thumbnailUrl] : [])}
              alt={project.title}
            />

            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">
                Teknologi yang Digunakan
              </h3>
              <div className="flex flex-wrap gap-2">
                {(project.techStack || []).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Comments */}
            <CommentSection projectId={project.id} initialComments={comments} />
          </div>

          {/* Sticky Action Box - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <ProjectActionCard
                projectId={project.id}
                projectTitle={project.title}
                projectType={project.type}
                price={project.price || 0}
                authorId={project.author.id}
                links={{
                  github: project.links.github,
                  demo: project.links.demo,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
