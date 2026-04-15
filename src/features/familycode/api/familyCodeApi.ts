import type { ApiFailure, ApiResponse } from "@/shared/types/api";
import { apiPost } from "@/shared/api/client";

/** Maps to Supabase table `family_management` (accessed via backend). */
export const FAMILY_MANAGEMENT_TABLE = "family_management" as const;

export interface FamilyCode {
  family_code: string;
  family_name: string;
}

const unwrap = <T>(res: ApiResponse<T>): T => {
  if (res.ok) {
    return res.data;
  }
  throw new Error((res as ApiFailure).error.message);
};

/**
 * Verifies a family code against the backend API.
 * Returns family_code and family_name if valid.
 * Throws error with message "유효하지 않은 인증코드입니다." if not found.
 */
export async function verifyFamilyCode(code: string): Promise<FamilyCode> {
  const res = await apiPost<FamilyCode, { family_code: string }>(
    "/verify-family-code",
    { family_code: code }
  );
  return unwrap(res);
}

