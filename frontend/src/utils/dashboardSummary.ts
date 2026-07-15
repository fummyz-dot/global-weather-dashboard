import type { DashboardCity } from "../types/weather";

export interface SummaryItem {
  cityName: string;
  slug: string;
  value: number;
}

export interface DashboardHighlights {
  hottest?: SummaryItem;
  coolest?: SummaryItem;
  highestApparent?: SummaryItem;
  highestPrecipitation?: SummaryItem;
}

function selectCity(
  cities: DashboardCity[],
  valueOf: (city: DashboardCity) => number | undefined,
  direction: "max" | "min",
): SummaryItem | undefined {
  const candidates = cities
    .map((item) => ({ item, value: valueOf(item) }))
    .filter(
      (candidate): candidate is { item: DashboardCity; value: number } =>
        Number.isFinite(candidate.value),
    );
  if (candidates.length === 0) return undefined;
  const selected = candidates.reduce((best, candidate) => {
    if (direction === "max") return candidate.value > best.value ? candidate : best;
    return candidate.value < best.value ? candidate : best;
  });
  return {
    cityName: selected.item.city?.name ?? "都市不明",
    slug: selected.item.city?.slug ?? "",
    value: selected.value,
  };
}

export function buildDashboardHighlights(
  cities: DashboardCity[] = [],
): DashboardHighlights {
  return {
    hottest: selectCity(cities, (city) => city.today?.maximumTemperatureC, "max"),
    coolest: selectCity(cities, (city) => city.today?.minimumTemperatureC, "min"),
    highestApparent: selectCity(
      cities,
      (city) => city.current?.apparentTemperatureC,
      "max",
    ),
    highestPrecipitation: selectCity(
      cities,
      (city) => city.today?.maximumPrecipitationProbabilityPercent,
      "max",
    ),
  };
}
