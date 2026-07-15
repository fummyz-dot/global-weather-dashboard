import type { LucideIcon } from "lucide-react";

interface MetricItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function MetricItem({ icon: Icon, label, value }: MetricItemProps) {
  return (
    <div className="rounded-xl bg-slate-950/25 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
