import { describe, expect, it } from "vitest";

import type { DashboardCity } from "../types/weather";
import { buildDashboardHighlights } from "./dashboardSummary";

function city(
  slug: string,
  name: string,
  maximum: number,
  minimum: number,
  apparent: number,
  precipitation: number,
): DashboardCity {
  return {
    city: {
      slug,
      name,
      country: "日本",
      region: "japan",
      latitude: 0,
      longitude: 0,
      timezone: "Asia/Tokyo",
    },
    current: {
      observedAtLocal: "2026-07-15T12:00",
      temperatureC: maximum - 1,
      apparentTemperatureC: apparent,
      relativeHumidityPercent: 50,
      weatherCode: 0,
      windSpeedKmh: 5,
    },
    today: {
      date: "2026-07-15",
      weatherCode: 0,
      maximumTemperatureC: maximum,
      minimumTemperatureC: minimum,
      maximumApparentTemperatureC: apparent,
      maximumPrecipitationProbabilityPercent: precipitation,
      sunriseLocal: "2026-07-15T04:30",
      sunsetLocal: "2026-07-15T19:00",
      heatLevel: "normal",
    },
  };
}

describe("buildDashboardHighlights", () => {
  it("4種類の比較対象を選ぶ", () => {
    const result = buildDashboardHighlights([
      city("tokyo", "東京", 33, 25, 36, 20),
      city("sapporo", "札幌", 27, 18, 28, 60),
      city("rome", "ローマ", 38, 26, 42, 10),
    ]);

    expect(result.hottest?.slug).toBe("rome");
    expect(result.coolest?.slug).toBe("sapporo");
    expect(result.highestApparent?.slug).toBe("rome");
    expect(result.highestPrecipitation?.slug).toBe("sapporo");
  });

  it("空配列を安全に処理する", () => {
    expect(buildDashboardHighlights([])).toEqual({
      hottest: undefined,
      coolest: undefined,
      highestApparent: undefined,
      highestPrecipitation: undefined,
    });
  });
});
