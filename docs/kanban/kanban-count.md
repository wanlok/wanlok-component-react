# kanban-count

2026-05-24

# Overview

Counts are shown in two places: per-column in the kanban header, and as a total in each project row in the sidebar.

# Column Count

## Functional Requirements

- Each column header displays the number of items in that column
- The count is shown as `(n)` next to the column name, e.g. `To Do (1)`
- The count shows `(0)` when a column has no items
- The count updates after a drag-and-drop, item add, or item delete

## UI / Behaviour

- The column name and count are separate `Typography` components (`variant="body1"` for name, `variant="body2"` for count) wrapped in a `Stack` with `flexDirection: "row"` and `alignItems: "center"` to vertically align them when font sizes differ
- Both sit inside the existing black column header bar in the `Bottom` component of `KanbanHeader.tsx`

## Implementation

- In `Bottom` (`KanbanHeader.tsx`), destructure `items` alongside `name` from each column
- Derive the count from `items.length` at render time — no Firestore changes needed
- Render a second `Typography` next to the name showing `(${items.length})`

# Project Row Total Count

## Functional Requirements

- Each project row in the sidebar displays the total number of items across all columns
- Shown after the created date as `, n`, e.g. `17-05-2026 5:23 PM, 5`
- Updates after a drag-and-drop, item add, or item delete

## UI / Behaviour

- The total count is appended inline to the existing date `Typography` as `, n`, e.g. `17-05-2026 5:23 PM, 5`
- No additional `Typography` component is needed — same font variant as the date

## Implementation

- In `ProjectRow.tsx`, derive the total as `project.columns.reduce((total, column) => total + column.items.length, 0)`
- Append `, {total}` to the date `Typography`

# Data Flow

- `project` state is owned by `useKanban` and passed as a prop to `KanbanHeader` and `ProjectRow`
- On drag-and-drop, add, or delete, `useKanban` updates `project` state and both components re-render automatically
