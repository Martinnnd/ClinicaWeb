import { useState } from "react";
import { Building2, CalendarDays, Stethoscope, Users } from "lucide-react";
import { mockUsers, STORAGE_KEY } from "../data/mock";
import type { User } from "../types";

type LoginPageProps = {
  onLogin: (user: User) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("admin@selfcare.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const foundUser = mockUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (!foundUser) {
      setError("Credenciales inválidas. Probá con uno de los usuarios demo.");
      return;
    }

    const { password: _password, ...safeUser } = foundUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    onLogin(safeUser);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f9fc] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.10),transparent_25%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm text-cyan-700">
            <Building2 className="h-4 w-4" />
            Sistema de gestión clínica
          </div>

          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-6xl">
              Gestión moderna para{" "}
              <span className="text-blue-600">clínicas y consultorios</span>
            </h1>

            <p className="text-lg leading-relaxed text-slate-600">
              Un panel pensado para administrar turnos, pacientes,
              profesionales y sucursales desde una experiencia clara, moderna,
              ordenada y profesional.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <p className="mt-3 font-medium text-slate-900">
                Turnos centralizados
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Agenda por médico, especialidad y sucursal.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <Users className="h-5 w-5 text-emerald-600" />
              <p className="mt-3 font-medium text-slate-900">
                Pacientes organizados
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Datos centralizados e historial básico.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <Stethoscope className="h-5 w-5 text-cyan-600" />
              <p className="mt-3 font-medium text-slate-900">
                Roles por usuario
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Administrador, secretaria y médico.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Ingresar al sistema
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Demo del front con login simulado usando localStorage.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-700">
                Correo
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@clinica.com"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-slate-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="h-12 w-full rounded-2xl bg-blue-600 font-medium text-white transition hover:bg-blue-700"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Usuarios demo</p>
            <div className="mt-3 space-y-2 text-xs text-slate-500">
              <p>
                <span className="text-slate-700">Admin:</span> admin@selfcare.com / 123456
              </p>
              <p>
                <span className="text-slate-700">Secretaria:</span> secretaria@selfcare.com / 123456
              </p>
              <p>
                <span className="text-slate-700">Médico:</span> medico@selfcare.com / 123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}