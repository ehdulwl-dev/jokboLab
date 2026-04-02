import { supabase } from "@/integrations/supabase/client";

export interface Inquiry {
  id: string;
  title: string;
  content: string;
  author: string;
  contact: string | null;
  created_at: string;
}

/**
 * 문의사항 목록 조회
 */
export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from("inquiries")
    .select("id, title, content, author, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  // contact는 서버에서 제외하거나 마스킹 처리
  return (data ?? []).map((d) => ({ ...d, contact: null }));
}

/**
 * 문의사항 등록
 */
export async function createInquiry(payload: {
  title: string;
  content: string;
  author: string;
  contact?: string;
}): Promise<Inquiry> {
  const { data, error } = await supabase
    .from("inquiries")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}
