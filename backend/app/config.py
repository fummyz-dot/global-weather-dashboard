"""Environment-based application configuration."""

from __future__ import annotations

import os


DEFAULT_ALLOWED_ORIGIN = "http://localhost:5173"


def get_allowed_origins() -> list[str]:
    """Return normalized CORS origins from the environment."""

    raw_origins = os.getenv("ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGIN)
    origins = [origin.strip().rstrip("/") for origin in raw_origins.split(",")]
    normalized = [origin for origin in origins if origin]
    return normalized or [DEFAULT_ALLOWED_ORIGIN]
