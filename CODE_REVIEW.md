# Code Review Report

## Summary of Findings

The project already had a sensible small-app structure: a single route composed from focused UI components, a custom hook for persistence, and a domain utility file for shared types and helpers. The biggest code hygiene opportunities were not architectural; they were concentrated in consistency, validation reuse, naming clarity, and defensive handling of persisted data.

Primary findings:

- Validation logic lived only inside the form component and was not reusable.
- Filtering and sorting logic was embedded in the route component instead of being expressed as domain helpers.
- Persisted `localStorage` data was only weakly validated when reloaded.
- A few variable names were too terse for assessment-quality readability.
- Empty-state messaging did not distinguish between "no data yet" and "no results after filtering".
- The filter UI did not provide feedback for inverted date ranges.
- There were minor polish issues such as scaffolded metadata and corrupted punctuation characters in the expense list.

## Improvements Made

### 1. Centralized expense-domain logic

Moved reusable business logic into `src/lib/expenses.ts`:

- added `ExpenseInput` to avoid repeating `Omit<Expense, "id" | "createdAt">`
- added `ExpenseFilters` and `DEFAULT_EXPENSE_FILTERS`
- added `validateExpenseInput`
- added `normalizeExpenseInput`
- added `matchesExpenseFilters`
- added `sortExpensesByDate`
- added `hasActiveExpenseFilters`
- added `hasInvalidExpenseFilterRange`
- added `formatExpenseDate`

**Why this improves quality**

- reduces duplication
- keeps business rules close to the domain model
- makes components thinner and easier to read
- improves future maintainability if the app grows slightly

### 2. Improved persistence safety

Strengthened `loadExpenses()` so persisted data is normalized before use.

- malformed items are ignored instead of being trusted blindly
- category/date/amount/basic shape are validated
- empty notes are normalized away

**Why this improves quality**

- protects the UI from corrupted or stale local storage
- makes persistence behavior more robust without adding heavy abstractions

### 3. Simplified form responsibilities

Cleaned up `src/components/expense-form.tsx`:

- reused shared validation and normalization helpers
- replaced broad string-keyed errors with typed validation errors
- cleared stale error messages when switching edit targets

**Why this improves quality**

- form logic is shorter and clearer
- validation rules now have a single source of truth
- reduces the chance of create/edit behavior diverging later

### 4. Improved filtering UX and consistency

Cleaned up `src/components/expense-filters.tsx`:

- switched to shared filter types/constants
- added feedback for invalid date ranges
- standardized reset behavior through `DEFAULT_EXPENSE_FILTERS`
- made the reset button explicitly `type="button"`

**Why this improves quality**

- improves clarity and user feedback
- avoids duplicated default values
- prevents subtle form-button behavior issues if the component is ever nested differently

### 5. Improved page-level readability

Cleaned up `src/routes/index.tsx`:

- renamed the route component to `ExpenseTrackerPage`
- moved filtering/sorting to shared helpers
- separated invalid-range detection from list derivation
- improved empty-state messaging:
  - `No expenses added yet.`
  - `No expenses match your filters.`

**Why this improves quality**

- better communicates intent
- reduces inline business logic in the page component
- improves UX without increasing complexity

### 6. Improved list component clarity

Cleaned up `src/components/expense-list.tsx`:

- replaced terse state names with `expenseBeingEdited` and `expenseBeingDeleted`
- reused `ExpenseInput` and `formatExpenseDate`
- fixed corrupted punctuation characters in display strings
- allowed the parent to control the empty-state message

**Why this improves quality**

- clearer state intent
- better separation of presentation and page-level messaging
- more polished UI output

### 7. Minor naming and readability cleanup

Improved naming in:

- `src/hooks/use-expenses.ts`
- `src/components/monthly-summary.tsx`

Examples:

- `newExp` -> `newExpense`
- `prev` -> `previousExpenses`
- `y` / `m` / `d` -> clearer date-related names

**Why this improves quality**

- makes the code easier to scan in an assessment setting
- reduces cognitive overhead for reviewers

### 8. Metadata polish

Updated root metadata in `src/routes/__root.tsx` to reflect the actual application rather than scaffold defaults.

**Why this improves quality**

- removes template residue
- makes the submission feel complete and intentional

## Remaining Recommendations

These were intentionally not implemented to avoid over-engineering a small assessment project:

### 1. Add automated tests

Recommended additions:

- unit tests for `validateExpenseInput`, `matchesExpenseFilters`, and storage normalization
- component tests for add/edit/delete flows
- a lightweight end-to-end smoke test

### 2. Introduce user feedback for successful actions

The project already includes `sonner` in the dependency graph, but it is not used in the app flow. Small success toasts for add, update, and delete would improve UX without much complexity.

### 3. Make currency configurable

`formatCurrency()` currently uses `USD`. That is acceptable for the assessment, but a production-ready version should externalize currency/locale settings.

### 4. Consider a small reporting utility

`MonthlySummary` is still appropriately small, but if reporting expands, summary derivation can move into a dedicated helper file.

### 5. Prune unused scaffold dependencies and UI components

The repository contains framework and UI scaffolding beyond the needs of this exercise. It is harmless, but trimming unused generated UI files and unused dependencies would make the repo leaner for a final submission.

## Code Hygiene Score

**8.5 / 10**

Reasoning:

- good component boundaries for a small app
- improved naming and reuse
- good validation and persistence safety after cleanup
- still carries some scaffold weight not directly used by the feature set

## Maintainability Score

**8 / 10**

Reasoning:

- business rules are now centralized
- components are easier to understand and extend
- file structure remains appropriate for project size
- lack of automated tests is the main maintainability gap

## Assessment Readiness Score

**8.5 / 10**

Reasoning:

- demonstrates solid engineering judgment for a 2-hour exercise
- shows clean separation of concerns without unnecessary abstraction
- preserves simplicity while addressing real code hygiene issues
- would be even stronger with tests and a small pass to remove unused scaffold assets
