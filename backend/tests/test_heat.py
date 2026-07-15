import pytest

from app.heat import calculate_heat_level
from app.schemas import HeatLevelCode


@pytest.mark.parametrize(
    ("temperature", "expected"),
    [
        (29.9, HeatLevelCode.NORMAL),
        (30.0, HeatLevelCode.HOT),
        (34.9, HeatLevelCode.HOT),
        (35.0, HeatLevelCode.VERY_HOT),
        (39.9, HeatLevelCode.VERY_HOT),
        (40.0, HeatLevelCode.EXTREME),
    ],
)
def test_heat_level_boundaries(
    temperature: float, expected: HeatLevelCode
) -> None:
    assert calculate_heat_level(temperature) is expected
