from app.models import PlanningMetric, PlanningQueryResponse
from app.tools.client_data import get_client_profile, get_portfolio_snapshot, get_risk_profile
from app.tools.planning_calculators import (
    calculate_affordability,
    calculate_cashflow_after_scenario,
    calculate_liquidity_buffer,
)


def _sum_bank_deposits(portfolio_snapshot: dict) -> float:
    return float(
        sum(deposit["balance"] for deposit in portfolio_snapshot["assets"]["bankDeposits"])
    )


def _infer_scenario(question: str) -> str:
    normalized = question.lower()

    if any(keyword in normalized for keyword in ("property", "mortgage", "afford", "house")):
        return "property-upgrade"
    if any(keyword in normalized for keyword in ("liquidity", "buffer", "runway", "emergency")):
        return "liquidity-buffer"
    return "risk-rebalance"


def run_planning_query(question: str) -> PlanningQueryResponse:
    client_profile = get_client_profile()
    portfolio_snapshot = get_portfolio_snapshot()
    risk_profile = get_risk_profile()
    scenario = _infer_scenario(question)

    monthly_income = float(client_profile["monthlyGrossIncome"])
    monthly_fixed_expenses = float(client_profile["monthlyFixedExpenses"])

    if scenario == "property-upgrade":
        affordability = calculate_affordability(
            property_price=1_200_000,
            down_payment_ratio=0.25,
            annual_interest_rate=0.04,
            loan_term_years=25,
            monthly_income=monthly_income,
            monthly_fixed_expenses=monthly_fixed_expenses,
        )
        liquidity = calculate_liquidity_buffer(
            liquid_reserves=_sum_bank_deposits(portfolio_snapshot),
            monthly_fixed_expenses=monthly_fixed_expenses,
        )

        summary = (
            "A property upgrade looks financially feasible on the current fact pattern, "
            "but it would convert a meaningful part of your liquid reserves into housing equity."
        )
        recommendation = (
            "Proceed only if you preserve at least 12 months of liquidity after the down payment "
            "and avoid funding the purchase by liquidating core long-term equity positions."
        )
        metrics = [
            PlanningMetric(label="Monthly mortgage", value=f"${affordability['monthlyPayment']:,.2f}"),
            PlanningMetric(label="Post-housing surplus", value=f"${affordability['postHousingSurplus']:,.2f}"),
            PlanningMetric(label="Liquidity runway", value=f"{liquidity['monthsOfRunway']:.2f} months"),
            PlanningMetric(label="Risk profile", value=risk_profile["riskTolerance"].title()),
        ]
    elif scenario == "liquidity-buffer":
        liquidity = calculate_liquidity_buffer(
            liquid_reserves=_sum_bank_deposits(portfolio_snapshot),
            monthly_fixed_expenses=monthly_fixed_expenses,
        )
        summary = (
            "Your current liquid reserves provide a strong cash buffer relative to fixed expenses."
        )
        recommendation = (
            "Maintain the current emergency reserve floor and only redeploy excess cash gradually "
            "if large near-term spending commitments remain unchanged."
        )
        metrics = [
            PlanningMetric(label="Liquid reserves", value=f"${liquidity['liquidReserves']:,.2f}"),
            PlanningMetric(label="Monthly burn", value=f"${liquidity['monthlyBurn']:,.2f}"),
            PlanningMetric(label="Runway", value=f"{liquidity['monthsOfRunway']:.2f} months"),
            PlanningMetric(label="Jurisdiction", value=risk_profile["jurisdiction"]),
        ]
    else:
        crypto_allocation = next(
            allocation for allocation in portfolio_snapshot["assetAllocation"] if allocation["category"] == "Crypto"
        )
        cashflow = calculate_cashflow_after_scenario(
            monthly_income=monthly_income,
            monthly_fixed_expenses=monthly_fixed_expenses,
            additional_monthly_costs=0,
        )
        summary = (
            "The portfolio has meaningful crypto concentration for a moderate-risk household, "
            "even though monthly cash flow is currently healthy."
        )
        recommendation = (
            "Consider trimming part of the digital asset sleeve into lower-volatility reserves or "
            "broad-market exposures if you want better alignment with a moderate-risk profile."
        )
        metrics = [
            PlanningMetric(label="Crypto allocation", value=f"{crypto_allocation['percentage']:.1f}%"),
            PlanningMetric(label="Monthly free cash flow", value=f"${cashflow['remainingMonthlyCashflow']:,.2f}"),
            PlanningMetric(label="Risk profile", value=risk_profile["riskTolerance"].title()),
            PlanningMetric(label="Investment horizon", value=risk_profile["investmentHorizon"]),
        ]

    return PlanningQueryResponse(
        scenario=scenario,
        summary=summary,
        recommendation=recommendation,
        key_metrics=metrics,
    )
