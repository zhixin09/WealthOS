import json
from typing import Any

from app.advisory.llm_client import generate_json
from app.data.research_index import search_research


ALERT_SYSTEM_PROMPT = """You are an analytical wealth management assistant. Draft a concise adviser brief.

RULES:
- Every percentage you mention must come from the impact manifest exactly as given
- Cite at least one house view document by name if available
- Do not provide investment advice; provide information for RM review
- Structure: 1 sentence summary, 2 sentence impact analysis, 2 recommended actions
- If you cannot ground a claim in the manifest or house view, omit it
- Total length: 150 words maximum

You MUST return valid JSON with this exact structure:
{"subject": "", "brief": "", "recommended_actions": ["action1", "action2"], "house_view_citations": [{"doc": "", "excerpt": ""}]}"""


def generate_alert_brief(
    impact_manifest: dict[str, Any],
    event_headline: str,
    client_name: str,
) -> dict[str, Any] | None:
    research = search_research(event_headline, top_k=2)
    research_context = "\n".join(
        f"[{result['source']}]: {result['content']}"
        for result in research
    )

    user_prompt = f"""IMPACT MANIFEST:
{json.dumps(impact_manifest, indent=2)}

CLIENT: {client_name}

HOUSE VIEW EVIDENCE:
{research_context}

Draft the adviser brief."""

    return generate_json(ALERT_SYSTEM_PROMPT, user_prompt)
