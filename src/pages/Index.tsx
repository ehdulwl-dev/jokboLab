import { Link } from "react-router-dom";
import { Search, MessageSquare } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ImageCarousel from "@/components/ImageCarousel";
import heroBg from "@/assets/hero-bg.jpg";

export default function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
        </div>
        <div className="relative z-10 text-center max-w-2xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 tracking-tight">
            뿌리를 찾는 가장 정직한 방법
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            족보를 쉽고 빠르게 찾아보세요
          </p>
          <SearchBar large />
        </div>
      </section>

      {/* Shortcuts */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/search"
            className="group flex items-center gap-4 p-6 bg-card rounded-2xl shadow-card border border-border hover:shadow-elevated transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">자료검색 바로가기</h3>
              <p className="text-sm text-muted-foreground">족보 자료를 검색하고 다운로드하세요</p>
            </div>
          </Link>
          <Link
            to="/inquiry"
            className="group flex items-center gap-4 p-6 bg-card rounded-2xl shadow-card border border-border hover:shadow-elevated transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">문의사항 바로가기</h3>
              <p className="text-sm text-muted-foreground">궁금한 점을 문의해 주세요</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Carousel */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">족보 자료 갤러리</h2>
        <ImageCarousel />
      </section>
    </>
  );
}
