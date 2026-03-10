from collections import defaultdict
from typing import Any


def _gross_assets(client: dict[str, Any]) -> float:
    return float(sum(float(asset["value_sgd"]) for asset in client.get("assets", [])))


def _total_liabilities(client: dict[str, Any]) -> float:
    return float(
        sum(float(liability["value_sgd"]) for liability in client.get("liabilities", []))
    )


def compute_net_worth(client: dict[str, Any]) -> float:
    return round(_gross_assets(client) - _total_liabilities(client), 2)


def compute_allocation(client: dict[str, Any]) -> dict[str, float]:
    gross_assets = _gross_assets(client)
    allocation_totals: dict[str, float] = defaultdict(float)

    for asset in client.get("assets", []):
        allocation_totals[asset["class"]] += float(asset["value_sgd"])

    if gross_assets == 0:
        return {asset_class: 0.0 for asset_class in allocation_totals}

    return {
        asset_class: round(value / gross_assets * 100, 2)
        for asset_class, value in allocation_totals.items()
    }


def compute_liquid_reserves(client: dict[str, Any]) -> float:
    return round(
        sum(
            float(asset["value_sgd"])
            for asset in client.get("assets", [])
            if asset.get("class") == "cash"
        ),
        2,
    )


def compute_liquidity_runway(client: dict[str, Any]) -> float:
    monthly_expenses = float(client.get("monthly_expenses_sgd", 0))

    if monthly_expenses == 0:
        return 999.0

    return round(compute_liquid_reserves(client) / monthly_expenses, 2)


def compute_dsr(client: dict[str, Any]) -> float:
    monthly_income = float(client.get("monthly_income_sgd", 0))

    if monthly_income == 0:
        return 0.0

    return round(float(client.get("monthly_debt_payments_sgd", 0)) / monthly_income, 4)


def compute_concentration_risk(client: dict[str, Any]) -> list[dict[str, Any]]:
    gross_assets = _gross_assets(client)
    results: list[dict[str, Any]] = []

    for asset in client.get("assets", []):
        concentration_pct = 0.0
        if gross_assets > 0:
            concentration_pct = round(float(asset["value_sgd"]) / gross_assets * 100, 2)

        results.append(
            {
                "id": asset["id"],
                "ticker": asset.get("ticker", asset["id"].upper()),
                "name": asset["name"],
                "value_sgd": round(float(asset["value_sgd"]), 2),
                "concentration_pct": concentration_pct,
                "is_concentrated": concentration_pct > 15.0,
            }
        )

    return results


def compute_diversification_score(weights: list[float]) -> float:
    if not weights:
        return 0.0

    hhi = sum(weight * weight for weight in weights)
    return round((1 - hhi) * 100, 2)


def compute_digital_exposure(client: dict[str, Any]) -> dict[str, float | str]:
    gross_assets = _gross_assets(client)
    digital_value = sum(
        float(asset["value_sgd"])
        for asset in client.get("assets", [])
        if asset.get("class") == "digital_assets"
    )

    digital_pct = 0.0 if gross_assets == 0 else round(digital_value / gross_assets, 4)
    if digital_pct > 0.2:
        level = "high"
    elif digital_pct > 0.05:
        level = "moderate"
    else:
        level = "low"

    return {
        "digital_pct": digital_pct,
        "level": level,
    }
