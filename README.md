# Radio Presto

A minimal full-stack V1 of Radio Presto. Users can enter one topic, generate one episode from fresh sources, and play the generated audio.

**Status: vertical slice (Create → Researching → Active) implemented.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 6 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Animation | motion/react (Framer Motion fork) 12 |
| Icons | lucide-react |
| AI SDK | @google/genai (installed, not used) |

---

## Installation

**Prerequisites:** Node.js

```bash
npm install
```

Copy `.env.example` to `.env.local` and set your Gemini API key (not currently used by any code):

```bash
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY
```

---

## Running Locally

```bash
npm run dev:api    # backend API on http://localhost:3001
npm run dev        # frontend on http://localhost:3000
npm run build      # production build → dist/
npm run lint       # TypeScript type checking
```

## Optional: Local Podcastfy Service

If you want backend script generation to use Podcastfy instead of Gemini fallback:

```bash
cd services/podcastfy_api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cd /Volumes/DevSSD/projects/radiopresto
npm run dev:podcastfy
```

Set in `.env.local`:

```env
PODCASTFY_ENDPOINT_URL="http://localhost:8000/generate"
```

Then restart `npm run dev:api`.

---

## Project Structure

```
src/
  main.tsx              # React entry point
  App.tsx               # Root component — owns all shared state
  index.css             # Tailwind imports + CSS custom properties (theme colors)
  components/
    UI.tsx              # TopNav, BottomNav, StationCard, NewsCard
    Screens.tsx         # All screen components
```

All app logic lives in three files. There is no routing library; navigation is controlled by `activeTab` state in `App.tsx`.

---

## Implemented Features

- **Tab navigation** — Discover, Create, Active, Profile tabs via bottom nav
- **Theme toggle** — dark/light mode, applied via CSS custom properties on `<body>`
- **Haptic feedback toggle** — calls `navigator.vibrate(10)` when enabled
- **Follow system** — follow/unfollow stations (nodes) and news categories; state persisted in `App.tsx`
- **Simulated notifications** — random notifications generated every ~20s; notification dropdown with "Manage Follow" action
- **Search with autocomplete** — client-side filter against 12 hardcoded topic strings in `DiscoverScreen`
- **Add node via category click** — confirmation modal that appends a new node to the node list
- **Node management** — drag-to-reorder and delete nodes (`NodesScreen`, uses `motion/react` Reorder)
- **Create screen** — text input + Web Speech API voice input; submitting triggers the research simulation
- **Research simulation** — 3-second `setTimeout`, then redirects to Active tab; no real API call
- **Active screen playback UI** — play/pause, skip ±15s, skip next/prev, progress bar with drag; timer ticks via `setInterval`
- **Queue management** — drag-to-reorder, remove, clear with confirmation modal (hardcoded initial queue)
- **Save broadcast** — adds the current hardcoded title to a `savedBroadcasts` array in `App.tsx`
- **Profile** — displays saved broadcasts; avatar changeable via file upload (FileReader → base64); stats and history are hardcoded
- **Settings** — theme and haptic toggles work; auth and music service buttons are non-functional

---

## Known Limitations and Gaps

- **No audio playback.** No `<audio>` element exists. Progress bar and controls are pure UI simulation.
- **No AI integration.** `@google/genai` is installed and `GEMINI_API_KEY` is exposed via `vite.config.ts`, but is never imported or called. The "research" step is a hardcoded 3-second timeout.
- **No backend.** `express` and `dotenv` are in `package.json` dependencies but no server file exists.
- **All broadcast content is hardcoded.** Now-playing track, artwork, queue, and profile stats are static values in component code.
- **No real sharing.** The Share button shows a toast saying "Link Copied to Clipboard" but does not call `navigator.clipboard`.
- **No authentication.** Sign-in and music service buttons are decorative.
- **No persistence.** All state resets on page refresh.
- **No error handling** anywhere in the codebase.
- **No tests.** No test framework is configured.

---

## Recommended Next Steps

1. Implement Gemini API calls in the Create flow to generate real broadcast content
2. Integrate Web Audio API or an `<audio>` element for actual playback
3. Add a backend (the `express` package is already installed) to handle persistence and auth
4. Replace hardcoded broadcast data with dynamic content from an API
5. Lift `triggerHaptic` into a React context to eliminate duplication across components
