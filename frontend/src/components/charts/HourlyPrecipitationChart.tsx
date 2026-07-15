import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { HourlyForecast } from "../../types/weather";
import { formatHour } from "../../utils/dateTime";
import { ChartCard, EmptyChart } from "./ChartCard";
import { axisStyle, gridColor, tooltipStyle } from "./chartTheme";

export function HourlyPrecipitationChart({ hourly = [] }: { hourly?: HourlyForecast[] }) {
  const data = hourly.map((item) => ({
    time: formatHour(item.timeLocal),
    降水確率: item.precipitationProbabilityPercent,
  }));
  return (
    <ChartCard title="24時間の降水確率" description="1時間ごとの降水確率">
      {data.length === 0 ? <EmptyChart /> : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }} accessibilityLayer>
            <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} interval={3} />
            <YAxis domain={[0, 100]} tick={axisStyle} axisLine={false} tickLine={false} unit="%" width={52} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(103, 232, 249, 0.08)" }} />
            <Bar dataKey="降水確率" fill="#38bdf8" radius={[4, 4, 0, 0]} unit="%" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
