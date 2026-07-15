import { Flame } from "lucide-react";

import type { HeatLevelCode } from "../../types/weather";

const HEAT_LEVELS: Record<HeatLevelCode, { label: string; className: string }> = {
  normal: {
    label: "通常",
    className: "border-amber-200/25 bg-amber-300/10 text-amber-100",
  },
  hot: {
    label: "高温",
    className: "border-orange-300/30 bg-orange-400/15 text-orange-100",
  },
  veryHot: {
    label: "非常に高温",
    className: "border-orange-300/40 bg-orange-500/20 text-orange-100",
  },
  extreme: {
    label: "極端な高温",
    className: "border-red-300/45 bg-red-500/20 text-red-100",
  },
};

interface HeatLevelBadgeProps {
  level?: HeatLevelCode;
}

export function HeatLevelBadge({ level }: HeatLevelBadgeProps) {
  const config = level ? HEAT_LEVELS[level] : undefined;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        config?.className ?? "border-slate-400/30 bg-slate-400/10 text-slate-300"
      }`}
    >
      <Flame className="h-3.5 w-3.5" aria-hidden="true" />
      {config?.label ?? "判定不能"}
    </span>
  );
}
