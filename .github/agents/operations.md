# Agent Operations Script

This file lists repeatable operations for your React playground workflow.

## Core Rules

- Keep changes minimal and scoped to the requested feature.
- Run lint and tests for touched files before finishing.
- Prefer type-safe solutions and strong runtime validation (Zod where needed).
- When adding state, pick React Query for server data and Zustand for app/global state.
- Keep stories and tests in sync with component/API behavior.

## Operation Mentions

Use these operation names when asking the agent to run a task.

1. `operation:plan-feature`

- Output: feature breakdown, route impact, API/data contracts, acceptance checklist.
- Prompt: `.github/prompts/plan-feature.prompt.md`.

2. `operation:write-code`

- Output: production code for feature scope, with small and safe changes.
- Prompt: `.github/prompts/write-code.prompt.md`.

3. `operation:write-tests`

- Output: Vitest + RTL coverage for updated behavior.
- Prompt: `.github/prompts/write-tests.prompt.md`.

4. `operation:write-stories`

- Output: Storybook stories with useful variants and controls.
- Prompt: `.github/prompts/write-stories.prompt.md`.

5. `operation:write-docs`

- Output: concise docs/changelog notes for feature behavior and usage.
- Prompt: `.github/prompts/write-docs.prompt.md`.

6. `operation:refactor`

- Output: structure/readability improvements without behavior changes.
- Prompt: `.github/prompts/refactor.prompt.md`.

7. `operation:optimize`

- Output: measurable performance improvements plus before/after notes.
- Prompt: `.github/prompts/optimize.prompt.md`.

8. `operation:fix-bugs`

- Output: root-cause fix + regression test.
- Prompt: `.github/prompts/fix-bugs.prompt.md`.

9. `operation:review`

- Output: prioritized findings (bugs/regressions/risks/missing tests).
- Prompt: `.github/prompts/review.prompt.md`.

10. `operation:commit-message`

- Output: conventional commit options based on staged diff.
- Prompt: `.github/prompts/commit-message.prompt.md`.

11. `operation:pre-commit`

- Output: checklist and fixes to pass local quality gates.
- Prompt: `.github/prompts/pre-commit.prompt.md`.

12. `operation:post-commit`

- Output: follow-up checks, release notes draft, and next actions.
- Prompt: `.github/prompts/post-commit.prompt.md`.

13. `operation:learn`

- Output: concept explanation + practical exercises in this repo stack.
- Prompt: `.github/prompts/learn.prompt.md`.

14. `operation:find-resources`

- Output: curated resources by topic/level with why each matters.
- Prompt: `.github/prompts/find-resources.prompt.md`.

15. `operation:track-progress`

- Output: learning progress snapshot and next milestone plan.
- Prompt: `.github/prompts/track-progress.prompt.md`.

## Suggested Usage Pattern

1. Start with `operation:plan-feature`.
2. Run `operation:write-code`.
3. Run `operation:write-tests` and `operation:write-stories`.
4. Run `operation:pre-commit`.
5. Run `operation:commit-message`.
6. After commit, run `operation:post-commit`.
