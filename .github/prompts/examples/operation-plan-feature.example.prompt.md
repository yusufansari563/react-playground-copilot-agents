operation:plan-feature

Feature goal:
Build a profile settings page where users can update display name, bio, and avatar URL.

Constraints:

- Keep route-protected area under authenticated layout.
- Validate form with React Hook Form + Zod.
- Save profile using Axios API client.
- Use React Query mutation and cache invalidation for current user profile query.
- Show optimistic UI for display name and bio update.

Existing areas involved:

- Route tree: /settings and nested profile route.
- User store in Zustand for auth/session basics.
- Shared form components in src/components/form.

Expected planning output:

1. Scope
   In scope: profile form UI, schema validation, mutation wiring, cache invalidation, UX states.
   Out of scope: password/email change, upload service backend, image cropping.

2. Route impact

- Add route: /settings/profile
- Add nav item inside settings sidebar.

3. Data contracts

- GET /me/profile -> { id, displayName, bio, avatarUrl }
- PATCH /me/profile -> same shape
- Zod schema mirrors payload and enforces lengths and URL format.

4. State strategy

- Server profile data via React Query.
- Keep transient auth/session in Zustand unchanged.

5. Form strategy

- React Hook Form with zodResolver.
- Disable submit while pending.
- Inline errors + toast on mutation failure.

6. Test plan

- Unit test schema edge cases.
- RTL integration test for success and error submit flow.
- Query invalidation assertion after successful mutation.

7. Storybook plan

- Default populated form
- Validation error state
- Pending submit state
- API error state

8. Implementation order

- Add profile API methods and types.
- Add Zod schema + form component.
- Wire route and settings navigation.
- Add mutation and optimistic UI behavior.
- Add tests then stories.

9. Risks

- Cache stale state if invalidation key mismatch.
- Avatar URL validation false negatives.

10. Acceptance checklist

- Route renders and submits successfully.
- Validation blocks invalid input.
- Successful mutation updates visible profile data.
- Tests and stories cover key states.
