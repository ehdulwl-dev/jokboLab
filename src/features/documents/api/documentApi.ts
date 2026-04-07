import { supabase } from "@/integrations/supabase/client";

/** Supabase table: `genealogy_document` */
export const GENEALOGY_DOCUMENT_TABLE = "genealogy_document" as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const from = (table: string) => (supabase as any).from(table);

export interface Document {
  id: string;
  filename: string;
  file_path: string | null;
  created_at: string;
  updated_at: string;
  family_code: string | null;
}

export async function fetchDocuments(query?: string): Promise<Document[]> {
  let request = from(GENEALOGY_DOCUMENT_TABLE)
    .select("*")
    .order("createddate", { ascending: false });

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
  const { data, error } = await from(GENEALOGY_DOCUMENT_TABLE)
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
  const { data, error } = await from(GENEALOGY_DOCUMENT_TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await from(GENEALOGY_DOCUMENT_TABLE).delete().eq("id", id);
  if (error) throw error;
}
