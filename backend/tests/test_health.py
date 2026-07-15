import httpx
import pytest


@pytest.mark.anyio
async def test_health_returns_ok_without_weather_request(
    api_client: httpx.AsyncClient,
) -> None:
    response = await api_client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.anyio
async def test_health_allows_configured_cors_origin(
    api_client: httpx.AsyncClient,
) -> None:
    response = await api_client.get(
        "/api/health",
        headers={"Origin": "http://localhost:5173"},
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert "access-control-allow-credentials" not in response.headers


@pytest.mark.anyio
async def test_cors_preflight_allows_get(api_client: httpx.AsyncClient) -> None:
    response = await api_client.options(
        "/api/dashboard",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert "GET" in response.headers["access-control-allow-methods"]
