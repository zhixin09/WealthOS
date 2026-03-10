from functools import lru_cache
from pathlib import Path
import re


CORPUS_PATH = Path(__file__).resolve().parents[2] / "data" / "research_corpus"
TOKEN_PATTERN = re.compile(r"[a-z0-9]+")
STOPWORDS = {
    "a",
    "an",
    "and",
    "as",
    "at",
    "be",
    "for",
    "how",
    "in",
    "is",
    "of",
    "or",
    "the",
    "to",
    "what",
    "with",
}


def _tokenize(text: str) -> set[str]:
    return {
        token
        for token in TOKEN_PATTERN.findall(text.lower())
        if token not in STOPWORDS
    }


@lru_cache(maxsize=1)
def load_corpus() -> list[dict[str, str]]:
    documents: list[dict[str, str]] = []

    for path in sorted(CORPUS_PATH.glob("*.md")):
        content = path.read_text(encoding="utf-8").strip()
        paragraphs = [paragraph.strip() for paragraph in content.split("\n\n") if paragraph.strip()]
        body_chunks = paragraphs[1:] if paragraphs and paragraphs[0].startswith("#") else paragraphs

        for index, chunk in enumerate(body_chunks, start=1):
            documents.append(
                {
                    "source": path.name,
                    "citation": f"{path.name}#chunk-{index}",
                    "content": chunk,
                }
            )

    return documents


def search_corpus(query: str, limit: int = 3) -> list[dict[str, str]]:
    query_tokens = _tokenize(query)
    ordered_query_tokens = [
        token
        for token in TOKEN_PATTERN.findall(query.lower())
        if token not in STOPWORDS
    ]
    scored_results: list[tuple[int, dict[str, str]]] = []

    for document in load_corpus():
        content_tokens = _tokenize(document["content"])
        score = len(query_tokens & content_tokens)
        content = document["content"].lower()

        for size, bonus in ((3, 4), (2, 2)):
            for index in range(len(ordered_query_tokens) - size + 1):
                phrase = " ".join(ordered_query_tokens[index : index + size])
                if phrase in content:
                    score += bonus

        if score > 0:
            scored_results.append((score, document))

    scored_results.sort(
        key=lambda item: (
            -item[0],
            item[1]["source"],
            item[1]["citation"],
        )
    )

    return [result for _, result in scored_results[:limit]]
