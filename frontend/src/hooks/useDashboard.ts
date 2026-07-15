import { useQuery } from "@tanstack/react-query";

import { fetchDashboard } from "../api/weather";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: ({ signal }) => fetchDashboard(signal),
  });
}
