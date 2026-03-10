from typing import Any

from app.analytics.engine import (
    _gross_assets,
    compute_allocation,
    compute_concentration_risk,
    compute_digital_exposure,
    compute_diversification_score,
    compute_dsr,
    compute_liquid_reserves,
    compute_liquidity_runway,
    compute_net_worth,
)
from app.analytics.wellness import (
    compute_behavioral_resilience,
    compute_wellness_score,
)
from app.data.clients import get_client


def _total_liabilities(client: dict[str, Any]) -> float:
    return round(
        sum(float(liability["value_sgd"]) for liability in client.get("liabilities", [])),
        2,
    )


def build_client_analytics(client_id: str) -> dict[str, Any] | None:
    client = get_client(client_id)
    if client is None:
        return None

    gross_assets = round(_gross_assets(client), 2)
    concentration_risk = compute_concentration_risk(client)
    weight_vector = [holding["concentration_pct"] / 100 for holding in concentration_risk]
    diversification_score = compute_diversification_score(weight_vector)
    digital_exposure = compute_digital_exposure(client)
    max_concentration = max(
        (holding["concentration_pct"] for holding in concentration_risk),
        default=0.0,
    )

    return {
        "client_id": client["id"],
        "name": client["name"],
        "risk_profile": client["risk_profile"],
        "jurisdiction": client["jurisdiction"],
        "net_worth_sgd": compute_net_worth(client),
        "gross_assets_sgd": gross_assets,
        "total_liabilities_sgd": _total_liabilities(client),
        "allocation": compute_allocation(client),
        "liquid_reserves_sgd": compute_liquid_reserves(client),
        "liquidity_runway_months": compute_liquidity_runway(client),
        "dsr": compute_dsr(client),
        "diversification_score": diversification_score,
        "max_concentration": max_concentration,
        "concentrated_holdings": [
            holding["name"]
            for holding in concentration_risk
            if holding["is_concentrated"]
        ],
        "digital_asset_pct": digital_exposure["digital_pct"],
        "digital_asset_level": digital_exposure["level"],
        "behavioral_resilience": compute_behavioral_resilience(
            client["risk_profile"],
            float(digital_exposure["digital_pct"]),
            max_concentration,
        ),
    }


def build_client_wellness(client_id: str) -> dict[str, Any] | None:
    analytics = build_client_analytics(client_id)
    if analytics is None:
        return None

    wellness = compute_wellness_score(
        {
            "liquidity_runway_months": analytics["liquidity_runway_months"],
            "dsr": analytics["dsr"],
            "diversification_score": analytics["diversification_score"],
            "digital_pct": analytics["digital_asset_pct"],
            "max_concentration_pct": analytics["max_concentration"],
        }
    )

    top_risks: list[str] = []
    if analytics["digital_asset_level"] == "high":
        top_risks.append("Digital asset exposure is elevated for the stated risk profile.")
    if analytics["max_concentration"] > 15.0:
        top_risks.append("Single-holding concentration exceeds the policy threshold.")
    if analytics["liquidity_runway_months"] < 12.0:
        top_risks.append("Liquidity runway is below the 12-month target.")
    if analytics["dsr"] > 0.3:
        top_risks.append("Debt service ratio is high relative to monthly income.")
    if analytics["diversification_score"] < 60.0:
        top_risks.append("Portfolio diversification remains below the preferred range.")

    return {
        "client_id": analytics["client_id"],
        "wellness_score": wellness["score"],
        "rating": wellness["rating"],
        "sub_scores": wellness["sub_scores"],
        "top_risks": top_risks,
    }
