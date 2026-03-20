import { Link } from "react-router-dom";
import { Search, MessageSquare, Camera, Bell } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ImageCarousel from "@/components/ImageCarousel";
import heroBg from "@/assets/hero-bg.jpg";

export default function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-15 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
        <div className="relative z-10 text-center max-w-2xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
            우리 가문의 기록을 찾다
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            성씨 기반 족보 검색 서비스
          </p>
          <div className="hanji-card p-3 shadow-elevated bg-card/70 backdrop-blur-sm">
            <SearchBar large />
          </div>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: "/search", icon: Search, label: "자료검색", desc: "족보 자료를 검색하세요" },
            { to: "/photos", icon: Camera, label: "족보사진", desc: "사진 자료를 열람하세요" },
            { to: "/notices", icon: Bell, label: "공지사항", desc: "새로운 소식을 확인하세요" },
            { to: "/inquiry", icon: MessageSquare, label: "문의사항", desc: "궁금한 점을 문의하세요" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex items-center gap-4 p-5 hanji-card shadow-card hover:shadow-elevated transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </Link>
          ))}
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
