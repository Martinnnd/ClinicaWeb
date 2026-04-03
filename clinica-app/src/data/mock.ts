import type { Appointment, Doctor, Patient, User } from "../types";

export const STORAGE_KEY = "clinica-auth";

export const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    clinicName: "Self-Care Salud",
    branchName: "Padua",
    fullName: "Laura Fernández",
    email: "admin@selfcare.com",
    role: "admin",
    password: "123456",
  },
  {
    id: "2",
    clinicName: "Self-Care Salud",
    branchName: "Padua",
    fullName: "Carla Gómez",
    email: "secretaria@selfcare.com",
    role: "secretaria",
    password: "123456",
  },
  {
    id: "3",
    clinicName: "Self-Care Salud",
    branchName: "Padua",
    fullName: "Dr. Martín López",
    email: "medico@selfcare.com",
    role: "medico",
    specialty: "Cardiología",
    password: "123456",
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    patientName: "Nicolás Pérez",
    doctorName: "Dr. Martín López",
    specialty: "Cardiología",
    date: "15/04/2026",
    time: "15:00",
    status: "Confirmado",
  },
  {
    id: "a2",
    patientName: "Julieta Sosa",
    doctorName: "Dr. Martín López",
    specialty: "Cardiología",
    date: "15/04/2026",
    time: "16:00",
    status: "Pendiente",
  },
  {
    id: "a3",
    patientName: "Pedro Ruiz",
    doctorName: "Dra. Lucía Benítez",
    specialty: "Traumatología",
    date: "16/04/2026",
    time: "10:30",
    status: "Confirmado",
  },
  {
    id: "a4",
    patientName: "Marta Díaz",
    doctorName: "Dr. Martín López",
    specialty: "Cardiología",
    date: "17/04/2026",
    time: "09:00",
    status: "Cancelado",
  },
];

export const mockPatients: Patient[] = [
  {
    id: "p1",
    fullName: "Nicolás Pérez",
    dni: "34.556.221",
    phone: "11 5487-3321",
    age: 37,
    obraSocial: "Particular",
    lastVisit: "10/04/2026",
  },
  {
    id: "p2",
    fullName: "Julieta Sosa",
    dni: "29.887.112",
    phone: "11 6231-4420",
    age: 29,
    obraSocial: "OSDE",
    lastVisit: "05/04/2026",
  },
  {
    id: "p3",
    fullName: "Pedro Ruiz",
    dni: "31.223.901",
    phone: "11 7120-1154",
    age: 42,
    obraSocial: "Swiss Medical",
    lastVisit: "09/04/2026",
  },
  {
    id: "p4",
    fullName: "Marta Díaz",
    dni: "27.110.452",
    phone: "11 4561-2190",
    age: 54,
    obraSocial: "IOMA",
    lastVisit: "02/04/2026",
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    fullName: "Dr. Martín López",
    specialty: "Cardiología",
    branchName: "Padua",
    shift: "Lun a Vie · 14 a 20 hs",
    status: "Activo",
  },
  {
    id: "d2",
    fullName: "Dra. Lucía Benítez",
    specialty: "Traumatología",
    branchName: "Padua",
    shift: "Lun, Mié y Vie · 09 a 13 hs",
    status: "Activo",
  },
  {
    id: "d3",
    fullName: "Dr. Javier Morales",
    specialty: "Clínica Médica",
    branchName: "Castelar",
    shift: "Mar y Jue · 08 a 16 hs",
    status: "Licencia",
  },
];