# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at http://localhost:5173
npm run build      # Production build to ./dist
./deploy.sh        # Build and deploy to wanlok.github.io (requires wanlok.github.io repo at sibling path)
```

## Architecture

**Stack:** React 19 + TypeScript, Vite, MUI v9, Firebase Firestore, react-router-dom v6 (hash router for GitHub Pages compatibility).

**Routing:** `src/configs/routes.tsx` defines all routes. The top-level route renders `LayoutMenu` as the shell with nav icons on the left (desktop) or bottom (mobile). Child routes render into the `<Outlet>`. The `name` field on a route controls whether it appears in the nav.

**Page pattern:** Each feature page lives in `src/pages/<name>/` and follows a consistent split:
- `index.tsx` — presentational component, receives all state/handlers from the hook
- `useXxx.ts` — all state, Firebase reads/writes, and business logic

**Panel page structure:** Pages with a left/right panel layout (collection, kanban) further split into four components:
- `LeftHeader.tsx` / `RightHeader.tsx` — header bars for each side, rendered via `LayoutHeader`
- `LeftContent.tsx` / `RightContent.tsx` — scrollable content for each side

**Firebase Firestore layout:**
- `configs/kanban` — single document holding all kanban projects and their columns/items
- `configs/folders` — single document holding all collection folders with metadata (attributes, counts, sequences)
- `collections/<folder-id>` — one document per folder containing its items, keyed by content ID, across types: `charts`, `files`, `hyperlinks`, `steam`, `youtubeRegular`, `youtubeShorts`
- `discussions/<YYYYMMDD>` — one document per day with an array of chat messages; uses `onSnapshot` for real-time updates

**Collection item ordering:** Firestore stores collection items as dicts (`{ [id]: item }`). Display order is maintained separately as a `sequences: string[]` per type inside the folder document. `toList()` in `src/utils/ListDictUtils.ts` merges a dict with its sequence array to produce a stable ordered list.

**Shared code:**
- `src/services/Types.ts` — all shared TypeScript types/interfaces and app-wide constants (`serverUrl`, `viewUrls`, `regex`)
- `src/utils/` — pure utility functions (date, string, count, file, layout, sorting, etc.)
- `src/services/` — external API integrations (YouTube oEmbed, Cloudinary image upload, server health check, hyperlink/chart parsing)
- `src/components/` — reusable UI components prefixed with `W` (e.g. `WModal`, `WButton`, `WChart`) and layout primitives (`LayoutMenu`, `LayoutPanel`, `LayoutHeader`, `PanelRow`, `DropdownIcon`)

**Icons:** Use MUI icons from `@mui/icons-material` — no PNG icon imports. `WButton` accepts `leftIcon` and `rightIcon` props (pass a MUI icon element). Use the exported `iconButtonSx` constant from `WButtonSx.ts` for icon-only square buttons.

**LayoutHeader:** Exports `topSx` (`height: 45`) and `bottomSx` (`height: 55`) for consistent header row styling. Hidden on mobile — do not put mobile-critical controls inside it.

**PanelRow:** Shared component for panel list items — takes `icon` (MUI icon element), `title` (string), and optional `children` for secondary content below the title.

**Environment variables** (Firebase config, set in `.env.local`):
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

**Deployment:** `deploy.sh` builds the app, wipes the `wanlok.github.io` repo directory, copies the build output into it, and pushes. The app uses a hash router (`createHashRouter`) so all routes work as static files on GitHub Pages.

## Conventions

**Guard clauses:** Always use multi-line braces for early returns. Example: `if (!x) { return; }` on separate lines, not `if (!x) return;` on one line.

**Handler naming:** Local handler functions must match the prop name they are passed to. Example: `onCreateButtonClick={onCreateButtonClick}`, not `onCreateButtonClick={openCreateModal}`.

**Variable naming:** Use full descriptive names, not abbreviations. Example: `column` not `col`, `project` not `p`. Exception: use single-letter counters (`i`, `j`, `k`) for index variables in map/filter callbacks, not prefixed variants like `ci` or `ii`.

**React imports:** Never reference the bare `React.` namespace (e.g. `React.ReactNode`, `React.MouseEvent`, `React.StrictMode`). Import the specific type or export by name from `"react"` instead. If a React-exported name would collide with an unrelated global of the same name already used in the file (e.g. the DOM's native `MouseEvent`/`TouchEvent`, used in a raw `addEventListener` callback), import React's version under an alias (e.g. `MouseEvent as ReactMouseEvent`) rather than reintroducing the bare `React.` prefix.

**Firebase writes:** Only call Firebase (e.g. `updateDoc`, `setDoc`) on explicit user actions like a Save button click. Never trigger writes on text change, blur, or other intermediate events — use local state to buffer edits until the user confirms.

**Firestore field naming:** Use camelCase for all Firestore document field names (e.g. `createdAt`, not `created_at`). TypeScript interface properties that map directly to Firestore fields follow the same convention. Exception: fields that mirror an external API's response verbatim (e.g. Cloudinary's `public_id`/`secure_url`, YouTube oEmbed's `thumbnail_url`, Tesseract.js language codes like `chi_sim`) keep the external contract's naming rather than being converted.

**Dependency versions:** Pin exact versions in `package.json` — no `^` or `~` ranges. `.npmrc` sets `save-exact=true` so `npm install <package>` writes exact pins automatically; don't hand-edit a version back to a range. This exists because a caret range on `@mui/x-charts` once silently resolved to a broken patch release (`@mui/x-charts-vendor@9.11.0` published with its vendor bundle files missing) — exact pins mean upgrades only happen deliberately, not as a side effect of an unrelated `npm install`.

**Testing with Playwright:** Ask before using Playwright (or any browser automation) to test a feature — don't launch a dev server and drive the browser unprompted.
