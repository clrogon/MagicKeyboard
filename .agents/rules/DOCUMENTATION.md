# DOCUMENTATION.md — Documentation Rules
> Load this file before: editing any `.md` file, changing public API behavior, adding modules, or modifying logic.

---

## Documentation-First Policy

This project follows a **strict documentation-first policy**. Documentation is the source of truth. Any change to behavior without a documentation update is considered incomplete.

---

## What to Update and When

| You changed... | Update these files |
|---|---|
| A module's behavior or UI | `README.md` + relevant guides |
| A public function or hook signature | Inline JSDoc/Docstring comment |
| Security controls or authorization | `SECURITY.md` + `CHANGELOG.md` |
| Any bug fix or feature | `CHANGELOG.md` under `[Unreleased]` |

---

## CHANGELOG.md Format

Always follow [Keep a Changelog](https://keepachangelog.com) format. Never delete the `[Unreleased]` section.

---

## Inline Code Documentation

- Every exported function, class, and component must have a comment describing its purpose, parameters, and return value.
- Complex business logic must have inline comments explaining *why*, not just *what*.
- Do not comment obvious code.
