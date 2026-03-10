from app.events.pipeline import (
    build_impact_manifest,
    classify_severity,
    compute_client_exposure,
    get_event_by_id,
    load_seeded_events,
    map_entities_to_securities,
)


def test_load_seeded_events_returns_curated_events() -> None:
    events = load_seeded_events()

    assert len(events) >= 3
    assert all("id" in event for event in events)


def test_get_event_by_id_returns_crypto_event() -> None:
    event = get_event_by_id("evt_crypto_001")

    assert event is not None
    assert "Bitcoin" in event["headline"]


def test_map_entities_to_securities_returns_union_of_matches() -> None:
    securities = map_entities_to_securities(["Bitcoin", "Crypto"])

    assert {"BTC", "ETH", "SOL"} <= securities


def test_compute_client_exposure_finds_matching_holdings() -> None:
    exposure = compute_client_exposure("alex_chen", {"BTC", "ETH", "SOL"})

    assert len(exposure) >= 1
    assert any(holding["ticker"] == "BTC" for holding in exposure)
    assert all(holding["exposure_pct"] > 0 for holding in exposure)


def test_classify_severity_for_high_exposure_regulatory_event() -> None:
    assert classify_severity(0.25, "regulatory") == "CRITICAL"


def test_classify_severity_for_low_exposure_event() -> None:
    assert classify_severity(0.01, "rate_decision") == "LOW"


def test_build_impact_manifest_for_crypto_event() -> None:
    manifest = build_impact_manifest("evt_crypto_001", "alex_chen")

    assert manifest["event_id"] == "evt_crypto_001"
    assert manifest["client_id"] == "alex_chen"
    assert manifest["total_exposure_pct"] > 0
    assert manifest["severity"] in {"LOW", "MODERATE", "HIGH", "CRITICAL"}
    assert len(manifest["matched_holdings"]) >= 1
