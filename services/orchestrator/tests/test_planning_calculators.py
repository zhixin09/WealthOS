from app.tools.planning_calculators import (
    calculate_affordability,
    calculate_cashflow_after_scenario,
    calculate_liquidity_buffer,
)


def test_calculate_affordability_is_deterministic() -> None:
    result = calculate_affordability(
        property_price=1_200_000,
        down_payment_ratio=0.25,
        annual_interest_rate=0.04,
        loan_term_years=25,
        monthly_income=18_500,
        monthly_fixed_expenses=7_200,
    )

    assert result == {
        "loanPrincipal": 900000.0,
        "downPayment": 300000.0,
        "monthlyPayment": 4750.53,
        "postHousingSurplus": 6549.47,
        "debtServiceRatio": 0.65,
        "affordable": True,
    }


def test_calculate_liquidity_buffer_is_deterministic() -> None:
    result = calculate_liquidity_buffer(
        liquid_reserves=157_500,
        monthly_fixed_expenses=7_200,
    )

    assert result == {
        "liquidReserves": 157500.0,
        "monthlyBurn": 7200.0,
        "monthsOfRunway": 21.88,
    }


def test_calculate_cashflow_after_scenario_is_deterministic() -> None:
    result = calculate_cashflow_after_scenario(
        monthly_income=18_500,
        monthly_fixed_expenses=7_200,
        additional_monthly_costs=4_500,
    )

    assert result == {
        "monthlyIncome": 18500.0,
        "monthlyFixedExpenses": 7200.0,
        "additionalMonthlyCosts": 4500.0,
        "remainingMonthlyCashflow": 6800.0,
    }
