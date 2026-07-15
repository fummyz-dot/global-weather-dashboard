from __future__ import annotations

from collections.abc import AsyncGenerator, Callable, Generator
from typing import Any

import httpx
import pytest
from app.main import app, get_open_meteo_client
from app.open_meteo import OpenMeteoClient


def make_forecast(
    *,
    latitude: float = 35.6762,
    longitude: float = 139.6503,
    timezone: str = "Asia/Tokyo",
    days: int = 7,
    hourly: bool = True,
    maximum_temperature: float = 32.0,
    minimum_temperature: float = 22.0,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "latitude": latitude,
        "longitude": longitude,
        "timezone": timezone,
        "current": {
            "time": "2026-07-15T12:00",
            "temperature_2m": 30.5,
            "apparent_temperature": 33.2,
            "relative_humidity_2m": 62,
            "weather_code": 1,
            "wind_speed_10m": 12.4,
        },
        "daily": {
            "time": [f"2026-07-{15 + index:02d}" for index in range(days)],
            "weather_code": [index % 4 for index in range(days)],
            "temperature_2m_max": [maximum_temperature + index for index in range(days)],
            "temperature_2m_min": [minimum_temperature + index for index in range(days)],
            "apparent_temperature_max": [maximum_temperature + 2 + index for index in range(days)],
            "precipitation_probability_max": [20 + index for index in range(days)],
            "sunrise": [f"2026-07-{15 + index:02d}T04:35" for index in range(days)],
            "sunset": [f"2026-07-{15 + index:02d}T18:55" for index in range(days)],
        },
    }
    if hourly:
        payload["hourly"] = {
            "time": [f"2026-07-15T{hour:02d}:00" for hour in range(24)],
            "temperature_2m": [24.0 + hour * 0.2 for hour in range(24)],
            "apparent_temperature": [25.0 + hour * 0.2 for hour in range(24)],
            "precipitation_probability": [hour % 100 for hour in range(24)],
            "weather_code": [hour % 4 for hour in range(24)],
            "relative_humidity_2m": [70 - hour for hour in range(24)],
        }
    return payload


@pytest.fixture
def dashboard_payload() -> list[dict[str, Any]]:
    locations = (
        (35.6762, 139.6503, "Asia/Tokyo", 34.0, 24.0),
        (34.6937, 135.5023, "Asia/Tokyo", 35.0, 25.0),
        (43.0618, 141.3545, "Asia/Tokyo", 27.0, 18.0),
        (41.3874, 2.1686, "Europe/Madrid", 36.0, 26.0),
        (48.8566, 2.3522, "Europe/Paris", 31.0, 21.0),
        (41.9028, 12.4964, "Europe/Rome", 40.0, 28.0),
    )
    return [
        make_forecast(
            latitude=latitude,
            longitude=longitude,
            timezone=timezone,
            days=1,
            hourly=False,
            maximum_temperature=maximum,
            minimum_temperature=minimum,
        )
        for latitude, longitude, timezone, maximum, minimum in locations
    ]


@pytest.fixture
def city_payload() -> dict[str, Any]:
    return make_forecast()


@pytest.fixture
def install_mock_transport() -> Generator[
    Callable[[Callable[[httpx.Request], httpx.Response]], None], None, None
]:
    def install(handler: Callable[[httpx.Request], httpx.Response]) -> None:
        transport = httpx.MockTransport(handler)

        async def override_client() -> OpenMeteoClient:
            return OpenMeteoClient(transport=transport)

        app.dependency_overrides[get_open_meteo_client] = override_client

    yield install
    app.dependency_overrides.clear()


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture
async def api_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(
        transport=transport,
        base_url="http://testserver",
    ) as client:
        yield client
