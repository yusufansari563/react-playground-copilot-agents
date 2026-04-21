1. Scope (in/out)  
   In scope: establish a production-style app foundation that includes route structure, server state, global state, forms with schema validation, API client layer, test baseline, and Storybook baseline.  
   In scope: implement at least one vertical feature slice (example: auth + dashboard + profile form) so every selected tool is exercised together.  
   Out of scope for this phase: advanced domain features, full design system maturity, CI/CD hardening, Docker optimization, Sentry release workflows, and extensive e2e coverage.

2. Route and navigation impact  
   Route model should be feature-oriented with a layout shell and protected/public splits.

Proposed routes:

- / (redirect to /dashboard or /login by auth state)
- /login (public)
- /dashboard (protected)
- /hooks/:hookName (protected learning pages for hooks/features)
- /settings/profile (protected form example)
- - (not found)

Navigation impact:

- top-level AppLayout with sidebar/nav for dashboard, hooks, settings
- protected route wrapper that reads auth/session state from Zustand
- lazy-load feature pages to keep initial bundle small

3. Data contracts (API/query/mutation types)  
   Use Axios instance + typed response contracts.

Baseline contracts:

- POST /auth/login
  Request: { email: string; password: string }  
  Response: { accessToken: string; user: User }

- GET /me  
  Response: User

- PATCH /me/profile  
  Request: { displayName: string; bio?: string; avatarUrl?: string }  
  Response: User

Type shapes:

- User = { id: string; email: string; displayName: string; role: "user" | "admin" }
- ApiError = { message: string; code?: string; fieldErrors?: Record<string, string> }

React Query keys:

- ["auth", "me"]
- ["profile", "me"]
- feature keys like ["hooks", hookName]

4. State strategy (React Query vs Zustand)  
   React Query:

- all server-originated data
- caching, stale/retry policies
- mutation lifecycle and invalidation

Zustand:

- minimal client state only: auth token, UI toggles, ephemeral preferences
- avoid duplicating server objects in Zustand
- session bootstrap bridges Zustand token to Axios auth header

Rule of thumb:

- if data comes from API and must stay fresh, keep it in React Query
- if state is UI/session-local and non-canonical, keep it in Zustand

5. Form and validation strategy (React Hook Form + Zod)  
   Form stack:

- React Hook Form for field lifecycle and performance
- Zod schemas as source of truth for validation
- zodResolver integration for sync schema feedback

Patterns:

- schema per form in feature folder
- shared field components for consistent error rendering
- submit handlers call React Query mutations
- map API fieldErrors to form errors when available

Initial form candidates:

- login form
- profile settings form

6. Test plan (unit/integration)  
   Unit tests:

- Zod schemas (valid/invalid matrix)
- small utility functions (API mappers, query key helpers)
- Zustand store actions/selectors

Integration tests (RTL + Vitest):

- route rendering and guard behavior
- login flow success/error
- profile form submit success/error
- loading, empty, and error states for query-driven pages

Network mocking:

- MSW handlers per feature
- default success handlers + override per test for edge/error
- verify mutation invalidates/refetches expected query keys

7. Storybook plan (variants)  
   Create stories for reusable UI and feature components.

Initial variants:

- form input default
- form input with validation error
- submit button loading
- profile form: default, invalid, submitting, API error
- dashboard widgets: loading, loaded, empty, error

Storybook quality:

- controls for major props
- args-based fixtures matching API contracts
- keep stories deterministic with mocked providers

8. Implementation steps in safe order
1. Foundation: folder structure, routing shell, providers (Router + QueryClient), Axios instance.
1. State: add Zustand auth/session store and token hydration.
1. API layer: typed client modules and query key constants.
1. Auth slice: login form with RHF + Zod, mutation, protected route wiring.
1. Feature slice: dashboard query page and profile edit form/mutation.
1. Testing baseline: Vitest setup, RTL setup, MSW server + first flow tests.
1. Storybook baseline: provider decorators + first component/feature stories.
1. Tooling quality gates: ESLint + Prettier checks, Husky + lint-staged + commitlint hooks.
1. Refinement: error boundaries, loading UX consistency, docs updates.

1. Risks and mitigations  
   Risk: state duplication between Zustand and React Query causing stale UI.  
   Mitigation: strict ownership rule; keep server entities out of Zustand.

Risk: route guard flicker during session bootstrap.  
Mitigation: auth bootstrap loading gate before protected route decision.

Risk: form schema drift from backend contract.  
Mitigation: co-locate Zod schemas with API types and add contract tests.

Risk: brittle tests with over-mocking.  
Mitigation: use MSW at network boundary; test behavior from user perspective.

Risk: commit/quality hooks slowing workflow.  
Mitigation: run scoped checks in pre-commit and full checks in CI.

10. Acceptance checklist

- Routing exists with public, protected, and fallback routes.
- React Query is used for server data and mutations with clear query keys.
- Zustand manages only client/session state.
- At least two forms use React Hook Form + Zod successfully.
- Axios client is typed and used consistently by feature APIs.
- ESLint and Prettier are configured and pass on baseline code.
- Husky + lint-staged + commitlint run successfully in local commit flow.
- Vitest + RTL tests cover route guard, query states, and form submission flows.
- MSW is integrated for deterministic API mocking in tests.
- Storybook stories exist for core UI and key feature states.
