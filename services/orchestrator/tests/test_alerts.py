from app.workflows.alerts import (
    build_portfolio_alert,
    extract_portfolio_symbols,
    filter_relevant_news,
)


def test_extract_portfolio_symbols_returns_owned_tickers() -> None:
    symbols = extract_portfolio_symbols()

    assert {"AAPL", "BTC", "ETH", "VOO"}.issubset(symbols)


def test_filter_relevant_news_keeps_owned_symbols() -> None:
    relevant_news = filter_relevant_news(
        portfolio_symbols={"AAPL", "BTC"},
        news_items=[
            {
                "symbol": "AAPL",
                "headline": "Apple supplier checks improve",
                "summary": "Margins look stable into the next quarter.",
                "source": "mock-wire",
            },
            {
                "symbol": "TSLA",
                "headline": "Tesla updates guidance",
                "summary": "Volumes remain under pressure.",
                "source": "mock-wire",
            },
        ],
    )

    assert len(relevant_news) == 1
    assert relevant_news[0]["symbol"] == "AAPL"


def test_build_portfolio_alert_returns_summary_holdings_and_recommendation() -> None:
    alert = build_portfolio_alert(
        {
            "symbol": "BTC",
            "headline": "Bitcoin rallies after regulatory clarity update",
            "summary": "A new policy signal improved market sentiment for large digital assets.",
            "source": "mock-wire",
        }
    )

    assert alert["eventSummary"]
    assert alert["impactedHoldings"] == ["BTC"]
    assert alert["recommendation"]
