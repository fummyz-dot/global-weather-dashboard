import { CloudRain, Snowflake, Sun, ThermometerSun, type LucideIcon } from "lucide-react";

import type { DashboardHighlights, SummaryItem } from "../../utils/dashboardSummary";
import { formatPercent, formatTemperatureWithUnit } from "../../utils/formatters";

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  item?: SummaryItem;
  formatter: (value?: number) => string;
  accent: string;
}

function SummaryCard({ icon: Icon, label, item, formatter, accent }: SummaryCardProps) {
  return (
    <article className="glass-card rounded-2xl p-5">
      <div className={`inline-flex rounded-xl p-2.5 ${accent}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="mt-4 text-xs font-semibold tracking-wide text-slate-400">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <p className="truncate text-xl font-bold text-white">{item?.cityName ?? "データなし"}</p>
        <p className="shrink-0 text-sm font-semibold text-cyan-100">{formatter(item?.value)}</p>
      </div>
    </article>
  );
}

export function SummaryCards({ highlights }: { highlights: DashboardHighlights }) {
  return (
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="sr-only">6都市のサマリー</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={Sun} label="最も暑い都市（最高気温）" item={highlights.hottest} formatter={formatTemperatureWithUnit} accent="bg-orange-400/15 text-orange-200" />
        <SummaryCard icon={Snowflake} label="最も涼しい都市（最低気温）" item={highlights.coolest} formatter={formatTemperatureWithUnit} accent="bg-cyan-300/15 text-cyan-200" />
        <SummaryCard icon={ThermometerSun} label="体感温度が最も高い都市" item={highlights.highestApparent} formatter={formatTemperatureWithUnit} accent="bg-amber-300/15 text-amber-200" />
        <SummaryCard icon={CloudRain} label="降水確率が最も高い都市（当日最大）" item={highlights.highestPrecipitation} formatter={formatPercent} accent="bg-sky-300/15 text-sky-200" />
      </div>
    </section>
  );
}
