from datetime import datetime, UTC

from app.models import AlertItem, AlertsRunResponse
from app.tools.client_data import get_portfolio_snapshot, get_risk_profile
from app.tools.market_data import get_company_news, get_market_quote


def extract_portfolio_symbols() -> set[str]:
    snapshot = get_portfolio_snapshot()
    equity_symbols = {asset["symbol"] for asset in snapshot["assets"]["equities"]}
    crypto_symbols = {asset["symbol"] for asset in snapshot["assets"]["crypto"]}
    return equity_symbols | crypto_symbols


def filter_relevant_news(
    *,
    portfolio_symbols: set[str],
    news_items: list[dict[str, str]],
) -> list[dict[str, str]]:
    return [
        item for item in news_items
        if item.get("symbol") in portfolio_symbols and item.get("headline")
    ]


def build_portfolio_alert(news_item: dict[str, str]) -> dict[str, object]:
    symbol = news_item["symbol"]
    risk_profile = get_risk_profile()
    current_price = get_market_quote(symbol)

    if symbol in {"BTC", "ETH", "SOL"}:
        recommendation = (
            "Review position sizing and keep enough liquid reserves in place before adding "
            "to digital asset exposure."
        )
    elif risk_profile["riskTolerance"] == "moderate":
        recommendation = (
            "Monitor the position for thesis changes, but avoid reactive trading unless the "
            "event alters medium-term earnings or liquidity expectations."
        )
    else:
        recommendation = "Keep monitoring the position against your stated risk budget."

    event_summary = f"{news_item['headline']} {news_item['summary']}".strip()
    return {
        "headline": news_item["headline"],
        "source": news_item.get("source", "unknown"),
        "eventSummary": event_summary,
        "impactedHoldings": [symbol],
        "recommendation": recommendation,
        "currentPrice": current_price,
    }


def run_alerts_workflow(limit: int = 4) -> AlertsRunResponse:
    symbols = sorted(extract_portfolio_symbols())
    relevant_news: list[dict[str, str]] = []

    for symbol in symbols:
        relevant_news.extend(
            filter_relevant_news(
                portfolio_symbols=set(symbols),
                news_items=get_company_news(symbol),
            )
        )

    deduped_by_headline: dict[str, dict[str, str]] = {}
    for item in relevant_news:
        deduped_by_headline[item["headline"]] = item

    alerts = [
        AlertItem(**build_portfolio_alert(item))
        for item in list(deduped_by_headline.values())[:limit]
    ]

    return AlertsRunResponse(
        generated_at=datetime.now(UTC).isoformat(),
        alerts=alerts,
    )
