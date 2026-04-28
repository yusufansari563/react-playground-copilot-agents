---
mode: "agent"
description: "Write Vitest + RTL tests covering behavior, loading/error states, and regressions."
---

Write tests for the recent code changes.

Stack:

- Vitest
- React Testing Library
- MSW for network mocking where needed

Requirements:

- Cover behavior, not implementation details.
- Add regression tests for fixed bugs.
- Include loading, success, empty, and error states when relevant.

Return:

1. Test cases added
2. Why each case matters
3. Gaps that still remain
