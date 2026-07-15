export type Region = "japan" | "europe";
export type HeatLevelCode = "normal" | "hot" | "veryHot" | "extreme";

export interface City {
  slug: string;
  name: string;
  country: string;
  region: Region;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  observedAtLocal: string;
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidityPercent: number;
  weatherCode: number;
  windSpeedKmh: number;
}

export interface HourlyForecast {
  timeLocal: string;
  temperatureC: number;
  apparentTemperatureC: number;
  precipitationProbabilityPercent: number;
  weatherCode: number;
  relativeHumidityPercent: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  maximumTemperatureC: number;
  minimumTemperatureC: number;
  maximumApparentTemperatureC: number;
  maximumPrecipitationProbabilityPercent: number;
  sunriseLocal: string;
  sunsetLocal: string;
  heatLevel: HeatLevelCode;
}

export interface HeatLevelNotice {
  metric: "dailyMaximumTemperature";
  isOfficialAlert: false;
  disclaimer: string;
  thresholdsC: Record<HeatLevelCode, string>;
}

export interface DataSource {
  name: "Open-Meteo";
  url: string;
}

export interface DashboardCity {
  city: City;
  current: CurrentWeather;
  today: DailyForecast;
}

export interface CityMetric {
  slug: string;
  cityName: string;
  valueC: number;
}

export interface DashboardResponse {
  generatedAt: string;
  cities: DashboardCity[];
  summary: {
    hottestCity: CityMetric;
    coolestCity: CityMetric;
  };
  heatLevelNotice: HeatLevelNotice;
  source: DataSource;
}

export interface CityDetailResponse {
  generatedAt: string;
  city: City;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  heatLevelNotice: HeatLevelNotice;
  source: DataSource;
}

export interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
  };
}
