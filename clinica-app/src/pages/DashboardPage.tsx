import { useMemo, useState } from "react";
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
import type { DashboardSection, User } from "../types";

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

  const filteredAppointments = useMemo(() => {
    if (user.role !== "medico") {
      return mockAppointments;
    }

    return mockAppointments.filter(
      (appointment) => appointment.doctorName === user.fullName
    );
  }, [user]);

  const filteredDoctors = useMemo(() => {
    if (user.role === "medico") {
      return mockDoctors.filter((doctor) => doctor.fullName === user.fullName);
    }

    return mockDoctors;
  }, [user]);

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

          {(currentSection === "dashboard" || currentSection === "turnos") && (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Turnos de hoy"
                  value="18"
                  icon={<CalendarDays className="h-5 w-5" />}
                  hint="Distribuidos entre especialidades"
                />
                <StatCard
                  title="Pacientes activos"
                  value="324"
                  icon={<Users className="h-5 w-5" />}
                  hint="Pacientes con atención reciente"
                />
                <StatCard
                  title="Médicos disponibles"
                  value="20"
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
              <PatientsSection patients={mockPatients} />
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