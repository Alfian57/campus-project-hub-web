"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Globe, Heart, MessageCircle, Check, Crown } from "lucide-react";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getAssetUrl } from "@/lib/env";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [likes] = useState(project.stats.likes);
  const [isLiked] = useState(false); // We can default to false or pass from props if needed, but pure read-only for now on list view is fine or we can use project.stats.isLiked if available

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 h-full relative group">
        <Link href={`/project/${project.id}`} className="absolute inset-0 z-0">
          <span className="sr-only">View Project</span>
        </Link>

        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={getAssetUrl(project.thumbnailUrl)}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </motion.div>

          {/* Pricing Badge */}
          <div className="absolute top-3 left-3 z-10">
            {project.type === "free" ? (
              <Badge className="bg-green-50 dark:bg-green-950/50 border-2 border-green-500 text-green-700 dark:text-green-400 font-semibold px-3 py-1 shadow-md backdrop-blur-sm flex items-center gap-1.5 rounded-full">
                <Check className="w-3.5 h-3.5" />
                Gratis
              </Badge>
            ) : (
              <Badge className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white font-bold px-3 py-1.5 shadow-lg flex items-center gap-1.5 rounded-lg border border-orange-400/30 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <Crown className="w-4 h-4" />
                <span className="relative">Rp {project.price?.toLocaleString("id-ID")}</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title & Description */}
          <h3 className="text-xl font-bold text-zinc-50 mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4 relative z-10">
            {project.techStack.slice(0, 4).map((tech) => (
              <Link key={tech} href={`/projects?techStack=${encodeURIComponent(tech)}`} onClick={(e) => e.stopPropagation()}>
                <Badge
                  variant="secondary"
                  className="text-xs rounded-full px-3 py-1 bg-zinc-800 text-zinc-400 border border-transparent hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all cursor-pointer"
                >
                  {tech}
                </Badge>
              </Link>
            ))}
            {project.techStack.length > 4 && (
              <Badge
                variant="secondary"
                className="text-xs rounded-full px-3 py-1 bg-zinc-800 text-zinc-400 border border-transparent"
              >
                +{project.techStack.length - 4}
              </Badge>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800 relative z-10">
            {/* Left - External Links */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.links.github, "_blank", "noopener,noreferrer");
                }}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
                title="Lihat Kode"
              >
                <Github className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.links.demo, "_blank", "noopener,noreferrer");
                }}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
                title="Lihat Demo"
              >
                <Globe className="w-5 h-5" />
              </button>
            </div>

              {/* Right - Social Stats */}
            <div className="flex items-center gap-4">
              {/* Like Button */}
              <div className="flex items-center gap-1.5 group/like">
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-zinc-400"
                  }`}
                />
                <span className="text-sm font-medium text-zinc-300">
                  {likes}
                </span>
              </div>

              {/* Comments */}
              <div className="flex items-center gap-1.5 text-zinc-400">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium text-zinc-300">
                  {project.stats.commentCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
