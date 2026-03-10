from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    app_name: str = "WealthOS Orchestrator"
    app_env: str = "development"
    finnhub_api_key: str | None = None
    alpha_vantage_api_key: str | None = None
    cors_origins: tuple[str, ...] = ("http://localhost:3000", "http://127.0.0.1:3000")


def get_settings() -> Settings:
    return Settings(
        app_name=os.getenv("WEALTHOS_APP_NAME", "WealthOS Orchestrator"),
        app_env=os.getenv("WEALTHOS_APP_ENV", "development"),
        finnhub_api_key=os.getenv("FINNHUB_API_KEY"),
        alpha_vantage_api_key=os.getenv("ALPHA_VANTAGE_API_KEY"),
        cors_origins=tuple(
            origin.strip()
            for origin in os.getenv(
                "WEALTHOS_CORS_ORIGINS",
                "http://localhost:3000,http://127.0.0.1:3000",
            ).split(",")
            if origin.strip()
        ),
    )
