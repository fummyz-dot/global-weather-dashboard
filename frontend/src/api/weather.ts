import type { CityDetailResponse, DashboardResponse } from "../types/weather";
import { getJson } from "./client";
import { cityDetailResponseSchema, dashboardResponseSchema } from "./schemas";

export function fetchDashboard(signal?: AbortSignal): Promise<DashboardResponse> {
  return getJson("/api/dashboard", dashboardResponseSchema, signal);
}

export function fetchCityWeather(
  slug: string,
  signal?: AbortSignal,
): Promise<CityDetailResponse> {
  return getJson(
    `/api/cities/${encodeURIComponent(slug)}`,
    cityDetailResponseSchema,
    signal,
  );
}
