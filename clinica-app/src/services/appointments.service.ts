import { selectFromSupabase } from "../lib/supabase";
import type { Appointment } from "../types";

type AppointmentRow = {
  id: string;
  date: string;
  time: string;
  status: Appointment["status"];
  specialty: string;
  patients: {
    full_name: string;
  } | null;
  doctors: {
    full_name: string;
  } | null;
};

export async function getAppointments(accessToken: string): Promise<Appointment[]> {
  const rows = await selectFromSupabase<AppointmentRow[]>(
    "appointments",
    accessToken,
    "select=id,date,time,status,specialty,patients(full_name),doctors(full_name)&order=date.asc,time.asc",
  );

  return rows.map((row) => ({
    id: row.id,
    patientName: row.patients?.full_name ?? "Paciente",
    doctorName: row.doctors?.full_name ?? "Médico",
    specialty: row.specialty,
    date: row.date,
    time: row.time,
    status: row.status,
  }));
}
