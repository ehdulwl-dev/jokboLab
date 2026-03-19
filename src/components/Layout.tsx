import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 族譜찾기. All rights reserved.
      </footer>
    </div>
  );
}
