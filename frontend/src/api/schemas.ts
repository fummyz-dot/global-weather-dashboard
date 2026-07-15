import { z } from "zod";

import type {
  CityDetailResponse,
  DashboardResponse,
} from "../types/weather";

const percentageSchema = z.number().finite().min(0).max(100);
const weatherCodeSchema = z.number().int().nonnegative();
const heatLevelSchema = z.enum(["normal", "hot", "veryHot", "extreme"]);

const citySchema = z.object({
  slug: z.string(),
  name: z.string(),
  country: z.string(),
  region: z.enum(["japan", "europe"]),
  latitude: z.number().finite(),
  longitude: z.number().finite(),
  timezone: z.string(),
});

const currentWeatherSchema = z.object({
  observedAtLocal: z.string(),
  temperatureC: z.number().finite(),
  apparentTemperatureC: z.number().finite(),
  relativeHumidityPercent: percentageSchema,
  weatherCode: weatherCodeSchema,
  windSpeedKmh: z.number().finite().nonnegative(),
});

const hourlyForecastSchema = z.object({
  timeLocal: z.string(),
  temperatureC: z.number().finite(),
  apparentTemperatureC: z.number().finite(),
  precipitationProbabilityPercent: percentageSchema,
  weatherCode: weatherCodeSchema,
  relativeHumidityPercent: percentageSchema,
});

const dailyForecastSchema = z.object({
  date: z.string(),
  weatherCode: weatherCodeSchema,
  maximumTemperatureC: z.number().finite(),
  minimumTemperatureC: z.number().finite(),
  maximumApparentTemperatureC: z.number().finite(),
  maximumPrecipitationProbabilityPercent: percentageSchema,
  sunriseLocal: z.string(),
  sunsetLocal: z.string(),
  heatLevel: heatLevelSchema,
});

const heatLevelNoticeSchema = z.object({
  metric: z.literal("dailyMaximumTemperature"),
  isOfficialAlert: z.literal(false),
  disclaimer: z.string(),
  thresholdsC: z.record(heatLevelSchema, z.string()),
});

const dataSourceSchema = z.object({
  name: z.literal("Open-Meteo"),
  url: z.string(),
});

const cityMetricSchema = z.object({
  slug: z.string(),
  cityName: z.string(),
  valueC: z.number().finite(),
});

export const dashboardResponseSchema: z.ZodType<DashboardResponse> = z.object({
  generatedAt: z.string(),
  cities: z.array(
    z.object({
      city: citySchema,
      current: currentWeatherSchema,
      today: dailyForecastSchema,
    }),
  ),
  summary: z.object({
    hottestCity: cityMetricSchema,
    coolestCity: cityMetricSchema,
  }),
  heatLevelNotice: heatLevelNoticeSchema,
  source: dataSourceSchema,
});

export const cityDetailResponseSchema: z.ZodType<CityDetailResponse> = z.object({
  generatedAt: z.string(),
  city: citySchema,
  current: currentWeatherSchema,
  hourly: z.array(hourlyForecastSchema),
  daily: z.array(dailyForecastSchema),
  heatLevelNotice: heatLevelNoticeSchema,
  source: dataSourceSchema,
});
