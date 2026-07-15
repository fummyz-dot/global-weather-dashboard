export type WeatherIconName =
  | "sun"
  | "cloudSun"
  | "cloud"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm"
  | "unknown";

export interface WeatherInfo {
  description: string;
  icon: WeatherIconName;
}

export function getWeatherInfo(code?: number): WeatherInfo {
  if (code === 0) return { description: "快晴", icon: "sun" };
  if (code === 1) return { description: "晴れ", icon: "cloudSun" };
  if (code === 2) return { description: "一部くもり", icon: "cloudSun" };
  if (code === 3) return { description: "くもり", icon: "cloud" };
  if (code === 45 || code === 48) return { description: "霧", icon: "fog" };
  if ([51, 53, 55, 56, 57].includes(code ?? -1)) {
    return { description: "霧雨", icon: "drizzle" };
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code ?? -1)) {
    return { description: "雨", icon: "rain" };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) {
    return { description: "雪", icon: "snow" };
  }
  if ([95, 96, 99].includes(code ?? -1)) {
    return { description: "雷雨", icon: "storm" };
  }
  return { description: "天気情報なし", icon: "unknown" };
}
