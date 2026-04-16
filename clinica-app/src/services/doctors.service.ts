import { selectFromSupabase } from "../lib/supabase";
import type { Doctor } from "../types";

type DoctorRow = {
  id: string;
  full_name: string;
  specialty: string;
  branch_name: string;
  shift: string;
  status: Doctor["status"];
};

export async function getDoctors(accessToken: string): Promise<Doctor[]> {
  const rows = await selectFromSupabase<DoctorRow[]>(
    "doctors",
    accessToken,
    "select=id,full_name,specialty,branch_name,shift,status&order=full_name.asc",
  );

  return rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    specialty: row.specialty,
    branchName: row.branch_name,
    shift: row.shift,
    status: row.status,
  }));
}
