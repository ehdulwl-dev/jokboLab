import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import carousel1 from "@/assets/carousel-1.jpg";
import carousel2 from "@/assets/carousel-2.jpg";
import carousel3 from "@/assets/carousel-3.jpg";
import carousel4 from "@/assets/carousel-4.jpg";

const slides = [
  { src: carousel1, alt: "고서 족보 기록" },
  { src: carousel2, alt: "전통 사당" },
  { src: carousel3, alt: "족보 자료 보관" },
  { src: carousel4, alt: "전통 마을 풍경" },
];

export default function ImageCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  const next = useCallback(() => {
    setStartIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setStartIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, [next]);

  const visibleSlides = [0, 1, 2].map((offset) => slides[(startIndex + offset) % slides.length]);

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
        {visibleSlides.map((slide, i) => (
          <div
            key={`${startIndex}-${i}`}
            className="bg-card overflow-hidden group cursor-pointer"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3 border-t border-border">
              <p className="text-xs text-muted-foreground">{slide.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setStartIndex(i)}
            className={`w-2 h-2 transition-colors ${
              i === startIndex ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
