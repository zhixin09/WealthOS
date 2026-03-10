import math


def calculate_affordability(
    *,
    property_price: float,
    down_payment_ratio: float,
    annual_interest_rate: float,
    loan_term_years: int,
    monthly_income: float,
    monthly_fixed_expenses: float,
) -> dict[str, float | bool]:
    down_payment = round(property_price * down_payment_ratio, 2)
    loan_principal = round(property_price - down_payment, 2)
    monthly_rate = annual_interest_rate / 12
    periods = loan_term_years * 12

    monthly_payment = loan_principal * (
        monthly_rate * (1 + monthly_rate) ** periods
    ) / (((1 + monthly_rate) ** periods) - 1)
    monthly_payment = round(monthly_payment, 2)

    post_housing_surplus = round(
        monthly_income - monthly_fixed_expenses - monthly_payment,
        2,
    )
    debt_service_ratio = round(
        (monthly_fixed_expenses + monthly_payment) / monthly_income,
        2,
    )

    return {
        "loanPrincipal": float(loan_principal),
        "downPayment": float(down_payment),
        "monthlyPayment": float(monthly_payment),
        "postHousingSurplus": float(post_housing_surplus),
        "debtServiceRatio": float(debt_service_ratio),
        "affordable": post_housing_surplus >= 0 and debt_service_ratio <= 0.7,
    }


def calculate_liquidity_buffer(
    *,
    liquid_reserves: float,
    monthly_fixed_expenses: float,
) -> dict[str, float]:
    months_of_runway = round(liquid_reserves / monthly_fixed_expenses, 2)

    return {
        "liquidReserves": float(liquid_reserves),
        "monthlyBurn": float(monthly_fixed_expenses),
        "monthsOfRunway": float(months_of_runway),
    }


def calculate_cashflow_after_scenario(
    *,
    monthly_income: float,
    monthly_fixed_expenses: float,
    additional_monthly_costs: float,
) -> dict[str, float]:
    remaining_monthly_cashflow = round(
        monthly_income - monthly_fixed_expenses - additional_monthly_costs,
        2,
    )

    return {
        "monthlyIncome": float(monthly_income),
        "monthlyFixedExpenses": float(monthly_fixed_expenses),
        "additionalMonthlyCosts": float(additional_monthly_costs),
        "remainingMonthlyCashflow": float(remaining_monthly_cashflow),
    }
