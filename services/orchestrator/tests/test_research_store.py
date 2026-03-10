from app.tools.research_store import load_corpus, search_corpus


def test_load_corpus_returns_seed_documents() -> None:
    documents = load_corpus()

    assert len(documents) >= 3
    assert any(document["source"] == "singapore-household-liquidity.md" for document in documents)


def test_keyword_query_returns_relevant_chunks() -> None:
    results = search_corpus("How should households think about liquidity buffers in Singapore?")

    assert len(results) >= 1
    assert results[0]["source"] == "singapore-household-liquidity.md"


def test_search_results_include_citation_fields() -> None:
    result = search_corpus("What matters for concentrated crypto exposure?", limit=1)[0]

    assert result["source"] == "digital-asset-risk-playbook.md"
    assert result["citation"] == "digital-asset-risk-playbook.md#chunk-1"
    assert "content" in result
