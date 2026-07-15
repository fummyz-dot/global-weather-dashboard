"""Application-specific heat level calculation."""

from __future__ import annotations

from app.schemas import HeatLevelCode, HeatLevelNotice


def calculate_heat_level(maximum_temperature_c: float) -> HeatLevelCode:
    if maximum_temperature_c >= 40:
        return HeatLevelCode.EXTREME
    if maximum_temperature_c >= 35:
        return HeatLevelCode.VERY_HOT
    if maximum_temperature_c >= 30:
        return HeatLevelCode.HOT
    return HeatLevelCode.NORMAL


def heat_level_notice() -> HeatLevelNotice:
    return HeatLevelNotice(
        disclaimer=(
            "高温レベルは当日の予想最高気温から算出する独自指標であり、"
            "公的な気象警報や熱中症警戒情報ではありません。"
        ),
        thresholds_c={
            HeatLevelCode.NORMAL: "< 30",
            HeatLevelCode.HOT: ">= 30 and < 35",
            HeatLevelCode.VERY_HOT: ">= 35 and < 40",
            HeatLevelCode.EXTREME: ">= 40",
        },
    )
