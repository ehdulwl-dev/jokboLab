import { supabase } from "@/integrations/supabase/client";

export interface Inquiry {
  id: string;
  title: string;
  content: string;
  author: string;
  contact: string | null;
  created_at: string;
}

const from = (table: string) => (supabase as any).from(table);

export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await from("inquiries")
    .select("id, title, content, author, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((d: any) => ({ ...d, contact: null }));
}

export async function createInquiry(payload: {
  title: string;
  content: string;
  author: string;
  contact?: string;
}): Promise<Inquiry> {
  const { data, error } = await from("inquiries")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}
