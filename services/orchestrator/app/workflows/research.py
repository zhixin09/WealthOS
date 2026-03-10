from app.models import ResearchCitation, ResearchQueryResponse
from app.tools.research_store import search_corpus


def run_research_query(question: str, limit: int = 3) -> ResearchQueryResponse:
    results = search_corpus(question, limit=limit)

    if not results:
        return ResearchQueryResponse(
            answer=(
                "No directly relevant research was found in the seeded corpus. "
                "Try a more specific question about liquidity, crypto risk, or technology equities."
            ),
            citations=[],
        )

    citations = [
        ResearchCitation(
            source=result["source"],
            citation=result["citation"],
            snippet=result["content"],
        )
        for result in results
    ]

    lead = citations[0]
    supporting_sources = ", ".join(citation.source for citation in citations[1:])
    support_text = f" Supporting context also comes from {supporting_sources}." if supporting_sources else ""

    answer = (
        f"Based on {lead.source}, {lead.snippet}{support_text} "
        "Use the cited excerpts below to validate the recommendation and decide whether to dig deeper."
    )

    return ResearchQueryResponse(answer=answer, citations=citations)
