import { useState } from "react";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AuthCodeInput() {
  const { isAuthenticated, clanName, verify, logout } = useAuth();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const success = verify(code);
    if (success) {
      toast.success("인증되었습니다.");
      setCode("");
    } else {
      toast.error("유효하지 않은 인증코드입니다.");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 hanji-card shadow-card">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm font-medium text-foreground">
          <span className="text-primary font-semibold">{clanName}</span> 인증됨
        </span>
        <button
          onClick={logout}
          className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> 해제
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-2.5 hanji-card shadow-card">
      <KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="인증코드 입력"
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
      />
      <button
        type="submit"
        className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-all shrink-0"
      >
        확인
      </button>
    </form>
  );
}
