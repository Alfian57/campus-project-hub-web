"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { projectsService } from "@/lib/services/projects";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Loader2, X } from "lucide-react";
import { ProjectApiResponse } from "@/types/api";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { LandingHeader } from "@/components/landing/landing-header";

type FilterType = "all" | "free" | "paid";

// Convert API response to Project type
function mapApiToProject(apiProject: ProjectApiResponse): Project {
  return {
    id: apiProject.id,
    title: apiProject.title,
    description: apiProject.description || "",
    thumbnailUrl: apiProject.thumbnailUrl || "",
    images: apiProject.images,
    techStack: apiProject.techStack || [],
    links: apiProject.links,
    stats: apiProject.stats,
    type: apiProject.type,
    price: apiProject.price,
    author: {
      id: apiProject.author.id,
      name: apiProject.author.name,
      avatarUrl: apiProject.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiProject.author.name}`,
      university: apiProject.author.university || undefined,
      major: apiProject.author.major || undefined,
    },
  };
}

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const techStackParam = searchParams.get("techStack");

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [freeCount, setFreeCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await projectsService.getProjects({
        perPage: 50,
        type: filter,
        search: debouncedSearch || undefined,
        // @ts-ignore - Assuming getProjects supports techStack but types might not be updated yet
        techStack: techStackParam || undefined,
      });
      
      setProjects(data.items.map(mapApiToProject));
      setTotalCount(data.total);
      
      // Count free and paid for filters (only if no specific filters active to save requests)
      if (filter === "all" && !debouncedSearch && !techStackParam) {
        const freeData = await projectsService.getProjects({ type: "free", perPage: 1 });
        const paidData = await projectsService.getProjects({ type: "paid", perPage: 1 });
        setFreeCount(freeData.total);
        setPaidCount(paidData.total);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, debouncedSearch, techStackParam]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const clearTechFilter = () => {
    router.push("/projects");
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-50 mb-2">Semua Proyek</h1>
          <p className="text-zinc-400">
            {isLoading ? "Memuat..." : `${projects.length} proyek ditemukan`}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Cari proyek berdasarkan judul, deskripsi, atau teknologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 font-medium"
            />
          </div>

          <div className="flex flex-col gap-4">
            {/* Type Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Filter className="w-4 h-4" />
                <span>Tipe Proyek:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={
                    filter === "all"
                      ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                      : "border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                  }
                >
                  Semua
                </Button>
                <Button
                  variant={filter === "free" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("free")}
                  className={
                    filter === "free"
                      ? "bg-green-600 hover:bg-green-700 border-green-600"
                      : "border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                  }
                >
                  Gratis
                </Button>
                <Button
                  variant={filter === "paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("paid")}
                  className={
                    filter === "paid"
                      ? "bg-orange-600 hover:bg-orange-700 border-orange-600"
                      : "border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                  }
                >
                  Berbayar
                </Button>
              </div>
            </div>

            {/* Active Tech Filter */}
            {techStackParam && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="text-sm font-medium text-zinc-400">
                  Filter Teknologi:
                </div>
                 <div className="flex items-center gap-2">
                  <Badge className="pl-3 pr-1 py-1.5 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700 flex items-center gap-2 text-sm">
                    {techStackParam}
                    <button 
                      onClick={clearTechFilter}
                      className="p-1 hover:bg-zinc-600 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearTechFilter}
                    className="text-zinc-500 hover:text-zinc-300 text-xs h-auto py-1"
                  >
                    Hapus Filter
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
            <div className="text-6xl mb-6 opacity-80">🔍</div>
            <h3 className="text-xl font-bold text-zinc-50 mb-2">
              Tidak ada proyek ditemukan
            </h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Kami tidak dapat menemukan proyek yang cocok dengan kriteria pencarian Anda. Coba ubah kata kunci atau hapus filter.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
                clearTechFilter();
              }}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Reset Semua Filter
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
