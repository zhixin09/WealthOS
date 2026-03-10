from app.analytics.wellness import (
    compute_behavioral_resilience,
    compute_wellness_score,
)


def test_wellness_score_returns_composite_response() -> None:
    metrics = {
        "liquidity_runway_months": 9.0,
        "dsr": 0.2,
        "diversification_score": 68.0,
        "digital_pct": 0.25,
        "max_concentration_pct": 18.0,
    }

    result = compute_wellness_score(metrics)

    assert 0 <= result["score"] <= 100
    assert result["rating"] in {"Excellent", "Good", "Fair", "At Risk"}
    assert set(result["sub_scores"]) == {
        "liquidity",
        "debt_burden",
        "diversification",
        "digital_safety",
        "concentration",
    }


def test_wellness_score_rewards_high_quality_inputs() -> None:
    metrics = {
        "liquidity_runway_months": 24.0,
        "dsr": 0.0,
        "diversification_score": 95.0,
        "digital_pct": 0.05,
        "max_concentration_pct": 5.0,
    }

    result = compute_wellness_score(metrics)

    assert result["score"] >= 90
    assert result["rating"] == "Excellent"


def test_behavioral_resilience_returns_bounded_score() -> None:
    score = compute_behavioral_resilience("moderate", 0.25, 18.0)

    assert 1 <= score <= 100


def test_behavioral_resilience_penalizes_conservative_profile() -> None:
    conservative = compute_behavioral_resilience("conservative", 0.25, 18.0)
    moderate = compute_behavioral_resilience("moderate", 0.25, 18.0)

    assert conservative < moderate
