# User Management Dashboard

A React + TypeScript CRUD dashboard for viewing, adding, editing, and deleting users, built against [JSONPlaceholder](https://jsonplaceholder.typicode.com)'s `/users` endpoint.

**Live demo:** _[add your deployment link here]_
**Repo:** _[add your GitHub repo link here]_

---

## Features

- View all users in a responsive table (ID, First Name, Last Name, Email, Department)
- Add / Edit users via a modal form with client-side validation
- Delete users with a confirmation modal
- Search across name, email, and department
- Filter by first name, last name, email, and department (popup)
- Sort by clicking any column header (toggles ascending/descending)
- Pagination with configurable page size (10 / 25 / 50 / 100 per page)
- Loading and error states, with retry on fetch failure
- Fully responsive — table collapses into stacked cards on mobile

---

## Setup & Run Instructions

**Requirements:** Node.js 16+ and npm.

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd user-management-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start
```

The app runs at `http://localhost:3000`.

### Running tests

```bash
npm test
```

This runs the full Jest + React Testing Library suite in watch mode. Press `a` to run all tests, or use:

```bash
npm test -- --watchAll=false
```

for a single non-interactive run (useful in CI).

### Environment variables

A `.env` file at the project root sets the API base URL:

```
REACT_APP_API_BASE_URL=https://jsonplaceholder.typicode.com
```

### Building for production

```bash
npm run build
```

Outputs a static build to `/build`, deployable to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## Project Structure

```
src/
├── api/                 # HTTP layer — axios instance + typed CRUD functions for /users
├── types/                # Shared TypeScript types (User, FilterCriteria, SortConfig, etc.)
├── utils/                # Pure functions — validation, data mapping, search/filter/sort logic
├── hooks/                # Custom hooks — data fetching, pagination, filters, all with their own state
├── styles/                # Shared CSS used across multiple components (e.g. modal form styles)
├── components/
│   ├── UserTable/         # Displays users, handles sorting UI
│   ├── UserFormModal/     # Add/Edit form (one component, mode decided by props)
│   ├── DeleteConfirmModal/
│   ├── FilterPopup/
│   ├── SearchBar/
│   ├── Pagination/
│   ├── ErrorBanner/
│   └── LoadingSpinner/
├── App.tsx                # Top-level orchestration — wires hooks to components
└── index.tsx
```

Each component/hook/util that has logic worth testing has a co-located `*.test.ts(x)` file next to it.

---

## Assumptions & Design Decisions

JSONPlaceholder is a **mock/demo API** — it does not persist any changes. This shaped several decisions worth calling out explicitly:

1. **No real `firstName`/`lastName`/`department` fields.** JSONPlaceholder's `/users` returns a single `name` field and a nested `company.name`. This app maps `name` → `firstName`/`lastName` (splitting on the first space) and `company.name` → `department`. See `utils/userMapper.ts`. This is a simplification — some real names won't split perfectly (e.g. "Mrs. Dennis Schulist" → first name "Mrs.").

2. **POST/PUT/DELETE responses are not trusted.** The API always returns a fake success response (e.g. POST always echoes back `id: 11` regardless of payload) without actually persisting anything. This app therefore treats its **local React state as the source of truth**: after a successful API call, the app updates its own in-memory user list directly rather than relying on the response body. New user IDs are generated client-side as `max(existing IDs) + 1`. See `hooks/useUsers.ts`.

3. **All search/filter/sort/pagination is client-side.** JSONPlaceholder's `/users` endpoint has no server-side pagination or filtering — it always returns all 10 users. Every list operation (search, filter, sort, pagination) operates on the in-memory array already fetched. See `utils/filterSortUsers.ts` and `hooks/usePagination.ts`.

4. **Pagination over infinite scroll.** The assignment allowed either. Since there are only 10 real users, infinite scroll would rarely visibly trigger and adds meaningfully more testing complexity (mocking `IntersectionObserver`), so classic pagination was chosen — it more directly satisfies the "10/25/50/100" requirement and is easier to verify correctness.

5. **Search matches are case-insensitive substrings** across first name, last name, email, and department. Filters use the same substring matching but are combined with AND logic (all provided filter fields must match).

6. **Errors are surfaced but non-blocking where possible.** If a background fetch fails while data is already on screen, the app shows the error but keeps the existing table visible rather than clearing it. A "Retry" button appears only when there's no data currently shown.

---

## Testing Approach

The suite favors testing pure logic (validators, data mappers, search/filter/sort) directly with plain input/output assertions, testing hooks in isolation with `renderHook` (mocking only the external boundary — the API layer), and testing components with React Testing Library, interacting the way a user would (`userEvent`) rather than reaching into implementation details.

`App.test.tsx` mocks only `useUsers` (the data-fetching boundary) and leaves everything else — modals, search, filters, sorting, pagination — real, so those tests double as integration tests of the actual wiring between components.

---

## Reflection

### Challenges faced

- **JSONPlaceholder's fake persistence** was the biggest design driver in this project. Once it was clear that POST/PUT/DELETE responses can't be trusted, most of the "real" logic moved into treating client-side state as the source of truth (`useUsers`), with the API calls kept mainly to genuinely exercise the request/response/error-handling path.
- **Reconciling pagination with filtering** required care: pagination has to operate on the *already filtered/sorted* list, and changing the search term, filters, or page size all need to reset the current page back to 1 — otherwise it's easy to end up "stuck" on a page number that no longer has any data.
- **Keeping the Add/Edit modal as one component** instead of two similar ones required deciding the interface up front (`initialData` presence = edit mode) so the validation, submit handling, and error states could be shared without duplication.

### What I'd improve with more time

- **Debounce is only on search, not filters** — typing quickly into multiple filter fields recomputes on Apply, which is fine, but a live-preview-as-you-type filter experience would benefit from the same debounce pattern used in `SearchBar`.
- **Per-operation error state** — `useUsers` currently shares one `error` value across fetch/add/edit/delete. Splitting this so, e.g., a failed delete doesn't visually resemble a failed fetch would give clearer feedback.
- **Optimistic UI updates** — mutations currently wait for the (simulated) API response before updating local state. Since the API is mocked anyway, an optimistic update with rollback-on-failure would feel snappier.
- **Accessibility pass** — current components use `aria-label`s and `role="alert"`/`role="status"` where relevant, but a full keyboard-navigation and screen-reader audit (especially focus trapping/return in modals) wasn't performed.
- **E2E tests** — the current suite is unit/integration level (Jest + RTL). A Cypress or Playwright pass covering full user flows against a running instance would catch issues unit tests can't (e.g. real browser focus behavior, actual network timing).

---

## Tech Stack

- React 18 + TypeScript
- Axios (HTTP client)
- react-modal (Add/Edit and Delete confirmation dialogs)
- Jest + React Testing Library (testing)
- Plain CSS (no framework) with a mobile-first responsive breakpoint strategy