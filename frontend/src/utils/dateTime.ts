const generatedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatGeneratedAt(value?: string): string {
  if (!value) return "取得日時不明";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "取得日時不明";
  return generatedAtFormatter.format(date);
}

export function formatLocalTime(timezone?: string, now = new Date()): string {
  if (!timezone) return "現地時刻不明";
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      timeZone: timezone,
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
  } catch {
    return "現地時刻不明";
  }
}

export function formatHour(value?: string): string {
  if (!value) return "--:--";
  const time = value.match(/T(\d{2}:\d{2})/)?.[1];
  return time ?? "--:--";
}

export function formatForecastDate(value?: string): string {
  if (!value) return "日付不明";
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return "日付不明";
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(date);
}
