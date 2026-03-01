# TESTING.md — Testing Rules
> Load this file before: writing tests, modifying CI, changing test configuration, or fixing test failures.

---

## Commands

```bash
npm run test              # run all tests
```

---

## Rules

- **Never remove a failing test.** Fix it. If it cannot be fixed within the scope of the current task, add a `TODO` comment and note it in the PR description.
- **New features need tests.** Any new utility function or component with business logic must have a corresponding test.
- Tests must pass before a PR is marked ready for review.

---

## Test File Location Conventions

Tests should live next to the file they test (e.g., `Filename.test.ts`), following the project's existing structure.
