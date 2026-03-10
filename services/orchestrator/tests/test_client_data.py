from app.tools.client_data import (
    get_client_profile,
    get_portfolio_snapshot,
    get_risk_profile,
)


def test_get_client_profile_returns_expected_client() -> None:
    profile = get_client_profile()

    assert profile["name"] == "Alex Chen"
    assert profile["jurisdiction"] == "Singapore"
    assert profile["monthlyGrossIncome"] == 18500


def test_get_portfolio_snapshot_exposes_assets_and_liabilities() -> None:
    snapshot = get_portfolio_snapshot()

    assert "assets" in snapshot
    assert "liabilities" in snapshot
    assert len(snapshot["assets"]["equities"]) >= 1
    assert len(snapshot["liabilities"]) >= 1


def test_get_risk_profile_is_deterministic() -> None:
    risk_profile = get_risk_profile()

    assert risk_profile == {
        "clientName": "Alex Chen",
        "jurisdiction": "Singapore",
        "riskTolerance": "moderate",
        "investmentHorizon": "10-15 years",
    }
