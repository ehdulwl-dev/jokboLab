import { supabase } from "@/integrations/supabase/client";

/**
 * Supabase Storage에서 파일의 공개 URL을 반환합니다.
 * @param bucket - 스토리지 버킷 이름
 * @param filePath - 파일 경로
 */
export function getStorageUrl(bucket: string, filePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Supabase Storage에 파일을 업로드합니다.
 */
export async function uploadFile(bucket: string, filePath: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (error) throw error;
  return data;
}

/**
 * Supabase Storage에서 파일을 삭제합니다.
 */
export async function deleteFile(bucket: string, filePaths: string[]) {
  const { error } = await supabase.storage.from(bucket).remove(filePaths);
  if (error) throw error;
}
