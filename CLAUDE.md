# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production build to ./build
npm test           # Run tests in watch mode
npm test -- --testPathPattern=<file>  # Run a single test file
./deploy.sh        # Build and deploy to wanlok.github.io (requires wanlok.github.io repo at sibling path)
```

## Architecture

**Stack:** React 18 + TypeScript, Create React App, MUI v5, Firebase Firestore, react-router-dom v6 (hash router for GitHub Pages compatibility).

**Routing:** `src/configs/routes.tsx` defines all routes. The top-level route renders `LayoutMenu` as the shell with nav icons on the left (desktop) or bottom (mobile). Child routes render into the `<Outlet>`. The `name` field on a route controls whether it appears in the nav.

**Page pattern:** Each feature page lives in `src/pages/<name>/` and follows a consistent split:
- `index.tsx` — presentational component, receives all state/handlers from the hook
- `useXxx.ts` — all state, Firebase reads/writes, and business logic

**Firebase Firestore layout:**
- `configs/kanban` — single document holding all kanban projects and their columns/items
- `configs/folders` — single document holding all collection folders with metadata (attributes, counts, sequences)
- `collections/<folder-id>` — one document per folder containing its items, keyed by content ID, across types: `charts`, `files`, `hyperlinks`, `steam`, `texts`, `youtube_regular`, `youtube_shorts`
- `discussions/<YYYYMMDD>` — one document per day with an array of chat messages; uses `onSnapshot` for real-time updates

**Collection item ordering:** Firestore stores collection items as dicts (`{ [id]: item }`). Display order is maintained separately as a `sequences: string[]` per type inside the folder document. `toList()` in `src/common/ListDictUtils.ts` merges a dict with its sequence array to produce a stable ordered list.

**Shared code:**
- `src/services/Types.ts` — all shared TypeScript types/interfaces and app-wide constants (`serverUrl`, `viewUrls`, `regex`)
- `src/common/` — pure utility functions (date, string, count, file, layout, sorting, etc.)
- `src/services/` — external API integrations (Steam, YouTube oEmbed, Cloudinary image upload, server health check, text/hyperlink/chart parsing)
- `src/components/` — reusable UI components prefixed with `W` (e.g. `WModal`, `WButton`, `WChart`) and layout primitives (`LayoutMenu`, `LayoutPanel`, `LayoutHeader`)

**Environment variables** (Firebase config, set in `.env`):
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
```

**Deployment:** `deploy.sh` builds the app, wipes the `wanlok.github.io` repo directory, copies the build output into it, and pushes. The app uses a hash router (`createHashRouter`) so all routes work as static files on GitHub Pages.
