# Radio Presto — V2 Product Architecture

## 1. Purpose

Radio Presto is an AI-powered audio app that creates a personalized radio-like listening experience.

Users follow **nodes**, where each node is currently a simple **topic label** such as:
- AI
- Climate
- Space
- Finance
- Football

For each node, the system periodically gathers fresh public information from online sources, prepares a source package, and uses **Podcastfy** to generate a podcast-style audio segment.

The playback experience alternates between:
1. **AI-generated spoken podcast segments**
2. **music playback** from the user’s connected provider such as Spotify or Apple Music

In V2:
- nodes remain **topic labels only**
- **Podcastfy** is the podcast generation engine
- music is used **only for playback**
- the app remains centered on a **radio experience**, not a traditional podcast library

---

## 2. Product goals

### Primary goal
Deliver a continuous, personalized audio stream where users hear short, fresh spoken updates on their chosen topics, with music in between.

### Secondary goals
- make listening passive and habitual
- keep segments fresh and relevant
- make the stream feel curated rather than random
- preserve trust by grounding each segment in real sources
- allow the user to control playback without micromanaging content generation

### Non-goals for V2
- full user-defined source configuration
- user-created longform podcast series
- live conversational AI
- music recommendation intelligence
- deep editorial customization per node
- user-uploaded document ingestion
- social or collaborative listening

---

## 3. Core product model

### 3.1 Node
A node is a **topic label** selected by the user.

Example:
- `"Artificial Intelligence"`
- `"European Politics"`
- `"Formula 1"`

V2 definition:

```ts
type Node = {
  id: string
  label: string
  isActive: boolean
  createdAt: string
}

A node does not yet contain:
	•	source preferences
	•	region preferences
	•	language preferences
	•	generation rules
	•	schedule rules
	•	weighting

Those can be introduced later as V3/V4 enhancements.

⸻

3.2 Segment

A segment is a generated spoken audio item for one node.

type Segment = {
  id: string
  nodeId: string
  title: string
  summary: string
  audioUrl: string
  durationSeconds: number
  generatedAt: string
  status: "queued" | "ready" | "playing" | "played" | "failed"
  sourceBundleId: string
}


⸻

3.3 Music item

A music item is a playback-only item inserted between segments.

type MusicItem = {
  id: string
  provider: "spotify" | "apple_music"
  providerTrackId: string
  title: string
  artist: string
  artworkUrl?: string
  durationSeconds?: number
  status: "queued" | "playing" | "played" | "failed"
}


⸻

3.4 Queue item

The playback queue contains both podcast segments and music items.

type QueueItem =
  | {
      id: string
      kind: "segment"
      refId: string
      status: "queued" | "playing" | "played" | "failed" | "skipped"
    }
  | {
      id: string
      kind: "music"
      refId: string
      status: "queued" | "playing" | "played" | "failed" | "skipped"
    }


⸻

4. Product experience

4.1 Main user flow
	1.	User opens the app
	2.	User follows one or more nodes
	3.	Backend generates fresh segments for those nodes using Podcastfy
	4.	The app builds a listening queue
	5.	Playback starts with a spoken segment or music item
	6.	When a spoken segment ends, a music item is played
	7.	When the music ends, the next spoken segment plays
	8.	The cycle continues like a radio channel

⸻

4.2 Listening model

The stream should feel like:
	•	a personal radio station
	•	topic-driven
	•	light-touch and passive
	•	always moving forward

It should not feel like:
	•	a static playlist of MP3 files
	•	a one-off podcast export tool
	•	a search-and-play interface only

⸻

4.3 Session modes

Lean-back mode

Default mode. The app manages the queue automatically.

Directed mode

The user taps a specific node and starts a focused listening session for that topic.

V2 should prioritize lean-back mode.

⸻

5. High-level architecture

The system is divided into five major layers:
	1.	Client application
	2.	Backend API
	3.	Content ingestion pipeline
	4.	Podcast generation pipeline
	5.	Playback orchestration layer

⸻

6. Client architecture

6.1 Responsibilities

The frontend should handle:
	•	user navigation
	•	node selection and management
	•	playback controls
	•	queue display
	•	source display
	•	authentication for music providers
	•	rendering playback state
	•	local preferences such as theme and haptics

The frontend should not handle:
	•	crawling or ranking sources
	•	generating scripts
	•	running Podcastfy jobs
	•	storing generation artifacts
	•	orchestrating queue generation logic beyond the current listening session state

⸻

6.2 Primary frontend screens

Discover
	•	browse nodes
	•	follow or unfollow nodes
	•	search topics
	•	see suggested trending nodes

Create
	•	add a new topic label as a node
	•	optionally start a new listening session from that topic

Researching / Generating
	•	show generation/loading state
	•	display progress while backend prepares content

Active
	•	show current playback item
	•	display whether the current item is spoken content or music
	•	support play/pause/skip
	•	show queue timeline
	•	surface sources for spoken segments

Profile
	•	saved segments
	•	listening history
	•	connected music services

Settings
	•	theme
	•	haptics
	•	provider connection settings
	•	privacy options

⸻

7. Backend architecture

7.1 Why a backend is required

A backend is required because the product needs a trusted orchestration layer for:
	•	node management
	•	source fetching
	•	source normalization
	•	source deduplication
	•	Podcastfy job execution
	•	audio storage
	•	metadata persistence
	•	queue creation
	•	playback sequencing rules
	•	provider token management for Spotify or Apple Music

A purely frontend-only approach is not suitable.

⸻

7.2 Backend services

A. API service

Handles:
	•	app data APIs
	•	node CRUD
	•	queue retrieval
	•	playback session state
	•	user profile data
	•	saved items
	•	music provider auth token handling

B. Source ingestion service

Handles:
	•	fetching fresh web content relevant to a node
	•	normalizing source metadata
	•	deduplicating near-identical articles
	•	selecting source bundles for generation

C. Podcast generation service

Handles:
	•	preparing Podcastfy input
	•	launching generation jobs
	•	receiving generation results
	•	storing metadata and audio references

D. Queue orchestration service

Handles:
	•	building radio-style playback queues
	•	alternating spoken segments and music items
	•	replenishing the queue as playback progresses

E. Media storage layer

Stores:
	•	generated audio files
	•	transcript files
	•	source bundle JSON
	•	optional cover images or waveform assets

⸻

8. Content ingestion pipeline

8.1 Purpose

Turn a simple topic label into a clean source package that can be passed to Podcastfy.

⸻

8.2 Inputs

Input is only:
	•	node label
	•	current time
	•	user language
	•	generation window rules

Example:
	•	node = "AI"
	•	time = now
	•	language = English
	•	recency window = last 24–72 hours

⸻

8.3 Stages

Stage 1 — Query generation

The system derives one or more search phrases from the node label.

Example for node "AI":
	•	latest AI news
	•	artificial intelligence recent developments
	•	major AI announcements today
	•	AI regulation and product updates

⸻

Stage 2 — Source retrieval

The system fetches candidate items from:
	•	news sites
	•	articles
	•	blogs
	•	other web sources allowed by product policy

V2 should keep source types constrained and predictable.

⸻

Stage 3 — Normalization

Each candidate source is normalized into a consistent record.

type SourceItem = {
  id: string
  url: string
  title: string
  publisher?: string
  publishedAt?: string
  excerpt?: string
  contentText?: string
  language?: string
}


⸻

Stage 4 — Deduplication

Remove sources that are:
	•	duplicates
	•	syndicated copies
	•	near-identical rewrites
	•	obviously low-value summaries of the same event

⸻

Stage 5 — Selection

Select a bounded number of sources for the generation bundle.

Example:
	•	3 to 6 strong sources per segment

The bundle should balance:
	•	freshness
	•	diversity
	•	clarity
	•	enough substance for an engaging script

⸻

Stage 6 — Packaging

Create a source bundle that is stored and passed into the generation pipeline.

type SourceBundle = {
  id: string
  nodeId: string
  createdAt: string
  sources: SourceItem[]
  windowStart: string
  windowEnd: string
}


⸻

9. Podcast generation pipeline

9.1 Purpose

Generate a short spoken podcast segment for a node using Podcastfy.

⸻

9.2 Inputs to Podcastfy

Podcastfy should receive:
	•	node label
	•	source bundle text/content
	•	target tone
	•	target duration
	•	language
	•	output format preferences

⸻

9.3 Output artifacts

Each generation job should produce:
	•	audio file
	•	transcript
	•	summary
	•	title
	•	duration
	•	generation metadata

Optional:
	•	chapter markers
	•	cover art
	•	short source attributions

⸻

9.4 Generation job lifecycle

type GenerationJob = {
  id: string
  nodeId: string
  sourceBundleId: string
  status: "pending" | "running" | "completed" | "failed"
  createdAt: string
  completedAt?: string
  errorMessage?: string
}

Steps
	1.	Queue generation job
	2.	Load source bundle
	3.	Transform bundle into Podcastfy input
	4.	Run Podcastfy
	5.	Validate generated artifacts
	6.	Store audio/transcript/metadata
	7.	Mark segment ready for playback

⸻

9.5 Segment duration strategy

V2 should standardize segment length.

Recommended default:
	•	short segment: 3 to 6 minutes

Reason:
	•	feels radio-like
	•	easier to alternate with music
	•	lower generation cost and latency
	•	reduces repetitive output

Longer segments can be a future option.

⸻

10. Playback orchestration

10.1 Goal

Create a continuous queue that alternates spoken content and music.

⸻

10.2 Core sequencing rule

Default sequence:
	1.	spoken segment
	2.	one music track
	3.	spoken segment
	4.	one music track
	5.	spoken segment
	6.	one music track

This can later evolve, but V2 should keep the rule simple and predictable.

⸻

10.3 Queue builder logic

Given:
	•	user’s active nodes
	•	ready segments
	•	connected music provider
	•	current session context

The queue service should:
	1.	choose the next spoken segment
	2.	choose the next music item
	3.	alternate them
	4.	keep a minimum queue buffer
	5.	replenish the queue in the background

⸻

10.4 Segment selection rules

V2 segment selection should aim for:
	•	freshness
	•	no immediate repetition of the same node
	•	balanced exposure across active nodes
	•	avoidance of replaying the exact same segment too soon

Simple rule example:
	•	rotate across followed nodes in round-robin order
	•	if a node has no fresh segment, skip it temporarily

⸻

10.5 Music selection rules

Music is playback-only.

V2 should support one of these modes:
	•	provider-based user queue continuation
	•	provider recommendations seeded from user context
	•	user-selected playlist/radio source

The product should not generate music intelligence itself in V2.

⸻

10.6 Transition handling

Transitions between spoken content and music should feel smooth.

V2 transition requirements:
	•	detect spoken segment end
	•	enqueue next music item immediately
	•	after music end, trigger next spoken item
	•	preserve playback continuity as much as platform limitations allow

Optional enhancements later:
	•	transition jingles
	•	spoken intros for tracks
	•	branded station IDs

⸻

11. Data model

11.1 User

type User = {
  id: string
  displayName?: string
  avatarUrl?: string
  createdAt: string
}


⸻

11.2 Node subscription

type UserNode = {
  id: string
  userId: string
  nodeId: string
  isFollowed: boolean
  createdAt: string
}


⸻

11.3 Listening session

type ListeningSession = {
  id: string
  userId: string
  startedAt: string
  endedAt?: string
  status: "active" | "ended"
}


⸻

11.4 Playback event

type PlaybackEvent = {
  id: string
  sessionId: string
  queueItemId: string
  kind: "start" | "pause" | "resume" | "finish" | "skip" | "fail"
  createdAt: string
}


⸻

11.5 Saved segment

type SavedSegment = {
  id: string
  userId: string
  segmentId: string
  savedAt: string
}


⸻

12. API surface

12.1 Node APIs
	•	GET /nodes
	•	POST /nodes
	•	DELETE /nodes/:id
	•	POST /nodes/:id/follow
	•	POST /nodes/:id/unfollow

⸻

12.2 Segment APIs
	•	GET /segments
	•	GET /segments/:id
	•	GET /segments/:id/sources
	•	POST /segments/:id/save

⸻

12.3 Queue APIs
	•	GET /queue/current
	•	POST /queue/rebuild
	•	POST /queue/skip
	•	POST /queue/event

⸻

12.4 Generation APIs
	•	POST /generation/jobs
	•	GET /generation/jobs/:id

⸻

12.5 Provider APIs
	•	POST /providers/spotify/connect
	•	POST /providers/apple-music/connect
	•	GET /providers/status

⸻

13. Storage architecture

13.1 Relational database

Use relational storage for:
	•	users
	•	nodes
	•	user-node follows
	•	segments
	•	generation jobs
	•	queue items
	•	playback events
	•	provider connections
	•	saved segments

Good fit:
	•	PostgreSQL

⸻

13.2 Object storage

Use object storage for:
	•	generated audio files
	•	transcripts
	•	source bundle snapshots
	•	optional artwork or waveform assets

Good fit:
	•	S3-compatible storage

⸻

14. Background jobs

The system requires background workers for:

Generation jobs
	•	poll for nodes needing fresh content
	•	build source bundles
	•	launch Podcastfy jobs
	•	store results

Queue maintenance jobs
	•	ensure ready segments exist
	•	keep user queues warm
	•	recover from failed items

Cleanup jobs
	•	remove stale temporary artifacts
	•	archive or prune old source bundles
	•	delete failed or incomplete intermediate files

⸻

15. Quality and trust controls

15.1 Source grounding

Every spoken segment should retain a structured reference to the sources used.

The Active screen should allow the user to inspect:
	•	article title
	•	publisher
	•	URL
	•	publication time

⸻

15.2 Freshness rules

V2 should define freshness windows.

Example:
	•	general news-like nodes: last 24–72 hours
	•	broader knowledge nodes: last 7 days

⸻

15.3 Repetition controls

The system should avoid:
	•	replaying the same segment too often
	•	generating nearly identical segments from the same source set
	•	overusing the same node in short sessions

⸻

15.4 Failure handling

If generation fails:
	•	mark the job failed
	•	skip the failed segment
	•	allow the queue to continue with music or another ready segment

The radio experience should degrade gracefully.

⸻

16. Frontend integration changes for the current prototype

16.1 Discover screen

Evolve from static stations/news cards to:
	•	user-followed nodes
	•	suggested topics
	•	possibly current freshness indicators

⸻

16.2 Create screen

Evolve from generic search input to:
	•	add-topic flow
	•	optional “generate now” action for a node
	•	optional preview of what kind of segment will be created

⸻

16.3 Researching screen

Connect to real backend generation status:
	•	source collection
	•	source packaging
	•	podcast generation
	•	audio ready

⸻

16.4 Active screen

This becomes the most important product screen.

It should represent:
	•	current queue item type: spoken or music
	•	current node label for spoken segments
	•	segment title
	•	source access
	•	next-up queue
	•	save/skip behavior
	•	real playback progress

⸻

16.5 Profile screen

Can later show:
	•	saved segments
	•	followed nodes
	•	recent listening history
	•	connected providers

⸻

16.6 Settings screen

Should manage:
	•	theme
	•	haptics
	•	provider connection status
	•	autoplay and playback preferences where supported

⸻

17. Suggested technical stack

17.1 Frontend
	•	React
	•	TypeScript
	•	existing motion and Tailwind setup
	•	real audio playback handling
	•	provider SDK integration where needed

⸻

17.2 Backend
	•	Node.js
	•	TypeScript
	•	REST APIs
	•	job worker process
	•	PostgreSQL
	•	object storage

⸻

17.3 Generation layer
	•	Podcastfy running in a Python-based worker or isolated generation service

Reason:
	•	keep Python-specific generation concerns separated from the main API server
	•	allow asynchronous job handling
	•	isolate heavy generation dependencies

⸻

18. Recommended deployment shape

Service 1 — Web client

Hosts the frontend app

Service 2 — API server

Handles app APIs and orchestration

Service 3 — Worker

Runs source ingestion and Podcastfy jobs

Service 4 — Database

Stores metadata

Service 5 — Object storage

Stores generated media and artifacts

This separation makes the system easier to evolve.

⸻

19. MVP cut line inside V2

The architecture should support more, but the first build should include only:
	1.	topic-label nodes
	2.	basic node follow/unfollow
	3.	backend source ingestion
	4.	Podcastfy-based spoken segment generation
	5.	object storage for audio
	6.	a real queue of spoken segments plus music placeholders or provider tracks
	7.	Active screen with real playback
	8.	source inspection for spoken segments
	9.	simple queue alternation rule:
	•	segment
	•	music
	•	segment
	•	music

Do not expand scope too early.

⸻

20. Future evolution path

Possible V3+ enhancements:
	•	node-level source preferences
	•	region/language preferences per node
	•	user-defined generation cadence
	•	multiple segment styles
	•	morning briefing mode
	•	fully personalized station schedules
	•	voice personalities
	•	station branding and jingles
	•	smart repetition avoidance using semantic history
	•	richer music rules and cross-provider handling

⸻

21. Key architectural decisions

Decided
	•	node = topic label only
	•	Podcastfy = podcast generation engine
	•	music = playback only
	•	backend required
	•	radio-style alternating queue is core product behavior

Not decided yet
	•	exact source providers
	•	exact search/indexing strategy
	•	exact music provider UX
	•	exact autoplay behavior per platform
	•	exact authentication model
	•	exact transcript/source presentation style

⸻

22. Architecture summary

Radio Presto V2 should be built as a backend-orchestrated audio platform where simple user-selected topic labels are transformed into source-grounded, Podcastfy-generated spoken segments, stored as audio artifacts, and inserted into a radio-style playback queue that alternates spoken content with provider-based music playback.

The frontend should focus on:
	•	node management
	•	listening experience
	•	queue visibility
	•	source transparency
	•	provider connection UX

The backend should own:
	•	ingestion
	•	generation
	•	storage
	•	queue orchestration
	•	playback sequencing logic

This is the simplest architecture that remains aligned with the product vision while staying realistic and extensible.

