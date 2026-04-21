# Prompt Templates Usage

This folder contains reusable prompt templates for operation-based workflow.

## Quick Start

1. Choose an operation mention.
2. Open the matching prompt template file.
3. Fill your feature/task-specific details.
4. Send the filled prompt to the agent.

## Operation to Template Map

- operation:plan-feature -> .github/prompts/plan-feature.prompt.md
- operation:write-code -> .github/prompts/write-code.prompt.md
- operation:write-tests -> .github/prompts/write-tests.prompt.md
- operation:write-stories -> .github/prompts/write-stories.prompt.md
- operation:write-docs -> .github/prompts/write-docs.prompt.md
- operation:refactor -> .github/prompts/refactor.prompt.md
- operation:optimize -> .github/prompts/optimize.prompt.md
- operation:fix-bugs -> .github/prompts/fix-bugs.prompt.md
- operation:review -> .github/prompts/review.prompt.md
- operation:commit-message -> .github/prompts/commit-message.prompt.md
- operation:pre-commit -> .github/prompts/pre-commit.prompt.md
- operation:post-commit -> .github/prompts/post-commit.prompt.md
- operation:learn -> .github/prompts/learn.prompt.md
- operation:find-resources -> .github/prompts/find-resources.prompt.md
- operation:track-progress -> .github/prompts/track-progress.prompt.md

## Invocation Examples

Example 1:
operation:plan-feature
Use .github/prompts/plan-feature.prompt.md
Goal: Add a dashboard analytics route with filterable charts and caching.
Constraints: Keep first-load under 2s, mobile responsive, no backend changes.

Example 2:
operation:write-tests
Use .github/prompts/write-tests.prompt.md
Target: src/features/todos/TodoList.tsx and src/features/todos/useTodos.ts
Focus: loading/empty/error states and mutation success.

Example 3:
operation:review
Use .github/prompts/review.prompt.md
Scope: current branch unstaged + staged changes.
Focus: regressions, edge cases, and missing tests.

## Example Filled Prompt

See .github/prompts/examples/operation-plan-feature.example.prompt.md for a fully filled planning prompt.
