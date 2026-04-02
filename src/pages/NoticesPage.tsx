import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/Modal";
import {
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  type Notice,
} from "@/services/noticeService";

export default function NoticesPage() {
  const { isAuthenticated, clanName, code, isAdmin } = useAuth();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotices = async () => {
    if (!code) return;
    try {
      setLoading(true);
      const data = await fetchNotices(code);
      setNotices(data);
    } catch (err) {
      console.error("공지 로드 실패:", err);
      toast.error("공지사항을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && code) {
      loadNotices();
    }
  }, [isAuthenticated, code]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-6 text-center">
        <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">인증이 필요합니다</h2>
        <p className="text-muted-foreground">
          공지사항을 열람하려면 상단에서 인증코드를 입력해주세요.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          인증코드가 없으신 경우 <a href="/inquiry" className="text-primary underline">문의사항</a>을 통해 발급받으실 수 있습니다.
        </p>
      </div>
    );
  }

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: "", content: "" });
    setModalOpen(true);
  };

  const openEdit = (notice: Notice) => {
    setEditItem(notice);
    setForm({ title: notice.title, content: notice.content });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }
    try {
      if (editItem) {
        await updateNotice(editItem.id, { title: form.title, content: form.content });
        toast.success("수정되었습니다.");
      } else {
        await createNotice({ title: form.title, content: form.content, family_code: code! });
        toast.success("등록되었습니다.");
      }
      setModalOpen(false);
      loadNotices();
    } catch {
      toast.error("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (notice: Notice) => {
    try {
      await deleteNotice(notice.id);
      toast.success(`"${notice.title}" 삭제되었습니다.`);
      loadNotices();
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  // Detail view
  if (selectedNotice) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <button
          onClick={() => setSelectedNotice(null)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> 목록으로
        </button>
        <article className="hanji-card shadow-card p-8">
          <h2 className="text-xl font-bold text-foreground mb-2">{selectedNotice.title}</h2>
          <p className="text-sm text-muted-foreground mb-6 tabular-nums">{selectedNotice.created_at?.slice(0, 10)}</p>
          <div className="text-foreground leading-relaxed whitespace-pre-line">
            {selectedNotice.content}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">공지사항</h2>
          <p className="text-muted-foreground text-sm mt-1">
            <span className="text-primary font-semibold">{clanName}</span> 관련 공지
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" /> 공지 등록
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : notices.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">공지사항이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="hanji-card shadow-card p-5 cursor-pointer hover:shadow-elevated transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{notice.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>
                  <p className="text-xs text-muted-foreground mt-2 tabular-nums">{notice.created_at?.slice(0, 10)}</p>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1 ml-4 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(notice); }}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(notice); }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "공지 수정" : "공지 등록"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">제목</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="공지 제목"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">내용</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="공지 내용을 입력하세요"
              rows={6}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-all active:scale-[0.98]"
          >
            {editItem ? "수정하기" : "등록하기"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
