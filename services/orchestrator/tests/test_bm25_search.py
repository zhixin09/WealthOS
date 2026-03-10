from app.data.research_index import get_available_docs, search_research


def test_get_available_docs_returns_three_seed_documents() -> None:
    docs = get_available_docs()

    assert len(docs) == 3
    assert any("liquidity" in doc["source"] for doc in docs)


def test_search_liquidity_returns_relevant_document() -> None:
    results = search_research("liquidity buffer Singapore households")

    assert len(results) >= 1
    assert results[0]["source"] == "singapore-household-liquidity.md"
    assert results[0]["score"] > 0


def test_search_crypto_returns_relevant_document() -> None:
    results = search_research("concentrated crypto exposure risk")

    assert len(results) >= 1
    assert results[0]["source"] == "digital-asset-risk-playbook.md"


def test_search_results_include_scores() -> None:
    results = search_research("equities valuation Asia technology")

    assert all("score" in result for result in results)
