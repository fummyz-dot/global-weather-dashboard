import { useQuery } from "@tanstack/react-query";

import { fetchCityWeather } from "../api/weather";

export function useCityWeather(slug?: string) {
  return useQuery({
    queryKey: ["city", slug],
    queryFn: ({ signal }) => fetchCityWeather(slug ?? "", signal),
    enabled: Boolean(slug),
  });
}
