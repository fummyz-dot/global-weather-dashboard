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

import type { DashboardCity } from "../../types/weather";
import { ChartCard, EmptyChart } from "./ChartCard";
import { axisStyle, gridColor, tooltipStyle } from "./chartTheme";

interface DashboardTemperatureChartProps {
  cities: DashboardCity[];
}

export function DashboardTemperatureChart({ cities }: DashboardTemperatureChartProps) {
  const data = cities.map((item) => ({
    city: item.city?.name ?? "都市不明",
    最高気温: item.today?.maximumTemperatureC,
    最低気温: item.today?.minimumTemperatureC,
  }));

  return (
    <ChartCard
      title="6都市の最高・最低気温"
      description="今日の予想気温を都市別に比較します"
    >
      {data.length === 0 ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }} accessibilityLayer>
            <CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="city" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="°" width={48} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#64748b" }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line type="monotone" dataKey="最高気温" stroke="#fb923c" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} unit="℃" isAnimationActive={false} />
            <Line type="monotone" dataKey="最低気温" stroke="#67e8f9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} unit="℃" isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
