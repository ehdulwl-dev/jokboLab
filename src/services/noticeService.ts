import { supabase } from "@/integrations/supabase/client";

export interface Notice {
  id: string;
  title: string;
  content: string;
  family_code: string;
  created_at: string;
}

/**
 * 공지사항 목록 조회 (family_code 기반 필터)
 */
export async function fetchNotices(familyCode: string): Promise<Notice[]> {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("family_code", familyCode)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * 공지사항 등록
 */
export async function createNotice(payload: {
  title: string;
  content: string;
  family_code: string;
}): Promise<Notice> {
  const { data, error } = await supabase
    .from("notices")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 공지사항 수정
 */
export async function updateNotice(
  id: string,
  payload: { title?: string; content?: string }
): Promise<Notice> {
  const { data, error } = await supabase
    .from("notices")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 공지사항 삭제
 */
export async function deleteNotice(id: string): Promise<void> {
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) throw error;
}
