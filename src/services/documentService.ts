import { supabase } from "@/integrations/supabase/client";

export interface Document {
  id: string;
  filename: string;
  file_path: string | null;
  created_at: string;
  updated_at: string;
  family_code: string | null;
}

/**
 * 자료 목록 조회 (검색어 필터 포함, 인증 없이 가능)
 */
export async function fetchDocuments(query?: string): Promise<Document[]> {
  let request = supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    request = request.ilike("filename", `%${query}%`);
  }

  const { data, error } = await request;
  if (error) throw error;
  return data ?? [];
}

/**
 * 자료 등록
 */
export async function createDocument(payload: {
  filename: string;
  file_path?: string;
  family_code?: string;
}): Promise<Document> {
  const { data, error } = await supabase
    .from("documents")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 자료 수정
 */
export async function updateDocument(
  id: string,
  payload: { filename?: string; file_path?: string }
): Promise<Document> {
  const { data, error } = await supabase
    .from("documents")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 자료 삭제
 */
export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw error;
}
