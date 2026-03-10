RISK_BASE_SCORES = {
    "conservative": 40,
    "moderate": 65,
    "aggressive": 85,
}


def _label(score: float) -> str:
    if score >= 0.8:
        return "Strong"
    if score >= 0.6:
        return "Adequate"
    if score >= 0.4:
        return "Moderate"
    return "Needs Attention"


def compute_wellness_score(metrics: dict[str, float]) -> dict[str, object]:
    liquidity_score = min(metrics["liquidity_runway_months"] / 12.0, 1.0)
    debt_score = max(0.0, 1.0 - metrics["dsr"] / 0.6)
    diversification_score = metrics["diversification_score"] / 100.0
    digital_score = max(0.0, 1.0 - max(0.0, metrics["digital_pct"] - 0.2) / 0.3)
    concentration_score = max(0.0, 1.0 - metrics["max_concentration_pct"] / 40.0)

    composite = (
        liquidity_score * 0.25
        + debt_score * 0.20
        + diversification_score * 0.20
        + digital_score * 0.15
        + concentration_score * 0.20
    )
    score = round(composite * 100, 1)

    if score >= 80:
        rating = "Excellent"
    elif score >= 60:
        rating = "Good"
    elif score >= 40:
        rating = "Fair"
    else:
        rating = "At Risk"

    return {
        "score": score,
        "rating": rating,
        "sub_scores": {
            "liquidity": {
                "score": round(liquidity_score * 100, 1),
                "label": _label(liquidity_score),
            },
            "debt_burden": {
                "score": round(debt_score * 100, 1),
                "label": _label(debt_score),
            },
            "diversification": {
                "score": round(diversification_score * 100, 1),
                "label": _label(diversification_score),
            },
            "digital_safety": {
                "score": round(digital_score * 100, 1),
                "label": _label(digital_score),
            },
            "concentration": {
                "score": round(concentration_score * 100, 1),
                "label": _label(concentration_score),
            },
        },
    }


def compute_behavioral_resilience(
    risk_profile: str,
    digital_pct: float,
    max_concentration_pct: float,
) -> int:
    base = RISK_BASE_SCORES.get(risk_profile, 65)
    penalty = 0

    if digital_pct > 0.2:
        penalty += int((digital_pct - 0.2) * 100)
    if max_concentration_pct > 15.0:
        penalty += int((max_concentration_pct - 15.0) / 2.0)

    return max(1, min(100, base - penalty))
