import { Sunrise, Sunset, Umbrella } from "lucide-react";

import type { DailyForecast } from "../../types/weather";
import { formatForecastDate, formatHour } from "../../utils/dateTime";
import { formatPercent, formatTemperatureWithUnit } from "../../utils/formatters";
import { getWeatherInfo } from "../../utils/weatherCode";
import { HeatLevelBadge } from "./HeatLevelBadge";
import { WeatherIcon } from "./WeatherIcon";

export function DailyForecastCard({ forecast }: { forecast: DailyForecast }) {
  const condition = getWeatherInfo(forecast.weatherCode);
  return (
    <article className="glass-card min-w-[210px] flex-1 rounded-2xl p-4">
      <p className="font-bold text-white">{formatForecastDate(forecast.date)}</p>
      <div className="mt-4 flex items-center gap-3">
        <WeatherIcon code={forecast.weatherCode} className="h-9 w-9 text-cyan-200" decorative />
        <span className="text-sm text-slate-300">{condition.description}</span>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <strong className="text-lg text-orange-200">{formatTemperatureWithUnit(forecast.maximumTemperatureC)}</strong>
        <span className="text-sm text-cyan-200">{formatTemperatureWithUnit(forecast.minimumTemperatureC)}</span>
      </div>
      <div className="mt-4 space-y-2 text-xs text-slate-400">
        <p className="flex items-center gap-2"><Umbrella className="h-3.5 w-3.5" aria-hidden="true" /> 降水 {formatPercent(forecast.maximumPrecipitationProbabilityPercent)}</p>
        <p className="flex items-center gap-2"><Sunrise className="h-3.5 w-3.5" aria-hidden="true" /> {formatHour(forecast.sunriseLocal)}</p>
        <p className="flex items-center gap-2"><Sunset className="h-3.5 w-3.5" aria-hidden="true" /> {formatHour(forecast.sunsetLocal)}</p>
      </div>
      <div className="mt-4"><HeatLevelBadge level={forecast.heatLevel} /></div>
    </article>
  );
}
