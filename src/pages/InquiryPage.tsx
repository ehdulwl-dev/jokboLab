import { useState } from "react";
import { Plus, Lock } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/Modal";

interface Inquiry {
  id: number;
  title: string;
  summary: string;
  author: string;
  contact: string;
  createdAt: string;
}

const mockInquiries: Inquiry[] = [
  { id: 1, title: "김해김씨 족보 관련 문의", summary: "김해김씨 32세 관련 자료가 있는지 확인 부탁드립니다.", author: "김○○", contact: "010-****-1234", createdAt: "2024-05-10" },
  { id: 2, title: "자료 다운로드 오류", summary: "전주이씨 족보 PDF 다운로드 시 오류가 발생합니다.", author: "이○○", contact: "010-****-5678", createdAt: "2024-05-08" },
  { id: 3, title: "새로운 족보 등록 요청", summary: "밀양박씨 새로운 족보 자료 등록을 요청합니다.", author: "박○○", contact: "010-****-9012", createdAt: "2024-05-05" },
  { id: 4, title: "회원가입 관련 문의", summary: "회원가입 절차에 대해 문의드립니다.", author: "최○○", contact: "010-****-3456", createdAt: "2024-05-01" },
];

export default function InquiryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", author: "", contact: "" });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }
    toast.success("문의가 등록되었습니다.");
    setModalOpen(false);
    setForm({ title: "", content: "", author: "", contact: "" });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
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

      {/* Desktop table */}
      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
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
              {mockInquiries.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">{item.title}</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{item.summary}</td>
                  <td className="px-6 py-4 text-foreground">{item.author}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {item.contact}
                    </span>
                  </td>
                  <td className="px-6 py-4 tabular-nums text-muted-foreground">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {mockInquiries.map((item) => (
            <div key={item.id} className="p-4 space-y-2">
              <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.author}</span>
                <span className="tabular-nums">{item.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              placeholder="문의 내용을 입력하세요"
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
