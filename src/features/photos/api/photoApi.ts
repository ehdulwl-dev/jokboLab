import { supabase } from "@/integrations/supabase/client";

/** Supabase table: `genealogy_photo` */
export const GENEALOGY_PHOTO_TABLE = "genealogy_photo" as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const from = (table: string) => (supabase as any).from(table);

export type PhotoCategory = "산소" | "벌초" | "기타";

export interface Photo {
  id: string;
  title: string;
  file_path: string;
  category: PhotoCategory;
  family_code: string;
  created_at: string;
}

export async function fetchPhotos(
  familyCode: string,
  category?: PhotoCategory
): Promise<Photo[]> {
  let request = from(GENEALOGY_PHOTO_TABLE)
    .select("*")
    .eq("family_code", familyCode)
    .order("created_at", { ascending: false });

  if (category) {
    request = request.eq("category", category);
  }

  const { data, error } = await request;
  if (error) throw error;
  return data ?? [];
}

export async function createPhoto(payload: {
  title: string;
  file_path: string;
  category: PhotoCategory;
  family_code: string;
}): Promise<Photo> {
  const { data, error } = await from(GENEALOGY_PHOTO_TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePhoto(id: string): Promise<void> {
  const { error } = await from(GENEALOGY_PHOTO_TABLE).delete().eq("id", id);
  if (error) throw error;
}
