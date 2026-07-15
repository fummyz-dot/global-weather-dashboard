import { describe, expect, it } from "vitest";

import { getWeatherInfo } from "./weatherCode";

describe("getWeatherInfo", () => {
  it.each([
    [0, "快晴", "sun"],
    [3, "くもり", "cloud"],
    [63, "雨", "rain"],
    [75, "雪", "snow"],
    [95, "雷雨", "storm"],
  ])("WMO code %iを日本語へ変換する", (code, description, icon) => {
    expect(getWeatherInfo(code)).toEqual({ description, icon });
  });

  it("不明なコードへ安全なフォールバックを返す", () => {
    expect(getWeatherInfo(999)).toEqual({
      description: "天気情報なし",
      icon: "unknown",
    });
  });
});
