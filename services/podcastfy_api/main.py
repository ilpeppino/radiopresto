from __future__ import annotations

import inspect
import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


class SourceItem(BaseModel):
  id: str
  url: str
  title: str
  publisher: str | None = None
  publishedAt: str | None = None
  excerpt: str | None = None


class GenerateRequest(BaseModel):
  topic: str = Field(min_length=1)
  sources: list[SourceItem] = Field(default_factory=list)
  prompt: str = Field(min_length=1)


class GenerateResponse(BaseModel):
  script: str


app = FastAPI(title="Radio Presto Podcastfy API", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
  return {"status": "ok"}


@app.post("/generate", response_model=GenerateResponse)
def generate(payload: GenerateRequest) -> GenerateResponse:
  topic = payload.topic.strip()
  if not topic:
    raise HTTPException(status_code=400, detail="Topic must not be empty.")

  composite_text = build_composite_text(payload.topic, payload.sources, payload.prompt)

  try:
    script = generate_script_with_podcastfy(composite_text, topic)
  except Exception as error:
    raise HTTPException(status_code=500, detail=f"Podcastfy generation failed: {error}") from error

  cleaned = script.strip()
  if not cleaned:
    raise HTTPException(status_code=500, detail="Podcastfy returned an empty script.")

  return GenerateResponse(script=cleaned)


def build_composite_text(topic: str, sources: list[SourceItem], prompt: str) -> str:
  lines = [f"Topic: {topic}", "", "Sources:"]
  if not sources:
    lines.append("- No explicit sources were provided.")
  else:
    for index, source in enumerate(sources, start=1):
      lines.append(f"{index}. {source.title}")
      lines.append(f"   URL: {source.url}")
      if source.publisher:
        lines.append(f"   Publisher: {source.publisher}")
      if source.publishedAt:
        lines.append(f"   Published: {source.publishedAt}")
      if source.excerpt:
        lines.append(f"   Excerpt: {source.excerpt}")

  lines.extend(["", "Generation instructions:", prompt])
  return "\n".join(lines)


def generate_script_with_podcastfy(input_text: str, topic: str) -> str:
  # Runtime import keeps startup errors clear when podcastfy is missing.
  from podcastfy.client import generate_podcast  # type: ignore

  signature = inspect.signature(generate_podcast)
  kwargs: dict[str, Any] = {}

  if "text" in signature.parameters:
    kwargs["text"] = input_text
  elif "urls" in signature.parameters:
    # Fallback path for older variants that do not expose `text`.
    kwargs["urls"] = []
  else:
    raise RuntimeError("Unsupported podcastfy version: no text/urls input parameter found.")

  if "transcript_only" in signature.parameters:
    kwargs["transcript_only"] = True

  output_dir = Path(os.getenv("PODCASTFY_OUTPUT_DIR", "./storage/podcastfy")).resolve()
  output_dir.mkdir(parents=True, exist_ok=True)

  transcript_out = output_dir / f"{safe_slug(topic)}.txt"
  # Some podcastfy versions treat `transcript_file` as an input path.
  # Do not pass it by default to avoid file-not-found failures.
  if os.getenv("PODCASTFY_PASS_TRANSCRIPT_FILE") == "1" and "transcript_file" in signature.parameters:
    kwargs["transcript_file"] = str(transcript_out)

  result = generate_podcast(**kwargs)

  if transcript_out.exists():
    content = transcript_out.read_text(encoding="utf-8").strip()
    if content:
      return content

  if isinstance(result, str):
    result_path = Path(result)
    if result_path.exists():
      content = result_path.read_text(encoding="utf-8", errors="ignore").strip()
      if content:
        return content
    if result.strip():
      return result

  latest = find_latest_transcript(output_dir)
  if latest is not None:
    content = latest.read_text(encoding="utf-8", errors="ignore").strip()
    if content:
      return content

  raise RuntimeError("No transcript returned by podcastfy.")


def find_latest_transcript(base_dir: Path) -> Path | None:
  candidates = [
    file
    for file in base_dir.rglob("*")
    if file.is_file() and file.suffix.lower() in {".txt", ".md"}
  ]
  if not candidates:
    return None
  return max(candidates, key=lambda item: item.stat().st_mtime)


def safe_slug(value: str) -> str:
  cleaned = "".join(ch.lower() if ch.isalnum() else "-" for ch in value).strip("-")
  return cleaned[:80] or "episode"
