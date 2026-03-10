import json
from copy import deepcopy
from functools import lru_cache
from pathlib import Path
from typing import Any


CLIENTS_DIR = Path(__file__).resolve().parents[2] / "data" / "clients"


@lru_cache(maxsize=1)
def _load_clients() -> dict[str, dict[str, Any]]:
    clients: dict[str, dict[str, Any]] = {}

    for path in sorted(CLIENTS_DIR.glob("*.json")):
        with path.open("r", encoding="utf-8") as file:
            payload = json.load(file)
        clients[payload["id"]] = payload

    return clients


def list_clients() -> list[dict[str, Any]]:
    return [deepcopy(client) for client in _load_clients().values()]


def get_client(client_id: str) -> dict[str, Any] | None:
    client = _load_clients().get(client_id)
    return deepcopy(client) if client is not None else None
