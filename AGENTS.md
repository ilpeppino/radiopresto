# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React 19 + TypeScript frontend prototype.

- `src/main.tsx`: app bootstrap.
- `src/App.tsx`: root state container and screen orchestration.
- `src/components/UI.tsx`: reusable UI primitives (nav/cards).
- `src/components/Screens.tsx`: screen-level components and flows.
- `src/index.css`: Tailwind v4 theme variables and custom utilities.
- `index.html`: Vite entry HTML.
- `.env.example`: environment variable template.

Keep new UI code in `src/components/` and avoid adding new top-level app state outside `App.tsx` unless you are intentionally refactoring state ownership.

## Build, Test, and Development Commands
Run from repository root:

- `npm run dev`: start local dev server on `http://localhost:3000`.
- `npm run build`: create production bundle in `dist/`.
- `npm run preview`: preview the production build locally.
- `npm run lint`: TypeScript type-check (`tsc --noEmit`).
- `npm run clean`: remove `dist/`.

## Coding Style & Naming Conventions
- Language: TypeScript + TSX, React function components.
- Indentation: 2 spaces; prefer semicolons and double quotes in component files to match existing code.
- Components/types: `PascalCase` (e.g., `DiscoverScreen`, `Tab`).
- Variables/functions: `camelCase` (e.g., `triggerHaptic`, `handleStartResearch`).
- Keep props explicit and typed; avoid `any` unless unavoidable.
- Use the `@` alias (configured in `vite.config.ts`) for root-based imports when it improves clarity.

## Testing Guidelines
No test framework is configured yet. Treat the minimum quality gate as:

1. `npm run lint`
2. `npm run build`

If you add tests, place them next to source files as `*.test.ts` / `*.test.tsx` and document the runner command in `package.json` and `README.md`.

## Commit & Pull Request Guidelines
Current history uses short, imperative commit subjects (e.g., `Initial commit`, workflow additions). Follow:

- Commit message: concise imperative summary, <=72 chars.
- Keep commits focused (one concern per commit).
- PRs should include: purpose, key UI/behavior changes, verification steps run, and screenshots/GIFs for UI updates.
- Link related issues and call out follow-up work explicitly.

## Security & Configuration Tips
Do not commit secrets. Copy `.env.example` to `.env.local` for local values. `vite.config.ts` injects `GEMINI_API_KEY` into the client build, so treat it as non-secret unless architecture changes.
