from copy import deepcopy
from functools import lru_cache
import json
from pathlib import Path
from typing import Any


SERVICE_ROOT = Path(__file__).resolve().parents[2]
REPO_ROOT = Path(__file__).resolve().parents[4]
CLIENT_PROFILE_PATH = SERVICE_ROOT / "data" / "client_profile.json"
PORTFOLIO_PATH = REPO_ROOT / "src" / "data" / "mock-portfolio.json"


def _load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


@lru_cache(maxsize=1)
def _client_profile() -> dict[str, Any]:
    return _load_json(CLIENT_PROFILE_PATH)


@lru_cache(maxsize=1)
def _portfolio_data() -> dict[str, Any]:
    return _load_json(PORTFOLIO_PATH)


def get_client_profile() -> dict[str, Any]:
    return deepcopy(_client_profile())


def get_portfolio_snapshot() -> dict[str, Any]:
    portfolio = _portfolio_data()
    return {
        "clientProfile": deepcopy(portfolio["clientProfile"]),
        "netWorth": deepcopy(portfolio["netWorth"]),
        "assets": deepcopy(portfolio["assets"]),
        "liabilities": deepcopy(portfolio["liabilities"]),
        "healthScore": deepcopy(portfolio["healthScore"]),
        "assetAllocation": deepcopy(portfolio["assetAllocation"]),
    }


def get_risk_profile() -> dict[str, Any]:
    profile = _client_profile()
    return {
        "clientName": profile["name"],
        "jurisdiction": profile["jurisdiction"],
        "riskTolerance": profile["riskTolerance"],
        "investmentHorizon": profile["investmentHorizon"],
    }
