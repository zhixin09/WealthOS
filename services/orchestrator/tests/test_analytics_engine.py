from app.analytics.engine import (
    compute_allocation,
    compute_concentration_risk,
    compute_digital_exposure,
    compute_diversification_score,
    compute_dsr,
    compute_liquid_reserves,
    compute_liquidity_runway,
    compute_net_worth,
)


SAMPLE_CLIENT = {
    "monthly_income_sgd": 18500,
    "monthly_expenses_sgd": 7200,
    "monthly_debt_payments_sgd": 3750,
    "assets": [
        {
            "id": "eq1",
            "name": "Stock A",
            "ticker": "A",
            "class": "equities",
            "value_sgd": 100000,
        },
        {
            "id": "crypto1",
            "name": "Bitcoin",
            "ticker": "BTC",
            "class": "digital_assets",
            "value_sgd": 200000,
        },
        {
            "id": "cash1",
            "name": "Savings",
            "class": "cash",
            "value_sgd": 50000,
        },
        {
            "id": "re1",
            "name": "Condo",
            "class": "real_estate",
            "value_sgd": 500000,
        },
        {
            "id": "cpf1",
            "name": "CPF OA",
            "class": "cpf",
            "value_sgd": 100000,
        },
    ],
    "liabilities": [
        {
            "id": "mort",
            "name": "Mortgage",
            "value_sgd": 300000,
            "monthly_payment_sgd": 2500,
        }
    ],
}


def test_compute_net_worth() -> None:
    assert compute_net_worth(SAMPLE_CLIENT) == 650000.0


def test_compute_allocation() -> None:
    result = compute_allocation(SAMPLE_CLIENT)

    assert result == {
        "equities": 10.53,
        "digital_assets": 21.05,
        "cash": 5.26,
        "real_estate": 52.63,
        "cpf": 10.53,
    }


def test_compute_liquid_reserves() -> None:
    assert compute_liquid_reserves(SAMPLE_CLIENT) == 50000.0


def test_compute_liquidity_runway() -> None:
    assert compute_liquidity_runway(SAMPLE_CLIENT) == 6.94


def test_compute_liquidity_runway_caps_zero_expenses() -> None:
    client = {**SAMPLE_CLIENT, "monthly_expenses_sgd": 0}

    assert compute_liquidity_runway(client) == 999.0


def test_compute_dsr() -> None:
    assert compute_dsr(SAMPLE_CLIENT) == 0.2027


def test_compute_concentration_risk_flags_holdings_over_threshold() -> None:
    result = compute_concentration_risk(SAMPLE_CLIENT)
    btc = next(holding for holding in result if holding["ticker"] == "BTC")

    assert btc["is_concentrated"] is True
    assert btc["concentration_pct"] == 21.05


def test_compute_diversification_score() -> None:
    assert compute_diversification_score([1.0]) == 0.0
    assert compute_diversification_score([0.2, 0.2, 0.2, 0.2, 0.2]) == 80.0


def test_compute_digital_exposure() -> None:
    assert compute_digital_exposure(SAMPLE_CLIENT) == {
        "digital_pct": 0.2105,
        "level": "high",
    }
