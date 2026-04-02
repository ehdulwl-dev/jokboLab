import { supabase } from "@/integrations/supabase/client";

export interface Document {
  id: string;
  filename: string;
  file_path: string | null;
  created_at: string;
  updated_at: string;
  family_code: string | null;
}

// 테이블이 아직 Supabase에 생성되지 않았으므로 any 캐스팅 사용
// 테이블 생성 후 generated types가 업데이트되면 제거 가능
const from = (table: string) => (supabase as any).from(table);

export async function fetchDocuments(query?: string): Promise<Document[]> {
  let request = from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    request = request.ilike("filename", `%${query}%`);
  }

  const { data, error } = await request;
  if (error) throw error;
  return data ?? [];
}

export async function createDocument(payload: {
  filename: string;
  file_path?: string;
  family_code?: string;
}): Promise<Document> {
  const { data, error } = await from("documents")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDocument(
  id: string,
  payload: { filename?: string; file_path?: string }
): Promise<Document> {
  const { data, error } = await from("documents")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await from("documents").delete().eq("id", id);
  if (error) throw error;
}
