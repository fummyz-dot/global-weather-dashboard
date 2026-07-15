import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <section className="glass-card min-w-0 rounded-2xl p-4 sm:p-6">
      <header className="mb-5">
        <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </header>
      <div className="h-72 min-w-0 sm:h-80">{children}</div>
    </section>
  );
}

export function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-500/30 text-sm text-slate-400">
      グラフデータがありません
    </div>
  );
}
