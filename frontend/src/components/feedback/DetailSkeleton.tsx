export function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-label="都市の天気を読み込み中" aria-busy="true">
      <div className="glass-card h-72 animate-pulse rounded-3xl bg-slate-300/10" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card h-96 animate-pulse rounded-2xl bg-slate-300/10" />
        <div className="glass-card h-96 animate-pulse rounded-2xl bg-slate-300/10" />
      </div>
      <div className="glass-card h-96 animate-pulse rounded-2xl bg-slate-300/10" />
    </div>
  );
}
