# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build (output: dist/)
npm run preview      # Preview production build
npm run lint         # TypeScript type checking (tsc --noEmit)
npm run clean        # Remove dist/
```

**Environment:** Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` before running.

## Architecture

Single-page React 19 app with no backend — all state is local (useState/useEffect, no Redux/Zustand). Entry point is `src/main.tsx` → `src/App.tsx`.

**Two source files contain virtually all app logic:**

- `src/App.tsx` — root component owning all shared state (active tab, theme, haptics, notifications, nodes, saved broadcasts). Passes props down to screens.
- `src/components/Screens.tsx` — all screen components: `DiscoverScreen`, `CreateScreen`, `ResearchingScreen`, `ActiveScreen`, `ProfileScreen`, `NodesScreen`, `SettingsScreen`.
- `src/components/UI.tsx` — shared layout components: `TopNav`, `BottomNav`, `StationCard`, `NewsCard`.

**Navigation** is tab-based (Discover / Create / Active / Profile) controlled by `activeTab` state in `App.tsx`. Screen transitions use `AnimatePresence` from `motion/react`.

**AI integration:** `@google/genai` SDK for Gemini. The `GEMINI_API_KEY` is exposed to the frontend via Vite's `define` in `vite.config.ts` as `process.env.GEMINI_API_KEY`.

**Styling:** Tailwind CSS v4 (Vite plugin). Theme colors are CSS variables in `src/index.css`, supporting dark (default) and light modes toggled via a class on `<html>`. Custom utilities like `.glass-panel`, `.text-glow`, `.neon-glow` are defined there.

**No test framework** is configured.
