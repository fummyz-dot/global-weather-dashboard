import pytest

from app.config import DEFAULT_ALLOWED_ORIGIN, get_allowed_origins


def test_allowed_origins_default(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)

    assert get_allowed_origins() == [DEFAULT_ALLOWED_ORIGIN]


def test_allowed_origins_are_split_and_normalized(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv(
        "ALLOWED_ORIGINS",
        " https://frontend.example.com/, http://localhost:5173 ",
    )

    assert get_allowed_origins() == [
        "https://frontend.example.com",
        "http://localhost:5173",
    ]
