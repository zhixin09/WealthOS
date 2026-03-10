from dataclasses import dataclass
import os
from pathlib import Path


def _load_env_local() -> None:
    """Load .env.local from repo root if it exists (no extra dependencies)."""
    env_path = Path(__file__).resolve().parents[3] / ".env.local"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip()
        if key and key not in os.environ:
            os.environ[key] = value


_load_env_local()


@dataclass(frozen=True)
class Settings:
    app_name: str = "WealthOS Orchestrator"
    app_env: str = "development"
    finnhub_api_key: str | None = None
    alpha_vantage_api_key: str | None = None
    finlight_api_key: str | None = None
    nvidia_api_key: str | None = None
    cors_origins: tuple[str, ...] = ("http://localhost:3000", "http://127.0.0.1:3000")


def get_settings() -> Settings:
    return Settings(
        app_name=os.getenv("WEALTHOS_APP_NAME", "WealthOS Orchestrator"),
        app_env=os.getenv("WEALTHOS_APP_ENV", "development"),
        finnhub_api_key=os.getenv("FINNHUB_API_KEY"),
        alpha_vantage_api_key=os.getenv("ALPHA_VANTAGE_API_KEY"),
        finlight_api_key=os.getenv("FINLIGHT_API_KEY"),
        nvidia_api_key=os.getenv("NVIDIA_API_KEY"),
        cors_origins=tuple(
            origin.strip()
            for origin in os.getenv(
                "WEALTHOS_CORS_ORIGINS",
                "http://localhost:3000,http://127.0.0.1:3000",
            ).split(",")
            if origin.strip()
        ),
    )
