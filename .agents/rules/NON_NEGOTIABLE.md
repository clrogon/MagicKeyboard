# Non-Negotiable Rules

These rules are absolute and must be followed by any AI agent interacting with this repository.

## Security & Safety
1. **Branch Protection:** Never attempt to push code directly to the `main` branch. All changes must be proposed via pull requests.
2. **Secrets Management:** Never touch `.env` files or any configuration related to credentials, API keys, or secrets.

## Development Standards
1. **Language:** Use TypeScript for all logic. Ensure strict typing where possible.
2. **Framework:** Adhere to Vite's development patterns and project structure.
3. **Verification:** Always run available linting and test commands before finalizing a task.

## Communication
- Explicitly state any assumptions made during code generation.
- If a task requires an action that is forbidden, stop and request human intervention.
