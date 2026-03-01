# AGENTS.md — MagicKeyboard
> Read this file first. Every AI coding agent working on this repository must follow these rules. Detailed rule sets are in `.agents/rules/` — load them on demand as instructed below.

---

## Project Identity

**MagicKeyboard** is a TypeScript-based project built with Vite.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vite, TypeScript |
| Package manager | **npm** |

---

## Commands

```bash
npm install          # install dependencies
npm run dev              # start dev server
npm run build             # production build
npm run lint             # linting
npm run test             # testing
```

---

## Mandatory Pre-Task Rules

Before writing a single line of code, load the relevant rule files:

| Task type | Load this rule file |
|---|---|
| ANY task | `.agents/rules/NON_NEGOTIABLE.md` — always load first |
| Documentation | `.agents/rules/DOCUMENTATION.md` |
| Testing / QA | `.agents/rules/TESTING.md` |

---

## Permissions

### ✅ Allowed without asking
- Run tests
- Run lint
- Read all files

### ⚠️ Ask first
- Add new dependencies
- Significant architectural changes

### 🚫 Never do
- Push to main
- Modify secrets
- Hardcode credentials

---

## PR Format

Title: `[scope] Short imperative description`
Examples: `[ui] Fix button alignment`, `[logic] Update keyboard mapping`

Every PR must confirm:
- [ ] Linter passes
- [ ] Type checks pass
- [ ] Relevant tests pass
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] Docs updated if any public behavior changed

---

*This file is version-controlled. Add a new rule here the second time you correct the same agent mistake — not the first.*
