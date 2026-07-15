import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ApiError } from "../api/client";
import { HourlyPrecipitationChart } from "../components/charts/HourlyPrecipitationChart";
import { HourlyTemperatureChart } from "../components/charts/HourlyTemperatureChart";
import { WeeklyTemperatureChart } from "../components/charts/WeeklyTemperatureChart";
import { DetailSkeleton } from "../components/feedback/DetailSkeleton";
import { ErrorPanel } from "../components/feedback/ErrorPanel";
import { SiteFooter } from "../components/layout/SiteFooter";
import { CurrentWeatherPanel } from "../components/weather/CurrentWeatherPanel";
import { DailyForecastCard } from "../components/weather/DailyForecastCard";
import { useCityWeather } from "../hooks/useCityWeather";
import { NotFoundPage } from "./NotFoundPage";

export function CityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const query = useCityWeather(slug);

  if (!slug) return <NotFoundPage />;
  if (query.isError && query.error instanceof ApiError && query.error.status === 404) {
    return <NotFoundPage />;
  }

  const errorMessage = query.error instanceof ApiError ? query.error.message : undefined;
  const data = query.data;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-[1200px] px-4 pb-4 pt-8 sm:px-6 sm:pt-10">
        <Link to="/" className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          ダッシュボードへ戻る
        </Link>

        {query.isPending ? (
          <DetailSkeleton />
        ) : query.isError ? (
          <ErrorPanel message={errorMessage} onRetry={() => void query.refetch()} />
        ) : !data?.city ? (
          <ErrorPanel message="都市情報が応答に含まれていません。" onRetry={() => void query.refetch()} />
        ) : (
          <>
            <CurrentWeatherPanel city={data.city} current={data.current} today={data.daily?.[0]} />
            <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-2">
              <HourlyTemperatureChart hourly={data.hourly ?? []} />
              <HourlyPrecipitationChart hourly={data.hourly ?? []} />
            </div>
            <div className="mt-6">
              <WeeklyTemperatureChart daily={data.daily ?? []} />
            </div>
            <section className="mt-10" aria-labelledby="weekly-forecast-heading">
              <h2 id="weekly-forecast-heading" className="text-2xl font-bold text-white sm:text-3xl">7日間予報</h2>
              {(data.daily ?? []).length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(data.daily ?? []).map((forecast) => <DailyForecastCard key={forecast.date} forecast={forecast} />)}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-dashed border-slate-500/30 p-8 text-center text-slate-400">週間予報データがありません。</p>
              )}
            </section>
            <aside className="mt-8 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-4 text-sm leading-6 text-orange-50">
              <strong>高温レベルについて:</strong>{" "}
              {data.heatLevelNotice?.disclaimer ?? "高温レベルは独自指標であり、公的な気象警報ではありません。"}
            </aside>
          </>
        )}
      </main>
      <SiteFooter generatedAt={data?.generatedAt} source={data?.source} />
    </div>
  );
}
