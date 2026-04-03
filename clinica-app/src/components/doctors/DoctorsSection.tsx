import type { Doctor } from "../../types";

type DoctorsSectionProps = {
  doctors: Doctor[];
};

function getStatusClasses(status: Doctor["status"]) {
  if (status === "Activo") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function DoctorsSection({ doctors }: DoctorsSectionProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Médicos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Profesionales disponibles por especialidad y sucursal.
          </p>
        </div>

        <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
          Nuevo médico
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <article
            key={doctor.id}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{doctor.fullName}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {doctor.specialty}
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                  doctor.status
                )}`}
              >
                {doctor.status}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-800">Sucursal:</span>{" "}
                {doctor.branchName}
              </p>
              <p>
                <span className="font-medium text-slate-800">Horario:</span>{" "}
                {doctor.shift}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}