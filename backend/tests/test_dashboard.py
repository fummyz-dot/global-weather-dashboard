from __future__ import annotations

from collections.abc import Callable
from typing import Any

import httpx
import pytest


@pytest.mark.anyio
async def test_dashboard_fetches_all_cities_in_one_request(
    api_client: httpx.AsyncClient,
    install_mock_transport: Callable[
        [Callable[[httpx.Request], httpx.Response]], None
    ],
    dashboard_payload: list[dict[str, Any]],
) -> None:
    requests: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        return httpx.Response(200, json=dashboard_payload)

    install_mock_transport(handler)
    response = await api_client.get("/api/dashboard")

    assert response.status_code == 200
    assert len(requests) == 1
    assert requests[0].url.params["latitude"].count(",") == 5
    assert requests[0].url.params["longitude"].count(",") == 5
    assert requests[0].url.params["timezone"].count(",") == 5
    assert requests[0].url.params["forecast_days"] == "1"

    body = response.json()
    assert [item["city"]["slug"] for item in body["cities"]] == [
        "tokyo",
        "osaka",
        "sapporo",
        "barcelona",
        "paris",
        "rome",
    ]
    assert body["cities"][0]["current"]["temperatureC"] == 30.5
    assert body["cities"][1]["today"]["heatLevel"] == "veryHot"
    assert body["cities"][5]["today"]["heatLevel"] == "extreme"
    assert body["summary"]["hottestCity"]["slug"] == "rome"
    assert body["summary"]["coolestCity"]["slug"] == "sapporo"
    assert body["heatLevelNotice"]["isOfficialAlert"] is False
    assert "公的" in body["heatLevelNotice"]["disclaimer"]
    assert body["source"]["name"] == "Open-Meteo"


@pytest.mark.anyio
async def test_dashboard_rejects_invalid_provider_payload(
    api_client: httpx.AsyncClient,
    install_mock_transport: Callable[
        [Callable[[httpx.Request], httpx.Response]], None
    ],
) -> None:
    install_mock_transport(
        lambda request: httpx.Response(200, json=[{"unexpected": "payload"}])
    )

    response = await api_client.get("/api/dashboard")

    assert response.status_code == 502
    assert response.json()["error"]["code"] == "WEATHER_PROVIDER_ERROR"
