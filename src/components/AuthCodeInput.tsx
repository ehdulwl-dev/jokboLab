import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AuthCodeInput() {
  const { isAuthenticated, clanName, verify, logout } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;
    setLoading(true);
    try {
      const success = await verify(code);
      if (success) {
        toast.success("인증되었습니다.");
        setCode("");
      } else {
        toast.error("유효하지 않은 인증코드입니다.");
      }
    } catch {
      toast.error("인증 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-primary font-medium">{clanName}</span>
        <span className="text-muted-foreground">인증됨</span>
        <button
          onClick={logout}
          className="text-xs text-muted-foreground hover:text-foreground border border-border px-2 py-1 transition-colors"
        >
          해제
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-0">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="인증코드 입력"
        className="flex-1 min-w-0 px-3 py-1.5 border border-border border-r-0 text-sm bg-background outline-none focus:border-primary transition-colors"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "인증"}
      </button>
    </form>
  );
}
