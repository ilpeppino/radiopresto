# Screens Ownership Boundaries

This folder contains screen-level UI modules for the tab-based SPA. `App.tsx` remains the single orchestrator for cross-screen app state, while each screen keeps only short-lived local UI state.

## Source of truth

- `src/App.tsx` owns app/session state that is shared across tabs, overlays, or navigation flow.
- Each screen file owns transient UI state that is specific to rendering or interaction inside that screen.
- No global state library and no router are used.

## App-Owned State (Cross-Screen / Flow State)

The following state is owned in `App.tsx` and passed down via props:

- Navigation and overlays:
  - `activeTab`
  - `showSettings`
  - `showNodes`
  - `isResearching`
  - `researchTopic`
- User/session preferences:
  - `theme`
  - `hapticEnabled`
  - `avatarUrl`
- Follow/subscription state:
  - `followedCategories`
  - `followedNodes`
- App collections and persisted-intent data:
  - `nodes`
  - `notifications`
  - `savedBroadcasts`

`App.tsx` also owns mutation handlers passed to screens, for example:

- `onStartResearch`
- `onAddNode`
- `onFollowCategory`
- `onFollowNode`
- `onSave`
- `onReorder`
- `onAvatarChange`

## Screen Boundaries

### `DiscoverScreen`

- App-owned (via props): followed categories/nodes, add-node callback, follow callbacks, open-nodes callback.
- Local-only UI state:
  - `confirmNode` (add-node confirm modal)
  - `searchQuery` (search input value)
  - `showSuggestions` (autocomplete dropdown visibility)
- Ownership rule: discover interactions that impact global app data delegate to App callbacks.

### `CreateScreen`

- App-owned (via props): `onStartResearch`.
- Local-only UI state:
  - `isListening` (speech capture status)
  - `inputValue` (topic input/transcript)
  - `recognitionRef` (speech recognition instance handle)
- Ownership rule: input/capture is local; starting research flow is delegated to App.

### `ResearchingScreen`

- App-owned (via props): `topic`.
- Local-only UI state: none.
- Ownership rule: purely presentational loading/progress screen driven by App flow state.

### `ActiveScreen`

- App-owned (via props): `onSave`, `triggerHaptic`.
- Local-only UI state:
  - `showQueue`
  - `isPlaying`
  - `showClearConfirm`
  - `currentTime`
  - `showShareToast`
  - `queue`
- Ownership rule: current playback simulation and queue UI are local demo mechanics; only save action escapes to App.

### `NodesScreen`

- App-owned (via props): `nodes`, `onReorder`, `onBack`.
- Local-only UI state: none.
- Ownership rule: node collection is global; screen only renders and requests reorder/remove via callback.

### `ProfileScreen`

- App-owned (via props): `savedBroadcasts`, `avatarUrl`, `onAvatarChange`.
- Local-only UI state:
  - `fileInputRef` (hidden file picker handle)
- Ownership rule: profile data is App-owned; file selection interaction is local.

### `SettingsScreen`

- App-owned (via props): `theme`, `onThemeToggle`, `hapticEnabled`, `onHapticToggle`, `onBack`.
- Local-only UI state: none.
- Ownership rule: settings values live in App; this screen is a controlled settings view.

## Extension Guidelines

When adding real backend/audio/auth integrations, keep these rules:

- Put cross-screen or persisted state in `App.tsx` (or a future explicitly introduced shared state layer).
- Keep animation toggles, input drafts, and modal visibility local to the owning screen.
- Prefer explicit prop contracts over implicit coupling.
