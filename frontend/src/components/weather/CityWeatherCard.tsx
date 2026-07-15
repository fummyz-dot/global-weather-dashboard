import {
  ArrowRight,
  Droplets,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { DashboardCity } from "../../types/weather";
import { getCityMetadata } from "../../utils/cityMetadata";
import {
  formatPercent,
  formatTemperature,
  formatTemperatureWithUnit,
  formatWindSpeed,
} from "../../utils/formatters";
import { getWeatherInfo } from "../../utils/weatherCode";
import { useLocalTime } from "../../hooks/useLocalTime";
import { HeatLevelBadge } from "./HeatLevelBadge";
import { MetricItem } from "./MetricItem";
import { WeatherIcon } from "./WeatherIcon";

interface CityWeatherCardProps {
  weather: DashboardCity;
}

export function CityWeatherCard({ weather }: CityWeatherCardProps) {
  const { city, current, today } = weather;
  const metadata = getCityMetadata(city.slug);
  const localTime = useLocalTime(city.timezone);
  const condition = getWeatherInfo(current?.weatherCode);

  return (
    <article className="glass-card flex min-w-0 flex-col rounded-2xl p-5 sm:p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan-200">
            <span className="text-lg" aria-hidden="true">{metadata.flag}</span>
            <span>{metadata.countryCode}</span>
            <span className="text-slate-500" aria-hidden="true">•</span>
            <span className="truncate text-slate-300">{city.country}</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">{city.name}</h3>
          <p className="text-sm text-slate-400">{metadata.englishName}</p>
        </div>
        <div className="rounded-2xl bg-cyan-300/10 p-3 text-cyan-200">
          <WeatherIcon code={current?.weatherCode} className="h-10 w-10" decorative />
        </div>
      </header>

      <p className="mt-4 text-sm text-slate-300">
        <span className="sr-only">現地時刻 </span>{localTime}
      </p>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-5xl font-bold tracking-tighter text-white">
            {formatTemperature(current?.temperatureC)}
          </p>
          <p className="mt-1 text-sm text-slate-300">{condition.description}</p>
        </div>
        <div className="pb-1 text-right text-sm text-slate-300">
          <p>最高 <strong className="text-orange-200">{formatTemperatureWithUnit(today?.maximumTemperatureC)}</strong></p>
          <p className="mt-1">最低 <strong className="text-cyan-200">{formatTemperatureWithUnit(today?.minimumTemperatureC)}</strong></p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <MetricItem icon={Thermometer} label="体感温度" value={formatTemperatureWithUnit(current?.apparentTemperatureC)} />
        <MetricItem icon={Droplets} label="湿度" value={formatPercent(current?.relativeHumidityPercent)} />
        <MetricItem icon={Umbrella} label="降水確率（最大）" value={formatPercent(today?.maximumPrecipitationProbabilityPercent)} />
        <MetricItem icon={Wind} label="風速" value={formatWindSpeed(current?.windSpeedKmh)} />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-400/15 pt-4">
        <div>
          <span className="mb-1 block text-[11px] text-slate-500">独自の高温レベル</span>
          <HeatLevelBadge level={today?.heatLevel} />
        </div>
        <Link
          to={`/cities/${city.slug}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-200"
          aria-label={`${city.name}の詳細を見る`}
        >
          詳細
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
