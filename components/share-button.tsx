"use client";

import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url: url || window.location.href,
    };

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
        // Fallback or Desktop preference: Copy Link
        handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const link = url || window.location.href;
    navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        toast.success("Tautan berhasil disalin!");
        setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <DropdownMenu>
       <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Bagikan
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
        <DropdownMenuItem onClick={handleCopyLink} className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
            {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
            Salin Tautan
        </DropdownMenuItem>
         {/* Add other share options like WA/Twitter if needed */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
