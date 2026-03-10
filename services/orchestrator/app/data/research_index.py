from functools import lru_cache
from pathlib import Path
from typing import Any
import re

from rank_bm25 import BM25Okapi


CORPUS_PATH = Path(__file__).resolve().parents[2] / "data" / "research_corpus"
TOKEN_PATTERN = re.compile(r"[a-z0-9]+")


def _tokenize(text: str) -> list[str]:
    return TOKEN_PATTERN.findall(text.lower())


def _chunk_markdown(path: Path) -> list[dict[str, str]]:
    content = path.read_text(encoding="utf-8").strip()
    paragraphs = [paragraph.strip() for paragraph in content.split("\n\n") if paragraph.strip()]
    body_chunks = paragraphs[1:] if paragraphs and paragraphs[0].startswith("#") else paragraphs

    return [
        {
            "source": path.name,
            "citation": f"{path.name}#chunk-{index}",
            "content": chunk,
        }
        for index, chunk in enumerate(body_chunks, start=1)
    ]


@lru_cache(maxsize=1)
def _build_index() -> tuple[BM25Okapi, list[dict[str, str]]]:
    documents: list[dict[str, str]] = []
    for path in sorted(CORPUS_PATH.glob("*.md")):
        documents.extend(_chunk_markdown(path))

    tokenized_documents = [_tokenize(document["content"]) for document in documents]
    bm25 = BM25Okapi(tokenized_documents)
    return bm25, documents


def get_available_docs() -> list[dict[str, str]]:
    _, documents = _build_index()
    seen: dict[str, dict[str, str]] = {}

    for document in documents:
        if document["source"] in seen:
            continue

        seen[document["source"]] = {
            "source": document["source"],
            "first_chunk": document["content"][:200],
        }

    return list(seen.values())


def search_research(query: str, top_k: int = 3) -> list[dict[str, Any]]:
    bm25, documents = _build_index()
    scores = bm25.get_scores(_tokenize(query))
    ranked = sorted(zip(scores, documents), key=lambda item: item[0], reverse=True)

    return [
        {**document, "score": round(float(score), 3)}
        for score, document in ranked[:top_k]
        if score > 0
    ]
