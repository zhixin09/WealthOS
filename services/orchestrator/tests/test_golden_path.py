from fastapi.testclient import TestClient

import app.routes.v2 as v2_routes
from app.main import app


client = TestClient(app)


def test_golden_path_demo_flow(monkeypatch) -> None:
    monkeypatch.setattr(v2_routes, "generate_alert_brief", lambda *args: None)
    monkeypatch.setattr(v2_routes, "generate_copilot_response", lambda *args: None)

    clients_response = client.get("/v2/clients")
    assert clients_response.status_code == 200
    clients = clients_response.json()
    assert len(clients) == 3
    assert clients[0]["wellness_score"] >= 0

    analytics_response = client.get("/v2/clients/alex_chen/analytics")
    assert analytics_response.status_code == 200
    analytics = analytics_response.json()
    assert analytics["client_id"] == "alex_chen"
    assert analytics["net_worth_sgd"] > 0

    wellness_response = client.get("/v2/clients/alex_chen/wellness")
    assert wellness_response.status_code == 200
    wellness = wellness_response.json()
    assert wellness["client_id"] == "alex_chen"
    assert 0 <= wellness["wellness_score"] <= 100

    events_response = client.get("/v2/events")
    assert events_response.status_code == 200
    events = events_response.json()
    assert len(events) >= 3

    impact_response = client.post(
        "/v2/events/impact",
        json={"event_id": "evt_crypto_001", "client_id": "alex_chen"},
    )
    assert impact_response.status_code == 200
    impact = impact_response.json()
    assert impact["severity"] in {"LOW", "MODERATE", "HIGH", "CRITICAL"}
    assert any(holding["ticker"] == "BTC" for holding in impact["matched_holdings"])

    alert_response = client.post(
        "/v2/alerts/generate",
        json={"event_id": "evt_crypto_001", "client_id": "alex_chen"},
    )
    assert alert_response.status_code == 200
    alert = alert_response.json()
    assert alert["severity"] == impact["severity"]
    assert len(alert["recommended_actions"]) >= 1

    copilot_response = client.post(
        "/v2/copilot/query",
        json={
            "client_id": "alex_chen",
            "question": "What are the top 3 actions for Alex this quarter?",
        },
    )
    assert copilot_response.status_code == 200
    copilot = copilot_response.json()
    assert copilot["client_id"] == "alex_chen"
    assert len(copilot["structured_actions"]) >= 1

    research_response = client.post(
        "/v2/research/search",
        json={"query": "crypto risk", "limit": 3},
    )
    assert research_response.status_code == 200
    research = research_response.json()
    assert len(research["results"]) >= 1
    assert research["results"][0]["score"] > 0
