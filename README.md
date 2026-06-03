# Expense Tracker

## Project Overview

This project is a lightweight personal expense tracking application built as a single-page web app. It allows a user to record expenses, categorize them, search and filter historical records, edit or delete existing entries, and review a current-month spending summary.

The implementation is intentionally small and pragmatic: it focuses on delivering the core expense-tracking workflow quickly, with a clean UI and reliable local persistence, while avoiding unnecessary backend complexity for a short practical exercise.

### Implemented Features

- Add a new expense with title, amount, category, date, and optional note
- View all saved expenses in a reverse-chronological list
- Edit an existing expense in-place through a modal dialog
- Delete an expense with confirmation
- Filter expenses by title, category, and date range
- Show a monthly spending summary for the current month
- Show category-wise breakdown for the current month
- Persist all data in the browser so entries survive refreshes
- Validate user input before saving

---

## Technology Stack

## Core Application Stack

### React 19
**Why it was chosen**
- React is well suited for building interactive form-driven UIs with reusable components.
- The application is stateful, event-driven, and component-oriented, which matches React’s model well.

**Tradeoffs**
- React introduces framework overhead for a relatively small app.
- For a simple CRUD tool, vanilla JavaScript or a lighter framework could reduce complexity, but React improves maintainability and extensibility.

### TypeScript
**Why it was chosen**
- The codebase defines typed domain models such as `Expense` and `Category`.
- Type safety is especially useful for form values, state transitions, and component props.

**Tradeoffs**
- Adds setup and verbosity compared with plain JavaScript.
- The added safety is valuable for a practical test because it reduces ambiguity and improves correctness.

### TanStack Start
**Why it was chosen**
- Provides the project scaffold, routing integration, and server/runtime structure.
- Offers a production-oriented application shape even for a small app.

**Tradeoffs**
- More infrastructure than this project strictly needs.
- Some framework/server files are present even though the app’s business logic is entirely client-side.

### TanStack Router
**Why it was chosen**
- The app uses file-based routing with `src/routes`.
- It gives a clean route structure and sets up an extensible app shell.

**Tradeoffs**
- Routing is currently minimal because the app only has one main screen.
- The router is somewhat overpowered for a single-route expense tracker, but it supports future expansion cleanly.

### TanStack React Query
**Why it was chosen**
- A `QueryClientProvider` is configured in the root route, which is standard in TanStack-based applications.
- This prepares the app for future API-backed data fetching.

**Tradeoffs**
- It is not actively used in the current expense workflow.
- This means some setup exists ahead of need, but it reduces future integration effort.

---

## UI and Styling Stack

### Tailwind CSS v4
**Why it was chosen**
- Enables fast UI development with utility classes.
- Keeps styling close to components, which is useful in a short implementation window.

**Tradeoffs**
- Utility-heavy markup can become dense.
- Styling logic is distributed through JSX rather than centralized CSS modules or component stylesheets.

### shadcn/ui Component Structure
**Why it was chosen**
- The project includes reusable UI building blocks under `src/components/ui`.
- It accelerates assembly of forms, dialogs, cards, buttons, and layout primitives.

**Tradeoffs**
- The repository contains many scaffolded UI components that are not used by the expense tracker itself.
- This increases repository size, but significantly reduces time needed to implement polished UI patterns.

### Radix UI Primitives
**Why it was chosen**
- Dialogs, alert dialogs, selects, and labels are built on accessible Radix primitives.
- This improves keyboard and accessibility behavior without building components from scratch.

**Tradeoffs**
- Adds dependency weight and abstraction layers.
- The benefit is better reliability for modal and selection interactions.

### Lucide React
**Why it was chosen**
- Used for edit and delete action icons.
- Lightweight and consistent with modern UI conventions.

**Tradeoffs**
- Adds a dependency for a small visual enhancement.
- The UX benefit is worthwhile for affordance and clarity.

---

## Storage and Browser APIs

### `localStorage`
**Why it was chosen**
- The application stores expenses in the browser under the key `expenses:v1`.
- This allows persistence with zero backend setup, which is appropriate for a 2-hour exercise.

**Tradeoffs**
- Data is tied to one browser on one device.
- There is no synchronization, backup, authentication, or multi-user support.

### `crypto.randomUUID()`
**Why it was chosen**
- Generates unique IDs for new expenses on the client.
- Simple and reliable for browser-side CRUD.

**Tradeoffs**
- IDs are not coordinated with any server or database.
- This is acceptable because the app is fully local.

### `Intl.NumberFormat`
**Why it was chosen**
- Formats amounts as currency in a standardized way.
- Avoids custom formatting logic.

**Tradeoffs**
- The currency is currently hardcoded to `USD`.
- This simplifies the implementation but limits internationalization.

---

## Tooling

### Vite
**Why it was chosen**
- Fast development server and build tooling.
- Well suited for a modern React + TypeScript workflow.

**Tradeoffs**
- Not a drawback for this project in practice; it is a good default choice.

### ESLint + Prettier
**Why it was chosen**
- Supports consistent formatting and code quality.
- Important for a practical assessment submission.

**Tradeoffs**
- Adds setup and maintenance overhead.
- The quality and consistency benefits outweigh this.

### Bun Configuration
**Why it was chosen**
- The repository includes `bun.lock` and `bunfig.toml`, so Bun is supported as an alternative package manager/runtime for scripts.

**Tradeoffs**
- Supporting both npm and Bun can create duplicate lockfiles.
- The benefit is flexibility for local development.

---

## Architecture & Structure

## High-Level Architecture

The app is a client-centric CRUD application with a thin framework shell around it:

1. The route at `/` renders the full expense-tracking screen.
2. Expense data is loaded from `localStorage` into React state via a custom hook.
3. UI components render the form, filters, list, and summary from that state.
4. User actions update React state.
5. A persistence effect writes the updated array back to `localStorage`.

There is no real backend, database, or remote API involved in the expense flow.

## Project Structure

### `src/routes`
Contains the route-level application structure.

- `src/routes/__root.tsx`  
  Defines the root shell, wraps the app in `QueryClientProvider`, and provides global not-found and error boundaries.
- `src/routes/index.tsx`  
  The main expense tracker screen. This is where feature components are composed and filtering logic is applied.
- `src/routes/README.md`  
  Documents TanStack Start file-based routing conventions.

### `src/components`
Contains the app-specific UI components.

- `src/components/expense-form.tsx`  
  Shared form used for both creating and editing expenses.
- `src/components/expense-list.tsx`  
  Renders the expense list and manages edit/delete dialogs.
- `src/components/expense-filters.tsx`  
  Renders search, category, and date range filters.
- `src/components/monthly-summary.tsx`  
  Computes and displays the current month total and per-category totals.

### `src/components/ui`
Contains reusable UI primitives generated/scaffolded in shadcn/ui style.  
Only a subset is used by the expense tracker, such as buttons, cards, dialogs, inputs, labels, selects, badges, and textareas.

### `src/hooks`
Contains reusable hooks.

- `src/hooks/use-expenses.ts`  
  Owns expense state, initial load, persistence, and CRUD operations.

### `src/lib`
Contains domain and utility logic.

- `src/lib/expenses.ts`  
  Defines categories, the `Expense` type, storage functions, currency formatting, and today’s ISO date helper.
- `src/lib/utils.ts`  
  Shared class name utility.
- `src/lib/error-page.ts`, `src/lib/error-capture.ts`, `src/lib/lovable-error-reporting.ts`  
  Framework/error-reporting support.
- `src/lib/api/example.functions.ts`  
  Example server function scaffold; not part of the implemented expense feature set.
- `src/lib/config.server.ts`  
  Server-only configuration helper.

### Root Configuration Files

- `package.json`  
  Scripts and dependencies
- `vite.config.ts`  
  Vite/TanStack Start build configuration
- `tsconfig.json`  
  TypeScript compiler settings
- `eslint.config.js`  
  Linting rules
- `components.json`  
  shadcn/ui component configuration
- `bunfig.toml`  
  Bun package-manager settings

## Data Flow

1. The user enters values in `ExpenseForm`.
2. `ExpenseForm` validates the input locally.
3. On success, the form passes normalized values upward through `onSubmit`.
4. `useExpenses` either adds a new object or updates an existing one in React state.
5. A `useEffect` in `useExpenses` persists the current array to `localStorage`.
6. `index.tsx` derives a filtered and sorted view from the full dataset using `useMemo`.
7. `ExpenseList` renders the filtered data.
8. `MonthlySummary` derives current-month totals from the full dataset, not the filtered subset.

This separation is sensible: filters affect what the user sees in the list, while the monthly summary remains a report of all stored expenses for the current month.

---

## Feature Breakdown

## Add Expense

### What it does
Allows the user to create a new expense with:
- title
- amount
- category
- date
- optional note

### How it works internally
- The add form is rendered by `ExpenseForm` inside `src/routes/index.tsx`.
- The form manages its own local input state with `useState`.
- On submit, the form validates all fields.
- If valid, it calls the `addExpense` function from `useExpenses`.

### Key implementation details
- The date defaults to `todayISO()`.
- A new expense gets:
  - `id` from `crypto.randomUUID()`
  - `createdAt` from `Date.now()`
- After successful creation, the form resets itself when used in add mode.

---

## View Expenses

### What it does
Displays all matching expenses in a list.

### How it works internally
- The main route keeps filter state in `filters`.
- A memoized `filtered` array is computed from `expenses`.
- `ExpenseList` receives and renders that filtered array.

### Key implementation details
- Sorting is descending by `date`.
- If two records share the same date, `createdAt` is used as the tiebreaker.
- Each item shows:
  - title
  - category badge
  - formatted date
  - optional note
  - formatted amount
  - edit/delete actions

---

## Edit Expense

### What it does
Allows an existing expense to be modified.

### How it works internally
- Clicking the edit icon sets `editing` state in `ExpenseList`.
- That opens a dialog containing `ExpenseForm`.
- `ExpenseForm` receives `initial` expense data and populates its fields via `useEffect`.
- On submit, `onUpdate` is called with the expense ID and updated values.

### Key implementation details
- The same form component is reused for add and edit.
- The update logic maps over the existing array and replaces the matching item by ID.
- `id` and `createdAt` are preserved during updates.

---

## Delete Expense

### What it does
Removes an expense after user confirmation.

### How it works internally
- Clicking the delete icon sets `deleting` state in `ExpenseList`.
- An `AlertDialog` is shown with the expense title and amount.
- Confirming triggers `onDelete(id)`.

### Key implementation details
- Deletion is implemented as an array filter in `useExpenses`.
- The confirmation dialog helps prevent accidental deletion.

---

## Monthly Summary

### What it does
Displays the total amount spent in the current month.

### How it works internally
- `MonthlySummary` derives the current year and month from `new Date()`.
- It filters the full expense list to only expenses whose `date` falls within the current calendar month.
- It sums the matching amounts.

### Key implementation details
- The month label is generated with `toLocaleString`.
- The summary is recalculated with `useMemo` whenever expenses change.
- If there are no expenses in the current month, the component shows an empty-state message.

---

## Category Breakdown

### What it does
Shows how the current month’s spending is distributed across categories.

### How it works internally
- After isolating current-month expenses, `MonthlySummary` reduces them into a `byCategory` object.
- The entries are sorted descending by amount.
- Each category displays:
  - total amount
  - rounded percentage of monthly total
  - a horizontal visual bar

### Key implementation details
- The breakdown is part of the monthly summary card, not a separate report page.
- The UI uses simple progress-style bars rather than a full charting library.

---

## Filtering/Search

### What it does
Lets the user narrow the visible expense list by:
- title search
- category
- start date
- end date

### How it works internally
- Filter state is stored in `index.tsx`.
- `ExpenseFilters` is a controlled component that updates that parent state.
- The list is filtered in a single pass before rendering.

### Key implementation details
- Title search is case-insensitive and uses substring matching.
- Category filtering compares exact category values.
- Date filtering compares ISO strings directly:
  - `e.date < filters.from`
  - `e.date > filters.to`

This works because dates are stored in `YYYY-MM-DD` format, which preserves chronological ordering in lexical string comparisons.

- A reset button clears all filters back to default values.

---

## Validation

### What it does
Prevents invalid expenses from being saved.

### How it works internally
Validation is implemented directly inside `ExpenseForm.handleSubmit`.

### Key implementation details
- Title:
  - required
  - trimmed
  - maximum 100 characters
- Amount:
  - required
  - must parse to a number
  - must be greater than `0`
  - must be less than or equal to `1,000,000,000`
- Date:
  - required
  - cannot be in the future
- Note:
  - optional
  - maximum 500 characters

There is also field-level browser assistance through input attributes:
- amount input uses `type="number"`, `step="0.01"`, and `min="0"`
- title and note use `maxLength`
- date input uses `type="date"` and `max={todayISO()}`

This is a good layered approach: UI-level constraints improve usability, while submit-time validation protects correctness.

---

## State Management & Persistence

The app uses local component state and one custom hook rather than a global store.

### How data is stored
- Expenses are stored in an array of `Expense` objects in React state inside `useExpenses`.
- Each expense has:
  - `id`
  - `title`
  - `amount`
  - `category`
  - `date`
  - optional `note`
  - `createdAt`

### How persistence works
- On first client render, `useExpenses` calls `loadExpenses()`.
- `loadExpenses()` reads `localStorage["expenses:v1"]`.
- If parsing fails or the data is invalid at a basic structural level, it falls back to an empty array.
- After initial load, a second effect writes the current array back through `saveExpenses()` whenever expenses change.

### Why this approach was selected
- It is the fastest way to deliver durable browser-side persistence.
- It requires no backend, auth, or schema management.
- It is perfectly reasonable for a practical exercise focused on front-end engineering and UX.

### Important implementation safeguard
The `loaded` boolean prevents the save effect from overwriting storage before the initial load completes. This is a small but important correctness detail.

---

## Design Decisions

## 1. Single-route application
The full workflow lives on `src/routes/index.tsx`.

**Why this is reasonable**
- The app is small and task-focused.
- Keeping everything on one screen reduces navigation complexity and improves usability.

## 2. Reuse one form for add and edit
`ExpenseForm` supports both creation and editing via optional `initial` data.

**Why this is reasonable**
- Prevents duplicated validation logic
- Keeps behavior consistent
- Reduces implementation time

## 3. Use ISO date strings for storage
Dates are stored as `YYYY-MM-DD` strings rather than timestamps.

**Why this is reasonable**
- Works naturally with HTML date inputs
- Makes client-side comparisons simple
- Avoids unnecessary date parsing in filter logic

## 4. Compute reports on the fly
The monthly summary and category breakdown are derived from the in-memory array every render cycle through `useMemo`.

**Why this is reasonable**
- Dataset size is small
- Simpler than maintaining pre-aggregated reporting state
- Easy to reason about and test manually

## 5. Prefer local persistence over backend complexity
No API, database, or authentication layer is used for core features.

**Why this is reasonable**
- The exercise appears time-boxed
- Local persistence demonstrates full CRUD behavior without infrastructure work
- It prioritizes delivering a complete user-facing workflow

## Simplifications likely made due to the 2-hour constraint

The code strongly suggests a conscious focus on the essential workflow rather than production completeness. Reasonable simplifications include:

- no backend API for expenses
- no authentication or user accounts
- no multi-device synchronization
- no export/report download functionality
- no automated tests configured in `package.json`
- no pagination or virtualization
- no advanced analytics or charting despite chart-related UI scaffolding in the repo
- no schema version migration beyond a simple storage key

These are sensible omissions for a short practical test because they avoid infrastructure-heavy work while still demonstrating component design, state management, validation, persistence, and reporting.

---

## Edge Cases Handled

### Empty states
- If no expenses match the active filters, `ExpenseList` shows `No expenses match your filters.`
- If there are no expenses in the current month, `MonthlySummary` shows `No expenses this month.`

### Invalid inputs
- Required title, amount, and date are enforced
- Negative or zero amounts are rejected
- Excessively large amounts are rejected
- Overlong title and note values are rejected
- Future dates are rejected both in the UI and in submit validation

### Invalid date ranges
- There is no explicit validation that `from <= to`
- If the user selects an inverted range, the filtering logic simply yields no matches, which is safe and predictable
- This is functional, though not as user-friendly as dedicated range validation

### Missing data
- Notes are optional
- Missing or absent persisted storage returns an empty list cleanly

### Malformed persisted data
- `loadExpenses()` is wrapped in `try/catch`
- Invalid JSON in `localStorage` fails safely to `[]`

### Browser/server execution boundary
- `loadExpenses()` and `saveExpenses()` check `typeof window === "undefined"`
- This prevents browser-only storage logic from running during server-side execution

### Accidental destructive actions
- Delete actions require explicit confirmation in an alert dialog

### Stable ordering
- Expenses are sorted by date and then `createdAt`, which avoids unstable ordering when multiple items share the same date

---

## Tradeoffs

## What was prioritized
- A complete CRUD user flow
- Clear validation
- Clean componentized UI
- Persistent local data
- Useful monthly reporting
- Fast implementation with minimal moving parts

## What was intentionally not implemented
- Backend API integration
- Real database persistence
- Authentication and user profiles
- Cross-device synchronization
- Automated tests
- Advanced charts and dashboards
- Import/export capabilities
- Internationalized currency and locale controls

## Why these decisions were made
For a short practical exercise, the highest-value outcome is a working, polished application that demonstrates engineering judgment. The current implementation proves the candidate can:
- model data
- build reusable components
- manage state
- validate inputs
- persist user data
- handle empty/error states
- structure a modern TypeScript React codebase

That is a strong tradeoff for a limited timeframe.

---

## Future Improvements

A realistic production roadmap would include:

### Backend and persistence
- Replace `localStorage` with a backend API
- Store expenses in a database such as PostgreSQL
- Add server-side validation and schema enforcement
- Introduce migrations and versioned storage models

### Authentication and accounts
- Add sign-up/login
- Support per-user data isolation
- Enable multi-device access and syncing

### Reporting
- Add historical month selection
- Add charts for trends over time
- Add exports to CSV/PDF
- Add budget targets and variance tracking

### Validation and UX
- Add explicit validation for invalid filter ranges
- Add toasts for create/update/delete feedback
- Add optimistic UI if a backend is introduced
- Add better currency/locale configuration

### Engineering quality
- Add unit tests for helpers and hooks
- Add component/integration tests for form and CRUD flows
- Add end-to-end tests for the main workflow
- Add CI for lint/build/test checks

### Performance and scalability
- Add pagination or virtualization for very large datasets
- Memoize or move aggregations if datasets grow large
- Introduce server-side querying and filtered fetching

---

## Running the Project

## Prerequisites

- Node.js for npm-based usage, or Bun for Bun-based usage
- A modern browser

The repository contains both `package-lock.json` and `bun.lock`, so either npm or Bun is a valid setup path.

## Installation

```bash
cd easy-dough-track
npm install
```

Or with Bun:

```bash
cd easy-dough-track
bun install
```

## Available Scripts

### Development server

```bash
npm run dev
```

Or:

```bash
bun run dev
```

This starts the Vite development server using the script defined in `package.json`.

### Production build

```bash
npm run build
```

Or:

```bash
bun run build
```

### Preview the production build

```bash
npm run preview
```

Or:

```bash
bun run preview
```

### Lint the codebase

```bash
npm run lint
```

### Format the codebase

```bash
npm run format
```

## Dependencies

The project’s actual script and dependency setup is defined in `package.json` and includes:

- runtime dependencies for React, TanStack Start/Router/Query, Tailwind, Radix UI, and supporting UI utilities
- development dependencies for TypeScript, Vite, ESLint, and Prettier

## Notes on current repository state

- No `test` script is configured
- No dedicated backend setup is required
- Expense data is stored only in the browser, so clearing browser storage removes saved entries

---

## AI Usage Disclosure

AI-assisted development tools were used to accelerate scaffolding and implementation. All generated code was reviewed, tested, and refined to ensure requirements were met and the application functioned correctly.
