"""Pydantic models for upstream data and public API responses."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, model_validator


Percent = Annotated[float, Field(ge=0, le=100)]
NonNegativeFloat = Annotated[float, Field(ge=0)]
WeatherCode = Annotated[int, Field(ge=0)]


def to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(word.capitalize() for word in rest)


class ApiModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class HeatLevelCode(str, Enum):
    NORMAL = "normal"
    HOT = "hot"
    VERY_HOT = "veryHot"
    EXTREME = "extreme"


class City(ApiModel):
    slug: str
    name: str
    country: str
    region: Literal["japan", "europe"]
    latitude: float
    longitude: float
    timezone: str


class CurrentWeather(ApiModel):
    observed_at_local: str
    temperature_c: float
    apparent_temperature_c: float
    relative_humidity_percent: Percent
    weather_code: WeatherCode
    wind_speed_kmh: NonNegativeFloat


class HourlyForecast(ApiModel):
    time_local: str
    temperature_c: float
    apparent_temperature_c: float
    precipitation_probability_percent: Percent
    weather_code: WeatherCode
    relative_humidity_percent: Percent


class DailyForecast(ApiModel):
    date: str
    weather_code: WeatherCode
    maximum_temperature_c: float
    minimum_temperature_c: float
    maximum_apparent_temperature_c: float
    maximum_precipitation_probability_percent: Percent
    sunrise_local: str
    sunset_local: str
    heat_level: HeatLevelCode


class HeatLevelNotice(ApiModel):
    metric: Literal["dailyMaximumTemperature"] = "dailyMaximumTemperature"
    is_official_alert: Literal[False] = False
    disclaimer: str
    thresholds_c: dict[HeatLevelCode, str]


class DataSource(ApiModel):
    name: Literal["Open-Meteo"] = "Open-Meteo"
    url: HttpUrl = HttpUrl("https://open-meteo.com/")


class DashboardCity(ApiModel):
    city: City
    current: CurrentWeather
    today: DailyForecast


class CityMetric(ApiModel):
    slug: str
    city_name: str
    value_c: float


class DashboardSummary(ApiModel):
    hottest_city: CityMetric
    coolest_city: CityMetric


class DashboardResponse(ApiModel):
    generated_at: datetime
    cities: list[DashboardCity]
    summary: DashboardSummary
    heat_level_notice: HeatLevelNotice
    source: DataSource


class CityDetailResponse(ApiModel):
    generated_at: datetime
    city: City
    current: CurrentWeather
    hourly: list[HourlyForecast] = Field(min_length=24, max_length=24)
    daily: list[DailyForecast] = Field(min_length=7, max_length=7)
    heat_level_notice: HeatLevelNotice
    source: DataSource


class HealthResponse(ApiModel):
    status: Literal["ok"] = "ok"


class ErrorBody(ApiModel):
    code: str
    message: str


class ErrorResponse(ApiModel):
    error: ErrorBody


class OpenMeteoCurrent(BaseModel):
    time: str
    temperature_2m: float
    apparent_temperature: float
    relative_humidity_2m: Percent
    weather_code: WeatherCode
    wind_speed_10m: NonNegativeFloat


class OpenMeteoHourly(BaseModel):
    time: list[str]
    temperature_2m: list[float]
    apparent_temperature: list[float]
    precipitation_probability: list[Percent]
    weather_code: list[WeatherCode]
    relative_humidity_2m: list[Percent]

    @model_validator(mode="after")
    def validate_lengths(self) -> "OpenMeteoHourly":
        lengths = {
            len(self.time),
            len(self.temperature_2m),
            len(self.apparent_temperature),
            len(self.precipitation_probability),
            len(self.weather_code),
            len(self.relative_humidity_2m),
        }
        if len(lengths) != 1 or len(self.time) < 24:
            raise ValueError("Hourly arrays must have equal lengths and at least 24 values")
        return self


class OpenMeteoDaily(BaseModel):
    time: list[str]
    weather_code: list[WeatherCode]
    temperature_2m_max: list[float]
    temperature_2m_min: list[float]
    apparent_temperature_max: list[float]
    precipitation_probability_max: list[Percent]
    sunrise: list[str]
    sunset: list[str]

    @model_validator(mode="after")
    def validate_lengths(self) -> "OpenMeteoDaily":
        lengths = {
            len(self.time),
            len(self.weather_code),
            len(self.temperature_2m_max),
            len(self.temperature_2m_min),
            len(self.apparent_temperature_max),
            len(self.precipitation_probability_max),
            len(self.sunrise),
            len(self.sunset),
        }
        if len(lengths) != 1 or not self.time:
            raise ValueError("Daily arrays must have equal, non-zero lengths")
        return self


class OpenMeteoForecast(BaseModel):
    latitude: float
    longitude: float
    timezone: str
    current: OpenMeteoCurrent
    daily: OpenMeteoDaily
    hourly: OpenMeteoHourly | None = None
