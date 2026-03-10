from app.data.clients import get_client, list_clients


def test_list_clients_returns_three_seeded_clients() -> None:
    clients = list_clients()

    assert len(clients) == 3
    assert {client["id"] for client in clients} == {
        "alex_chen",
        "priya_sharma",
        "david_lim",
    }


def test_get_client_returns_enriched_alex_profile() -> None:
    client = get_client("alex_chen")

    assert client is not None
    assert client["name"] == "Alex Chen"
    assert client["risk_profile"] == "moderate"
    assert len(client["assets"]) >= 10


def test_get_client_returns_none_for_unknown_id() -> None:
    assert get_client("unknown_person") is None
