import {
  CircleHelp,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { getWeatherInfo, type WeatherIconName } from "../../utils/weatherCode";

const ICONS: Record<WeatherIconName, LucideIcon> = {
  sun: Sun,
  cloudSun: CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: Snowflake,
  storm: CloudLightning,
  unknown: CircleHelp,
};

interface WeatherIconProps {
  code?: number;
  className?: string;
  decorative?: boolean;
}

export function WeatherIcon({
  code,
  className = "h-10 w-10",
  decorative = false,
}: WeatherIconProps) {
  const weather = getWeatherInfo(code);
  const Icon = ICONS[weather.icon];
  return (
    <Icon
      className={className}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : weather.description}
      strokeWidth={1.7}
    />
  );
}
