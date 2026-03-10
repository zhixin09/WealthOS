from typing import Literal

from app.workflows.alerts import run_alerts_workflow
from app.workflows.planning import run_planning_query
from app.workflows.research import run_research_query


Intent = Literal["research", "alerts", "planning"]


def classify_intent(question: str) -> Intent:
    normalized = question.lower()

    if any(keyword in normalized for keyword in ("alert", "headline", "news", "portfolio event")):
        return "alerts"
    if any(keyword in normalized for keyword in ("afford", "property", "liquidity", "plan", "risk profile")):
        return "planning"
    return "research"


def route_question(question: str) -> dict[str, object]:
    intent = classify_intent(question)

    if intent == "alerts":
        result = run_alerts_workflow().model_dump()
    elif intent == "planning":
        result = run_planning_query(question).model_dump()
    else:
        result = run_research_query(question).model_dump()

    return {
        "intent": intent,
        "result": result,
    }
