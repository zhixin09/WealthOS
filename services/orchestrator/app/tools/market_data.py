from datetime import date, timedelta
import json
from urllib.parse import urlencode
from urllib.request import urlopen

from app.config import get_settings
from app.tools.client_data import get_portfolio_snapshot


MOCK_NEWS_BY_SYMBOL = {
    "AAPL": [
        {
            "symbol": "AAPL",
            "headline": "Apple supplier checks improve ahead of the next product cycle",
            "summary": "Channel commentary suggests margin resilience and steadier hardware demand.",
            "source": "mock-wire",
        }
    ],
    "NVDA": [
        {
            "symbol": "NVDA",
            "headline": "AI infrastructure spending stays elevated across large cloud providers",
            "summary": "Capital expenditure plans remain supportive for semiconductor leaders.",
            "source": "mock-wire",
        }
    ],
    "BTC": [
        {
            "symbol": "BTC",
            "headline": "Bitcoin rallies after regulatory clarity update",
            "summary": "A new policy signal improved market sentiment for large digital assets.",
            "source": "mock-wire",
        }
    ],
    "ETH": [
        {
            "symbol": "ETH",
            "headline": "Ethereum trading activity rises as institutional participation broadens",
            "summary": "Higher on-chain activity reinforced near-term sentiment across major crypto assets.",
            "source": "mock-wire",
        }
    ],
}


def get_company_news(symbol: str) -> list[dict[str, str]]:
    settings = get_settings()
    if not settings.finnhub_api_key:
        return MOCK_NEWS_BY_SYMBOL.get(symbol, [])

    params = urlencode(
        {
            "symbol": symbol,
            "from": (date.today() - timedelta(days=7)).isoformat(),
            "to": date.today().isoformat(),
            "token": settings.finnhub_api_key,
        }
    )
    url = f"https://finnhub.io/api/v1/company-news?{params}"

    try:
        with urlopen(url, timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except Exception:
        return MOCK_NEWS_BY_SYMBOL.get(symbol, [])

    return [
        {
            "symbol": symbol,
            "headline": item.get("headline", ""),
            "summary": item.get("summary", ""),
            "source": item.get("source", "finnhub"),
        }
        for item in payload[:3]
        if item.get("headline")
    ] or MOCK_NEWS_BY_SYMBOL.get(symbol, [])


def get_market_quote(symbol: str) -> float | None:
    portfolio = get_portfolio_snapshot()
    for asset in portfolio["assets"]["equities"]:
        if asset["symbol"] == symbol:
            return float(asset["currentPrice"])
    for asset in portfolio["assets"]["crypto"]:
        if asset["symbol"] == symbol:
            return float(asset["currentPrice"])
    return None
