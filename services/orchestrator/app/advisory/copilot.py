import json
from typing import Any

from app.advisory.llm_client import generate_json
from app.analytics.assembler import build_client_analytics, build_client_wellness
from app.data.research_index import search_research


COPILOT_SYSTEM_PROMPT = """You are a senior wealth adviser assistant. Answer questions about a specific client.

RULES:
- Reference specific dollar amounts and percentages from the metrics provided
- Do not invent any number not present in the profile or metrics
- Each action must reference a specific metric that motivates it
- Keep answer under 200 words
- Actions must be concrete and specific

You MUST return valid JSON with this exact structure:
{"answer": "", "structured_actions": [{"rank": 1, "action": "", "rationale": "", "urgency": "HIGH|MEDIUM|LOW"}]}"""


def generate_copilot_response(client_id: str, question: str) -> dict[str, Any] | None:
    analytics = build_client_analytics(client_id)
    wellness = build_client_wellness(client_id)
    if analytics is None or wellness is None:
        return None

    research = search_research(question, top_k=2)
    research_context = "\n".join(
        f"[{result['source']}]: {result['content']}"
        for result in research
    )

    user_prompt = f"""CLIENT ANALYTICS (do not contradict these):
{json.dumps(analytics, indent=2)}

WELLNESS SCORE:
{json.dumps(wellness, indent=2)}

HOUSE VIEW CONTEXT:
{research_context}

QUESTION: {question}"""

    return generate_json(COPILOT_SYSTEM_PROMPT, user_prompt, max_tokens=1000)
