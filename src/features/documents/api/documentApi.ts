import type { ApiFailure, ApiResponse } from "@/shared/types/api";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/shared/api/client";

/** Supabase table: `genealogy_document` (accessed via jokboLab-backend) */
export const GENEALOGY_DOCUMENT_TABLE = "genealogy_document" as const;

export interface Document {
  id: string;
  filename: string;
  file_path: string | null;
  created_at: string;
  updated_at: string;
  family_code: string | null;
}

const unwrap = <T>(res: ApiResponse<T>): T => {
  if (res.ok) {
    return res.data;
  }
  throw new Error((res as ApiFailure).error.message);
};

export async function fetchDocuments(query?: string): Promise<Document[]> {
  const path = query
    ? `/api/documents?${new URLSearchParams({ q: query }).toString()}`
    : "/api/documents";
  const res = await apiGet<Document[]>(path);
  return unwrap(res);
}

export async function createDocument(payload: {
  filename: string;
  file_path?: string;
  family_code?: string;
}): Promise<Document> {
  const res = await apiPost<Document, typeof payload>("/api/documents", payload);
  return unwrap(res);
}

export async function updateDocument(
  id: string,
  payload: { filename?: string; file_path?: string }
): Promise<Document> {
  const res = await apiPatch<Document, typeof payload>(`/api/documents/${id}`, payload);
  return unwrap(res);
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await apiDelete<null>(`/api/documents/${id}`);
  unwrap(res);
}
