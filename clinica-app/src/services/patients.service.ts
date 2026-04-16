import { selectFromSupabase } from "../lib/supabase";
import type { Patient } from "../types";

type PatientRow = {
  id: string;
  full_name: string;
  dni: string;
  phone: string;
  age: number;
  obra_social: string;
  last_visit: string;
};

export async function getPatients(accessToken: string): Promise<Patient[]> {
  const rows = await selectFromSupabase<PatientRow[]>(
    "patients",
    accessToken,
    "select=id,full_name,dni,phone,age,obra_social,last_visit&order=full_name.asc",
  );

  return rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    dni: row.dni,
    phone: row.phone,
    age: row.age,
    obraSocial: row.obra_social,
    lastVisit: row.last_visit,
  }));
}
