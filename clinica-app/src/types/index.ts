export type Role = "admin" | "secretaria" | "medico";

export type User = {
  id: string;
  clinicName: string;
  branchName: string;
  fullName: string;
  email: string;
  role: Role;
  specialty?: string;
};

export type AppointmentStatus = "Confirmado" | "Pendiente" | "Cancelado";

export type Appointment = {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
};

export type Patient = {
  id: string;
  fullName: string;
  dni: string;
  phone: string;
  age: number;
  obraSocial: string;
  lastVisit: string;
};

export type DoctorStatus = "Activo" | "Licencia";

export type Doctor = {
  id: string;
  fullName: string;
  specialty: string;
  branchName: string;
  shift: string;
  status: DoctorStatus;
};

export type DashboardSection = "dashboard" | "turnos" | "pacientes" | "medicos";