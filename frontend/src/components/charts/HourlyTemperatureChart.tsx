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

import type { HourlyForecast } from "../../types/weather";
import { formatHour } from "../../utils/dateTime";
import { ChartCard, EmptyChart } from "./ChartCard";
import { axisStyle, gridColor, tooltipStyle } from "./chartTheme";

export function HourlyTemperatureChart({ hourly = [] }: { hourly?: HourlyForecast[] }) {
  const data = hourly.map((item) => ({
    time: formatHour(item.timeLocal),
    気温: item.temperatureC,
    体感温度: item.apparentTemperatureC,
  }));
  return (
    <ChartCard title="24時間の気温" description="気温と体感温度の推移">
      {data.length === 0 ? <EmptyChart /> : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }} accessibilityLayer>
            <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="°" width={48} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line type="monotone" dataKey="気温" stroke="#67e8f9" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} unit="℃" isAnimationActive={false} />
            <Line type="monotone" dataKey="体感温度" stroke="#fb923c" strokeWidth={2.5} strokeDasharray="5 4" dot={false} activeDot={{ r: 5 }} unit="℃" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
