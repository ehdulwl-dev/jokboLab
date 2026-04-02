import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SearchBar from "@/components/SearchBar";
import Modal from "@/components/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { getStorageUrl } from "@/lib/supabaseStorage";
import {
  fetchDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  type Document,
} from "@/services/documentService";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const { isAdmin } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Document | null>(null);
  const [formName, setFormName] = useState("");

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async (q?: string) => {
    try {
      setLoading(true);
      const data = await fetchDocuments(q);
      setDocuments(data);
    } catch (err) {
      console.error("문서 로드 실패:", err);
      toast.error("자료를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments(query || undefined);
  }, [query]);

  const handleDownload = (doc: Document) => {
    if (doc.file_path) {
      const url = getStorageUrl("documents", doc.file_path);
      window.open(url, "_blank");
    } else {
      toast.success(`${doc.filename} 다운로드를 시작합니다.`);
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setFormName("");
    setModalOpen(true);
  };

  const openEdit = (item: Document) => {
    setEditItem(item);
    setFormName(item.filename);
    setModalOpen(true);
  };

  const handleDelete = async (item: Document) => {
    try {
      await deleteDocument(item.id);
      toast.success(`${item.filename}이(가) 삭제되었습니다.`);
      loadDocuments(query || undefined);
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    try {
      if (editItem) {
        await updateDocument(editItem.id, { filename: formName });
        toast.success("수정되었습니다.");
      } else {
        await createDocument({ filename: formName });
        toast.success("등록되었습니다.");
      }
      setModalOpen(false);
      loadDocuments(query || undefined);
    } catch {
      toast.error("저장에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Search */}
      <div className="mb-10">
        <SearchBar onSearch={setQuery} defaultValue={query} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">자료 검색 결과</h2>
          <p className="text-muted-foreground text-sm mt-1">
            총 {documents.length}개의 자료가 검색되었습니다. 다운로드는 인증 없이 가능합니다.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" /> 등록
          </button>
        )}
      </div>

      {/* Loading */}
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
                  {["번호", "파일명", "생성일자", "수정일자", "작업"].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {documents.map((item, idx) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 tabular-nums text-muted-foreground">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{item.filename}</td>
                    <td className="px-6 py-4 tabular-nums text-muted-foreground">{item.created_at?.slice(0, 10)}</td>
                    <td className="px-6 py-4 tabular-nums text-muted-foreground">{item.updated_at?.slice(0, 10)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> 다운로드
                        </button>
                        {isAdmin && (
                          <>
                            <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button onClick={() => handleDelete(item)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {documents.map((item, idx) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.filename}</p>
                    <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                      생성: {item.created_at?.slice(0, 10)} · 수정: {item.updated_at?.slice(0, 10)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">#{idx + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs font-medium"
                  >
                    <Download className="w-3.5 h-3.5" /> 다운로드
                  </button>
                  {isAdmin && (
                    <>
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => handleDelete(item)} className="p-1.5 rounded-lg hover:bg-destructive/10">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "자료 수정" : "자료 등록"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">파일명</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="파일명을 입력하세요"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">파일 업로드</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">클릭하여 파일을 선택하거나 드래그하세요</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, 최대 50MB</p>
            </div>
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
