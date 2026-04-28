# Copilot Instructions

## Commands

```bash
npm run dev              # start dev server
npm run build            # tsc + vite build
npm run typecheck        # type-check only
npm run lint             # ESLint
npm run format           # Prettier (write)
npm run format:check     # Prettier (check only)
npm test                 # Vitest (watch)
npm run test:ui          # Vitest with browser UI
npm run test:coverage    # coverage report
npm run storybook        # Storybook on :6006
```

**Run a single test file:**

```bash
npx vitest run src/features/auth/pages/LoginPage.test.tsx
```

**Run tests matching a name:**

```bash
npx vitest run -t "redirects to dashboard"
```

## Architecture

This is a React 19 + TypeScript + Vite playground app structured around **feature slices** under `src/features/` and shared infrastructure under `src/shared/` and `src/app/`.

```
src/
  app/               # App bootstrap: router, providers, layout, route guards
  features/          # Feature slices: auth, dashboard, hooks, profile
    <feature>/
      api/           # Axios calls using shared http client
      pages/         # Route-level components
      store/         # Zustand stores (feature-local state only)
  shared/
    api/             # http.ts (Axios instance), queryKeys.ts
    components/      # Shared UI components + .stories.tsx
    types/           # Shared TypeScript types (user.ts)
    validation/      # Zod schemas (co-located .test.ts)
    utils/
  test/
    setup.ts         # Vitest global setup (MSW lifecycle)
    msw/             # handlers.ts + server.ts
```

**Data flow:**

- Server state → React Query (`@tanstack/react-query`)
- Global/app state → Zustand stores in `src/features/<feature>/store/`
- All API calls go through `src/shared/api/http.ts` (Axios instance with Bearer token interceptor)
- Token persisted in `localStorage` as `auth_token`; Zustand auth store initializes from it
- All routes under `/` are protected by `ProtectedRoute`, which reads from `useAuthStore`

**Query keys** are centralized in `src/shared/api/queryKeys.ts`. Add new keys there.

## Key Conventions

### State management split

Use **React Query** for anything server-fetched/cached. Use **Zustand** for app-level state that doesn't come from the server (e.g. `useAuthStore`). Do not use `useState` for either of these.

### Zod schemas

Define Zod schemas in `src/shared/validation/`. Export inferred types with `z.infer<typeof schema>`. Use `@hookform/resolvers/zod` to wire them into React Hook Form.

### API fallback pattern

`authApi.ts` shows the project's offline/fallback pattern: catch network/5xx errors with `canUseLocalFallback()` and return demo data. Follow this when adding new API modules.

### Test setup

- Tests run in jsdom with globals enabled — no need to import `describe`/`it`/`expect`.
- MSW server is started globally in `src/test/setup.ts`. Override handlers per-test with `server.use(...)`.
- Wrap components under test in `QueryClientProvider` with `retry: false` to avoid flaky retries.
- Reset Zustand state in `beforeEach` with `useStore.setState(...)`.

### Storybook stories

Stories live next to their component (`*.stories.tsx`). Use `satisfies Meta<typeof Component>` and `StoryObj<typeof meta>` types. Import from `@storybook/react-vite`.

### Commits

Conventional Commits enforced by commitlint. Lint-staged runs ESLint + Prettier on staged files before each commit.

## Agent Operations

Prompt templates in `.github/prompts/` drive a structured workflow. Invoke them by name:

| Operation                  | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `operation:plan-feature`   | Feature breakdown, route/API contracts, acceptance checklist |
| `operation:write-code`     | Production code for planned feature                          |
| `operation:write-tests`    | Vitest + RTL tests for updated behavior                      |
| `operation:write-stories`  | Storybook stories with variants                              |
| `operation:fix-bugs`       | Root-cause fix + regression test                             |
| `operation:review`         | Prioritized findings (bugs/regressions/risks)                |
| `operation:commit-message` | Conventional commit options from staged diff                 |
| `operation:pre-commit`     | Checklist and fixes to pass local quality gates              |
| `operation:refactor`       | Structure/readability improvements, no behavior changes      |
| `operation:optimize`       | Performance improvements with before/after notes             |

**Suggested sequence:** `plan-feature` → `write-code` → `write-tests` + `write-stories` → `pre-commit` → `commit-message`.
