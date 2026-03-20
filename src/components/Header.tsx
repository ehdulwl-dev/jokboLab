import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthCodeInput from "./AuthCodeInput";

const navItems = [
  { label: "메인", path: "/" },
  { label: "자료검색", path: "/search" },
  { label: "족보사진", path: "/photos" },
  { label: "공지사항", path: "/notices" },
  { label: "문의사항", path: "/inquiry" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-primary tracking-tight font-serif whitespace-nowrap">
          族譜찾기
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth code - desktop */}
        <div className="hidden lg:block w-72">
          <AuthCodeInput />
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-border bg-card"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2">
                <AuthCodeInput />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
