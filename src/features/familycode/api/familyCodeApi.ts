import { supabase } from "@/integrations/supabase/client";

/** Maps to Supabase table `family_management`. */
export const FAMILY_MANAGEMENT_TABLE = "family_management" as const;

export interface FamilyCode {
  code: string;
  clan_name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const from = (table: string) => (supabase as any).from(table);

/**
 * Verifies a family code against `family_management`.
 * Expects columns `family_code` and `clan_name`; adjust if your schema differs.
 */
export async function verifyFamilyCode(code: string): Promise<FamilyCode | null> {
  const { data, error } = await from(FAMILY_MANAGEMENT_TABLE)
    .select("family_code, clan_name")
    .eq("family_code", code.toUpperCase())
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    code: data.family_code as string,
    clan_name: data.clan_name as string,
  };
}
