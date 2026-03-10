import json

from app.config import get_settings


NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
NVIDIA_MODEL = "moonshotai/kimi-k2.5"
_client = None


def parse_json_response(content: str | None) -> dict | None:
    if not content:
        return None

    cleaned = content.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if lines:
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None


def get_llm_client():
    global _client
    if _client is not None:
        return _client

    settings = get_settings()
    if not settings.nvidia_api_key:
        return None

    from openai import OpenAI

    _client = OpenAI(
        base_url=NVIDIA_BASE_URL,
        api_key=settings.nvidia_api_key,
    )
    return _client


def generate_json(
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 4096,
) -> dict | None:
    client = get_llm_client()
    if client is None:
        return None

    try:
        response = client.chat.completions.create(
            model=NVIDIA_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=max_tokens,
            temperature=0.3,
            top_p=1.0,
            timeout=15.0,
        )
    except Exception:
        return None

    return parse_json_response(response.choices[0].message.content)
