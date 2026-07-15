import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailyForecast } from "../../types/weather";
import { formatForecastDate } from "../../utils/dateTime";
import { ChartCard, EmptyChart } from "./ChartCard";
import { axisStyle, gridColor, tooltipStyle } from "./chartTheme";

export function WeeklyTemperatureChart({ daily = [] }: { daily?: DailyForecast[] }) {
  const data = daily.map((item) => ({
    date: formatForecastDate(item.date),
    最高気温: item.maximumTemperatureC,
    最低気温: item.minimumTemperatureC,
  }));
  return (
    <ChartCard title="7日間の気温" description="予想最高気温と最低気温の推移">
      {data.length === 0 ? <EmptyChart /> : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }} accessibilityLayer>
            <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="°" width={48} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line type="monotone" dataKey="最高気温" stroke="#fb923c" strokeWidth={3} dot={{ r: 4 }} unit="℃" isAnimationActive={false} />
            <Line type="monotone" dataKey="最低気温" stroke="#67e8f9" strokeWidth={3} dot={{ r: 4 }} unit="℃" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
