import { selectFromSupabase } from "../lib/supabase";
import type { User } from "../types";

type ProfileRow = {
  id: string;
  clinic_name: string;
  branch_name: string;
  full_name: string;
  email: string;
  role: User["role"];
  specialty: string | null;
};

export async function getProfileById(userId: string, accessToken: string): Promise<User> {
  const rows = await selectFromSupabase<ProfileRow[]>(
    "profiles",
    accessToken,
    `select=id,clinic_name,branch_name,full_name,email,role,specialty&id=eq.${userId}&limit=1`,
  );

  const profile = rows[0];

  if (!profile) {
    throw new Error("No se encontró el perfil del usuario en Supabase.");
  }

  return {
    id: profile.id,
    clinicName: profile.clinic_name,
    branchName: profile.branch_name,
    fullName: profile.full_name,
    email: profile.email,
    role: profile.role,
    specialty: profile.specialty ?? undefined,
  };
}
