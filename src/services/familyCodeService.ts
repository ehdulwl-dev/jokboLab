import { supabase } from "@/integrations/supabase/client";

export interface FamilyCode {
  code: string;
  clan_name: string;
}

const from = (table: string) => (supabase as any).from(table);

export async function verifyFamilyCode(code: string): Promise<FamilyCode | null> {
  const { data, error } = await from("family_codes")
    .select("code, clan_name")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}
