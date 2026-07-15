export function formatTemperature(value?: number | null): string {
  return Number.isFinite(value) ? `${Math.round(value as number)}°` : "--°";
}

export function formatTemperatureWithUnit(value?: number | null): string {
  return Number.isFinite(value) ? `${(value as number).toFixed(1)}℃` : "--℃";
}

export function formatPercent(value?: number | null): string {
  return Number.isFinite(value) ? `${Math.round(value as number)}%` : "--%";
}

export function formatWindSpeed(value?: number | null): string {
  return Number.isFinite(value) ? `${(value as number).toFixed(1)} km/h` : "-- km/h";
}
