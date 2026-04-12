# Radio Presto — Source Ranking Algorithm + Queue Intelligence (V2)

## 1. Purpose

This document defines two core systems for Radio Presto V2:

1. Source Ranking Algorithm
2. Queue Intelligence

These systems determine:
- content quality
- freshness
- perceived intelligence of the app
- whether the experience feels like real radio or a stitched AI demo

---

## 2. Design Principles

### Source Ranking Principles
- prioritize freshness for time-sensitive topics
- prefer substance over clickbait
- ensure diversity of perspectives
- aggressively remove duplicates
- avoid repeating recent angles
- produce compact, high-signal bundles

### Queue Intelligence Principles
- continuous, frictionless playback
- predictable spoken/music alternation
- balanced across nodes
- avoid repetition
- degrade gracefully when content is missing
- feel like a real radio station

---

## 3. Source Ranking Overview

### Input

Source ranking receives:

type SourceRankingInput = {
  userId: string
  node: {
    id: string
    label: string
  }
  now: string
  candidateSources: SourceCandidate[]
  recentEpisodeMemory: EpisodeMemory[]
}

---

## 4. Candidate Source Model

type SourceCandidate = {
  id: string
  url: string
  title: string
  publisher?: string
  publishedAt?: string
  language?: string
  snippet?: string
  extractedText?: string
  sourceType?: "news" | "article" | "blog" | "other"
  fetchSucceeded: boolean
}

---

## 5. Source Ranking Pipeline

### Stage 1 — Retrieval
Fetch 20–40 candidates per node.

---

### Stage 2 — Normalization
- canonicalize URLs
- clean titles
- normalize publishers
- parse timestamps
- extract readable content
- detect language

---

### Stage 3 — Hard Filtering

Reject sources if:
- fetch failed
- content too short
- malformed structure
- wrong language
- exact duplicate
- outside freshness window
- clearly off-topic

---

### Stage 4 — Deduplication

Remove:
- exact duplicates
- near duplicates (same text/title)
- event duplicates (same story across sources)

Keep only the best representative per cluster.

---

### Stage 5 — Feature Scoring

Each source is scored across:

- relevance
- freshness
- substance
- clarity
- novelty
- diversity contribution
- trust weight

---

## 6. Scoring Model

type SourceScoreBreakdown = {
  relevance: number
  freshness: number
  substance: number
  clarity: number
  novelty: number
  diversityContribution: number
  trustWeight: number
  finalScore: number
}

### Weighted Formula

finalScore =
  relevance * 0.30 +
  freshness * 0.20 +
  substance * 0.18 +
  clarity * 0.12 +
  novelty * 0.10 +
  diversityContribution * 0.05 +
  trustWeight * 0.05

---

## 7. Scoring Definitions

Relevance:
- semantic match with node label

Freshness:
- recency decay (recent = higher)

Substance:
- depth and amount of useful content

Clarity:
- ease of summarization

Novelty:
- difference from recent episodes

Diversity:
- adds new perspective

Trust:
- internal weighting of source quality

---

## 8. Bundle Selection

Goal: select 3–6 sources (ideal = 4)

Rules:
1. sort by score
2. pick best anchor source
3. add sources only if they add new value
4. avoid duplication of angle
5. stop when marginal value drops

---

## 9. Bundle Composition

Ideal structure:
1. anchor source
2. supporting source
3. context-expanding source
4. contrasting or forward-looking source

---

## 10. Episode Memory

type EpisodeMemory = {
  episodeId: string
  nodeId: string
  generatedAt: string
  sourceUrls: string[]
  angleSummary: string
  keywords: string[]
}

Usage:
- penalize reused sources
- penalize repeated angles
- encourage new perspectives

---

## 11. Fallback Strategy

If insufficient quality sources:

1. widen freshness window
2. accept slightly lower scores
3. skip generation

Important rule:
Better to skip than generate low-quality content

---

## 12. Queue Intelligence Overview

Goal:
Create a continuous, radio-like listening experience.

---

## 13. Queue Input

type QueueBuilderInput = {
  userId: string
  followedNodes: Node[]
  readySegments: Segment[]
  recentPlaybackHistory: PlaybackHistoryItem[]
  musicProviderState?: MusicProviderState
  activeSessionId: string
}

---

## 14. Queue Output

type QueuePlan = {
  sessionId: string
  generatedAt: string
  items: QueueItem[]
}

---

## 15. Sequencing Rule

Base pattern:

1. spoken segment
2. music track
3. spoken segment
4. music track

---

## 16. Queue Buffer

Maintain:
- 6–10 items ahead
- typically:
  - 3 spoken
  - 3 music

---

## 17. Spoken Segment Selection

Score each segment:

queueSegmentScore =
  freshnessWeight * 0.35 +
  nodeRotationWeight * 0.25 +
  noveltyWeight * 0.20 +
  sessionFitWeight * 0.10 +
  replayPenaltyAdjustedWeight * 0.10

---

## 18. Segment Selection Rules

Choose segments that:
- are fresh
- come from different nodes
- avoid repetition
- fit session flow

Hard rules:
- no replay in same session
- no stale content
- no near-duplicate segments

---

## 19. Node Rotation

Use weighted round-robin:
- rotate across nodes
- skip nodes without fresh content
- avoid dominance of one node

---

## 20. Music Selection

Music is playback-only.

Modes:
- continue provider queue
- use playlist
- use recommendation seed

Rules:
- no immediate repetition
- must be playable
- maintain continuity

---

## 21. Music Memory

type MusicPlaybackMemory = {
  trackId: string
  playedAt: string
  sessionId: string
}

Rules:
- avoid replaying recent tracks

---

## 22. Queue Building Algorithm

Steps:

1. load nodes
2. load ready segments
3. filter invalid segments
4. score segments
5. build rotation
6. interleave music
7. validate sequence
8. output queue

---

## 23. Queue Replenishment

Trigger when:
- buffer too small
- item finishes
- failure occurs
- new segments available
- nodes change

---

## 24. Rebuild Strategy

Incremental:
- fill missing slots

Full rebuild:
- node changes
- stale queue
- repeated failures

---

## 25. Failure Handling

Spoken failure:
- skip
- continue playback
- trigger refill

Music failure:
- fallback track
- or skip to next segment

---

## 26. Session Balancing

Rule:
- avoid same node too often

Example:
max 2 appearances per node within 4 segments

---

## 27. Topic Clustering Control

Avoid:
- same angle twice in a row
- overly similar segments

---

## 28. Recommended Heuristics

Source:
- 20–40 candidates
- 4-source bundle
- aggressive deduplication

Queue:
- strict alternation
- 6–10 buffer items
- no repetition

---

## 29. Source Ranking Pseudocode

function buildSourceBundle(node, candidates, memory) {
  const normalized = normalizeCandidates(candidates)
  const filtered = normalized.filter(passHardFilters)
  const deduped = deduplicate(filtered)

  const scored = deduped.map(source => ({
    source,
    score: computeSourceScore(source, node, memory)
  }))

  const ranked = scored.sort((a, b) => b.score.finalScore - a.score.finalScore)

  return selectBundleSet(ranked, {
    targetSize: 4,
    requireDiversity: true,
    avoidRecentAngles: true
  })
}

---

## 30. Queue Builder Pseudocode

function buildQueue(user, nodes, readySegments, providerState, playbackHistory) {
  const spokenCandidates = readySegments
    .filter(segment => isPlayableSegment(segment, playbackHistory))
    .map(segment => ({
      segment,
      score: computeQueueSegmentScore(segment, playbackHistory, nodes)
    }))
    .sort((a, b) => b.score - a.score)

  const spokenPlan = weightedRoundRobin(spokenCandidates, {
    maxPerNodeWindow: 2,
    avoidImmediateNodeRepeat: true
  })

  const items = []

  for (const spoken of spokenPlan.slice(0, 3)) {
    items.push(makeSegmentQueueItem(spoken.segment))

    const music = selectNextMusicItem(providerState, playbackHistory)
    if (music) {
      items.push(makeMusicQueueItem(music))
    }
  }

  return {
    sessionId: user.activeSessionId,
    generatedAt: new Date().toISOString(),
    items
  }
}

---

## 31. Frontend Implications

Active screen:
- show spoken vs music
- show node label
- show queue
- show sources

Discover/Create:
- manage nodes
- show freshness

Profile:
- saved segments
- history

---

## 32. Final Principle

Radio Presto must not feel like random AI audio stitched together.

It must feel like:
a coherent, evolving, personalized radio station that continuously delivers fresh, relevant, and engaging content.
