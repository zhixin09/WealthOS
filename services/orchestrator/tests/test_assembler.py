from app.analytics.assembler import build_client_analytics, build_client_wellness


def test_build_client_analytics_for_alex() -> None:
    result = build_client_analytics("alex_chen")

    assert result is not None
    assert result["client_id"] == "alex_chen"
    assert result["name"] == "Alex Chen"
    assert result["net_worth_sgd"] > 0
    assert result["gross_assets_sgd"] > result["net_worth_sgd"]
    assert "equities" in result["allocation"]
    assert result["liquid_reserves_sgd"] > 0
    assert result["liquidity_runway_months"] > 0
    assert 0 < result["dsr"] < 1
    assert 0 <= result["diversification_score"] <= 100
    assert result["digital_asset_level"] in {"low", "moderate", "high"}
    assert 1 <= result["behavioral_resilience"] <= 100


def test_build_client_analytics_unknown_returns_none() -> None:
    assert build_client_analytics("nonexistent") is None


def test_build_client_wellness_for_alex() -> None:
    result = build_client_wellness("alex_chen")

    assert result is not None
    assert result["client_id"] == "alex_chen"
    assert 0 <= result["wellness_score"] <= 100
    assert result["rating"] in {"Excellent", "Good", "Fair", "At Risk"}
    assert len(result["sub_scores"]) == 5
    assert isinstance(result["top_risks"], list)
