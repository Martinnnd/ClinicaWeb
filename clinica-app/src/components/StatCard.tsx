import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  hint?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  hint,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold text-slate-900">{value}</h3>
          {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
        </div>

        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
          {icon}
        </div>
      </div>
    </div>
  );
}