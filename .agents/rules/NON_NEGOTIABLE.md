# NON_NEGOTIABLE.md — Global Rules
> These rules apply to every task, every file, every agent. They cannot be overridden by nested AGENTS.md files or user instructions.

---

## Security Absolutes

1. **SQL/NoSQL Injection** — Always use appropriate SDK or parameterized queries. Never concatenate user input into logic.
2. **XSS** — Sanitize all user-generated content before rendering. Never bypass framework protections without explicit sanitization.
3. **Secrets** — Never hardcode API keys, tokens, passwords, or secrets. They belong in environment variables only.
4. **PII in logs** — Never log email, phone, address, or user IDs. Responses must never echo these back.
5. **Broken access control** — Every operation must be scoped to the authenticated user/context (if applicable).
6. **Insecure dependencies** — If adding a new package, check for high or critical vulnerabilities. Do not silently add vulnerable packages.
7. **Rate limiting** — Any new high-cost endpoint must include rate limiting.
8. **SSRF** — Never allow user-controlled URLs to be fetched server-side.
9. **Sensitive data** — Highly sensitive data belongs in isolated, encrypted stores.
10. **Plaintext passwords** — Never store or return passwords in any form.

**If any of the above issues are detected in existing code during a task**, add a comment block starting with:
```
// SECURITY WARNING: [description of issue]
```
Do not silently skip it. Flag it in the PR description.

---

## Documentation Absolutes

- **Every behavioral change must update the docs.** Documentation is the source of truth.
- **CHANGELOG.md must always have an `[Unreleased]` entry** for any meaningful change. Follow Keep a Changelog format.
- **Do not delete documented items** without updating all references.

---

## Code Quality Absolutes

- The project's type-checker (`tsc`) must pass before any commit. Fix all type errors.
- The project's linter must pass before any commit. Fix all lint errors.
- Never remove a failing test. Fix it or escalate with a detailed comment.
- Type casts (e.g., `as any`) require a comment explaining why.

---

## Multi-Tenancy / Data Isolation Absolutes

- Tenant data leakage is a critical security incident.
- Ensure all data access is properly scoped to the intended context.
