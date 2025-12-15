"use client";

import { Article } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAssetUrl } from "@/lib/env";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(article.publishedAt);

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="group overflow-hidden border-zinc-800 bg-zinc-900/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={getAssetUrl(article.thumbnailUrl)}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-600/90 hover:bg-blue-600 text-white border-0">
              {article.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardHeader className="pb-2">
          <h3 className="text-lg font-bold text-zinc-100 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-zinc-400 text-sm line-clamp-2">
            {article.excerpt}
          </p>
        </CardContent>

        {/* Footer */}
        <CardFooter className="pt-0 border-t border-zinc-800/50 mt-auto">
          <div className="flex items-center justify-between w-full pt-4">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar className="w-7 h-7 border border-zinc-700">
                <AvatarImage src={article.author.avatarUrl} alt={article.author.name} />
                <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                  {article.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-zinc-400 truncate max-w-[100px]">
                {article.author.name}
              </span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 text-zinc-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">{article.readingTime} menit</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
