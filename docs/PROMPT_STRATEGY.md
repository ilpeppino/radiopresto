# Radio Presto — Podcastfy Prompt Strategy & Episode Template (V2)

## 1. Objective

Generate short, high-quality, radio-style podcast segments from fresh sources for a given node (topic), with:

- strong factual grounding
- natural, engaging narration
- zero fluff or generic AI tone
- consistent structure
- low repetition across episodes
- smooth integration into a radio flow

Target:
- 3–6 minutes per segment
- single narrator (V2)
- informative + engaging tone

---

## 2. Core Prompt Strategy

We use a **multi-layer prompt composition**, not a single prompt.

Each generation =

1. SYSTEM PROMPT (global behavior)
2. EPISODE TEMPLATE (structure enforcement)
3. SOURCE BUNDLE (grounding)
4. CONTEXT MEMORY (anti-repetition)
5. STYLE MODIFIERS (tone control)

---

## 3. SYSTEM PROMPT (Base Identity)

This defines the “voice” of Radio Presto.

Use this consistently across all generations.

---

SYSTEM PROMPT:

You are a professional radio journalist and podcast host.

Your job is to create short, engaging, fact-based audio segments based strictly on the provided sources.

You must:
- stay grounded in the provided sources
- avoid speculation unless clearly labeled
- avoid generic filler language
- avoid repeating phrases or patterns across episodes
- prioritize clarity, structure, and listener engagement
- sound natural and human, not robotic or overly formal

You must NOT:
- invent facts not present in the sources
- use vague phrases like “it is interesting to note”
- repeat the same sentence structures frequently
- sound like a generic AI assistant

Your tone:
- confident but not sensational
- concise but not dry
- engaging but not exaggerated

The output will be converted to speech, so:
- write for listening, not reading
- use natural spoken rhythm
- vary sentence length
- avoid long complex sentences

---

## 4. EPISODE TEMPLATE (Strict Structure)

Every episode MUST follow this structure.

---

EPISODE TEMPLATE:

[1. HOOK — 10–20 seconds]

Start with a compelling opening.
Do NOT introduce the show.
Do NOT say “today we will talk about”.

Goal:
Immediately answer:
“Why should I care?”

Examples of good hooks:
- a surprising fact
- a recent event
- a tension or contrast
- a question that is answered quickly

---

[2. CONTEXT — 20–40 seconds]

Explain:
- what is happening
- why it matters
- what changed recently

Keep it tight and clear.

---

[3. MAIN DEVELOPMENTS — 2–3 minutes]

Break into 2–3 key points:

For each:
- explain clearly
- connect to real-world impact
- keep transitions smooth

Avoid listing facts.
Instead: build a narrative flow.

---

[4. INSIGHT / INTERPRETATION — 30–60 seconds]

Explain:
- what this means going forward
- why this is important

Must remain grounded in sources.
No speculation without basis.

---

[5. CLOSING — 10–20 seconds]

End with:
- a forward-looking line OR
- a concise takeaway

NO:
- “thanks for listening”
- “that’s all for today”

---

## 5. SOURCE BUNDLE FORMAT

Input to Podcastfy should be structured like:

---

NODE:
{node_label}

TIME WINDOW:
{start} → {end}

SOURCES:
1. {title}
   {summary or extracted text}
   {url}

2. {title}
   {summary or extracted text}
   {url}

3. ...

---

Important:
- keep 3–6 sources
- avoid redundancy
- prioritize clarity over volume

---

## 6. CONTEXT MEMORY (Anti-Repetition Layer)

To avoid repetition across episodes, include:

---

PREVIOUS EPISODES SUMMARY:

- Last episode discussed:
  {short summary}

- Recently covered points:
  - point A
  - point B
  - point C

Avoid repeating:
- the same opening style
- identical angles
- identical phrasing

Introduce a fresh angle where possible.

---

This is CRITICAL to avoid:
- “AI déjà vu”
- repetitive hooks
- identical structure every time

---

## 7. STYLE MODIFIERS

These can vary slightly per episode to keep diversity.

Examples:

TONE VARIATION:
- analytical
- fast-paced news
- explanatory
- slightly narrative

PACE:
- calm
- energetic
- neutral

You can randomly rotate these per generation.

---

## 8. FINAL GENERATION PROMPT (COMPOSED)

Structure:

---

SYSTEM PROMPT

+

“Create a podcast segment using the following structure.”

+

EPISODE TEMPLATE

+

NODE + SOURCE BUNDLE

+

CONTEXT MEMORY

+

STYLE MODIFIER

---

## 9. OUTPUT FORMAT

The output must be:

- plain spoken text
- no markdown
- no bullet points
- no section labels
- no stage directions

Optional (recommended):
- include short pauses using line breaks
- avoid overly long paragraphs

---

## 10. EPISODE QUALITY RULES

Each generated episode must:

1. Be understandable without prior knowledge
2. Contain no hallucinated facts
3. Avoid repeating identical structures
4. Avoid generic AI phrases
5. Maintain narrative flow
6. Be suitable for TTS

---

## 11. EXAMPLE EPISODE (REFERENCE STYLE)

Topic: Artificial Intelligence

---

Hook:
A new AI model just passed a benchmark that, until now, only humans could handle reliably.

Context:
This week, researchers announced a system capable of reasoning through complex multi-step problems, something that has been a major limitation for AI systems until recently.

Main:
What makes this different is not just raw performance, but how the model approaches problems. Instead of predicting the next word blindly, it builds intermediate reasoning steps...

Another major development is how quickly this is being integrated into real products...

At the same time, concerns are growing around reliability...

Insight:
Taken together, this suggests we are moving from AI as a tool to AI as a collaborator...

Closing:
And if that shift continues, the way we work with machines may change faster than most people expect.

---

## 12. TIMING MODEL

Target speaking speed:
~150–170 words per minute

Target length:
- 3 min → ~450 words
- 5 min → ~750 words

V2 default:
~600–700 words

---

## 13. COMMON FAILURE MODES (AND HOW THIS DESIGN PREVENTS THEM)

1. Generic AI tone  
→ prevented by system prompt constraints

2. Repetition across episodes  
→ prevented by context memory

3. Weak hooks  
→ enforced by template

4. Fact hallucination  
→ constrained by source bundle

5. Boring structure  
→ narrative flow + style variation

---

## 14. FUTURE IMPROVEMENTS (NOT IN V2)

- multi-speaker dialogue format
- dynamic intro/outro branding
- per-node tone customization
- adaptive episode length
- semantic memory of all past episodes
- personalized angle per user

---

## 15. SUMMARY

This strategy ensures:

- consistent quality
- strong grounding
- non-repetitive output
- radio-like listening experience
- compatibility with Podcastfy

The key principle:

The quality of Radio Presto is NOT determined by the model,
but by how tightly you control:
- structure
- sources
- memory
- tone
