"""Small asynchronous client for the Open-Meteo forecast API."""

from __future__ import annotations

from collections.abc import Sequence
from typing import Any

import httpx
from pydantic import ValidationError

from app.cities import CityConfig
from app.schemas import OpenMeteoForecast


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
CURRENT_FIELDS = (
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "weather_code",
    "wind_speed_10m",
)
HOURLY_FIELDS = (
    "temperature_2m",
    "apparent_temperature",
    "precipitation_probability",
    "weather_code",
    "relative_humidity_2m",
)
DAILY_FIELDS = (
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "precipitation_probability_max",
    "sunrise",
    "sunset",
)


class WeatherProviderError(Exception):
    """Base error for failures communicating with the weather provider."""


class WeatherProviderTimeout(WeatherProviderError):
    """The weather provider did not respond within the configured timeout."""


class WeatherProviderInvalidResponse(WeatherProviderError):
    """The weather provider returned data that does not match the contract."""


class OpenMeteoClient:
    def __init__(
        self,
        *,
        timeout: httpx.Timeout | None = None,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        self._timeout = timeout or httpx.Timeout(8.0, connect=3.0)
        self._transport = transport

    async def fetch_dashboard(
        self, cities: Sequence[CityConfig]
    ) -> list[OpenMeteoForecast]:
        params = {
            "latitude": ",".join(str(city.latitude) for city in cities),
            "longitude": ",".join(str(city.longitude) for city in cities),
            "timezone": ",".join(city.timezone for city in cities),
            "current": ",".join(CURRENT_FIELDS),
            "daily": ",".join(DAILY_FIELDS),
            "forecast_days": "1",
            "temperature_unit": "celsius",
            "wind_speed_unit": "kmh",
        }
        payload = await self._request(params)
        if not isinstance(payload, list) or len(payload) != len(cities):
            raise WeatherProviderInvalidResponse(
                "Open-Meteo did not return one result per requested city"
            )
        return self._validate_many(payload)

    async def fetch_city(self, city: CityConfig) -> OpenMeteoForecast:
        params = {
            "latitude": str(city.latitude),
            "longitude": str(city.longitude),
            "timezone": city.timezone,
            "current": ",".join(CURRENT_FIELDS),
            "hourly": ",".join(HOURLY_FIELDS),
            "daily": ",".join(DAILY_FIELDS),
            "forecast_hours": "24",
            "forecast_days": "7",
            "temperature_unit": "celsius",
            "wind_speed_unit": "kmh",
        }
        payload = await self._request(params)
        if not isinstance(payload, dict):
            raise WeatherProviderInvalidResponse(
                "Open-Meteo returned an unexpected city response"
            )
        try:
            forecast = OpenMeteoForecast.model_validate(payload)
        except ValidationError as exc:
            raise WeatherProviderInvalidResponse(
                "Open-Meteo city response failed validation"
            ) from exc
        if forecast.hourly is None:
            raise WeatherProviderInvalidResponse("Hourly data is missing")
        if len(forecast.daily.time) < 7:
            raise WeatherProviderInvalidResponse("Seven days of daily data are required")
        return forecast

    async def _request(self, params: dict[str, str]) -> Any:
        try:
            async with httpx.AsyncClient(
                timeout=self._timeout,
                transport=self._transport,
            ) as client:
                response = await client.get(OPEN_METEO_URL, params=params)
                response.raise_for_status()
                return response.json()
        except httpx.TimeoutException as exc:
            raise WeatherProviderTimeout("Open-Meteo request timed out") from exc
        except (httpx.HTTPError, ValueError) as exc:
            raise WeatherProviderError("Open-Meteo request failed") from exc

    @staticmethod
    def _validate_many(payload: list[Any]) -> list[OpenMeteoForecast]:
        try:
            return [OpenMeteoForecast.model_validate(item) for item in payload]
        except ValidationError as exc:
            raise WeatherProviderInvalidResponse(
                "Open-Meteo dashboard response failed validation"
            ) from exc
