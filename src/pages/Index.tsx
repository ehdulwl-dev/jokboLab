import { Link } from "react-router-dom";
import { Search, MessageSquare, Camera, Bell } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ImageCarousel from "@/components/ImageCarousel";

export default function Index() {
  return (
    <>
      {/* Search section */}
      <section className="border-b border-border bg-secondary py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold text-foreground mb-1">족보 자료 검색</h1>
          <p className="text-sm text-muted-foreground mb-5">
            성씨 또는 이름으로 족보 자료를 검색하세요.
          </p>
          <SearchBar large />
        </div>
      </section>

      {/* Shortcuts */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">바로가기</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {[
            { to: "/search", icon: Search, label: "자료검색", desc: "족보 자료를 검색하세요" },
            { to: "/photos", icon: Camera, label: "족보사진", desc: "사진 자료를 열람하세요" },
            { to: "/notices", icon: Bell, label: "공지사항", desc: "새로운 소식을 확인하세요" },
            { to: "/inquiry", icon: MessageSquare, label: "문의사항", desc: "궁금한 점을 문의하세요" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex items-center gap-4 p-5 bg-card hover:bg-secondary transition-colors"
            >
              <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Carousel */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">족보 자료 갤러리</h2>
        <ImageCarousel />
      </section>
    </>
  );
}
