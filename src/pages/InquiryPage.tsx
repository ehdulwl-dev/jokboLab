import { useState, useEffect } from "react";
import { Plus, Lock, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/Modal";
import {
  fetchInquiries,
  createInquiry,
  type Inquiry,
} from "@/features/inquiries/api/inquiryApi";

export default function InquiryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", author: "", contact: "" });

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await fetchInquiries();
      setInquiries(data);
    } catch (err) {
      console.error("문의 로드 실패:", err);
      toast.error("문의사항을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }
    try {
      await createInquiry({
        title: form.title,
        content: form.content,
        author: form.author,
        contact: form.contact || undefined,
      });
      toast.success("문의가 등록되었습니다.");
      setModalOpen(false);
      setForm({ title: "", content: "", author: "", contact: "" });
      loadInquiries();
    } catch {
      toast.error("문의 등록에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">문의사항</h2>
          <p className="text-muted-foreground text-sm mt-1">궁금한 점을 자유롭게 문의해 주세요.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" /> 문의 등록
        </button>
      </div>

      {/* Auth code notice */}
      <div className="flex items-start gap-3 p-4 hanji-card shadow-card mb-8">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">인증코드 안내</p>
          <p className="text-sm text-muted-foreground mt-1">
            족보사진, 공지사항 열람을 위한 인증코드는 문의를 통해 발급됩니다.
            문의 등록 시 성씨와 연락처를 남겨주시면 확인 후 인증코드를 안내해 드립니다.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="hanji-card shadow-card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["제목", "내용", "작성자", "연락처", "작성일"].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {inquiries.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{item.title}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{item.content}</td>
                    <td className="px-6 py-4 text-foreground">{item.author}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Lock className="w-3 h-3" /> 비공개
                      </span>
                    </td>
                    <td className="px-6 py-4 tabular-nums text-muted-foreground">{item.created_at?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {inquiries.map((item) => (
              <div key={item.id} className="p-4 space-y-2">
                <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.author}</span>
                  <span className="tabular-nums">{item.created_at?.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>

          {inquiries.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              등록된 문의사항이 없습니다.
            </div>
          )}
        </div>
      )}

      {/* Inquiry Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="문의 등록">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">제목 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="문의 제목을 입력하세요"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">내용 *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="문의 내용을 입력하세요 (인증코드 발급 요청 시 성씨를 함께 적어주세요)"
              rows={5}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">작성자 *</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="이름"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">연락처</label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="010-0000-0000"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
              />
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
            <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              연락처는 비공개로 처리되며, 관리자만 확인할 수 있습니다.
              인증코드는 문의 확인 후 별도 안내됩니다.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-all active:scale-[0.98]"
          >
            등록하기
          </button>
        </div>
      </Modal>
    </div>
  );
}
