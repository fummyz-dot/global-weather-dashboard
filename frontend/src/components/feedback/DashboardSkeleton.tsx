function PulseBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-300/10 ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div aria-label="天気データを読み込み中" aria-busy="true">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="glass-card rounded-2xl p-5">
            <PulseBlock className="h-4 w-24" />
            <PulseBlock className="mt-4 h-8 w-32" />
            <PulseBlock className="mt-3 h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="glass-card rounded-2xl p-6">
            <PulseBlock className="h-6 w-32" />
            <PulseBlock className="mt-6 h-14 w-24" />
            <div className="mt-6 grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }, (_, item) => (
                <PulseBlock key={item} className="h-16" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
