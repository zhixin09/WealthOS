from app.orchestrator import classify_intent, route_question


def test_classify_intent_routes_research_questions() -> None:
    assert classify_intent("What matters for concentrated crypto exposure?") == "research"


def test_classify_intent_routes_alerts_questions() -> None:
    assert classify_intent("What alerts matter for my portfolio right now?") == "alerts"


def test_classify_intent_routes_planning_questions() -> None:
    assert classify_intent("Can I afford a property upgrade next year?") == "planning"


def test_route_question_returns_planning_result() -> None:
    response = route_question("Can I afford a property upgrade next year?")

    assert response["intent"] == "planning"
    assert "recommendation" in response["result"]
