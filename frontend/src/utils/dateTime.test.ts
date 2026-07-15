import { describe, expect, it } from "vitest";

import { formatGeneratedAt, formatHour, formatLocalTime } from "./dateTime";

describe("dateTime utilities", () => {
  it("Open-Meteoの現地時刻文字列から時刻を取り出す", () => {
    expect(formatHour("2026-07-15T04:35")).toBe("04:35");
    expect(formatHour(undefined)).toBe("--:--");
  });

  it("IANAタイムゾーンを使って現地時刻を表示する", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    expect(formatLocalTime("Asia/Tokyo", now)).toContain("09:00");
    expect(formatLocalTime("invalid/timezone", now)).toBe("現地時刻不明");
  });

  it("不正な更新日時を安全に処理する", () => {
    expect(formatGeneratedAt("not-a-date")).toBe("取得日時不明");
  });
});
