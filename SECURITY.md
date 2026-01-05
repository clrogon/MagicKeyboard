
# Security & Privacy Policy

## 1. Privacy-First Architecture

**Teclado Mágico** is engineered with a **Privacy-by-Design** philosophy. We recognize that our primary users are children, and as such, we adhere to the strictest standards of data minimization and sovereignty.

### Data Sovereignty (Local-First)
*   **No Central Database**: We do not maintain a backend database to store user profiles, progress, or activity logs.
*   **LocalStorage**: All user data (names, avatars, XP, level progress) is encrypted at rest within the browser's `LocalStorage` on the user's physical device.
*   **No Telemetry**: We do not use third-party analytics trackers (e.g., Google Analytics, Mixpanel) to monitor user behavior.

### AI Anonymization (Gemini API)
When generating dynamic lessons using the Google Gemini API:
*   **Stateless Requests**: Every API call is independent. We do not maintain a conversation history or "memory" with the AI model.
*   **Anonymization**: We strip all PII (Personally Identifiable Information) before sending a prompt. The AI receives generic instructions (e.g., *"Generate a sentence with the letter 'J' in European Portuguese"*) and never user-specific data (e.g., *"Generate a lesson for João who lives in Lisbon"*).
*   **Zero Retention**: We do not use user data to train the models.

## 2. GDPR & User Rights

Although we do not store data on our servers, we provide tools to ensure users exercise their rights under GDPR (General Data Protection Regulation):

| User Right | Implementation in Teclado Mágico |
| :--- | :--- |
| **Right to Access** | Users can view all stored data via the "Parent Dashboard". |
| **Right to Portability** | Users can export their entire profile and history to a portable `.json` file via the "Backup" feature. |
| **Right to Erasure** | Users can permanently delete their profile or factory reset the application via the "Privacy Modal" or "Parent Dashboard". This action instantly wipes the data from `LocalStorage`. |
| **Right to Rectification** | Users can edit their names, avatars, and settings at any time. |

## 3. Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## 4. Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability or a privacy leak within **Teclado Mágico**, please do not disclose it publicly until it has been patched.

### API Keys & Secrets
*   **Client-Side Exposure**: This application is a client-side PWA. If you fork this repository for public deployment, you **must** configure a proxy server or use strict API Key restrictions (HTTP Referrer) in the Google Cloud Console to prevent quota theft.
*   **Env Variables**: Never commit `.env` files containing `API_KEY` to version control.

### Reporting Process
1.  Email the maintainers at [claudio.r.goncalves@outlook.com] (or create a private GitHub Advisory).
2.  Provide a detailed description of the vulnerability.
3.  We will acknowledge your report within 48 hours.
4.  We will provide a timeline for the fix.

### Scope
*   **In Scope**: Logic flaws, XSS vulnerabilities in text rendering, local data leakage, API key exposure in the codebase.
*   **Out of Scope**: Physical access to the user's device (e.g., someone reading `LocalStorage` by taking the unlocked tablet).

Thank you for helping keep **Teclado Mágico** safe and private for children.
