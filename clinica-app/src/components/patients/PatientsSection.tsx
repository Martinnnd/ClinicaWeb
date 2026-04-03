import type { Patient } from "../../types";

type PatientsSectionProps = {
  patients: Patient[];
};

export default function PatientsSection({
  patients,
}: PatientsSectionProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Pacientes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Listado inicial de pacientes con datos básicos e historial reciente.
          </p>
        </div>

        <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
          Nuevo paciente
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
        <div className="grid grid-cols-[2fr_1fr_1fr_0.8fr_1fr] gap-4 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-600">
          <span>Paciente</span>
          <span>DNI</span>
          <span>Contacto</span>
          <span>Edad</span>
          <span>Obra social</span>
        </div>

        <div className="divide-y divide-slate-200">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="grid grid-cols-[2fr_1fr_1fr_0.8fr_1fr] gap-4 px-5 py-4 text-sm text-slate-700"
            >
              <div>
                <p className="font-medium text-slate-900">{patient.fullName}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Última atención: {patient.lastVisit}
                </p>
              </div>

              <span>{patient.dni}</span>
              <span>{patient.phone}</span>
              <span>{patient.age}</span>
              <span>{patient.obraSocial}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}