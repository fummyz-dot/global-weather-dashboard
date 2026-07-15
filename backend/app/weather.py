"""Conversion from Open-Meteo models to the public API contract."""

from __future__ import annotations

from datetime import UTC, datetime

from app.cities import CityConfig
from app.heat import calculate_heat_level, heat_level_notice
from app.schemas import (
    City,
    CityDetailResponse,
    CityMetric,
    CurrentWeather,
    DailyForecast,
    DashboardCity,
    DashboardResponse,
    DashboardSummary,
    DataSource,
    HourlyForecast,
    OpenMeteoForecast,
)


def city_schema(city: CityConfig) -> City:
    return City(
        slug=city.slug,
        name=city.name,
        country=city.country,
        region=city.region,
        latitude=city.latitude,
        longitude=city.longitude,
        timezone=city.timezone,
    )


def current_weather(forecast: OpenMeteoForecast) -> CurrentWeather:
    current = forecast.current
    return CurrentWeather(
        observed_at_local=current.time,
        temperature_c=current.temperature_2m,
        apparent_temperature_c=current.apparent_temperature,
        relative_humidity_percent=current.relative_humidity_2m,
        weather_code=current.weather_code,
        wind_speed_kmh=current.wind_speed_10m,
    )


def daily_forecasts(
    forecast: OpenMeteoForecast, *, limit: int
) -> list[DailyForecast]:
    daily = forecast.daily
    rows = zip(
        daily.time,
        daily.weather_code,
        daily.temperature_2m_max,
        daily.temperature_2m_min,
        daily.apparent_temperature_max,
        daily.precipitation_probability_max,
        daily.sunrise,
        daily.sunset,
        strict=True,
    )
    return [
        DailyForecast(
            date=date,
            weather_code=weather_code,
            maximum_temperature_c=maximum_temperature,
            minimum_temperature_c=minimum_temperature,
            maximum_apparent_temperature_c=maximum_apparent_temperature,
            maximum_precipitation_probability_percent=precipitation_probability,
            sunrise_local=sunrise,
            sunset_local=sunset,
            heat_level=calculate_heat_level(maximum_temperature),
        )
        for (
            date,
            weather_code,
            maximum_temperature,
            minimum_temperature,
            maximum_apparent_temperature,
            precipitation_probability,
            sunrise,
            sunset,
        ) in list(rows)[:limit]
    ]


def hourly_forecasts(forecast: OpenMeteoForecast) -> list[HourlyForecast]:
    if forecast.hourly is None:
        raise ValueError("Hourly data is required for a city detail response")
    hourly = forecast.hourly
    rows = zip(
        hourly.time,
        hourly.temperature_2m,
        hourly.apparent_temperature,
        hourly.precipitation_probability,
        hourly.weather_code,
        hourly.relative_humidity_2m,
        strict=True,
    )
    return [
        HourlyForecast(
            time_local=time,
            temperature_c=temperature,
            apparent_temperature_c=apparent_temperature,
            precipitation_probability_percent=precipitation_probability,
            weather_code=weather_code,
            relative_humidity_percent=relative_humidity,
        )
        for (
            time,
            temperature,
            apparent_temperature,
            precipitation_probability,
            weather_code,
            relative_humidity,
        ) in list(rows)[:24]
    ]


def build_dashboard_response(
    cities: tuple[CityConfig, ...], forecasts: list[OpenMeteoForecast]
) -> DashboardResponse:
    dashboard_cities = [
        DashboardCity(
            city=city_schema(city),
            current=current_weather(forecast),
            today=daily_forecasts(forecast, limit=1)[0],
        )
        for city, forecast in zip(cities, forecasts, strict=True)
    ]
    hottest = max(
        dashboard_cities, key=lambda item: item.today.maximum_temperature_c
    )
    coolest = min(
        dashboard_cities, key=lambda item: item.today.minimum_temperature_c
    )
    return DashboardResponse(
        generated_at=datetime.now(UTC),
        cities=dashboard_cities,
        summary=DashboardSummary(
            hottest_city=CityMetric(
                slug=hottest.city.slug,
                city_name=hottest.city.name,
                value_c=hottest.today.maximum_temperature_c,
            ),
            coolest_city=CityMetric(
                slug=coolest.city.slug,
                city_name=coolest.city.name,
                value_c=coolest.today.minimum_temperature_c,
            ),
        ),
        heat_level_notice=heat_level_notice(),
        source=DataSource(),
    )


def build_city_response(
    city: CityConfig, forecast: OpenMeteoForecast
) -> CityDetailResponse:
    return CityDetailResponse(
        generated_at=datetime.now(UTC),
        city=city_schema(city),
        current=current_weather(forecast),
        hourly=hourly_forecasts(forecast),
        daily=daily_forecasts(forecast, limit=7),
        heat_level_notice=heat_level_notice(),
        source=DataSource(),
    )
