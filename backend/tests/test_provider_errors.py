from __future__ import annotations

from collections.abc import Callable

import httpx
import pytest


@pytest.mark.anyio
async def test_provider_http_error_is_returned_as_502(
    api_client: httpx.AsyncClient,
    install_mock_transport: Callable[
        [Callable[[httpx.Request], httpx.Response]], None
    ],
) -> None:
    install_mock_transport(lambda request: httpx.Response(503, json={"error": True}))

    response = await api_client.get("/api/cities/paris")

    assert response.status_code == 502
    assert response.json() == {
        "error": {
            "code": "WEATHER_PROVIDER_ERROR",
            "message": "気象データを取得できませんでした。",
        }
    }


@pytest.mark.anyio
async def test_provider_timeout_is_returned_as_504(
    api_client: httpx.AsyncClient,
    install_mock_transport: Callable[
        [Callable[[httpx.Request], httpx.Response]], None
    ],
) -> None:
    def timeout(request: httpx.Request) -> httpx.Response:
        raise httpx.ReadTimeout("test timeout", request=request)

    install_mock_transport(timeout)
    response = await api_client.get("/api/dashboard")

    assert response.status_code == 504
    assert response.json()["error"]["code"] == "WEATHER_PROVIDER_TIMEOUT"
