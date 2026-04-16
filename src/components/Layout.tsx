import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout() {
  const { isAdmin, setIsAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 족보자료검색. All rights reserved.</p>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              isAdmin
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            {isAdmin ? "관리자 모드 종료" : "관리자 모드"}
          </button>
        </div>
      </footer>
    </div>
  );
}
