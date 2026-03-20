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
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {visibleSlides.map((slide, i) => (
          <div
            key={`${startIndex}-${i}`}
            className="hanji-card shadow-card overflow-hidden group cursor-pointer"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-sm text-muted-foreground">{slide.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm shadow-card flex items-center justify-center hover:bg-card transition-colors border border-border"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm shadow-card flex items-center justify-center hover:bg-card transition-colors border border-border"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setStartIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === startIndex ? "w-8 bg-primary" : "w-1.5 bg-primary/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
