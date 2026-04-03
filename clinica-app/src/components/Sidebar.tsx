import {
  CalendarDays,
  Building2,
  Users,
  Stethoscope,
  LogOut,
} from "lucide-react";
import type { DashboardSection, User } from "../types";

type SidebarProps = {
  user: User;
  currentSection: DashboardSection;
  onChangeSection: (section: DashboardSection) => void;
  onLogout: () => void;
};

type NavItem = {
  id: DashboardSection;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: CalendarDays },
  { id: "turnos", label: "Turnos", icon: CalendarDays },
  { id: "pacientes", label: "Pacientes", icon: Users },
  { id: "medicos", label: "Médicos", icon: Stethoscope },
];

export default function Sidebar({
  user,
  currentSection,
  onChangeSection,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="flex h-full min-h-screen w-[280px] flex-col border-r border-slate-200 bg-white p-5">
      <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {user.clinicName}
            </p>
            <p className="text-xs text-slate-500">Sucursal {user.branchName}</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeSection(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
        <p className="mt-1 text-xs capitalize text-slate-500">{user.role}</p>

        <button
          onClick={onLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}