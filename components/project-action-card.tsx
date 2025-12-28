"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseModal } from "@/components/purchase-modal";
import { useAuth } from "@/components/providers/AuthContext";
import { Github, Globe, Lock, Crown, Check, Heart } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";

interface ProjectActionCardProps {
  projectId: string;
  projectTitle: string;
  projectType: "free" | "paid";
  price: number;
  authorId: string;
  links: {
    github: string;
    demo: string;
  };
  initialLikes: number;
  initialIsLiked: boolean;
}

export function ProjectActionCard({
  projectId,
  projectTitle,
  projectType,
  price,
  authorId,
  links,
  initialLikes,
  initialIsLiked,
}: ProjectActionCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLiking, setIsLiking] = useState(false);
  
  const isOwner = isAuthenticated && user?.id === authorId;
  const canAccessSourceCode = projectType === "free" || isOwner;

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Silakan login untuk menyukai proyek ini");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic update
    const previousLikes = likes;
    const previousIsLiked = isLiked;
    
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev => !prev);

    try {
      const response = await api.post<{ liked: boolean; likes: number }>(`/projects/${projectId}/like`);
      if (response.success && response.data) {
        setLikes(response.data.likes);
        setIsLiked(response.data.liked);
      } else {
        // Revert
        setLikes(previousLikes);
        setIsLiked(previousIsLiked);
        toast.error("Gagal memproses like");
      }
    } catch (error) {
       // Revert
       setLikes(previousLikes);
       setIsLiked(previousIsLiked);
       toast.error("Terjadi kesalahan saat like");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6 space-y-3">
        <h3 className="font-semibold text-zinc-50 mb-4">
          Tautan Proyek
        </h3>
        
        {/* Like Button */}
        <Button 
          className={cn(
            "w-full transition-all border", 
            isLiked 
              ? "bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20 hover:text-red-400" 
              : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50 hover:border-zinc-600"
          )}
          size="lg"
          variant="ghost"
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
          {likes > 0 ? `${likes} Suka` : "Suka Proyek"}
        </Button>

        {/* Demo Button - Always Available but requires Auth */}
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          size="lg" 
          variant="default"
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Silakan login untuk melihat demo");
              return;
            }
            window.open(links.demo, "_blank", "noopener,noreferrer");
          }}
        >
          <Globe className="w-4 h-4 mr-2" />
          Lihat Demo
        </Button>
        
        {/* Source Code Button - Conditional */}
        {canAccessSourceCode ? (
          <Button 
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 mt-3" 
            size="lg" 
            variant="outline"
            onClick={() => {
              if (!isAuthenticated) {
                toast.error("Silakan login untuk melihat kode sumber");
                return;
              }
              window.open(links.github, "_blank", "noopener,noreferrer");
            }}
          >
            <Github className="w-4 h-4 mr-2" />
            Lihat Kode Sumber
          </Button>
        ) : (
          <div className="mt-3 space-y-3">
            {/* Locked Source Code Notice */}
            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                <Lock className="w-4 h-4" />
                <span>Kode sumber terkunci</span>
              </div>
              <p className="text-xs text-zinc-500">
                Beli proyek ini untuk mendapatkan akses ke source code
              </p>
            </div>
            
            {/* Purchase Button */}
            {isAuthenticated ? (
              <PurchaseModal
                projectId={projectId}
                projectTitle={projectTitle}
                price={price}
              >
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold" 
                  size="lg"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Beli - Rp {price.toLocaleString("id-ID")}
                </Button>
              </PurchaseModal>
            ) : (
              <div className="space-y-3">
                <Button 
                  className="w-full bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed hover:bg-zinc-800" 
                  size="lg"
                  disabled
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Beli - Rp {price.toLocaleString("id-ID")}
                </Button>
                <p className="text-xs text-center text-zinc-500">
                  Anda harus <a href="/login" className="text-blue-500 hover:text-blue-400 hover:underline">masuk</a> untuk membeli proyek ini
                </p>
              </div>
            )}
          </div>
        )}

        {/* Owner Notice */}
        {isOwner && projectType === "paid" && (
          <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Check className="w-4 h-4" />
              <span>Ini adalah proyek milik Anda</span>
            </div>
            <p className="text-xs text-green-500/80 mt-1">
              Anda memiliki akses penuh ke semua fitur proyek ini
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
