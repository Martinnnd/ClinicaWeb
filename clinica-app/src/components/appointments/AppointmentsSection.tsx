import type { Appointment } from "../../types";

type AppointmentsSectionProps = {
  appointments: Appointment[];
};

function getStatusClasses(status: Appointment["status"]) {
  if (status === "Confirmado") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Pendiente") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-rose-200 bg-rose-50 text-rose-700";
}

export default function AppointmentsSection({
  appointments,
}: AppointmentsSectionProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Turnos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gestión inicial de turnos por paciente, profesional y horario.
          </p>
        </div>

        <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
          Nuevo turno
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-medium text-slate-900">
                {appointment.patientName}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {appointment.doctorName} · {appointment.specialty}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-700">{appointment.date}</p>
                <p className="text-xs text-slate-400">{appointment.time}</p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}