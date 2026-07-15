import { CloudSun, RefreshCw } from "lucide-react";

import { ApiError } from "../api/client";
import { DashboardTemperatureChart } from "../components/charts/DashboardTemperatureChart";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { DashboardSkeleton } from "../components/feedback/DashboardSkeleton";
import { ErrorPanel } from "../components/feedback/ErrorPanel";
import { SiteFooter } from "../components/layout/SiteFooter";
import { CityWeatherCard } from "../components/weather/CityWeatherCard";
import { useDashboard } from "../hooks/useDashboard";
import type { DashboardCity, Region } from "../types/weather";
import { formatGeneratedAt } from "../utils/dateTime";
import { buildDashboardHighlights } from "../utils/dashboardSummary";

function RegionSection({
  title,
  eyebrow,
  cities,
}: {
  title: string;
  eyebrow: string;
  cities: DashboardCity[];
}) {
  return (
    <section className="mt-12" aria-labelledby={`${eyebrow}-cities-heading`}>
      <div className="mb-5">
        <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">{eyebrow}</p>
        <h2 id={`${eyebrow}-cities-heading`} className="mt-1 text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      </div>
      {cities.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => <CityWeatherCard key={city.city.slug} weather={city} />)}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-500/30 p-8 text-center text-slate-400">表示できる都市データがありません。</p>
      )}
    </section>
  );
}

function citiesForRegion(cities: DashboardCity[], region: Region): DashboardCity[] {
  return cities.filter((item) => item.city?.region === region);
}

export function DashboardPage() {
  const query = useDashboard();
  const cities = query.data?.cities ?? [];
  const highlights = buildDashboardHighlights(cities);
  const errorMessage = query.error instanceof ApiError ? query.error.message : undefined;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[1200px] px-4 pb-4 pt-10 sm:px-6 sm:pt-14">
        <header className="mb-10 flex flex-col gap-6 border-b border-slate-400/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
              <CloudSun className="h-4 w-4" aria-hidden="true" />
              6 CITY WEATHER
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Global Weather Dashboard</h1>
            <p className="mt-4 text-lg text-slate-300">日本と欧州6都市の天気を比較</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="text-sm text-slate-400">API更新: {formatGeneratedAt(query.data?.generatedAt)}</p>
            <button
              type="button"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-200/25 bg-cyan-300/10 px-4 py-2.5 text-sm font-bold text-cyan-100 hover:bg-cyan-300/20 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
              {query.isFetching ? "更新中" : "データ再取得"}
            </button>
          </div>
        </header>

        {query.isPending ? (
          <DashboardSkeleton />
        ) : query.isError ? (
          <ErrorPanel message={errorMessage} onRetry={() => void query.refetch()} />
        ) : (
          <>
            <SummaryCards highlights={highlights} />
            <RegionSection title="日本の都市" eyebrow="JAPAN" cities={citiesForRegion(cities, "japan")} />
            <RegionSection title="欧州の都市" eyebrow="EUROPE" cities={citiesForRegion(cities, "europe")} />
            <div className="mt-12">
              <DashboardTemperatureChart cities={cities} />
            </div>
            <aside className="mt-8 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-4 text-sm leading-6 text-orange-50">
              <strong>高温レベルについて:</strong>{" "}
              {query.data?.heatLevelNotice?.disclaimer ?? "高温レベルは独自指標であり、公的な気象警報ではありません。"}
            </aside>
          </>
        )}
      </main>
      <SiteFooter generatedAt={query.data?.generatedAt} source={query.data?.source} />
    </div>
  );
}
