import { supabase } from "@/integrations/supabase/client";

export interface Notice {
  id: string;
  title: string;
  content: string;
  family_code: string;
  created_at: string;
}

const from = (table: string) => (supabase as any).from(table);

export async function fetchNotices(familyCode: string): Promise<Notice[]> {
  const { data, error } = await from("notices")
    .select("*")
    .eq("family_code", familyCode)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createNotice(payload: {
  title: string;
  content: string;
  family_code: string;
}): Promise<Notice> {
  const { data, error } = await from("notices")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNotice(
  id: string,
  payload: { title?: string; content?: string }
): Promise<Notice> {
  const { data, error } = await from("notices")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNotice(id: string): Promise<void> {
  const { error } = await from("notices").delete().eq("id", id);
  if (error) throw error;
}
