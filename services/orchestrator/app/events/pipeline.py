import json
from copy import deepcopy
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.data.clients import get_client


DATA_DIR = Path(__file__).resolve().parents[2] / "data"
EVENTS_PATH = DATA_DIR / "seeded_events.json"
ENTITY_SECURITY_MAP_PATH = DATA_DIR / "entity_security_map.json"


@lru_cache(maxsize=1)
def _load_events() -> list[dict[str, Any]]:
    with EVENTS_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


@lru_cache(maxsize=1)
def _load_entity_security_map() -> dict[str, list[str]]:
    with ENTITY_SECURITY_MAP_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def load_seeded_events() -> list[dict[str, Any]]:
    return deepcopy(_load_events())


def get_event_by_id(event_id: str) -> dict[str, Any] | None:
    for event in _load_events():
        if event["id"] == event_id:
            return deepcopy(event)
    return None


def map_entities_to_securities(entities: list[str]) -> set[str]:
    entity_map = _load_entity_security_map()
    securities: set[str] = set()

    for entity in entities:
        securities.update(entity_map.get(entity, []))

    return securities


def compute_client_exposure(
    client_id: str,
    securities: set[str],
) -> list[dict[str, Any]]:
    client = get_client(client_id)
    if client is None:
        return []

    gross_assets = sum(float(asset["value_sgd"]) for asset in client["assets"])
    if gross_assets == 0:
        return []

    exposures: list[dict[str, Any]] = []
    for asset in client["assets"]:
        ticker = asset.get("ticker")
        if ticker not in securities:
            continue

        exposures.append(
            {
                "ticker": ticker,
                "name": asset["name"],
                "value_sgd": round(float(asset["value_sgd"]), 2),
                "exposure_pct": round(float(asset["value_sgd"]) / gross_assets * 100, 2),
            }
        )

    return sorted(exposures, key=lambda holding: holding["value_sgd"], reverse=True)


def classify_severity(total_exposure_frac: float, event_type: str) -> str:
    if total_exposure_frac > 0.15:
        return "CRITICAL"
    if total_exposure_frac > 0.05 and event_type in {
        "rate_decision",
        "regulatory",
        "credit_event",
        "trade_policy",
    }:
        return "HIGH"
    if total_exposure_frac > 0.02:
        return "MODERATE"
    return "LOW"


def build_impact_manifest(event_id: str, client_id: str) -> dict[str, Any]:
    event = get_event_by_id(event_id)
    if event is None:
        return {"error": f"Event {event_id} not found"}

    client = get_client(client_id)
    if client is None:
        return {"error": f"Client {client_id} not found"}

    securities = map_entities_to_securities(event["entities"])
    matched_holdings = compute_client_exposure(client_id, securities)
    gross_assets = sum(float(asset["value_sgd"]) for asset in client["assets"])
    total_exposed = sum(holding["value_sgd"] for holding in matched_holdings)
    exposure_frac = 0.0 if gross_assets == 0 else total_exposed / gross_assets
    total_exposure_pct = round(exposure_frac * 100, 2)
    severity = classify_severity(exposure_frac, event["event_type"])

    return {
        "event_id": event["id"],
        "client_id": client_id,
        "headline": event["headline"],
        "event_type": event["event_type"],
        "matched_holdings": matched_holdings,
        "matched_securities": sorted(securities),
        "total_exposure_pct": total_exposure_pct,
        "severity": severity,
        "severity_rationale": (
            f"{total_exposure_pct}% gross-asset exposure across "
            f"{len(matched_holdings)} holding(s) for a {event['event_type']} event."
        ),
    }
