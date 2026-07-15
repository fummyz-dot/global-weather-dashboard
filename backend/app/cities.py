"""Fixed city metadata used by the weather APIs."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


Region = Literal["japan", "europe"]


@dataclass(frozen=True, slots=True)
class CityConfig:
    slug: str
    name: str
    country: str
    region: Region
    latitude: float
    longitude: float
    timezone: str


CITIES: tuple[CityConfig, ...] = (
    CityConfig("tokyo", "東京", "日本", "japan", 35.6762, 139.6503, "Asia/Tokyo"),
    CityConfig("osaka", "大阪", "日本", "japan", 34.6937, 135.5023, "Asia/Tokyo"),
    CityConfig("sapporo", "札幌", "日本", "japan", 43.0618, 141.3545, "Asia/Tokyo"),
    CityConfig(
        "barcelona",
        "バルセロナ",
        "スペイン",
        "europe",
        41.3874,
        2.1686,
        "Europe/Madrid",
    ),
    CityConfig("paris", "パリ", "フランス", "europe", 48.8566, 2.3522, "Europe/Paris"),
    CityConfig("rome", "ローマ", "イタリア", "europe", 41.9028, 12.4964, "Europe/Rome"),
)


def find_city(slug: str) -> CityConfig | None:
    """Find a configured city without maintaining mutable lookup state."""

    return next((city for city in CITIES if city.slug == slug), None)
