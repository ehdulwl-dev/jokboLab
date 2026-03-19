import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-card">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={current}
            src={slides[current].src}
            alt={slides[current].alt}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm shadow-card flex items-center justify-center hover:bg-card transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm shadow-card flex items-center justify-center hover:bg-card transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-primary" : "w-1.5 bg-primary/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
