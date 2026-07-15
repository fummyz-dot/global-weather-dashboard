import { Droplets, Sunrise, Sunset, Thermometer, Wind } from "lucide-react";

import type { City, CurrentWeather, DailyForecast } from "../../types/weather";
import { useLocalTime } from "../../hooks/useLocalTime";
import { getCityMetadata } from "../../utils/cityMetadata";
import { formatHour } from "../../utils/dateTime";
import {
  formatPercent,
  formatTemperature,
  formatTemperatureWithUnit,
  formatWindSpeed,
} from "../../utils/formatters";
import { getWeatherInfo } from "../../utils/weatherCode";
import { HeatLevelBadge } from "./HeatLevelBadge";
import { MetricItem } from "./MetricItem";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherPanelProps {
  city: City;
  current?: CurrentWeather;
  today?: DailyForecast;
}

export function CurrentWeatherPanel({ city, current, today }: CurrentWeatherPanelProps) {
  const metadata = getCityMetadata(city.slug);
  const localTime = useLocalTime(city.timezone);
  const condition = getWeatherInfo(current?.weatherCode);

  return (
    <section className="glass-card overflow-hidden rounded-3xl p-6 sm:p-8">
      <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <span className="text-xl" aria-hidden="true">{metadata.flag}</span>
            <span>{city.country}</span>
            <span className="text-slate-500">/</span>
            <span>{metadata.englishName}</span>
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">{city.name}</h1>
          <p className="mt-2 text-slate-300">現地時刻 {localTime}</p>

          <div className="mt-8 flex items-center gap-5">
            <div className="rounded-3xl bg-cyan-300/10 p-4 text-cyan-200">
              <WeatherIcon code={current?.weatherCode} className="h-16 w-16" decorative />
            </div>
            <div>
              <p className="text-6xl font-bold tracking-tighter text-white sm:text-7xl">
                {formatTemperature(current?.temperatureC)}
              </p>
              <p className="mt-2 text-lg text-slate-200">{condition.description}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3">
            <MetricItem icon={Thermometer} label="体感温度" value={formatTemperatureWithUnit(current?.apparentTemperatureC)} />
            <MetricItem icon={Droplets} label="湿度" value={formatPercent(current?.relativeHumidityPercent)} />
            <MetricItem icon={Wind} label="風速" value={formatWindSpeed(current?.windSpeedKmh)} />
            <MetricItem icon={Sunrise} label="日の出" value={formatHour(today?.sunriseLocal)} />
            <MetricItem icon={Sunset} label="日の入り" value={formatHour(today?.sunsetLocal)} />
            <div className="rounded-xl bg-slate-950/25 p-3">
              <span className="mb-2 block text-xs text-slate-400">独自の高温レベル</span>
              <HeatLevelBadge level={today?.heatLevel} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
