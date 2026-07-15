from __future__ import annotations

from collections.abc import Callable
from typing import Any

import httpx
import pytest


@pytest.mark.anyio
async def test_city_returns_current_hourly_and_daily_forecast(
    api_client: httpx.AsyncClient,
    install_mock_transport: Callable[
        [Callable[[httpx.Request], httpx.Response]], None
    ],
    city_payload: dict[str, Any],
) -> None:
    requests: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        return httpx.Response(200, json=city_payload)

    install_mock_transport(handler)
    response = await api_client.get("/api/cities/tokyo")

    assert response.status_code == 200
    assert len(requests) == 1
    params = requests[0].url.params
    assert params["latitude"] == "35.6762"
    assert params["longitude"] == "139.6503"
    assert params["timezone"] == "Asia/Tokyo"
    assert params["forecast_hours"] == "24"
    assert params["forecast_days"] == "7"
    assert "relative_humidity_2m" in params["hourly"]
    assert "sunrise" in params["daily"]

    body = response.json()
    assert body["city"]["slug"] == "tokyo"
    assert body["city"]["name"] == "東京"
    assert len(body["hourly"]) == 24
    assert len(body["daily"]) == 7
    assert body["hourly"][0] == {
        "timeLocal": "2026-07-15T00:00",
        "temperatureC": 24.0,
        "apparentTemperatureC": 25.0,
        "precipitationProbabilityPercent": 0.0,
        "weatherCode": 0,
        "relativeHumidityPercent": 70.0,
    }
    assert body["daily"][0]["sunriseLocal"] == "2026-07-15T04:35"
    assert body["daily"][0]["sunsetLocal"] == "2026-07-15T18:55"


@pytest.mark.anyio
async def test_unknown_city_returns_404_without_provider_request(
    api_client: httpx.AsyncClient,
    install_mock_transport: Callable[
        [Callable[[httpx.Request], httpx.Response]], None
    ],
) -> None:
    def unexpected_request(request: httpx.Request) -> httpx.Response:
        raise AssertionError("The provider must not be called for an unknown city")

    install_mock_transport(unexpected_request)
    response = await api_client.get("/api/cities/unknown")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "CITY_NOT_FOUND",
            "message": "指定された都市は見つかりません。",
        }
    }


@pytest.mark.anyio
async def test_city_rejects_incomplete_daily_forecast(
    api_client: httpx.AsyncClient,
    install_mock_transport: Callable[
        [Callable[[httpx.Request], httpx.Response]], None
    ],
    city_payload: dict[str, Any],
) -> None:
    for key, values in city_payload["daily"].items():
        city_payload["daily"][key] = values[:1]
    install_mock_transport(lambda request: httpx.Response(200, json=city_payload))

    response = await api_client.get("/api/cities/tokyo")

    assert response.status_code == 502
    assert response.json()["error"]["code"] == "WEATHER_PROVIDER_ERROR"
