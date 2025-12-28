"use client";

import { useEffect, useState } from "react";
import { Eye, Heart } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { cn } from "@/lib/cn";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ProjectStatsProps {
  projectId: string;
  views: number;
  likes: number;
  isLiked: boolean;
}

export function ProjectStats({
  projectId,
  views: initialViews,
  likes: initialLikes,
  isLiked: initialIsLiked,
}: ProjectStatsProps) {
  const { isAuthenticated } = useAuth();
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLiking, setIsLiking] = useState(false);

  // Record view on mount
  useEffect(() => {
    const recordView = async () => {
        try {
            await api.post(`/projects/${projectId}/view`);
            // We do not update view count from server response because it's void
            // Check if we should increment locally or if it was already incremented?
            // Usually views are eventually consistent, but let's just increment locally for better UX if the API returned success
            setViews(v => v + 1);
        } catch (error) {
            console.error("Failed to record view", error);
        }
    };

    // To prevent double counting in React Strict Mode or re-renders
    // We can use a session storage flag or just let it be.
    // Given the requirement is just "integrate feature", simple call is fine.
    // Ideally we should use a ref to ensure it only runs once per session/mount
    // But StrictMode runs twice in dev only.
    
  // Check if we already viewed this project in this session
    const viewedKey = `viewed_${projectId}`;
    if (!sessionStorage.getItem(viewedKey)) {
        recordView();
        sessionStorage.setItem(viewedKey, "true");
    }
  }, [projectId]);

  return (
    <div className="flex items-center gap-6 text-sm text-zinc-400">
      <div className="flex items-center gap-1.5" title={`${views} dilihat`}>
        <Eye className="w-4 h-4" />
        <span>{views} dilihat</span>
      </div>
    </div>
  );
}
