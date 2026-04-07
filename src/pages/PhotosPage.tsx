import { useState, useEffect } from "react";
import { Plus, Trash2, X, Upload, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/Modal";
import { getStorageUrl } from "@/lib/supabaseStorage";
import {
  fetchPhotos,
  createPhoto,
  deletePhoto,
  type Photo,
  type PhotoCategory,
} from "@/features/photos/api/photoApi";

const categories: (PhotoCategory | "전체")[] = ["전체", "산소", "벌초", "기타"];

export default function PhotosPage() {
  const { isAuthenticated, clanName, code, isAdmin } = useAuth();
  const [selectedCat, setSelectedCat] = useState<PhotoCategory | "전체">("전체");
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCat, setUploadCat] = useState<PhotoCategory>("산소");

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPhotos = async () => {
    if (!code) return;
    try {
      setLoading(true);
      const cat = selectedCat === "전체" ? undefined : selectedCat;
      const data = await fetchPhotos(code, cat);
      setPhotos(data);
    } catch (err) {
      console.error("사진 로드 실패:", err);
      toast.error("사진을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && code) {
      loadPhotos();
    }
  }, [isAuthenticated, code, selectedCat]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-6 text-center">
        <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">인증이 필요합니다</h2>
        <p className="text-muted-foreground">
          족보사진을 열람하려면 상단에서 인증코드를 입력해주세요.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          인증코드가 없으신 경우 <a href="/inquiry" className="text-primary underline">문의사항</a>을 통해 발급받으실 수 있습니다.
        </p>
      </div>
    );
  }

  const getPhotoUrl = (photo: Photo) => {
    return photo.file_path ? getStorageUrl("photos", photo.file_path) : "";
  };

  const handleDelete = async (photo: Photo) => {
    try {
      await deletePhoto(photo.id);
      toast.success(`"${photo.title}" 삭제되었습니다.`);
      loadPhotos();
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const handleUpload = async () => {
    // TODO: 실제 파일 업로드 로직 연결
    toast.success("사진이 업로드되었습니다.");
    setUploadOpen(false);
    loadPhotos();
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">족보사진</h2>
          <p className="text-muted-foreground text-sm mt-1">
            <span className="text-primary font-semibold">{clanName}</span> 관련 사진 자료
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" /> 사진 업로드
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCat === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : photos.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          해당 카테고리에 사진이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="hanji-card shadow-card overflow-hidden group cursor-pointer relative"
              onClick={() => setViewPhoto(photo)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={getPhotoUrl(photo)}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{photo.title}</h3>
                    <span className="text-xs text-muted-foreground">{photo.category}</span>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(photo); }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View modal */}
      {viewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setViewPhoto(null)}>
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewPhoto(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-lg hover:bg-card/20 transition-colors"
            >
              <X className="w-5 h-5 text-primary-foreground" />
            </button>
            <img src={getPhotoUrl(viewPhoto)} alt={viewPhoto.title} className="w-full rounded-2xl shadow-elevated" />
            <p className="text-center mt-3 text-primary-foreground text-sm font-medium">{viewPhoto.title}</p>
          </div>
        </div>
      )}

      {/* Upload modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="사진 업로드">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">카테고리</label>
            <select
              value={uploadCat}
              onChange={(e) => setUploadCat(e.target.value as PhotoCategory)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="산소">산소</option>
              <option value="벌초">벌초</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">사진 파일</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">클릭하여 사진을 선택하세요</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, 최대 10MB</p>
            </div>
          </div>
          <button
            onClick={handleUpload}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-all active:scale-[0.98]"
          >
            업로드하기
          </button>
        </div>
      </Modal>
    </div>
  );
}
