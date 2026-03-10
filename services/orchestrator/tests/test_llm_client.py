from app.advisory.llm_client import parse_json_response


def test_parse_json_response_strips_markdown_fences() -> None:
    payload = parse_json_response(
        '```json\n{"subject":"Hello","recommended_actions":["one"]}\n```'
    )

    assert payload == {
        "subject": "Hello",
        "recommended_actions": ["one"],
    }


def test_parse_json_response_returns_none_on_invalid_json() -> None:
    assert parse_json_response("not json") is None
