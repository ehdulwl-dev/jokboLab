import { supabase } from "@/integrations/supabase/client";

export interface FamilyCode {
  code: string;
  clan_name: string;
}

/**
 * family_code로 성씨 정보 조회 (인증)
 */
export async function verifyFamilyCode(code: string): Promise<FamilyCode | null> {
  const { data, error } = await supabase
    .from("family_codes")
    .select("code, clan_name")
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (error) throw error;
  return data;
}
