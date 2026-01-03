# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability within **Teclado Mágico**, please do not disclose it publicly until it has been patched.

### API Keys
This project uses client-side API keys for the Gemini API in some configurations. 
*   **Development**: It is acceptable to use env vars locally.
*   **Production**: Do **NOT** commit `process.env.API_KEY` to public repositories. If deploying for public use, we recommend setting up a proxy server to hide the key, or using a restricted key that only allows specific referrers.

### Reporting Process
1.  Email the maintainers at [your-email@example.com] (replace with actual contact).
2.  Provide a detailed description of the vulnerability.
3.  We will acknowledge your email within 48 hours.
4.  We will provide a timeline for the fix.

Thank you for helping keep the project secure!
