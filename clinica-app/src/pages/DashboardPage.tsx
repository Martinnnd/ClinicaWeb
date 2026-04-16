import { useEffect, useMemo, useState } from "react";
import { Building2, CalendarDays, Stethoscope, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import AppointmentsSection from "../components/appointments/AppointmentsSection";
import PatientsSection from "../components/patients/PatientsSection";
import DoctorsSection from "../components/doctors/DoctorsSection";
import {
  mockAppointments,
  mockDoctors,
  mockPatients,
} from "../data/mock";
import { isSupabaseConfigured } from "../lib/supabase";
import { getSession } from "../services/auth.service";
import { getAppointments } from "../services/appointments.service";
import { getDoctors } from "../services/doctors.service";
import { getPatients } from "../services/patients.service";
import type { Appointment, DashboardSection, Doctor, Patient, User } from "../types";

type DashboardPageProps = {
  user: User;
  onLogout: () => void;
};

export default function DashboardPage({
  user,
  onLogout,
}: DashboardPageProps) {
  const [currentSection, setCurrentSection] =
    useState<DashboardSection>("dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!isSupabaseConfigured()) return;

      const session = getSession();
      if (!session) return;

      try {
        setLoadingData(true);
        setDataError("");

        const [appointmentsData, patientsData, doctorsData] = await Promise.all([
          getAppointments(session.access_token),
          getPatients(session.access_token),
          getDoctors(session.access_token),
        ]);

        setAppointments(appointmentsData);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (error) {
        setDataError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los datos desde Supabase.",
        );
      } finally {
        setLoadingData(false);
      }
    };

    void loadData();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (user.role !== "medico") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.doctorName === user.fullName,
    );
  }, [appointments, user]);

  const filteredDoctors = useMemo(() => {
    if (user.role === "medico") {
      return doctors.filter((doctor) => doctor.fullName === user.fullName);
    }

    return doctors;
  }, [doctors, user]);

  const pageTitleMap: Record<DashboardSection, string> = {
    dashboard: "Bienvenido",
    turnos: "Gestión de turnos",
    pacientes: "Gestión de pacientes",
    medicos: "Equipo médico",
  };

  const pageDescriptionMap: Record<DashboardSection, string> = {
    dashboard: `${user.clinicName} · Sucursal ${user.branchName}`,
    turnos: "Administración de turnos y disponibilidad médica.",
    pacientes: "Consulta y organización de pacientes registrados.",
    medicos: "Profesionales disponibles por especialidad y sede.",
  };

  return (
    <div className="min-h-screen bg-[#f5f9fc] text-slate-900">
      <div className="flex">
        <Sidebar
          user={user}
          currentSection={currentSection}
          onChangeSection={setCurrentSection}
          onLogout={onLogout}
        />

        <main className="flex-1 p-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900">
              {currentSection === "dashboard"
                ? `${pageTitleMap[currentSection]}, ${user.fullName}`
                : pageTitleMap[currentSection]}
            </h1>

            <p className="mt-2 text-slate-500">
              {pageDescriptionMap[currentSection]}
            </p>
          </div>

          {dataError && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {dataError}
            </div>
          )}

          {loadingData && (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Cargando datos en tiempo real desde Supabase...
            </div>
          )}

          {(currentSection === "dashboard" || currentSection === "turnos") && (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Turnos de hoy"
                  value={String(filteredAppointments.length)}
                  icon={<CalendarDays className="h-5 w-5" />}
                  hint="Distribuidos entre especialidades"
                />
                <StatCard
                  title="Pacientes activos"
                  value={String(patients.length)}
                  icon={<Users className="h-5 w-5" />}
                  hint="Pacientes con atención reciente"
                />
                <StatCard
                  title="Médicos disponibles"
                  value={String(
                    filteredDoctors.filter((doctor) => doctor.status === "Activo")
                      .length,
                  )}
                  icon={<Stethoscope className="h-5 w-5" />}
                  hint="En esta sucursal"
                />
                <StatCard
                  title="Sucursales"
                  value="2"
                  icon={<Building2 className="h-5 w-5" />}
                  hint="Estructura actual"
                />
              </div>

              <div className="mt-6">
                <AppointmentsSection appointments={filteredAppointments} />
              </div>
            </>
          )}

          {currentSection === "pacientes" && (
            <div className="mt-6">
              <PatientsSection patients={patients} />
            </div>
          )}

          {currentSection === "medicos" && (
            <div className="mt-6">
              <DoctorsSection doctors={filteredDoctors} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
