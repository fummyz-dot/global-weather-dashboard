# AGENTS.md

## Project scope

This repository contains a React frontend and a FastAPI backend for a six-city
weather dashboard. Keep both applications independently deployable to Vercel.

## Backend conventions

- Run backend commands from `backend/`.
- Expose the FastAPI application as `app` from `backend/app/main.py`.
- Keep city metadata in `backend/app/cities.py`.
- Use Open-Meteo as the only weather data provider.
- Do not add a database, authentication, Docker, or a shared mutable cache.
- Keep API responses camelCase and Python identifiers snake_case.
- Add type hints to production Python code.
- Mock all external HTTP traffic in tests.

## Validation

Before handing off backend changes, run:

```bash
pytest
python -c "from app.main import app; print(app.title)"
```

## Frontend conventions

The frontend is intentionally reserved for a later implementation stage. Do not
add UI code until requested.
