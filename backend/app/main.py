"""FastAPI entrypoint for local development and Vercel."""

from __future__ import annotations

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.cities import CITIES, find_city
from app.config import get_allowed_origins
from app.open_meteo import (
    OpenMeteoClient,
    WeatherProviderError,
    WeatherProviderTimeout,
)
from app.schemas import (
    CityDetailResponse,
    DashboardResponse,
    ErrorBody,
    ErrorResponse,
    HealthResponse,
)
from app.weather import build_city_response, build_dashboard_response


async def get_open_meteo_client() -> OpenMeteoClient:
    return OpenMeteoClient()


app = FastAPI(
    title="Global Weather Dashboard API",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Accept", "Content-Type"],
)


def error_response(status_code: int, code: str, message: str) -> JSONResponse:
    body = ErrorResponse(error=ErrorBody(code=code, message=message))
    return JSONResponse(status_code=status_code, content=body.model_dump(by_alias=True))


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse()


@app.get(
    "/api/dashboard",
    response_model=DashboardResponse,
    responses={502: {"model": ErrorResponse}, 504: {"model": ErrorResponse}},
)
async def dashboard(
    client: OpenMeteoClient = Depends(get_open_meteo_client),
) -> DashboardResponse | JSONResponse:
    try:
        forecasts = await client.fetch_dashboard(CITIES)
        return build_dashboard_response(CITIES, forecasts)
    except WeatherProviderTimeout:
        return error_response(
            504,
            "WEATHER_PROVIDER_TIMEOUT",
            "気象データの取得がタイムアウトしました。",
        )
    except WeatherProviderError:
        return error_response(
            502,
            "WEATHER_PROVIDER_ERROR",
            "気象データを取得できませんでした。",
        )


@app.get(
    "/api/cities/{slug}",
    response_model=CityDetailResponse,
    responses={
        404: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
        504: {"model": ErrorResponse},
    },
)
async def city_detail(
    slug: str,
    client: OpenMeteoClient = Depends(get_open_meteo_client),
) -> CityDetailResponse | JSONResponse:
    city = find_city(slug)
    if city is None:
        return error_response(
            404,
            "CITY_NOT_FOUND",
            "指定された都市は見つかりません。",
        )
    try:
        forecast = await client.fetch_city(city)
        return build_city_response(city, forecast)
    except WeatherProviderTimeout:
        return error_response(
            504,
            "WEATHER_PROVIDER_TIMEOUT",
            "気象データの取得がタイムアウトしました。",
        )
    except WeatherProviderError:
        return error_response(
            502,
            "WEATHER_PROVIDER_ERROR",
            "気象データを取得できませんでした。",
        )
