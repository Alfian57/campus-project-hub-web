"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { getAssetUrl } from "@/lib/env";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images or empty array, show nothing
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center">
        <span className="text-zinc-500">Tidak ada gambar</span>
      </div>
    );
  }

  // If only one image, show without navigation
  if (images.length === 1) {
    return (
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
        <Image
          src={getAssetUrl(images[0])}
          alt={alt}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative group">
      {/* Main Image Container */}
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
        <Image
          src={getAssetUrl(images[currentIndex])}
          alt={`${alt} - Gambar ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          unoptimized
        />

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-zinc-900/70 hover:bg-zinc-900/90 text-white border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-900/70 hover:bg-zinc-900/90 text-white border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={goToNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Image Counter */}
        <div className="absolute top-3 right-3 bg-zinc-900/80 px-3 py-1 rounded-full text-sm text-zinc-200 border border-zinc-700">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-200",
              index === currentIndex
                ? "bg-blue-500 scale-110"
                : "bg-zinc-600 hover:bg-zinc-500"
            )}
            aria-label={`Lihat gambar ${index + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail Strip (for larger galleries) */}
      {images.length > 2 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-blue-500 ring-2 ring-blue-500/30"
                  : "border-zinc-700 hover:border-zinc-500"
              )}
            >
              <Image
                src={getAssetUrl(image)}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
